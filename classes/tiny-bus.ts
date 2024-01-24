import { nanoid } from "nanoid";

import type {
  EventName,
  SubscriberID,
  TinyBusOptions,
  EventRetryError,
  TinyBusInterface,
  EventErrorCallback,
  EventSubscriberOptions,
  PriorityEventSubscriber,
} from "types/tiny-bus";

import PriorityQueue from "classes/priority-queue";

/**
 * ### Class - TinyBus
 *
 * A single dependency event bus messaging system that allows different parts of your application to
 * communicate with each other through events.
 */
export default class TinyBus<T extends object = any>
  implements TinyBusInterface<T>
{
  constructor(private readonly options?: TinyBusOptions<T>) {}

  private processedEvents = new Set<string>();
  private subscribers = new Map<
    EventName,
    PriorityQueue<PriorityEventSubscriber<T, any>>
  >();

  private errorHandlers = new Map<EventName, Map<string, EventErrorCallback>>();

  public async emit<A extends any[] = any[]>(eventName: EventName, ...args: A) {
    const subscribers = this.subscribers.get(eventName);
    const isUnique = await this.isUnique(eventName, args);

    // throw error if event was already emitted
    if (!isUnique) {
      throw new Error(
        `Event ${eventName} with args ${JSON.stringify(
          args,
        )} was already emitted.`,
      );
    }

    // throw error if no subscribers for event
    if (!subscribers?.size()) {
      throw new Error(`No subscribers for event ${eventName}`);
    }

    const successFullCallbacks: string[] = [];
    const maxRetries = this.options?.maxRetries ?? 3;
    const subscriberMode = this.options?.subscriberMode ?? "single";
    const errorStrategy = this.options?.errorStrategy ?? "exit-on-error";

    for (const entry of subscribers.toArray()) {
      let subscriber = null;

      switch (subscriberMode) {
        // if the subscriber mode is set to single, we set the subscriber to the
        // top entry in the queue and only pop it from the queue after the callback
        // has been invoked.
        case "single":
          subscriber = subscribers.top();
          break;
        // if the subscriber mode is set to multiple, we set the subscriber to
        // the current entry in the queue.
        case "multiple":
          subscriber = entry;
          break;
      }

      if (!subscriber) break;

      const { onCallback, subscriberId: id, context } = subscriber;
      if (successFullCallbacks.includes(id)) continue;

      let retryCount = 0;
      const exceptions: Error[] = [];

      while (retryCount <= maxRetries) {
        // wait for retry interval if this is not the first retry
        if (retryCount > 0) await this.wait();

        try {
          await onCallback(id, context, ...args);
          successFullCallbacks.push(id);
          // remove subscriber from queue after successful callback
          // has been invoked if the subscriber mode is set to single
          if (subscriberMode === "single") subscribers.pop();
          break;
        } catch (error: any) {
          exceptions.push(error);
          retryCount++;
        }
      }

      // if the retry count is greater than the max retries, throw the last
      if (!!retryCount && !!maxRetries && retryCount === maxRetries + 1) {
        if (!successFullCallbacks.includes(id)) {
          // create retry error if the event was not successful
          const message = `Event "${eventName}" failed with ${
            exceptions.length
          } error(s) for subscriber "${subscriber}" after ${retryCount} retries.`;

          const exception = new Error(message, {
            eventName,
            cause: exceptions,
            subscriberId: subscriber,
          } as any) as EventRetryError;

          this.error<EventRetryError>(eventName, id, exception);

          // if the strategy is set to exit-on-error, stop emitting the event
          if (errorStrategy === "exit-on-error") break;
        }

        // if the strategy is set to continue-on-error, continue emitting the
        // event and remove the subscriber from the queue if the subscriber
        // mode is set to single
        if (subscriberMode === "single") subscribers.pop();
      }
    }
  }

  public async on<A extends any[] = any[]>(
    eventName: EventName,
    options: EventSubscriberOptions<T, A>,
  ): Promise<SubscriberID> {
    if (!this.subscribers.has(eventName)) {
      this.subscribers.set(
        eventName,
        new PriorityQueue<PriorityEventSubscriber<T, A>>((a, b) => {
          if (a === undefined || b === undefined) return false;
          return a.priority < b.priority;
        }),
      );
    }

    const context = this.options?.context;
    const queue = this.subscribers.get(eventName)!;

    const { onCallback, onError, priority = 0 - queue.size() } = options;
    let subscriberId = (await this.options?.onIdentifier?.()) ?? nanoid();

    queue.push({ onCallback, subscriberId, context, priority });

    // set error handler if provided for this subscriber
    if (onError) {
      if (!this.errorHandlers.has(eventName))
        this.errorHandlers.set(eventName, new Map());
      this.errorHandlers.get(eventName)?.set(subscriberId, onError);
    }

    // call subscribe handler if provided
    await this.options?.onSubscribe?.(eventName, subscriberId);

    return subscriberId;
  }

  public async remove(
    eventName: EventName,
    subscriberId: string,
  ): Promise<SubscriberID> {
    const subscribers = this.subscribers.get(eventName);

    if (!subscribers?.size()) {
      throw new Error(`No subscribers for event ${eventName}`);
    }

    const subscriberArr = subscribers.toArray();
    const subscriber = subscriberArr.find(s => {
      return s.subscriberId === subscriberId;
    });

    if (!subscriber) {
      throw new Error(
        `No subscriber with id ${subscriberId} for event ${eventName}`,
      );
    }

    // remove subscriber from queue
    subscriberArr.splice(subscriberArr.indexOf(subscriber), 1);
    subscribers.clear();

    // populate queue with remaining subscribers
    for (const s of subscriberArr) subscribers.push(s);

    // remove error handler if provided for this subscriber
    const errorHandlers = this.errorHandlers.get(eventName);
    if (errorHandlers?.size) errorHandlers.delete(subscriberId);

    // call unsubscribe handler if provided
    await this.options?.onUnsubscribe?.(eventName, subscriberId);

    return subscriberId;
  }

  public async removeAll(eventName: EventName): Promise<EventName> {
    const subscribers = this.subscribers.get(eventName);

    if (!subscribers?.size()) {
      throw new Error(`No subscribers for event ${eventName}`);
    }

    // call unsubscribe handler if provided
    for (const s of subscribers.toArray()) {
      await this.options?.onUnsubscribe?.(eventName, s.subscriberId);
    }

    // clear subscribers and error handlers
    subscribers.clear();
    this.errorHandlers.delete(eventName);

    return eventName;
  }

  private async isUnique(eventName: EventName, args: any[]): Promise<boolean> {
    // if unique events is disabled, return true
    if (this.options?.uniqueEvents === false) return true;

    // call onUniqueCheck handler if provided
    if (this.options?.onUniqueCheck) {
      return await this.options.onUniqueCheck(eventName, args);
    }

    const eventId = Buffer.from(
      `${eventName}:${JSON.stringify(args)}`,
    ).toString("base64");

    const isUnique = !this.processedEvents.has(eventId);
    if (isUnique) this.processedEvents.add(eventId);

    return isUnique;
  }

  private error<E extends Error = Error>(
    eventName: EventName,
    subscriberId: SubscriberID,
    error: E,
  ) {
    const errorHandlers = this.errorHandlers.get(eventName);
    if (!errorHandlers?.size) return;
    const handler = errorHandlers.get(subscriberId);
    if (!handler) throw error;
    handler({ error, eventName, subscriberId });
  }

  private async wait() {
    return new Promise(resolve =>
      setTimeout(resolve, this.options?.retryInterval ?? 500),
    );
  }
}

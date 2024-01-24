<p align="center">
  <a href="https://github.com/fabio-nettis/tiny-bus">
    <img src="./assets/logo.svg" width="318px" alt="TinyBus Logo" />
  </a>
</p>

<h3 align="center">A tiny and highly customizable event bus. Created to be typesafe out of the box.</h3>

<p align="center">Comes with different dispatching strategies, retry support, event peristence, event replay and much more.</p>

## Installation

```bash
yarn add tiny-b
```

## Usage

```typescript
import TinyBus from "tiny-b";

const tinyBus = new TinyBus(/* options */);

const subscriberId = await tinyBus.on("my-event::v1", {
  onCallback: (subscriberId, context, ...args) => {
    console.log("My event", { subscriberId, context, args });
  },
});

await tinyBus.emit("my-event::v1", { foo: "bar" });
```

## FAQ

### What is an event bus?

An event bus is a mechanism that allows different parts of an application to communicate with each other without knowing about each other. It is a publish/subscribe system where the publisher of an event (the producer) does not send it directly to the receiver (the consumer), but instead sends it to an event bus. The event bus then distributes the event to all interested consumers.

### Why another event bus?

There are many event bus implementations out there, but TinyBus is different. Starting from the fact that it is tiny and has almost no dependencies, it also supports different dispatching strategies, event deduplication and retrying failed events out of the box.

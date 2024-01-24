<p align="center">
  <a href="https://github.com/fabio-nettis/tiny-bus">
    <img src="./assets/logo.svg" width="318px" alt="TinyBus Logo" />
  </a>
</p>

<h3 align="center">A tiny and highly customizable event bus supporting different dispatching strategies.</h3>

<p align="center">Comes with built in retry and event deduplication support as well as many other features.</p>

## Installation

```bash
yarn add tiny-bus
```

## Usage

```typescript
import TinyBus from "tiny-bus";

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

## Future plans

Some of the features that are planned for the future are include but are not limited to the following list:

- [ ] Add support for event tracing
- [ ] Add support for event replay

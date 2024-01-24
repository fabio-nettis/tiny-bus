import { expect, it } from "bun:test";
import TinyBus from "classes/tiny-bus";

/**
 * Multiple run-through mode allows subscribers to be called multiple times
 * for the same event. This is useful for things like logging or metrics.
 */

it('Mode "multiple" with unique events works as expected', async () => {
  const tinyBus = new TinyBus({
    uniqueEvents: true,
    subscriberMode: "multiple",
    context: { test: "test" },
    onIdentifier: async () => "test",
  });

  const subscriberId = await tinyBus.on("multiple::sub::args", {
    onCallback: (id, context, ...args) => {
      expect(id).toBe("test");
      expect(context).toEqual({ test: "test" });
      expect(args).toEqual(["test"]);
    },
  });

  await tinyBus.emit("multiple::sub::args", "test");

  try {
    await tinyBus.emit("multiple::sub::args", "test");
  } catch (error: any) {
    expect(error.message).toBe(
      'Event multiple::sub::args with args ["test"] was already emitted.',
    );
  }

  const unsubscribeId = await tinyBus.remove(
    "multiple::sub::args",
    subscriberId,
  );

  expect(unsubscribeId).toBe(subscriberId);
});

it('Mode "multiple" without unique events works as expected', async () => {
  const tinyBus = new TinyBus({
    uniqueEvents: false,
    subscriberMode: "multiple",
    context: { test: "test" },
    onIdentifier: async () => "test",
  });

  const subscriberId = await tinyBus.on("multiple::sub::args", {
    onCallback: (id, context, ...args) => {
      expect(id).toBe("test");
      expect(context).toEqual({ test: "test" });
      expect(args).toEqual(["test"]);
    },
  });

  await tinyBus.emit("multiple::sub::args", "test");
  await tinyBus.emit("multiple::sub::args", "test");

  const unsubscribeId = await tinyBus.remove(
    "multiple::sub::args",
    subscriberId,
  );

  expect(unsubscribeId).toBe(subscriberId);
});

/**
 * Single run-through mode allows subscribers to be called only once for the
 * same event. This is useful for things like sending emails or text messages.
 */

it('Mode "single" with unique events works as expected', async () => {
  const tinyBus = new TinyBus({
    uniqueEvents: true,
    subscriberMode: "single",
    context: { test: "test" },
    onIdentifier: async () => "test",
  });

  await tinyBus.on("single::sub::args", {
    onCallback: (subscriberId, context, ...args) => {
      expect(subscriberId).toBe("test");
      expect(context).toEqual({ test: "test" });
      expect(args).toEqual(["test"]);
    },
  });

  await tinyBus.emit("single::sub::args", "test");

  try {
    await tinyBus.emit("single::sub::args", "test");
  } catch (error: any) {
    expect(error.message).toBe(
      'Event single::sub::args with args ["test"] was already emitted.',
    );
  }
});

it('Mode "single" without unique events works as expected', async () => {
  const tinyBus = new TinyBus({
    uniqueEvents: false,
    subscriberMode: "single",
    context: { test: "test" },
    onIdentifier: async () => "test",
  });

  await tinyBus.on("single::sub::args", {
    onCallback: (subscriberId, context, ...args) => {
      expect(subscriberId).toBe("test");
      expect(context).toEqual({ test: "test" });
      expect(args).toEqual(["test"]);
    },
  });

  await tinyBus.emit("single::sub::args", "test");

  try {
    await tinyBus.emit("single::sub::args", "test");
  } catch (error: any) {
    expect(error.message).toBe("No subscribers for event single::sub::args");
  }
});

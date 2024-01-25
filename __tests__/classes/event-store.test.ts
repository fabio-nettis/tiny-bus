import { expect, it } from "bun:test";

import EventStore from "classes/event-store";

const store = new EventStore();

it("Successfully persists and restores events", () => {
  expect(store).toBeInstanceOf(EventStore);
  const id = store.persist({ name: "event::test", args: [1, 2, 3] });
  const event = store.restore(id);
  if (!event) throw new Error("Event not found");
  expect(event.name).toEqual("event::test");
  expect(event.args).toEqual([1, 2, 3]);
  expect(event.id).toEqual(id);
});

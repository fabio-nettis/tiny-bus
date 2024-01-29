import { it, expect } from "bun:test";

import DebugLogger from "classes/debug-logger";
import type { DebugEventName } from "types/debug-logger";

const debugEventNames: DebugEventName[] = [
  "startReplay",
  "endReplay",
  "startEmit",
  "endEmit",
  "startSubscribe",
  "endSubscribe",
  "startRemove",
  "endRemove",
  "startRemoveAll",
  "endRemoveAll",
  "startPersist",
  "endPersist",
  "startRestore",
  "endRestore",
  "startErrorHandler",
  "endErrorHandler",
  "startIsUnique",
  "endIsUnique",
];

it("Callback is called with correct arguments", () => {
  const debugLogger = new DebugLogger((debugName, debugId, duration) => {
    expect(debugEventNames).toContain(debugName);
    expect(debugId).toBe("test");
    if (debugName.startsWith("start")) expect(duration).toBeUndefined();
    else expect(duration).toBeTypeOf("string");
  });

  debugLogger.startReplay("test");
  debugLogger.endReplay("test");
  debugLogger.startEmit("test");
  debugLogger.endEmit("test");
  debugLogger.startSubscribe("test");
  debugLogger.endSubscribe("test");
  debugLogger.startRemove("test");
  debugLogger.endRemove("test");
  debugLogger.startRemoveAll("test");
  debugLogger.endRemoveAll("test");
  debugLogger.startPersist("test");
  debugLogger.endPersist("test");
  debugLogger.startRestore("test");
  debugLogger.endRestore("test");
  debugLogger.startErrorHandler("test");
  debugLogger.endErrorHandler("test");
  debugLogger.startIsUnique("test");
  debugLogger.endIsUnique("test");
});

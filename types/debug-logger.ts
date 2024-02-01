export type DebugEventCallback = (
  debugEventName: DebugEventName,
  debugEventId: string,
  duration?: number,
) => void;

export type DebugEventKeyPrefix =
  | "replay"
  | "emit"
  | "subscribe"
  | "remove"
  | "removeAll"
  | "persist"
  | "restore"
  | "error"
  | "unique";

export type DebugEventName =
  | "startReplay"
  | "endReplay"
  | "startEmit"
  | "endEmit"
  | "startSubscribe"
  | "endSubscribe"
  | "startRemove"
  | "endRemove"
  | "startRemoveAll"
  | "endRemoveAll"
  | "startPersist"
  | "endPersist"
  | "startRestore"
  | "endRestore"
  | "startErrorHandler"
  | "endErrorHandler"
  | "startIsUnique"
  | "endIsUnique";

export interface DebugLoggerInterface {
  /**
   * Retrieves the duration of a debug event.
   */
  getDuration: (id: string) => number;
  /**
   * Called to start logging a debug event.
   */
  log: (
    debugEventName: DebugEventName,
    keyPrefix: DebugEventKeyPrefix,
    debugEventId: string,
  ) => void;
  /**
   * Called to output a debug event to the console.
   */
  out: (
    debugEventName: DebugEventName,
    keyPrefix: DebugEventKeyPrefix,
    debugEventId: string,
    debugEventDurationMs?: number,
  ) => void;
}

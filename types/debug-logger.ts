export type DebugEventCallback = (
  name: DebugEventName,
  id: string,
  duration?: string,
) => void;

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
   * Called when a event replay starts.
   */
  startReplay: (id: string) => void;
  /**
   * Called when a event is restored for replay.
   */
  startRestore: (id: string) => void;
  /**
   * Called when a event replay has been restored.
   */
  endRestore: (id: string) => void;
  /**
   * Called when a event replay ends.
   */
  endReplay: (id: string) => void;
  /**
   * Called a event starts to be emitted.
   */
  startEmit: (id: string) => void;
  /**
   * Called when a event has been emitted.
   */
  endEmit: (id: string) => void;
  /**
   * Called when a event starts to be subscribed to.
   */
  startSubscribe: (id: string) => void;
  /**
   * Called when a event has been subscribed to.
   */
  endSubscribe: (id: string) => void;
  /**
   * Called when a subscriber starts to be removed.
   */
  startRemove: (id: string) => void;
  /**
   * Called when a subscriber has been removed.
   */
  endRemove: (id: string) => void;
  /**
   * Called when all subscribers start to be removed.
   */
  startRemoveAll: (id: string) => void;
  /**
   * Called when all subscribers have been removed.
   */
  endRemoveAll: (id: string) => void;
  /**
   * Called when a event starts to be persisted for replay.
   */
  startPersist: (id: string) => void;
  /**
   * Called when a event has been persisted for replay.
   */
  endPersist: (id: string) => void;
  /**
   * Called when a error handler starts to be called.
   */
  startErrorHandler: (id: string) => void;
  /**
   * Called when a error handler has been called.
   */
  endErrorHandler: (id: string) => void;
  /**
   * Called when a event starts to be checked for uniqueness.
   */
  startIsUnique: (id: string) => void;
  /**
   * Called when a event has been checked for uniqueness.
   */
  endIsUnique: (id: string) => void;
}

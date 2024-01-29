import { c } from "utils/console";

import type {
  DebugEventCallback,
  DebugLoggerInterface,
} from "types/debug-logger";

/**
 * A class for logging debug events. This class is used internally by TinyBus,
 * optionally a callback can be provided to log events to a custom logger.
 */
export default class DebugLogger implements DebugLoggerInterface {
  private readonly time = new Map<string, Date>();

  constructor(private readonly callback?: DebugEventCallback) {}

  private getDuration(id: string) {
    if (!this.time.has(id)) throw new Error(`No start time for ${id}`);
    const start = this.time.get(id);
    if (!start) throw new Error(`Invalid start time for ${id}`);
    const duration = new Date().getTime() - start.getTime();
    this.time.delete(id);
    return duration.toFixed(2);
  }

  startReplay(id: string) {
    this.time.set(`replay::${id}`, new Date());
    if (this.callback) return this.callback("startReplay", id);
    console.log(`${c("[Replay]", "blue")} Started replaying ${id}`);
  }

  endReplay(id: string) {
    const duration = this.getDuration(`replay::${id}`);
    if (this.callback) return this.callback("endReplay", id, duration);
    console.log(`${c("[Replay]", "blue")} Ended replay ${id} (${duration} ms)`);
  }

  startEmit(id: string) {
    this.time.set(`emit::${id}`, new Date());
    if (this.callback) return this.callback("startEmit", id);
    console.log(`${c("[Emit]", "green")} Started emitting ${id}`);
  }

  endEmit(id: string) {
    const duration = this.getDuration(`emit::${id}`);
    if (this.callback) return this.callback("endEmit", id, duration);
    console.log(
      `${c("[Emit]", "green")} Ended emitting ${id} (${duration} ms)`,
    );
  }

  startSubscribe(id: string) {
    this.time.set(`subscribe::${id}`, new Date());
    if (this.callback) return this.callback("startSubscribe", id);
    console.log(`${c("[New]", "yellow")} Started subscribing ${id}`);
  }

  endSubscribe(id: string) {
    const duration = this.getDuration(`subscribe::${id}`);
    if (this.callback) return this.callback("endSubscribe", id, duration);
    console.log(
      `${c("[New]", "yellow")} Ended subscribing ${id} (${duration} ms)`,
    );
  }

  startRemove(id: string) {
    this.time.set(`remove::${id}`, new Date());
    if (this.callback) return this.callback("startRemove", id);
    console.log(`${c("[End]", "red")} Started removing ${id}`);
  }

  endRemove(id: string) {
    const duration = this.getDuration(`remove::${id}`);
    if (this.callback) return this.callback("endRemove", id, duration);
    console.log(`${c("[End]", "red")} Ended removing ${id} (${duration} ms)`);
  }

  startRemoveAll(id: string) {
    this.time.set(`removeAll::${id}`, new Date());
    if (this.callback) return this.callback("startRemoveAll", id);
    console.log(`${c("[Clear]", "magenta")} Started removing all ${id}`);
  }

  endRemoveAll(id: string) {
    const duration = this.getDuration(`removeAll::${id}`);
    if (this.callback) return this.callback("endRemoveAll", id, duration);
    console.log(
      `${c("[Clear]", "magenta")} Ended removing all ${id} (${duration} ms)`,
    );
  }

  startPersist(id: string) {
    this.time.set(`persist::${id}`, new Date());
    if (this.callback) return this.callback("startPersist", id);
    console.log(`${c("[Replay]", "blue")} Started persisting ${id}`);
  }

  endPersist(id: string) {
    const duration = this.getDuration(`persist::${id}`);
    if (this.callback) return this.callback("endPersist", id, duration);
    console.log(
      `${c("[Replay]", "blue")} Ended persisting ${id} (${duration} ms)`,
    );
  }

  startRestore(id: string) {
    this.time.set(`restore::${id}`, new Date());
    if (this.callback) return this.callback("startRestore", id);
    console.log(`${c("[Replay]", "blue")} Started restoring ${id}`);
  }

  endRestore(id: string) {
    const duration = this.getDuration(`restore::${id}`);
    if (this.callback) return this.callback("endRestore", id, duration);
    console.log(
      `${c("[Replay]", "blue")} Ended restoring ${id} (${duration} ms)`,
    );
  }

  startErrorHandler(id: string) {
    this.time.set(`error::${id}`, new Date());
    if (this.callback) return this.callback("startErrorHandler", id);
    console.log(`${c("[Error]", "red")} Started handling error ${id}`);
  }

  endErrorHandler(id: string) {
    const duration = this.getDuration(`error::${id}`);
    if (this.callback) return this.callback("endErrorHandler", id, duration);
    console.log(
      `${c("[Error]", "red")} Ended handling error ${id} (${duration} ms)`,
    );
  }

  startIsUnique(id: string) {
    this.time.set(`unique::${id}`, new Date());
    if (this.callback) return this.callback("startIsUnique", id);
    console.log(
      `${c("[Unique]", "cyan")} Started checking if event args for (${id}) are unique`,
    );
  }

  endIsUnique(id: string) {
    const duration = this.getDuration(`unique::${id}`);
    if (this.callback) return this.callback("endIsUnique", id, duration);
    console.log(
      `${c("[Unique]", "cyan")} Ended checking if event args for (${id}) are unique (${duration} ms)`,
    );
  }
}

import type { EventEmitter } from "./event-emitter";
import type { TypeTypeMseState } from "./types";

export class PlayerState {
  value: TypeTypeMseState = "idle";

  constructor(private readonly emitter: EventEmitter) {}

  set(state: TypeTypeMseState): void {
    if (this.value === state) return;
    this.value = state;
    this.emitter.emit({ type: "state", state });
  }

  fail(error: Error): void {
    if (error.name === "AbortError") return;
    this.set("error");
    this.emitter.emit({ type: "error", error });
  }

  destroy(): void {
    this.value = "destroyed";
  }
}

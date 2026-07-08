import type { TypeTypeMseEvent, TypeTypeMseEventType, TypeTypeMseListener } from "./types";

export class EventEmitter {
  private readonly listeners = new Map<TypeTypeMseEventType, Set<TypeTypeMseListener>>();

  on(type: TypeTypeMseEventType, listener: TypeTypeMseListener): () => void {
    const listeners = this.listeners.get(type) ?? new Set<TypeTypeMseListener>();
    listeners.add(listener);
    this.listeners.set(type, listeners);
    return () => this.off(type, listener);
  }

  off(type: TypeTypeMseEventType, listener: TypeTypeMseListener): void {
    const listeners = this.listeners.get(type);
    listeners?.delete(listener);
    if (listeners?.size === 0) this.listeners.delete(type);
  }

  emit(event: TypeTypeMseEvent): void {
    this.listeners.get(event.type)?.forEach((listener) => {
      listener(event);
    });
  }

  clear(): void {
    this.listeners.clear();
  }
}

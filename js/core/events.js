// Kleine event-bus: één plek waar MIDI, toetsenbord, touch en schermen elkaar vinden.
export function createEmitter() {
  const map = new Map();
  return {
    on(ev, fn) {
      if (!map.has(ev)) map.set(ev, new Set());
      map.get(ev).add(fn);
      return () => map.get(ev)?.delete(fn);
    },
    emit(ev, ...args) {
      const set = map.get(ev);
      if (!set) return;
      for (const fn of [...set]) {
        try { fn(...args); } catch (e) { console.error(`Fout in handler voor "${ev}"`, e); }
      }
    },
  };
}

export const bus = createEmitter();

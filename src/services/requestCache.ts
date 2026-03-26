/** Простой TTL-кэш для GET-запросов к API */
interface CacheEntry {
  data: unknown;
  ts: number;
}

const store = new Map<string, CacheEntry>();
const TTL = 20_000; // 20 секунд

export const requestCache = {
  get<T>(key: string): T | null {
    const e = store.get(key);
    if (!e) return null;
    if (Date.now() - e.ts > TTL) {
      store.delete(key);
      return null;
    }
    return e.data as T;
  },

  set(key: string, data: unknown): void {
    store.set(key, { data, ts: Date.now() });
  },

  /** Удаляет все записи, ключ которых совпадает с паттерном */
  invalidate(pattern: RegExp): void {
    for (const k of store.keys()) {
      if (pattern.test(k)) store.delete(k);
    }
  },

  clear(): void {
    store.clear();
  },
};

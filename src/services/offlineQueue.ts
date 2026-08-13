import { workoutsApi, exercisesApi } from './api';

const QUEUE_KEY = 'gym-tracker-offline-queue';
/** Действия, исчерпавшие попытки, не выбрасываем — иначе данные пропадают молча. */
const DEAD_LETTER_KEY = 'gym-tracker-offline-failed';
const MAX_RETRIES = 5;

export interface QueuedAction {
  id: string;
  type: 'create_workout' | 'update_workout' | 'delete_workout' | 'create_exercise' | 'complete_workout';
  /**
   * Действия с одинаковым ключом схлопываются: для одной тренировки имеет
   * значение только последний снимок упражнений.
   */
  dedupeKey?: string;
  payload: unknown;
  timestamp: number;
  retries: number;
}

function readList(key: string): QueuedAction[] {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeList(key: string, list: QueuedAction[]): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(list));
    return true;
  } catch {
    // Переполненное хранилище: сообщаем вызывающему, что записать не вышло.
    return false;
  }
}

function getQueue(): QueuedAction[] {
  return readList(QUEUE_KEY);
}

export function enqueue(
  type: QueuedAction['type'],
  payload: unknown,
  dedupeKey?: string
): QueuedAction | null {
  const action: QueuedAction = {
    id: crypto.randomUUID(),
    type,
    dedupeKey,
    payload,
    timestamp: Date.now(),
    retries: 0,
  };

  const queue = getQueue();
  const deduped = dedupeKey ? queue.filter(a => a.dedupeKey !== dedupeKey) : queue;
  deduped.push(action);

  return writeList(QUEUE_KEY, deduped) ? action : null;
}

export function getQueueLength(): number {
  return getQueue().length;
}

export function getFailedLength(): number {
  return readList(DEAD_LETTER_KEY).length;
}

export function clearQueue() {
  localStorage.removeItem(QUEUE_KEY);
}

export function clearFailed() {
  localStorage.removeItem(DEAD_LETTER_KEY);
}

async function runAction(action: QueuedAction): Promise<void> {
  switch (action.type) {
    case 'create_workout':
      await workoutsApi.create(action.payload);
      return;
    case 'update_workout': {
      const { id, data } = action.payload as { id: string; data: unknown };
      await workoutsApi.update(id, data);
      return;
    }
    case 'complete_workout': {
      const { id, data } = action.payload as { id: string; data: { exercises?: unknown[] } };
      await workoutsApi.complete(id, data);
      return;
    }
    case 'delete_workout': {
      const { id } = action.payload as { id: string };
      await workoutsApi.delete(id);
      return;
    }
    case 'create_exercise':
      await exercisesApi.create(action.payload);
      return;
  }
}

/** Два параллельных запуска отправили бы одни и те же действия дважды. */
let processing = false;

export async function processQueue(): Promise<{ processed: number; failed: number; dropped: number }> {
  if (processing) return { processed: 0, failed: 0, dropped: 0 };

  const snapshot = getQueue();
  if (snapshot.length === 0) return { processed: 0, failed: 0, dropped: 0 };

  processing = true;
  const done = new Set<string>();
  const retriesById = new Map<string, number>();
  let processed = 0;
  let failed = 0;

  try {
    for (const action of snapshot) {
      try {
        await runAction(action);
        done.add(action.id);
        processed++;
      } catch {
        retriesById.set(action.id, action.retries + 1);
        failed++;
      }
    }
  } finally {
    processing = false;
  }

  // Очередь перечитываем заново: пока шли сетевые запросы, приложение могло
  // добавить новые действия, и запись старого снимка их бы затёрла.
  const current = getQueue();
  const remaining: QueuedAction[] = [];
  const exhausted: QueuedAction[] = [];

  for (const action of current) {
    if (done.has(action.id)) continue;
    const retries = retriesById.get(action.id) ?? action.retries;
    if (retries >= MAX_RETRIES) {
      exhausted.push({ ...action, retries });
    } else {
      remaining.push({ ...action, retries });
    }
  }

  writeList(QUEUE_KEY, remaining);
  if (exhausted.length > 0) {
    writeList(DEAD_LETTER_KEY, [...readList(DEAD_LETTER_KEY), ...exhausted]);
  }

  return { processed, failed, dropped: exhausted.length };
}

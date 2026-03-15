import { workoutsApi, exercisesApi } from './api';

const QUEUE_KEY = 'gym-tracker-offline-queue';

export interface QueuedAction {
  id: string;
  type: 'create_workout' | 'update_workout' | 'delete_workout' | 'create_exercise';
  payload: unknown;
  timestamp: number;
  retries: number;
}

function getQueue(): QueuedAction[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveQueue(queue: QueuedAction[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function enqueue(type: QueuedAction['type'], payload: unknown): QueuedAction {
  const action: QueuedAction = {
    id: crypto.randomUUID(),
    type,
    payload,
    timestamp: Date.now(),
    retries: 0,
  };
  const queue = getQueue();
  queue.push(action);
  saveQueue(queue);
  return action;
}

export function getQueueLength(): number {
  return getQueue().length;
}

export function clearQueue() {
  localStorage.removeItem(QUEUE_KEY);
}

export async function processQueue(): Promise<{ processed: number; failed: number }> {
  const queue = getQueue();
  if (queue.length === 0) return { processed: 0, failed: 0 };

  let processed = 0;
  let failed = 0;
  const remaining: QueuedAction[] = [];

  for (const action of queue) {
    try {
      switch (action.type) {
        case 'create_workout':
          await workoutsApi.create(action.payload);
          break;
        case 'update_workout': {
          const { id, data } = action.payload as { id: string; data: unknown };
          await workoutsApi.update(id, data);
          break;
        }
        case 'delete_workout': {
          const { id } = action.payload as { id: string };
          await workoutsApi.delete(id);
          break;
        }
        case 'create_exercise':
          await exercisesApi.create(action.payload);
          break;
      }
      processed++;
    } catch {
      action.retries++;
      if (action.retries < 3) {
        remaining.push(action);
      }
      failed++;
    }
  }

  saveQueue(remaining);
  return { processed, failed };
}

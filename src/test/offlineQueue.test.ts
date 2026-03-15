import { describe, it, expect, beforeEach, vi } from 'vitest';

// We test offlineQueue in isolation: mock api calls
vi.mock('../services/api', () => ({
  workoutsApi: {
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
  },
  exercisesApi: {
    create: vi.fn().mockResolvedValue({}),
  },
}));

import { enqueue, getQueueLength, clearQueue, processQueue } from '../services/offlineQueue';

describe('offlineQueue', () => {
  beforeEach(() => {
    clearQueue();
  });

  it('starts with empty queue', () => {
    expect(getQueueLength()).toBe(0);
  });

  it('enqueues an action', () => {
    enqueue('create_workout', { name: 'Test' });
    expect(getQueueLength()).toBe(1);
  });

  it('enqueues multiple actions', () => {
    enqueue('create_workout', { name: 'W1' });
    enqueue('delete_workout', { id: '123' });
    expect(getQueueLength()).toBe(2);
  });

  it('processQueue resolves all actions', async () => {
    enqueue('create_workout', { name: 'W1' });
    enqueue('update_workout', { id: '123', data: { name: 'Updated' } });
    const result = await processQueue();
    expect(result.processed).toBe(2);
    expect(result.failed).toBe(0);
    expect(getQueueLength()).toBe(0);
  });

  it('clearQueue empties everything', () => {
    enqueue('create_workout', { name: 'W1' });
    enqueue('create_workout', { name: 'W2' });
    clearQueue();
    expect(getQueueLength()).toBe(0);
  });

  it('returns processed=0 on empty queue', async () => {
    const result = await processQueue();
    expect(result.processed).toBe(0);
    expect(result.failed).toBe(0);
  });
});

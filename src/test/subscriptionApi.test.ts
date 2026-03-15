import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/apiClient', () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from '@/services/apiClient';
import { subscriptionApi } from '../services/subscriptionApi';

const mockFetch = apiFetch as ReturnType<typeof vi.fn>;

describe('subscriptionApi', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getPlans fetches /subscriptions/plans', async () => {
    mockFetch.mockResolvedValue({ plans: [] });
    const result = await subscriptionApi.getPlans();
    expect(mockFetch).toHaveBeenCalledWith('/subscriptions/plans');
    expect(result.plans).toEqual([]);
  });

  it('getStatus fetches /subscriptions/status', async () => {
    mockFetch.mockResolvedValue({ active: false, subscription: null });
    const result = await subscriptionApi.getStatus();
    expect(mockFetch).toHaveBeenCalledWith('/subscriptions/status');
    expect(result.active).toBe(false);
  });

  it('create sends POST with plan and optional fields', async () => {
    mockFetch.mockResolvedValue({ message: 'ok' });
    await subscriptionApi.create('pro', 'stripe', 'ext123');
    expect(mockFetch).toHaveBeenCalledWith('/subscriptions/create', {
      method: 'POST',
      body: JSON.stringify({ plan: 'pro', paymentProvider: 'stripe', externalId: 'ext123' }),
    });
  });

  it('cancel sends POST to /subscriptions/cancel', async () => {
    mockFetch.mockResolvedValue({ message: 'cancelled' });
    await subscriptionApi.cancel();
    expect(mockFetch).toHaveBeenCalledWith('/subscriptions/cancel', { method: 'POST' });
  });

  it('getHistory fetches /subscriptions/history', async () => {
    mockFetch.mockResolvedValue({ subscriptions: [] });
    const result = await subscriptionApi.getHistory();
    expect(mockFetch).toHaveBeenCalledWith('/subscriptions/history');
    expect(result.subscriptions).toEqual([]);
  });
});

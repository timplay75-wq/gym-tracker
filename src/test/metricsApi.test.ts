import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/apiClient', () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from '@/services/apiClient';
import { metricsApi } from '../services/metricsApi';

const mockFetch = apiFetch as ReturnType<typeof vi.fn>;

describe('metricsApi', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getAll fetches /measurements', async () => {
    mockFetch.mockResolvedValue([]);
    await metricsApi.getAll();
    expect(mockFetch).toHaveBeenCalledWith('/measurements');
  });

  it('getLatest fetches /measurements/latest', async () => {
    mockFetch.mockResolvedValue({ weight: 80 });
    const result = await metricsApi.getLatest();
    expect(mockFetch).toHaveBeenCalledWith('/measurements/latest');
    expect(result.weight).toBe(80);
  });

  it('upsert sends POST with data', async () => {
    mockFetch.mockResolvedValue({});
    await metricsApi.upsert({ date: '2024-01-01', weight: 75, notes: 'test' });
    expect(mockFetch).toHaveBeenCalledWith('/measurements', {
      method: 'POST',
      body: JSON.stringify({ date: '2024-01-01', weight: 75, notes: 'test' }),
    });
  });

  it('delete sends DELETE with encoded date', async () => {
    mockFetch.mockResolvedValue(undefined);
    await metricsApi.delete('2024-01-01');
    expect(mockFetch).toHaveBeenCalledWith('/measurements/2024-01-01', { method: 'DELETE' });
  });
});

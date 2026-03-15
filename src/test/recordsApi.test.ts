import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/apiClient', () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from '@/services/apiClient';
import { recordsApi } from '../services/recordsApi';

const mockFetch = apiFetch as ReturnType<typeof vi.fn>;

describe('recordsApi', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getAll fetches /records', async () => {
    mockFetch.mockResolvedValue([]);
    await recordsApi.getAll();
    expect(mockFetch).toHaveBeenCalledWith('/records');
  });

  it('getByExercise fetches by encoded name', async () => {
    mockFetch.mockResolvedValue({});
    await recordsApi.getByExercise('Bench Press');
    expect(mockFetch).toHaveBeenCalledWith(`/records/${encodeURIComponent('Bench Press')}`);
  });

  it('delete sends DELETE with encoded name', async () => {
    mockFetch.mockResolvedValue(undefined);
    await recordsApi.delete('Squat');
    expect(mockFetch).toHaveBeenCalledWith(`/records/${encodeURIComponent('Squat')}`, { method: 'DELETE' });
  });
});

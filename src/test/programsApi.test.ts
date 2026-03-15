import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/apiClient', () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from '@/services/apiClient';
import { programsApi } from '../services/programsApi';

const mockFetch = apiFetch as ReturnType<typeof vi.fn>;

describe('programsApi', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getAll fetches /programs', async () => {
    mockFetch.mockResolvedValue([]);
    await programsApi.getAll();
    expect(mockFetch).toHaveBeenCalledWith('/programs');
  });

  it('getById fetches by id', async () => {
    mockFetch.mockResolvedValue({});
    await programsApi.getById('abc');
    expect(mockFetch).toHaveBeenCalledWith('/programs/abc');
  });

  it('create sends POST', async () => {
    mockFetch.mockResolvedValue({});
    await programsApi.create({ name: 'PPL' });
    expect(mockFetch).toHaveBeenCalledWith('/programs', {
      method: 'POST',
      body: JSON.stringify({ name: 'PPL' }),
    });
  });

  it('update sends PUT', async () => {
    mockFetch.mockResolvedValue({});
    await programsApi.update('1', { name: 'Updated' });
    expect(mockFetch).toHaveBeenCalledWith('/programs/1', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Updated' }),
    });
  });

  it('delete sends DELETE', async () => {
    mockFetch.mockResolvedValue(undefined);
    await programsApi.delete('1');
    expect(mockFetch).toHaveBeenCalledWith('/programs/1', { method: 'DELETE' });
  });

  it('activate sends POST to /activate', async () => {
    mockFetch.mockResolvedValue({});
    await programsApi.activate('1');
    expect(mockFetch).toHaveBeenCalledWith('/programs/1/activate', { method: 'POST' });
  });
});

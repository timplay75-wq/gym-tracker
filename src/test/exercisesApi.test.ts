import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/apiClient', () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from '@/services/apiClient';
import { exercisesApi } from '../services/exercisesApi';

const mockFetch = apiFetch as ReturnType<typeof vi.fn>;

describe('exercisesApi', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getAll fetches without params', async () => {
    mockFetch.mockResolvedValue([]);
    await exercisesApi.getAll();
    expect(mockFetch).toHaveBeenCalledWith('/exercises');
  });

  it('getAll passes query params', async () => {
    mockFetch.mockResolvedValue([]);
    await exercisesApi.getAll({ category: 'chest', search: 'bench' });
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain('category=chest');
    expect(url).toContain('search=bench');
  });

  it('getById fetches by id', async () => {
    mockFetch.mockResolvedValue({ _id: '1' });
    await exercisesApi.getById('1');
    expect(mockFetch).toHaveBeenCalledWith('/exercises/1');
  });

  it('create sends POST', async () => {
    mockFetch.mockResolvedValue({});
    await exercisesApi.create({ name: 'Squat' });
    expect(mockFetch).toHaveBeenCalledWith('/exercises', {
      method: 'POST',
      body: JSON.stringify({ name: 'Squat' }),
    });
  });

  it('update sends PUT', async () => {
    mockFetch.mockResolvedValue({});
    await exercisesApi.update('1', { name: 'Updated' });
    expect(mockFetch).toHaveBeenCalledWith('/exercises/1', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Updated' }),
    });
  });

  it('delete sends DELETE', async () => {
    mockFetch.mockResolvedValue(undefined);
    await exercisesApi.delete('1');
    expect(mockFetch).toHaveBeenCalledWith('/exercises/1', { method: 'DELETE' });
  });

  it('seed sends POST to /exercises/seed', async () => {
    mockFetch.mockResolvedValue({});
    await exercisesApi.seed();
    expect(mockFetch).toHaveBeenCalledWith('/exercises/seed', { method: 'POST' });
  });
});

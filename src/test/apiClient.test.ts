import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiFetch, normalizeWorkout, API_URL } from '../services/apiClient';

describe('apiClient', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('API_URL', () => {
    it('defaults to localhost:5000/api', () => {
      expect(API_URL).toBe('http://localhost:5000/api');
    });
  });

  describe('normalizeWorkout', () => {
    it('normalizes _id to id', () => {
      const result = normalizeWorkout({ _id: 'abc', date: '2024-01-01', exercises: [] });
      expect(result.id).toBe('abc');
    });

    it('uses id if _id is absent', () => {
      const result = normalizeWorkout({ id: 'xyz', date: '2024-01-01', exercises: [] });
      expect(result.id).toBe('xyz');
    });

    it('converts date to Date object', () => {
      const result = normalizeWorkout({ _id: '1', date: '2024-06-15', exercises: [] });
      expect(result.date).toBeInstanceOf(Date);
    });

    it('converts createdAt to Date object', () => {
      const result = normalizeWorkout({ _id: '1', date: '2024-01-01', createdAt: '2024-01-01T12:00:00Z', exercises: [] });
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('normalizes exercise ids and set ids', () => {
      const result = normalizeWorkout({
        _id: '1',
        date: '2024-01-01',
        exercises: [{
          _id: 'ex1',
          name: 'Bench Press',
          sets: [{ _id: 's1', reps: 10, weight: 100 }],
        }],
      });
      expect(result.exercises[0].id).toBe('ex1');
      expect(result.exercises[0].sets[0].id).toBe('s1');
    });

    it('handles missing exercises', () => {
      const result = normalizeWorkout({ _id: '1', date: '2024-01-01' });
      expect(result.exercises).toEqual([]);
    });

    it('handles missing sets', () => {
      const result = normalizeWorkout({
        _id: '1', date: '2024-01-01',
        exercises: [{ _id: 'e1', name: 'Test' }],
      });
      expect(result.exercises[0].sets).toEqual([]);
    });

    it('returns empty string for id when both _id and id are missing', () => {
      const result = normalizeWorkout({ date: '2024-01-01', exercises: [] });
      expect(result.id).toBe('');
    });
  });

  describe('apiFetch', () => {
    it('sends GET request with auth header when token exists', async () => {
      localStorage.setItem('token', 'test-jwt');
      const mockResponse = { data: 'ok' };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiFetch('/test');
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL}/test`,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-jwt',
            'Content-Type': 'application/json',
          }),
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it('sends request without auth header when no token', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      });

      await apiFetch('/test');
      const headers = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].headers;
      expect(headers.Authorization).toBeUndefined();
    });

    it('handles 204 No Content', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: true, status: 204 });
      const result = await apiFetch('/test');
      expect(result).toBeUndefined();
    });

    it('handles 401 by removing token and redirecting', async () => {
      localStorage.setItem('token', 'old-token');
      const replaceMock = vi.fn();
      Object.defineProperty(window, 'location', {
        value: { replace: replaceMock },
        writable: true,
      });
      global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 401 });

      await apiFetch('/test');
      expect(localStorage.getItem('token')).toBeNull();
      expect(replaceMock).toHaveBeenCalledWith('/login');
    });

    it('throws on non-ok response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: 'Bad request' }),
      });

      await expect(apiFetch('/test')).rejects.toThrow('Bad request');
    });

    it('handles error response without JSON body', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('no json')),
      });

      await expect(apiFetch('/test')).rejects.toThrow('HTTP 500');
    });

    it('passes custom options', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      });

      await apiFetch('/test', { method: 'POST', body: JSON.stringify({ a: 1 }) });
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL}/test`,
        expect.objectContaining({ method: 'POST', body: '{"a":1}' }),
      );
    });
  });
});

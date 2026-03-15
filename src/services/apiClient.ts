import type { Workout } from '@/types';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeWorkout(w: any): Workout {
  return {
    ...w,
    id: (w._id ?? w.id)?.toString() || '',
    date: new Date(w.date),
    createdAt: w.createdAt ? new Date(w.createdAt) : undefined,
    exercises: (w.exercises || []).map((ex: any) => ({
      ...ex,
      id: (ex._id ?? ex.id)?.toString() || '',
      sets: (ex.sets || []).map((s: any) => ({
        ...s,
        id: (s._id ?? s.id)?.toString() || '',
      })),
    })),
  };
}

// Получение токена из localStorage
const getToken = (): string | null => localStorage.getItem('token');

// Базовый fetch с JWT-заголовком
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.replace('/login');
    return undefined as T;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

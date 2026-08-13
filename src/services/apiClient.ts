import type { Workout } from '@/types';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/** Документ как он приходит с сервера: _id вместо id, даты строками. */
interface RawDoc {
  _id?: string;
  id?: string;
  [key: string]: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeWorkout(w: any): Workout {
  return {
    ...w,
    id: (w._id ?? w.id)?.toString() || '',
    date: new Date(w.date),
    createdAt: w.createdAt ? new Date(w.createdAt) : undefined,
    exercises: (w.exercises || []).map((ex: RawDoc) => ({
      ...ex,
      id: (ex._id ?? ex.id)?.toString() || '',
      sets: ((ex.sets as RawDoc[]) || []).map((s: RawDoc) => ({
        ...s,
        id: (s._id ?? s.id)?.toString() || '',
      })),
    })),
  };
}

/**
 * Ошибка API с сохранённым HTTP-статусом.
 *
 * Раньше статус терялся в тексте сообщения, а вызывающему коду нужно отличать
 * 409 (конфликт версий) от прочих сбоев, чтобы повторить запись.
 */
export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
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
    throw new ApiError(err.message || `HTTP ${res.status}`, res.status, err);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

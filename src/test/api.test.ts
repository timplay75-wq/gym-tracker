import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/workoutsApi', () => ({
  workoutsApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getStats: vi.fn(),
  },
}));

vi.mock('@/services/authApi', () => ({
  authApi: {
    register: vi.fn(),
    login: vi.fn(),
    getMe: vi.fn(),
  },
}));

import { apiService } from '../services/api';
import { workoutsApi } from '@/services/workoutsApi';
import { authApi } from '@/services/authApi';

describe('apiService (legacy)', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getWorkouts delegates to workoutsApi.getAll', async () => {
    (workoutsApi.getAll as ReturnType<typeof vi.fn>).mockResolvedValue({ workouts: [] });
    await apiService.getWorkouts();
    expect(workoutsApi.getAll).toHaveBeenCalled();
  });

  it('getWorkout delegates to workoutsApi.getById', async () => {
    (workoutsApi.getById as ReturnType<typeof vi.fn>).mockResolvedValue({});
    await apiService.getWorkout('1');
    expect(workoutsApi.getById).toHaveBeenCalledWith('1');
  });

  it('createWorkout delegates to workoutsApi.create', async () => {
    (workoutsApi.create as ReturnType<typeof vi.fn>).mockResolvedValue({});
    await apiService.createWorkout({ name: 'w' });
    expect(workoutsApi.create).toHaveBeenCalledWith({ name: 'w' });
  });

  it('updateWorkout delegates to workoutsApi.update', async () => {
    (workoutsApi.update as ReturnType<typeof vi.fn>).mockResolvedValue({});
    await apiService.updateWorkout('1', { name: 'u' });
    expect(workoutsApi.update).toHaveBeenCalledWith('1', { name: 'u' });
  });

  it('deleteWorkout delegates to workoutsApi.delete', async () => {
    (workoutsApi.delete as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
    await apiService.deleteWorkout('1');
    expect(workoutsApi.delete).toHaveBeenCalledWith('1');
  });

  it('getWorkoutStats delegates to workoutsApi.getStats', async () => {
    (workoutsApi.getStats as ReturnType<typeof vi.fn>).mockResolvedValue({});
    await apiService.getWorkoutStats();
    expect(workoutsApi.getStats).toHaveBeenCalled();
  });

  it('register delegates to authApi.register', async () => {
    (authApi.register as ReturnType<typeof vi.fn>).mockResolvedValue({});
    await apiService.register('John', 'j@e.com', 'pass');
    expect(authApi.register).toHaveBeenCalledWith('John', 'j@e.com', 'pass');
  });

  it('login delegates to authApi.login', async () => {
    (authApi.login as ReturnType<typeof vi.fn>).mockResolvedValue({});
    await apiService.login('j@e.com', 'pass');
    expect(authApi.login).toHaveBeenCalledWith('j@e.com', 'pass');
  });

  it('getUserProfile delegates to authApi.getMe', async () => {
    (authApi.getMe as ReturnType<typeof vi.fn>).mockResolvedValue({});
    await apiService.getUserProfile();
    expect(authApi.getMe).toHaveBeenCalled();
  });
});

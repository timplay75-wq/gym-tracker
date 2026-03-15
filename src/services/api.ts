// Barrel re-export — all API modules split into separate files
export { apiFetch, API_URL, normalizeWorkout } from './apiClient';
export { authApi } from './authApi';
export { workoutsApi } from './workoutsApi';
export { exercisesApi } from './exercisesApi';
export { programsApi } from './programsApi';
export { statsApi } from './statsApi';
export { recordsApi } from './recordsApi';
export { shopApi } from './shopApi';
export { metricsApi } from './metricsApi';
export { subscriptionApi } from './subscriptionApi';
export type { ExercisePackItem } from './shopApi';
export type { BodyMeasurement } from './metricsApi';
export type { SubscriptionPlan, SubscriptionInfo } from './subscriptionApi';

// Legacy default export for backwards compatibility
import { workoutsApi } from './workoutsApi';
import { authApi } from './authApi';

class ApiService {
  async getWorkouts() { return workoutsApi.getAll(); }
  async getWorkout(id: string) { return workoutsApi.getById(id); }
  async createWorkout(workout: unknown) { return workoutsApi.create(workout); }
  async updateWorkout(id: string, workout: unknown) { return workoutsApi.update(id, workout); }
  async deleteWorkout(id: string) { return workoutsApi.delete(id); }
  async getWorkoutStats() { return workoutsApi.getStats(); }
  async register(name: string, email: string, password: string) { return authApi.register(name, email, password); }
  async login(email: string, password: string) { return authApi.login(email, password); }
  async getUserProfile() { return authApi.getMe(); }
}

export const apiService = new ApiService();
export default apiService;

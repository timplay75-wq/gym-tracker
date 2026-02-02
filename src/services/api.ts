const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  // Workouts
  async getWorkouts() {
    const response = await fetch(`${API_URL}/workouts`);
    if (!response.ok) throw new Error('Ошибка при получении тренировок');
    return response.json();
  }

  async getWorkout(id: string) {
    const response = await fetch(`${API_URL}/workouts/${id}`);
    if (!response.ok) throw new Error('Ошибка при получении тренировки');
    return response.json();
  }

  async createWorkout(workout: any) {
    const response = await fetch(`${API_URL}/workouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workout)
    });
    if (!response.ok) throw new Error('Ошибка при создании тренировки');
    return response.json();
  }

  async updateWorkout(id: string, workout: any) {
    const response = await fetch(`${API_URL}/workouts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workout)
    });
    if (!response.ok) throw new Error('Ошибка при обновлении тренировки');
    return response.json();
  }

  async deleteWorkout(id: string) {
    const response = await fetch(`${API_URL}/workouts/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Ошибка при удалении тренировки');
    return response.json();
  }

  async getWorkoutStats() {
    const response = await fetch(`${API_URL}/workouts/stats`);
    if (!response.ok) throw new Error('Ошибка при получении статистики');
    return response.json();
  }

  // Users
  async register(name: string, email: string, password: string) {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (!response.ok) throw new Error('Ошибка при регистрации');
    return response.json();
  }

  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Ошибка при входе');
    return response.json();
  }

  async getUserProfile(token: string) {
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Ошибка при получении профиля');
    return response.json();
  }
}

export const apiService = new ApiService();

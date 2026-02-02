import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '@/services/storage';
import { generateId } from '@/utils/helpers';
import type { Workout } from '@/types';

export const AddWorkout = () => {
  const navigate = useNavigate();
  const [workoutName, setWorkoutName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workoutName.trim()) return;

    const newWorkout: Workout = {
      id: generateId(),
      name: workoutName,
      date: new Date(),
      exercises: [],
      status: 'planned',
    };

    storageService.saveWorkout(newWorkout);
    navigate('/workouts');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Новая тренировка</h2>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label htmlFor="workoutName" className="block text-gray-700 font-medium mb-2">
            Название тренировки
          </label>
          <input
            type="text"
            id="workoutName"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Например: Грудь и трицепс"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Создать тренировку
        </button>
      </form>
    </div>
  );
};

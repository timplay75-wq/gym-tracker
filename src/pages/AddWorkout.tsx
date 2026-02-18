import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '@/services/storage';
import { generateId } from '@/utils/helpers';
import type { Workout } from '@/types';
import { Button } from '@/components';

export const AddWorkout = () => {
  const navigate = useNavigate();
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split('T')[0]);
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workoutName.trim()) return;

    const newWorkout: Workout = {
      id: generateId(),
      name: workoutName,
      date: new Date(workoutDate),
      exercises: [],
      status: 'planned',
      notes: notes || undefined,
    };

    // Сохраняем тренировку и переходим в конструктор для добавления упражнений
    storageService.saveWorkout(newWorkout);
    navigate('/builder', { state: { workout: newWorkout } });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-[480px] mx-auto px-5">
        {/* Header */}
        <header className="pt-6 pb-6">
          <div className="bg-gradient-to-r from-[#7c3aed] to-[#9333ea] text-white rounded-2xl p-6 shadow-lg shadow-[#9333ea]/30">
            <h1 className="text-2xl font-bold">
              Новая тренировка
            </h1>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Название тренировки */}
          <div>
            <label
              htmlFor="workoutName"
              className="block text-sm font-medium text-[#6d28d9] mb-2"
            >
              Название тренировки
            </label>
            <input
              type="text"
              id="workoutName"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              className="w-full h-12 px-4 border-2 border-[#9333ea] rounded-lg focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed] bg-white text-gray-900 placeholder-[#9333ea] outline-none transition-all"
              placeholder="Грудь и трицепс"
              required
              autoFocus
            />
          </div>

          {/* Дата */}
          <div>
            <label
              htmlFor="workoutDate"
              className="block text-sm font-medium text-[#6d28d9] mb-2"
            >
              Дата
            </label>
            <input
              type="date"
              id="workoutDate"
              value={workoutDate}
              onChange={(e) => setWorkoutDate(e.target.value)}
              className="w-full h-12 px-4 border-2 border-[#9333ea] rounded-lg focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed] bg-white text-gray-900 outline-none transition-all"
              required
            />
          </div>

          {/* День недели (опционально) */}
          <div>
            <label
              htmlFor="dayOfWeek"
              className="block text-sm font-medium text-[#6d28d9] mb-2"
            >
              День недели <span className="text-[#9333ea]">(опционально)</span>
            </label>
            <input
              type="text"
              id="dayOfWeek"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              className="w-full h-12 px-4 border-2 border-[#9333ea] rounded-lg focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed] bg-white text-gray-900 placeholder-[#9333ea] outline-none transition-all"
              placeholder="Понедельник"
            />
          </div>

          {/* Заметки (опционально) */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-[#6d28d9] mb-2"
            >
              Заметки <span className="text-[#9333ea]">(опционально)</span>
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border-2 border-[#9333ea] rounded-lg focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed] bg-white text-gray-900 placeholder-[#9333ea] outline-none transition-all resize-none"
              placeholder="Добавьте заметки к тренировке..."
            />
          </div>

          {/* Блок упражнений */}
          <div className="pt-4">
            <h3 className="text-sm font-medium text-[#6d28d9] mb-2">
              Упражнения (0)
            </h3>
            <div className="min-h-[100px] border-2 border-dashed border-[#9333ea] bg-[#e9d5ff] rounded-lg flex items-center justify-center text-[#7c3aed] font-medium">
              Упражнения будут добавлены на следующем шаге
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="flex-1 h-14"
              onClick={handleCancel}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="flex-1 h-14"
            >
              Следующий шаг
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

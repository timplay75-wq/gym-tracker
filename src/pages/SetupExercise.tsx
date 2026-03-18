import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { workoutsApi } from '@/services/api';
import { useLanguage } from '@/i18n';
import { useToast } from '@/hooks/useToast';

export const SetupExercise = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const toast = useToast();
  
  const exerciseName = location.state?.exerciseName as string || '';
  const categoryId = location.state?.categoryId as string || '';
  const categoryName = location.state?.categoryName as string || '';
  
  const [name, setName] = useState(exerciseName);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);

    const categoryMap: Record<string, string> = {
      chest: 'chest', back: 'back', legs: 'legs',
      shoulders: 'shoulders', arms: 'arms', abs: 'core',
      cardio: 'cardio', stretching: 'other',
    };
    const category = categoryMap[categoryId] ?? 'other';

    const newExercise = {
      name: name,
      category: category,
      sets: [{ reps: 0, weight: 0 }],
    };

    try {
      const dayStr = date;
      const res = await workoutsApi.getAll({ limit: 50 });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const existing = res.workouts.find((w: any) => {
        const wd = typeof w.date === 'string' ? w.date.slice(0, 10) : new Date(w.date).toISOString().slice(0, 10);
        return wd === dayStr;
      });

      if (existing) {
        const updatedExercises = [...(existing.exercises || []), newExercise];
        await workoutsApi.update(existing.id, { exercises: updatedExercises });
      } else {
        await workoutsApi.create({
          name: name,
          date: new Date(date + 'T12:00:00'),
          exercises: [newExercise],
          status: 'planned',
        });
      }
      navigate('/');
      toast.success(t.setupExercise.saved);
    } catch (err) {
      toast.error(`${t.setupExercise.saveError}: ${err instanceof Error ? err.message : ''}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a2e] pb-24">
      <div className="max-w-[480px] mx-auto px-5">
        {/* Header */}
        <header className="pt-8 pb-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-[#9333ea]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-black dark:text-white">{categoryName}</h1>
          <div className="w-6" />
        </header>

        {/* Exercise name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t.setupExercise.exerciseName}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-[#9333ea] focus:outline-none text-base bg-white dark:bg-[#16213e] text-gray-900 dark:text-white"
            placeholder={t.setupExercise.namePlaceholder}
          />
        </div>

        {/* Date */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t.setupExercise.trainingDate}
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-[#9333ea] focus:outline-none text-base bg-white dark:bg-[#16213e] text-gray-900 dark:text-white"
          />
        </div>

        {/* Info hint */}
        <div className="mb-6 p-4 bg-[#f3e8ff] dark:bg-[#9333ea]/10 rounded-xl">
          <p className="text-sm text-[#7c3aed] dark:text-[#c084fc]">
            {t.setupExercise.setsHint || 'Подходы, вес и повторения настраиваются во время тренировки'}
          </p>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving || !name.trim()}
          className="w-full py-4 bg-[#9333ea] text-white rounded-xl font-semibold text-lg hover:bg-[#7c3aed] transition-colors disabled:opacity-50"
        >
          {saving ? t.setupExercise.saving : t.setupExercise.save}
        </button>
      </div>
    </div>
  );
};

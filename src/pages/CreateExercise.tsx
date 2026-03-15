import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { exercisesApi } from '@/services/api';
import { useToast } from '@/hooks/useToast';
import { useLanguage } from '@/i18n';

const CATEGORIES = [
  { id: 'chest', icon: '🏋️' },
  { id: 'back', icon: '🔙' },
  { id: 'legs', icon: '🦵' },
  { id: 'shoulders', icon: '💪' },
  { id: 'arms', icon: '💪' },
  { id: 'abs', icon: '🎯' },
  { id: 'cardio', icon: '❤️' },
  { id: 'stretching', icon: '🧘' },
] as const;

const categoryToBackend: Record<string, string> = {
  stretching: 'other', cardio: 'cardio', chest: 'chest', back: 'back',
  arms: 'arms', legs: 'legs', shoulders: 'shoulders', abs: 'core',
};

export const CreateExercise = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useLanguage();
  const prefilledName = location.state?.prefilledName as string | undefined;
  const preselectedCategory = location.state?.preselectedCategory as string | undefined;

  const [name, setName] = useState(prefilledName || '');
  const [selectedCategory, setSelectedCategory] = useState(preselectedCategory || '');
  const [isDoubleWeight, setIsDoubleWeight] = useState(false);
  const [isBodyweight, setIsBodyweight] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !selectedCategory || saving) return;
    setSaving(true);
    try {
      const backendCat = categoryToBackend[selectedCategory] || 'other';
      await exercisesApi.create({
        name: name.trim(),
        category: backendCat,
        type: backendCat === 'cardio' ? 'cardio' : 'strength',
        isDoubleWeight,
        isBodyweight,
      });
      toast.success(t.setupExercise.saved);
      navigate(-1);
    } catch {
      toast.error(t.common?.error || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a2e] pb-8">
      <div className="max-w-[480px] mx-auto px-5">
        {/* Header */}
        <header className="pt-6 pb-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-2xl font-bold text-black dark:text-white">{t.exercises.newExercise || 'Новое упражнение'}</h1>
        </header>

        {/* Name */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t.setupExercise?.exerciseName || 'Название упражнения'}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-[#9333ea] focus:outline-none text-base bg-white dark:bg-[#16213e] text-gray-900 dark:text-white"
            placeholder={t.exercises.enterName || 'Введите название'}
            autoFocus
          />
        </div>

        {/* Category selection */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t.exercises.selectCategory || 'Категория'}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              const label = (t.exercises as Record<string, string>)[cat.id] || cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`py-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                    active
                      ? 'bg-[#9333ea] text-white shadow-md shadow-purple-300 dark:shadow-purple-900/40'
                      : 'bg-white dark:bg-[#16213e] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Toggles */}
        <div className="mt-6 space-y-3">
          {/* Double weight */}
          <label className="flex items-center justify-between bg-white dark:bg-[#16213e] rounded-xl px-4 py-3.5 border border-gray-100 dark:border-gray-800 cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.exercises.doubleWeight || 'Двойной вес'}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{t.exercises.doubleWeightHint || '2 гантели — вес ×2 в статистике'}</p>
            </div>
            <div
              onClick={() => setIsDoubleWeight(!isDoubleWeight)}
              className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors cursor-pointer ${
                isDoubleWeight ? 'bg-[#9333ea]' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                isDoubleWeight ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </div>
          </label>

          {/* Bodyweight */}
          <label className="flex items-center justify-between bg-white dark:bg-[#16213e] rounded-xl px-4 py-3.5 border border-gray-100 dark:border-gray-800 cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.exercises.bodyweight || 'Собственный вес'}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{t.exercises.bodyweightHint || 'Подтягивания, отжимания и т.п.'}</p>
            </div>
            <div
              onClick={() => setIsBodyweight(!isBodyweight)}
              className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors cursor-pointer ${
                isBodyweight ? 'bg-[#9333ea]' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                isBodyweight ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </div>
          </label>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving || !name.trim() || !selectedCategory}
          className="w-full mt-8 py-3.5 bg-[#9333ea] text-white rounded-xl font-semibold text-base active:bg-[#7c3aed] transition-colors disabled:opacity-50"
        >
          {saving ? '...' : (t.exercises.createExercise || 'Создать')}
        </button>
      </div>
    </div>
  );
};

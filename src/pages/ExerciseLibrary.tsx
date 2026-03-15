import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n';
import { exercisesApi } from '@/services/api';

const categoryToBackend: Record<string, string> = {
  stretching: 'other',
  cardio: 'cardio',
  chest: 'chest',
  back: 'back',
  arms: 'arms',
  legs: 'legs',
  shoulders: 'shoulders',
  abs: 'core',
};

interface Category {
  id: string;
  name: string;
  count: number;
  exercises: string[];
}

export const ExerciseLibrary = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'exercises' | 'programs'>('exercises');
  const [customCounts, setCustomCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    exercisesApi.getAll().then((exercises: any[]) => {
      const counts: Record<string, number> = {};
      exercises.filter((e: any) => e.isCustom).forEach((e: any) => {
        const frontendCat = Object.entries(categoryToBackend).find(([, v]) => v === e.category)?.[0];
        if (frontendCat) counts[frontendCat] = (counts[frontendCat] || 0) + 1;
      });
      setCustomCounts(counts);
    }).catch(() => {});
  }, []);

  const categories: Category[] = [
    { id: 'stretching', name: t.exercises.stretching, count: 3 + (customCounts['stretching'] || 0), exercises: [...t.exerciseLib.stretching] },
    { id: 'cardio', name: t.exercises.cardio, count: 4 + (customCounts['cardio'] || 0), exercises: [...t.exerciseLib.cardio] },
    { id: 'chest', name: t.exercises.chest, count: 4 + (customCounts['chest'] || 0), exercises: [...t.exerciseLib.chest] },
    { id: 'back', name: t.exercises.back, count: 3 + (customCounts['back'] || 0), exercises: [...t.exerciseLib.back] },
    { id: 'arms', name: t.exercises.arms, count: 4 + (customCounts['arms'] || 0), exercises: [...t.exerciseLib.arms] },
    { id: 'legs', name: t.exercises.legs, count: 4 + (customCounts['legs'] || 0), exercises: [...t.exerciseLib.legs] },
    { id: 'shoulders', name: t.exercises.shoulders, count: 3 + (customCounts['shoulders'] || 0), exercises: [...t.exerciseLib.shoulders] },
    { id: 'abs', name: t.exercises.abs, count: 3 + (customCounts['abs'] || 0), exercises: [...t.exerciseLib.abs] },
  ];

  const handleCategoryClick = (category: Category) => {
    navigate(`/category/${category.id}`, { state: { category } });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a2e] pb-8">
      <div className="max-w-[480px] mx-auto px-5">
        {/* Заголовок */}
        <header className="pt-6 pb-4 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-3xl font-bold text-black dark:text-white">{t.exercises.title}</h1>
        </header>

        {/* Переключатель вкладок */}
        <div className="flex justify-center gap-8 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('exercises')}
            className={`pb-3 px-1 font-semibold transition-colors relative ${
              activeTab === 'exercises' 
                ? 'text-[#9333ea]' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {t.exercises.exercises}
            {activeTab === 'exercises' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9333ea]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('programs')}
            className={`pb-3 px-1 font-semibold transition-colors relative ${
              activeTab === 'programs' 
                ? 'text-[#9333ea]' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {t.exercises.programs}
            {activeTab === 'programs' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9333ea]" />
            )}
          </button>
        </div>

        {/* Контент вкладки */}
        {activeTab === 'exercises' ? (
          <div>
            {/* Кнопка создания своего упражнения */}
            <button
              onClick={() => navigate('/create-exercise')}
              className="w-full mb-4 py-3 border-2 border-dashed border-[#9333ea] rounded-xl text-[#9333ea] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#9333ea]/10 active:bg-[#9333ea]/20 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              {t.exercises.createExercise}
            </button>

            {/* Список категорий */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="w-full py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#16213e] transition-colors"
                >
                  <span className="font-semibold text-black dark:text-white">{category.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">{category.count}</span>
                    <svg className="w-5 h-5 text-[#9333ea]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Вкладка "Программы"
          <div className="flex items-center justify-center py-20">
            <button
              onClick={() => navigate('/create-program')}
              className="px-8 py-4 border-2 border-[#9333ea] rounded-xl text-[#9333ea] font-semibold hover:bg-[#9333ea] hover:text-white transition-colors"
            >
              {t.exercises.createProgram}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/i18n';
import { exercisesApi, programsApi, workoutsApi } from '@/services/api';
import { MuscleIcon } from '@/components/MuscleIcon';
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
  const location = useLocation();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'exercises' | 'programs'>('exercises');
  const [customCounts, setCustomCounts] = useState<Record<string, number>>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [programs, setPrograms] = useState<any[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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

  useEffect(() => {
    if (activeTab === 'programs') {
      setLoadingPrograms(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (programsApi.getAll() as Promise<any[]>).then(data => {
        setPrograms(data);
      }).catch(() => setPrograms([])).finally(() => setLoadingPrograms(false));
    }
  }, [activeTab]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleApplyProgram = async (prog: any) => {    const date = (location.state?.date as string) || new Date().toISOString().slice(0, 10);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let exercises: any[] = [];
    if (prog.exercises && prog.exercises.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      exercises = prog.exercises.map((ex: any) => ({
        name: ex.name, category: ex.category || 'other',
        sets: Array.from({ length: ex.sets || 3 }, () => ({ weight: 0, reps: 0, completed: false })),
      }));
    } else if (prog.days && prog.days.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      exercises = prog.days.flatMap((d: any) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (d.exercises || []).map((ex: any) => ({
          name: ex.name, category: ex.category || 'other',
          sets: Array.from({ length: ex.sets || 3 }, () => ({ weight: ex.weight || 0, reps: ex.reps || 0, completed: false })),
        }))
      );
    }
    if (!exercises.length) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await workoutsApi.getAll({ limit: 50 }) as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const match = res.workouts.find((w: any) => {
        const wd = typeof w.date === 'string' ? w.date.slice(0, 10) : new Date(w.date).toISOString().slice(0, 10);
        return wd === date;
      });
      if (match) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await workoutsApi.update((match as any).id || (match as any)._id, { exercises: [...(match as any).exercises, ...exercises] });
      } else {
        await workoutsApi.create({ name: prog.name, date: new Date(date).toISOString(), exercises });
      }
      navigate('/');
    } catch { /* ignore */ }
  };

  const confirmDeleteProgram = async () => {
    if (!deleteConfirmId) return;
    try {
      await programsApi.delete(deleteConfirmId);
      setPrograms(prev => prev.filter(p => p._id !== deleteConfirmId));
    } catch { /* ignore */ } finally {
      setDeleteConfirmId(null);
    }
  };

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
    navigate(`/category/${category.id}`, { state: { category, date: location.state?.date } });
  };

  return (
    <>
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
            <div className="space-y-1 animate-stagger">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="w-full rounded-[1.4rem] px-2 py-2.5 text-left flex items-center gap-3 transition-colors hover:bg-black/[0.035] dark:hover:bg-white/[0.05] active:scale-[0.98]"
                >
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-[#18181b] dark:text-white">
                    <MuscleIcon muscle={category.id} size={42} className="h-10 w-10" />
                  </div>
                  <span className="flex-1 text-[1.125rem] font-semibold tracking-[-0.02em] text-[#18181b] dark:text-white">{category.name}</span>
                  <div className="flex items-center gap-4 pl-3">
                    <span className="min-w-[0.75rem] text-right text-base font-semibold text-[#a1a1aa] dark:text-[#9ca3af]">{category.count}</span>
                    <svg className="w-4 h-4 text-[#b4b4bc] dark:text-[#8f95a3]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Вкладка "Программы"
          <div>
            <button
              onClick={() => navigate('/create-program', { state: { fromDate: location.state?.date } })}
              className="w-full mb-4 py-3 border-2 border-dashed border-[#9333ea] rounded-xl text-[#9333ea] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#9333ea]/10 active:bg-[#9333ea]/20 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              {t.exercises.createProgram}
            </button>

            {loadingPrograms ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : programs.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                {t.programs?.noPrograms || 'Нет программ'}
              </div>
            ) : (
              <div className="space-y-3">
                {programs.map((prog: any) => {
                  const exerciseCount: number = prog.exercises?.length
                    || (prog.days || []).reduce((s: number, d: any) => s + (d.exercises?.length || 0), 0)
                    || 0;
                  return (
                    <div key={prog._id} className="bg-white dark:bg-[#16213e] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">{prog.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        {exerciseCount} {t.programs?.exercises || 'упр.'}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApplyProgram(prog)}
                          className="flex-1 py-2 rounded-xl bg-[#9333ea] text-white text-sm font-semibold active:bg-[#7c3aed] transition-colors"
                        >
                          + {t.programs?.applyToDay || 'Добавить к дню'}
                        </button>
                        <button
                          onClick={() => navigate('/create-program', { state: { program: prog } })}
                          className="py-2 px-3 rounded-xl text-sm font-medium bg-[#f3e8ff] text-[#7c3aed] hover:bg-[#e9d5ff] transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(prog._id)}
                          className="py-2 px-3 rounded-xl text-sm font-medium bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>

    {/* Delete program confirm modal */}
    {deleteConfirmId && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirmId(null)}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="relative bg-white dark:bg-[#16213e] rounded-2xl shadow-xl p-6 w-full max-w-[320px]" onClick={e => e.stopPropagation()}>
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </div>
          <h3 className="text-center font-bold text-gray-900 dark:text-white mb-1">{t.programs?.title || 'Программа'}</h3>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-5">{t.programs?.deleteConfirm || 'Удалить программу?'}</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              {t.common?.cancel || 'Отмена'}
            </button>
            <button onClick={confirmDeleteProgram} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">
              {t.common?.delete || 'Удалить'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

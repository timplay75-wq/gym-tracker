import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';
import { programsApi, exercisesApi } from '@/services/api';
import { useLanguage } from '@/i18n';

/* ───── данные категорий ───── */
const CATEGORIES = [
  { id: 'chest',     name: 'Грудь',  backendKey: 'chest',     exercises: ['Жим гантелей на наклонной скамье', 'Жим штанги лежа', 'Отжимания', 'Сведение рук в тренажере'] },
  { id: 'back',      name: 'Спина',  backendKey: 'back',      exercises: ['Подтягивания широким хватом', 'Становая тяга', 'Тяга нижнего блока'] },
  { id: 'legs',      name: 'Ноги',   backendKey: 'legs',      exercises: ['Выпады со штангой', 'Жим ногами в тренажере', 'Приседания со штангой', 'Разгибания ног в тренажере'] },
  { id: 'arms',      name: 'Руки',   backendKey: 'arms',      exercises: ['Концентрированные подъемы на бицепс', 'Отжимания на брусьях', 'Подъем штанги на бицепс', 'Французский жим лежа со штангой'] },
  { id: 'shoulders', name: 'Плечи',  backendKey: 'shoulders', exercises: ['Армейский жим стоя', 'Жим гантелей сидя', 'Разведение гантелей в стороны'] },
  { id: 'abs',       name: 'Пресс',  backendKey: 'core',      exercises: ['Горизонтальные скручивания', 'Подъем ног в висе', 'Скручивания на наклонной скамье'] },
  { id: 'cardio',    name: 'Кардио', backendKey: 'cardio',    exercises: ['Беговая дорожка', 'Велотренажер', 'Степ тренажер', 'Эллиптический тренажер'] },
];

interface ProgramState {
  _id: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  days: { exercises: any[] }[];
}

export const CreateProgram = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const toast = useToast();

  const editProgram = (location.state as { program?: ProgramState })?.program;
  const isEditMode = !!editProgram;

  /* извлекаем упражнения из существующей программы для предзаполнения */
  const getInitialSelected = (): Set<string> => {
    if (!editProgram) return new Set();
    const names: string[] = [];
    editProgram.days?.forEach((day) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      day.exercises?.forEach((ex: any) => names.push(ex.name));
    });
    return new Set(names);
  };

  const [programName, setProgramName] = useState(editProgram?.name || '');
  const [selected, setSelected] = useState<Set<string>>(getInitialSelected);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [customByCategory, setCustomByCategory] = useState<Record<string, string[]>>({});

  /* загружаем пользовательские упражнения */
  useEffect(() => {
    const load = async () => {
      const result: Record<string, string[]> = {};
      await Promise.all(
        CATEGORIES.map(async (cat) => {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const exs = await exercisesApi.getAll({ category: cat.backendKey }) as any[];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            result[cat.id] = exs.filter((e: any) => e.isCustom).map((e: any) => e.name);
          } catch { /* ignore */ }
        })
      );
      setCustomByCategory(result);
    };
    load();
  }, []);

  const toggleExercise = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const getCategoryBackendKey = (name: string): string => {
    for (const cat of CATEGORIES) {
      if (cat.exercises.includes(name) || (customByCategory[cat.id] || []).includes(name)) {
        return cat.backendKey;
      }
    }
    return 'other';
  };

  const handleSave = async () => {
    if (!programName.trim()) {
      toast.error(t.programs.name);
      return;
    }
    if (selected.size === 0) {
      toast.error(t.programs.noExercisesSelected);
      return;
    }
    setSaving(true);
    const exercises = Array.from(selected).map((name) => ({
      name,
      category: getCategoryBackendKey(name),
      sets: 3,
      reps: 10,
      weight: 0,
      restTime: 90,
    }));
    const payload = {
      name: programName.trim(),
      days: [{ dayOfWeek: 'all', name: programName.trim(), exercises }],
    };
    try {
      if (isEditMode && editProgram) {
        await programsApi.update(editProgram._id, payload);
        toast.success(t.programs.updated);
      } else {
        await programsApi.create(payload);
        toast.success(t.programs.saved);
      }
      navigate('/programs');
    } catch {
      toast.error('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a2e] pb-32">
      <div className="max-w-[480px] mx-auto px-4">
        {/* Header */}
        <header className="pt-6 pb-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex-1">
            {isEditMode ? t.programs.editProgram : t.programs.createNew}
          </h1>
        </header>

        {/* Program name */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            {t.programs.name}
          </label>
          <input
            type="text"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            placeholder={t.programs.namePlaceholder}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#16213e] text-gray-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-[#9333ea]"
          />
        </div>

        {/* Selected count */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {t.programs.pickExercises}:&nbsp;
          <span className="font-bold text-[#9333ea]">{selected.size}</span>
        </p>

        {/* Category accordion */}
        <div className="space-y-2">
          {CATEGORIES.map((cat) => {
            const allExercises = [...cat.exercises, ...(customByCategory[cat.id] || [])];
            const selectedCount = allExercises.filter((e) => selected.has(e)).length;
            const isOpen = expanded === cat.id;

            return (
              <div key={cat.id} className="bg-white dark:bg-[#16213e] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
                {/* Category header */}
                <button
                  onClick={() => setExpanded(isOpen ? null : cat.id)}
                  className="w-full px-4 py-3.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">{cat.name}</span>
                    {selectedCount > 0 && (
                      <span className="text-xs bg-[#9333ea] text-white px-2 py-0.5 rounded-full font-medium">
                        {selectedCount}
                      </span>
                    )}
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Exercise list */}
                {isOpen && (
                  <div className="border-t border-gray-100 dark:border-gray-800">
                    {allExercises.map((exercise) => {
                      const isChecked = selected.has(exercise);
                      return (
                        <button
                          key={exercise}
                          onClick={() => toggleExercise(exercise)}
                          className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                            isChecked
                              ? 'bg-[#f3e8ff] dark:bg-[#9333ea]/10'
                              : 'hover:bg-gray-50 dark:hover:bg-white/5'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 transition-colors ${
                            isChecked ? 'bg-[#9333ea] border-[#9333ea]' : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {isChecked && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-sm ${isChecked ? 'font-semibold text-[#7c3aed]' : 'text-gray-800 dark:text-white'}`}>
                            {exercise}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky save button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1a1a2e] border-t border-gray-200 dark:border-gray-700 p-4 pb-safe">
        <div className="max-w-[480px] mx-auto">
          <button
            onClick={handleSave}
            disabled={saving || !programName.trim() || selected.size === 0}
            className="w-full py-3.5 bg-[#9333ea] text-white rounded-2xl font-semibold text-base disabled:opacity-40 hover:bg-[#7c3aed] transition-colors"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t.programs.save}
              </span>
            ) : `${t.programs.save} (${selected.size} ${t.programs.exercises})`}
          </button>
        </div>
      </div>
    </div>
  );
};

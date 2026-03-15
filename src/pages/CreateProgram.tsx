import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';
import { programsApi } from '@/services/api';
import { NumberStepper } from '@/components';
import { useLanguage } from '@/i18n';

/* ───── типы ───── */
interface ExerciseEntry {
  name: string;
  category: string;
  sets: number;
  reps: number;
  weight: number;
  restTime: number;
}

interface DayEntry {
  dayOfWeek: string;
  name: string;
  exercises: ExerciseEntry[];
}

interface ProgramState {
  _id: string;
  name: string;
  description?: string;
  durationWeeks?: number;
  days: DayEntry[];
}

const ALL_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export const CreateProgram = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const toast = useToast();

  // Если пришли из редактирования — заполняем формы данными
  const editProgram = (location.state as { program?: ProgramState })?.program;
  const isEditMode = !!editProgram;

  const [programName, setProgramName] = useState(editProgram?.name || '');
  const [description, setDescription] = useState(editProgram?.description || '');
  const [duration, setDuration] = useState(editProgram?.durationWeeks || 4);
  const [days, setDays] = useState<DayEntry[]>(
    editProgram?.days?.map((d) => ({
      dayOfWeek: d.dayOfWeek,
      name: d.name,
      exercises: d.exercises.map((ex) => ({
        name: ex.name,
        category: ex.category || 'chest',
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight || 0,
        restTime: ex.restTime,
      })),
    })) || []
  );
  const [saving, setSaving] = useState(false);

  /* добавить / убрать день по дню недели (toggle) */
  const toggleDay = (dayOfWeek: string) => {
    const existing = days.findIndex((d) => d.dayOfWeek === dayOfWeek);
    if (existing !== -1) {
      // Убрать день
      setDays(days.filter((_, i) => i !== existing));
    } else {
      // Добавить день и отсортировать по порядку недели
      const newDays = [...days, { dayOfWeek, name: '', exercises: [] }];
      newDays.sort((a, b) => ALL_DAYS.indexOf(a.dayOfWeek as typeof ALL_DAYS[number]) - ALL_DAYS.indexOf(b.dayOfWeek as typeof ALL_DAYS[number]));
      setDays(newDays);
    }
  };

  const updateDay = (idx: number, patch: Partial<DayEntry>) => {
    setDays(days.map((d, i) => (i === idx ? { ...d, ...patch } : d)));
  };

  /* упражнения в дне */
  const addExercise = (dayIdx: number) => {
    const day = days[dayIdx];
    updateDay(dayIdx, {
      exercises: [...day.exercises, { name: '', category: 'chest', sets: 3, reps: 10, weight: 0, restTime: 90 }],
    });
  };

  const removeExercise = (dayIdx: number, exIdx: number) => {
    const day = days[dayIdx];
    updateDay(dayIdx, { exercises: day.exercises.filter((_, i) => i !== exIdx) });
  };

  const updateExercise = (dayIdx: number, exIdx: number, patch: Partial<ExerciseEntry>) => {
    const day = days[dayIdx];
    updateDay(dayIdx, {
      exercises: day.exercises.map((ex, i) => (i === exIdx ? { ...ex, ...patch } : ex)),
    });
  };

  /* сохранение */
  const handleSave = async () => {
    if (!programName.trim()) return;
    setSaving(true);
    try {
      const payload = {
        name: programName.trim(),
        description: description.trim() || undefined,
        durationWeeks: duration || undefined,
        days: days.filter((d) => d.name.trim()).map((d) => ({
          dayOfWeek: d.dayOfWeek,
          name: d.name.trim(),
          exercises: d.exercises.filter((ex) => ex.name.trim()),
        })),
      };
      if (isEditMode && editProgram) {
        await programsApi.update(editProgram._id, payload);
        toast.success(t.programs.updated);
      } else {
        await programsApi.create(payload);
        toast.success(t.programs.created);
      }
      navigate('/programs');
    } catch {
      toast.error('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const dayNames = t.programs.dayNames as Record<string, string>;

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a2e] pb-24">
      <div className="max-w-[480px] mx-auto px-4">
        {/* Header */}
        <header className="pt-6 pb-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-1 text-[#9333ea]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-[#1e1b4b] dark:text-white">{isEditMode ? t.programs.editProgram : t.programs.createNew}</h1>
          <div className="w-6" />
        </header>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#374151] dark:text-gray-300 mb-1.5">
            {t.programs.name} *
          </label>
          <input
            type="text"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            className="w-full px-4 py-3 border-2 border-[#e5e7eb] dark:border-gray-600 rounded-xl bg-white dark:bg-[#16213e] text-gray-900 dark:text-white focus:border-[#9333ea] focus:outline-none text-base"
            placeholder={t.programs.namePlaceholder}
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#374151] dark:text-gray-300 mb-1.5">
            {t.programs.description}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border-2 border-[#e5e7eb] dark:border-gray-600 rounded-xl bg-white dark:bg-[#16213e] text-gray-900 dark:text-white focus:border-[#9333ea] focus:outline-none text-base resize-none"
            placeholder={t.programs.descPlaceholder}
            rows={2}
          />
        </div>

        {/* Duration */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-[#374151] dark:text-gray-300 mb-1.5">
            {t.programs.duration}
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border-2 border-[#e5e7eb] dark:border-gray-600 rounded-xl bg-white dark:bg-[#16213e] text-gray-900 dark:text-white focus:border-[#9333ea] focus:outline-none text-base"
            min="1"
            max="52"
          />
        </div>

        {/* Days */}
        <div className="mb-5">
          <h2 className="text-base font-semibold text-[#1e1b4b] dark:text-white mb-3">{t.programs.schedule}</h2>

          {/* Day chips row — toggle on/off */}
          <div className="flex gap-1.5 mb-4">
            {ALL_DAYS.map((d) => {
              const isSelected = days.some((day) => day.dayOfWeek === d);
              const shortName = (t.programs.dayNamesShort as Record<string, string>)[d];
              return (
                <button
                  key={d}
                  onClick={() => toggleDay(d)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-[#9333ea] text-white'
                    : 'bg-[#f3f4f6] dark:bg-gray-800 text-[#6b7280] dark:text-gray-400 hover:bg-[#e5e7eb] dark:hover:bg-gray-700'
                  }`}
                >
                  {shortName}
                </button>
              );
            })}
          </div>

          {days.length === 0 && (
            <p className="text-sm text-[#6b7280] dark:text-gray-400 text-center py-6">{t.programs.selectDay}</p>
          )}

          <div className="space-y-3">
            {days.map((day, dayIdx) => (
              <div key={dayIdx} className="bg-[#f9fafb] dark:bg-[#16213e] rounded-xl p-3 border border-[#e5e7eb] dark:border-gray-700">
                {/* Day header */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#e9d5ff] text-[#7c3aed] font-semibold">
                    {dayNames[day.dayOfWeek]}
                  </span>
                  <input
                    type="text"
                    value={day.name}
                    onChange={(e) => updateDay(dayIdx, { name: e.target.value })}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-[#e5e7eb] dark:border-gray-600 bg-white dark:bg-[#1a1a2e] text-gray-900 dark:text-white text-sm focus:border-[#9333ea] focus:outline-none"
                    placeholder={t.programs.dayNamePlaceholder}
                  />
                </div>

                {/* Exercises */}
                {day.exercises.length > 0 && (
                  <div className="text-[10px] font-semibold text-[#9333ea] uppercase tracking-wider mb-1.5 px-0.5">
                    {t.programs.exercises} ({day.exercises.length})
                  </div>
                )}
                <div className="space-y-2 mb-2">
                  {day.exercises.map((ex, exIdx) => (
                    <div key={exIdx} className="bg-white dark:bg-[#1a1a2e] rounded-lg p-2.5 border border-[#e5e7eb] dark:border-gray-700 relative">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#e9d5ff] text-[#7c3aed] text-[10px] font-bold flex items-center justify-center">
                          {exIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={ex.name}
                          onChange={(e) => updateExercise(dayIdx, exIdx, { name: e.target.value })}
                          className="flex-1 px-2 py-1 rounded-lg border border-[#e5e7eb] dark:border-gray-600 bg-white dark:bg-[#16213e] text-gray-900 dark:text-white text-sm focus:border-[#9333ea] focus:outline-none"
                          placeholder={t.programs.addExercise}
                        />
                        <button
                          onClick={() => removeExercise(dayIdx, exIdx)}
                          className="text-[#ef4444] p-1"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 overflow-hidden">
                        <div>
                          <div className="text-[10px] text-[#6b7280] dark:text-gray-400 mb-0.5 text-center">{t.programs.sets}</div>
                          <NumberStepper
                            value={ex.sets}
                            onChange={(v) => updateExercise(dayIdx, exIdx, { sets: v })}
                            min={1}
                            step={1}
                            size="sm"
                          />
                        </div>
                        <div>
                          <div className="text-[10px] text-[#6b7280] dark:text-gray-400 mb-0.5 text-center">{t.programs.reps}</div>
                          <NumberStepper
                            value={ex.reps}
                            onChange={(v) => updateExercise(dayIdx, exIdx, { reps: v })}
                            min={1}
                            step={1}
                            size="sm"
                          />
                        </div>
                        <div>
                          <div className="text-[10px] text-[#6b7280] dark:text-gray-400 mb-0.5 text-center">{t.programs.rest}</div>
                          <NumberStepper
                            value={ex.restTime}
                            onChange={(v) => updateExercise(dayIdx, exIdx, { restTime: v })}
                            min={0}
                            step={15}
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => addExercise(dayIdx)}
                  className="w-full py-2.5 text-sm font-semibold text-[#7c3aed] bg-[#f3e8ff] rounded-xl hover:bg-[#e9d5ff] transition-colors flex items-center justify-center gap-1.5 border-2 border-dashed border-[#d8b4fe]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  {t.programs.addExercise}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-3.5 border-2 border-[#9333ea] text-[#9333ea] rounded-xl font-semibold text-base hover:bg-[#f3e8ff] transition-colors"
          >
            {t.programs.cancel}
          </button>
          <button
            onClick={handleSave}
            disabled={!programName.trim() || saving}
            className="flex-1 py-3.5 bg-[#9333ea] text-white rounded-xl font-semibold text-base hover:bg-[#7c3aed] disabled:opacity-50 transition-colors btn-ripple"
          >
            {saving ? '...' : t.programs.save}
          </button>
        </div>
      </div>
    </div>
  );
};

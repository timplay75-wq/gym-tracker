import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { workoutsApi } from '@/services/api';
import { useLanguage } from '@/i18n';
import { useToast } from '@/hooks/useToast';
import { playBeep } from '@/utils/playBeep';
import { hapticLight, hapticSuccess } from '@/utils/haptics';
import { useWakeLock } from '@/hooks/useWakeLock';
import { useBackgroundTimer } from '@/hooks/useBackgroundTimer';
import type { Workout } from '@/types';

const isMongoId = (id?: string) => !!id && /^[a-f\d]{24}$/i.test(id);

interface EditableSet {
  weight: string;
  reps: string;
}

export const ActiveWorkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const toast = useToast();

  const [workout] = useState<Workout | null>(location.state?.workout || null);
  const startIdx: number = location.state?.startExerciseIndex ?? 0;
  const [currentExerciseIndex] = useState(startIdx);
  const currentExercise = workout?.exercises[currentExerciseIndex];

  const withResults: boolean = location.state?.withResults ?? false;

  const [sets, setSets] = useState<EditableSet[]>(() => {
    const ex = (location.state?.workout as Workout | undefined)?.exercises[startIdx];
    if (!ex?.sets?.length) return [{ weight: '', reps: '' }];
    if (!withResults) return [{ weight: '', reps: '' }];
    return ex.sets.map(s => ({
      weight: s.weight ? String(s.weight) : '',
      reps: s.reps ? String(s.reps) : '',
    }));
  });

  const [focusedField, setFocusedField] = useState<{ set: number; field: 'weight' | 'reps' } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  // ── Wake Lock — экран не гаснет во время тренировки ──
  useWakeLock(true);

  // ── Rest Timer (фоновый — корректно работает при сворачивании) ──
  const defaultRestTime = currentExercise?.sets?.[0]?.restTime || 90;
  const [restTotal, setRestTotal] = useState(0);

  const handleRestEnd = useCallback(() => {
    playBeep();
    setTimeout(() => playBeep(660, 200), 300);
    setTimeout(() => playBeep(880, 400), 600);
    hapticSuccess();
  }, []);

  const {
    seconds: restSeconds,
    running: restActive,
    start: startRestTimer,
    stop: stopRestTimer,
    addSeconds: addRestSeconds,
  } = useBackgroundTimer(defaultRestTime, handleRestEnd);

  const startRest = useCallback(() => {
    setRestTotal(defaultRestTime);
    startRestTimer(defaultRestTime);
  }, [defaultRestTime, startRestTimer]);

  const stopRest = useCallback(() => {
    stopRestTimer();
    setRestTotal(0);
  }, [stopRestTimer]);

  const addRestTime = useCallback((sec: number) => {
    addRestSeconds(sec);
    setRestTotal(prev => prev + sec);
  }, [addRestSeconds]);

  const formatRestTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  useEffect(() => {
    if (!currentExercise) return;
    const newSets = currentExercise.sets?.map(s => ({
      weight: s.weight ? String(s.weight) : '',
      reps: s.reps ? String(s.reps) : '',
    }));
    setSets(newSets?.length ? newSets : [{ weight: '', reps: '' }]);
    setHasChanges(false);
  }, [currentExerciseIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateSet = (index: number, field: 'weight' | 'reps', value: string) => {
    if (field === 'weight' && value !== '' && !/^\d*\.?\d*$/.test(value)) return;
    if (field === 'reps' && value !== '' && !/^\d*$/.test(value)) return;
    setSets(prev => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
    setHasChanges(true);
  };

  const handleAddSet = () => {
    hapticLight();
    setSets(prev => [...prev, { weight: '', reps: '' }]);
    setHasChanges(true);
  };

  const handleDeleteSet = (index: number) => {
    if (sets.length <= 1) return;
    hapticLight();
    setSets(prev => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const handleCopyPrevious = async () => {
    if (!currentExercise) return;
    try {
      const res = await workoutsApi.getAll({ limit: 50 });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const currentId = workout?.id || (workout as any)?._id;
      for (const w of res.workouts) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const wId = w.id || (w as any)._id;
        if (wId === currentId) continue;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ex = (w.exercises as any[])?.find((e: any) => e.name === currentExercise.name);
        if (ex?.sets?.length) {
          setSets(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (ex.sets as any[]).map((s: any) => ({
              weight: s.weight ? String(s.weight) : '',
              reps: s.reps ? String(s.reps) : '',
            })),
          );
          setHasChanges(true);
          break;
        }
      }
    } catch {
      /* ignore */
    }
  };

  const handleDone = async () => {
    if (!workout || !currentExercise) return;
    setSaving(true);
    try {
      const updatedWorkout = { ...workout, exercises: [...workout.exercises] };
      const exercise = { ...updatedWorkout.exercises[currentExerciseIndex] };
      const filledSets = sets.filter(s => parseFloat(s.weight) > 0 || parseInt(s.reps, 10) > 0);
      const setsToSave = filledSets.length > 0 ? filledSets : [sets[0]];
      exercise.sets = setsToSave.map((s, i) => ({
        ...(exercise.sets[i] || {}),
        id: exercise.sets[i]?.id || String(i),
        weight: parseFloat(s.weight) || 0,
        reps: parseInt(s.reps, 10) || 0,
        completed: !!(parseFloat(s.weight) || parseInt(s.reps, 10)),
        timestamp: new Date(),
        restTime: exercise.sets[i]?.restTime || 0,
        rpe: exercise.sets[i]?.rpe || undefined,
      }));
      updatedWorkout.exercises[currentExerciseIndex] = exercise;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const id = updatedWorkout.id || (updatedWorkout as any)._id;
      if (isMongoId(id)) {
        await workoutsApi.complete(id, { exercises: updatedWorkout.exercises });
      }
      toast.success(t.activeWorkout.workoutDone);
      hapticSuccess();
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Ошибка. Попробуйте снова');
    } finally {
      setSaving(false);
    }
    navigate('/');
  };

  const handleStats = () => {
    if (currentExercise) {
      navigate(`/stats/exercise/${encodeURIComponent(currentExercise.name)}`);
    }
  };

  // ═════════════════════════════════════════════════
  // Нет тренировки
  // ═════════════════════════════════════════════════
  if (!workout || !currentExercise) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a2e] flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-gray-500 dark:text-gray-400 mb-4">{t.activeWorkout.notFound}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#9333ea] text-white rounded-xl font-semibold text-sm"
          >
            {t.activeWorkout.toHome}
          </button>
        </div>
      </div>
    );
  }

  // Focused input helper
  const inputCls = (idx: number, field: 'weight' | 'reps') => {
    const base = 'w-0 flex-1 h-12 rounded-xl text-center text-lg font-bold outline-none transition-all duration-150';
    const focused = focusedField?.set === idx && focusedField?.field === field;
    if (focused) {
      return `${base} bg-[#ede9fe] dark:bg-[#2d1b4e] text-gray-900 dark:text-white ring-2 ring-[#9333ea]`;
    }
    return `${base} bg-gray-100 dark:bg-[#16213e] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`;
  };

  // ═════════════════════════════════════════════════
  // Основной экран
  // ═════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a2e] pb-8">
      <div className="max-w-[480px] mx-auto px-4">

        {/* ── Назад + Заголовок ── */}
        <div className="pt-4 pb-2 flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
            {currentExercise.name}
          </h1>
        </div>

        {/* ── Карточка с подходами ── */}
        <div className="bg-white dark:bg-[#16213e] rounded-2xl p-4 mb-4">

          {/* Заголовки колонок */}
          <div className="flex items-center gap-3 mb-3 px-1">
            <span className="w-6 shrink-0" />
            <span className="w-0 flex-1 text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide">
              {t.activeWorkout.weightLabel}
            </span>
            <span className="w-0 flex-1 text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide text-center">
              {t.activeWorkout.repsLabel}
            </span>
            {sets.length > 1 && <span className="w-8 shrink-0" />}
          </div>

          {/* Подходы */}
          <div className="space-y-3">
            {sets.map((set, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-6 text-center text-gray-400 dark:text-gray-500 text-sm font-bold shrink-0">
                  {i + 1}
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  size={1}
                  value={set.weight}
                  placeholder="0"
                  onChange={e => updateSet(i, 'weight', e.target.value)}
                  onFocus={() => setFocusedField({ set: i, field: 'weight' })}
                  onBlur={() => setFocusedField(null)}
                  className={inputCls(i, 'weight')}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  size={1}
                  value={set.reps}
                  placeholder="0"
                  onChange={e => updateSet(i, 'reps', e.target.value)}
                  onFocus={() => setFocusedField({ set: i, field: 'reps' })}
                  onBlur={() => setFocusedField(null)}
                  className={inputCls(i, 'reps')}
                />
                {sets.length > 1 && (
                  <button
                    onClick={() => handleDeleteSet(i)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 active:scale-95 transition-all shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}

            {/* Добавить подход */}
            <div className="flex items-center gap-3">
              <span className="w-6 text-center text-gray-400 dark:text-gray-500 text-sm font-bold shrink-0">
                {sets.length + 1}
              </span>
              <button
                onClick={handleAddSet}
                className="w-0 flex-1 h-12 rounded-xl bg-[#9333ea] text-white font-semibold text-sm active:bg-[#7c3aed] transition-colors flex items-center justify-center gap-1.5"
              >
                {t.activeWorkout.addSet}
              </button>
            </div>
          </div>
        </div>

        {/* ── Rest Timer ── */}
        <div className="mb-4">
          {!restActive ? (
            <button
              onClick={startRest}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl border-2 border-[#9333ea] dark:border-[#a855f7] text-[#9333ea] dark:text-[#a855f7] font-semibold text-sm active:bg-[#9333ea]/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" d="M12 6v6l4 2" />
              </svg>
              {t.activeWorkout.rest} — {formatRestTime(defaultRestTime)}
            </button>
          ) : (
            <div className="bg-white dark:bg-[#16213e] rounded-2xl p-5 text-center">
              <div className="text-5xl font-bold text-gray-900 dark:text-white mb-1 tabular-nums">
                {formatRestTime(restSeconds)}
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-4">
                {t.activeWorkout.rest}
              </div>
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
                <div
                  className="h-1.5 bg-[#9333ea] rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${restTotal > 0 ? (restSeconds / restTotal) * 100 : 0}%` }}
                />
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={stopRest}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-[#0d1b3e] text-gray-600 dark:text-gray-400 text-sm font-semibold active:opacity-70 transition-opacity"
                >
                  {t.activeWorkout.skip}
                </button>
                <button
                  onClick={() => addRestTime(30)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-[#0d1b3e] text-gray-600 dark:text-gray-400 text-sm font-semibold active:opacity-70 transition-opacity"
                >
                  {t.activeWorkout.add30s}
                </button>
                <button
                  onClick={() => addRestTime(60)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-[#0d1b3e] text-gray-600 dark:text-gray-400 text-sm font-semibold active:opacity-70 transition-opacity"
                >
                  {t.activeWorkout.add60s}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Копировать прошлое */}
        <button
          onClick={handleCopyPrevious}
          className="flex items-center justify-center gap-1.5 w-full py-3 text-[#9333ea] dark:text-[#a855f7] text-sm font-semibold active:opacity-70 transition-opacity mb-6"
        >
          {t.activeWorkout.copyPrevious}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* ── Нижние кнопки ── */}
        {!hasChanges ? (
          <div className="flex gap-3">
            <button
              onClick={handleStats}
              className="w-0 flex-1 h-14 rounded-2xl bg-white dark:bg-[#16213e] text-gray-700 dark:text-gray-200 font-semibold text-base flex items-center justify-center gap-2 active:bg-gray-100 dark:active:bg-[#0d1b3e] transition-colors shadow-sm"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="truncate">{t.activeWorkout.statistics}</span>
            </button>
            <button
              onClick={handleDone}
              disabled={saving}
              className="w-0 flex-1 h-14 rounded-2xl bg-[#9333ea] text-white font-bold text-base active:bg-[#7c3aed] transition-colors disabled:opacity-50 shadow-lg shadow-purple-500/30"
            >
              {t.activeWorkout.doneBtn}
            </button>
          </div>
        ) : (
          <button
            onClick={handleDone}
            disabled={saving}
            className="w-full h-14 rounded-2xl bg-[#9333ea] text-white font-bold text-base active:bg-[#7c3aed] transition-colors disabled:opacity-50 shadow-lg shadow-purple-500/30"
          >
            {saving ? '...' : t.activeWorkout.save}
          </button>
        )}
      </div>
    </div>
  );
};

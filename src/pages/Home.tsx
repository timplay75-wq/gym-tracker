import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutsApi, programsApi } from '@/services/api';
import { useLanguage } from '@/i18n';
import { useToast } from '@/hooks/useToast';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { Plus, User, Calendar as CalendarIcon, Layers, MoreVertical, Copy, ClipboardList, RotateCcw } from 'lucide-react';
import { hapticLight, hapticMedium, hapticSuccess } from '@/utils/haptics';
import { SwipeExerciseCard } from '@/components/SwipeExerciseCard';
import { EditWorkoutSheet } from '@/components/EditWorkoutSheet';
import type { ExerciseItem } from '@/components/SwipeExerciseCard';

// ─── Helpers ──────────────────────────────────────────
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function buildDateRange(today: Date, pastDays: number, futureDays: number): Date[] {
  const arr: Date[] = [];
  for (let i = pastDays - 1; i >= -futureDays; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    arr.push(d);
  }
  return arr;
}

// ─── Component ────────────────────────────────────────
export const Home = () => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

  const TOTAL_DAYS = 90;
  const today = new Date();
  const [dates] = useState(() => buildDateRange(today, TOTAL_DAYS, 30));
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const scrollRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLButtonElement>(null);

  const [workoutDates, setWorkoutDates] = useState<Set<string>>(new Set());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dayWorkout, setDayWorkout] = useState<any>(null);
  const [dayLoading, setDayLoading] = useState(false);

  // Pull-to-refresh
  const exerciseListRef = useRef<HTMLDivElement>(null);

  // Scroll to today on mount
  useEffect(() => {
    requestAnimationFrame(() => {
      todayRef.current?.scrollIntoView({ inline: 'center', block: 'nearest' });
    });
  }, []);

  // Load workout dates for the calendar
  useEffect(() => {
    (async () => {
      try {
        const now = new Date();
        const m1 = workoutsApi.getCalendar(now.getFullYear(), now.getMonth() + 1);
        const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const m2 = workoutsApi.getCalendar(prev.getFullYear(), prev.getMonth() + 1);
        const [cal1, cal2] = await Promise.all([m1, m2]);
        const set = new Set<string>();
        [...cal1, ...cal2].forEach(d => { if (d.count > 0) set.add(d.date.slice(0, 10)); });
        setWorkoutDates(set);
      } catch { /* ignore */ }
    })();
  }, []);

  // Load workout for selected day (first one with exercises)
  const loadDay = useCallback(async (date: Date) => {
    setDayLoading(true);
    try {
      const res = await workoutsApi.getAll({ limit: 50 });
      const dayStr = date.toISOString().slice(0, 10);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const match = res.workouts.find((w: any) => {
        const wd = typeof w.date === 'string' ? w.date.slice(0, 10) : new Date(w.date).toISOString().slice(0, 10);
        return wd === dayStr;
      });
      setDayWorkout(match ?? null);
    } catch {
      setDayWorkout(null);
    } finally {
      setDayLoading(false);
    }
  }, []);

  useEffect(() => { loadDay(selectedDate); }, [selectedDate, loadDay]);

  const { pullDistance, isRefreshing } = usePullToRefresh({
    onRefresh: async () => { await loadDay(selectedDate); },
    containerRef: exerciseListRef,
  });

  // Delete exercise — custom modal
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const handleDeleteExercise = (exerciseIndex: number) => {
    setDeleteTarget(exerciseIndex);
  };

  const confirmDeleteExercise = async () => {
    if (deleteTarget === null || !dayWorkout) return;
    hapticMedium();
    try {
      const updatedExercises = [...dayWorkout.exercises];
      updatedExercises.splice(deleteTarget, 1);
      await workoutsApi.update(dayWorkout.id ?? dayWorkout._id, { exercises: updatedExercises });
      loadDay(selectedDate);
    } catch { /* ignore */ }
    setDeleteTarget(null);
  };

  // Edit workout
  const [editingWorkout, setEditingWorkout] = useState(false);
  const toast = useToast();

  // Multi-select mode
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  const [programModal, setProgramModal] = useState(false);
  const [programName, setProgramName] = useState('');

  const toggleSelect = (idx: number) => {
    setSelectedIndices(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelectedIndices(new Set());
  };

  const selectedExercises = () => exercises.filter((_, i) => selectedIndices.has(i));

  const handleRepeatToday = async () => {
    if (!selectedIndices.size) return;
    hapticMedium();
    try {
      const todayStr = new Date().toISOString().slice(0, 10);
      const copied = selectedExercises().map(ex => ({
        name: ex.name, category: ex.category || 'other',
        sets: [{ weight: 0, reps: 0, completed: false }],
      }));
      // Find or create today's workout
      const res = await workoutsApi.getAll({ limit: 50 });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const todayWorkout = res.workouts.find((w: any) => {
        const wd = typeof w.date === 'string' ? w.date.slice(0, 10) : new Date(w.date).toISOString().slice(0, 10);
        return wd === todayStr;
      });
      if (todayWorkout) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const id = (todayWorkout as any).id || (todayWorkout as any)._id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await workoutsApi.update(id, { exercises: [...(todayWorkout as any).exercises, ...copied] });
      } else {
        await workoutsApi.create({ name: t.home.todayWorkout, date: new Date().toISOString(), exercises: copied });
      }
      toast.success(t.home.copiedToday);
      exitSelectMode();
      loadDay(selectedDate);
    } catch {
      toast.error(t.errors?.saveFailed || 'Error');
    }
  };

  const handleRepeatWithResults = async () => {
    if (!selectedIndices.size) return;
    hapticMedium();
    try {
      const todayStr = new Date().toISOString().slice(0, 10);
      const copied = selectedExercises().map(ex => ({
        name: ex.name, category: ex.category || 'other',
        sets: ex.sets.map(s => ({ weight: s.weight || 0, reps: s.reps || 0, completed: false })),
      }));
      const res = await workoutsApi.getAll({ limit: 50 });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let todayWorkout = res.workouts.find((w: any) => {
        const wd = typeof w.date === 'string' ? w.date.slice(0, 10) : new Date(w.date).toISOString().slice(0, 10);
        return wd === todayStr;
      });
      if (todayWorkout) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const id = (todayWorkout as any).id || (todayWorkout as any)._id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updatedExercises = [...(todayWorkout as any).exercises, ...copied];
        await workoutsApi.update(id, { exercises: updatedExercises });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        todayWorkout = { ...(todayWorkout as any), exercises: updatedExercises };
      } else {
        const created = await workoutsApi.create({ name: t.home.todayWorkout, date: new Date().toISOString(), exercises: copied });
        todayWorkout = created;
      }
      exitSelectMode();
      // Navigate to active workout with the first copied exercise
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const startIdx = (todayWorkout as any).exercises.length - copied.length;
      navigate('/active-workout', { state: { workout: todayWorkout, startExerciseIndex: startIdx, withResults: true } });
    } catch {
      toast.error(t.errors?.saveFailed || 'Error');
    }
  };

  const handleSaveAsProgram = async () => {
    if (!selectedIndices.size || !programName.trim()) return;
    hapticMedium();
    try {
      await programsApi.create({
        name: programName.trim(),
        exercises: selectedExercises().map(ex => ({
          name: ex.name, category: ex.category || 'other',
          sets: ex.sets.length || 3,
        })),
      });
      toast.success(t.home.savedAsProgram);
      setProgramModal(false);
      setProgramName('');
      exitSelectMode();
    } catch {
      toast.error(t.errors?.saveFailed || 'Error');
    }
  };



  const handleSaveWorkout = async (data: { name: string; date: string; notes: string; exercises: ExerciseItem[] }) => {
    if (!dayWorkout) return;
    try {
      await workoutsApi.update(dayWorkout.id ?? dayWorkout._id, {
        name: data.name,
        date: new Date(data.date).toISOString(),
        notes: data.notes,
        exercises: data.exercises,
      });
      setEditingWorkout(false);
      hapticSuccess();
      toast.success(t.home.saveChanges);
      loadDay(selectedDate);
    } catch {
      toast.error(t.errors.saveFailed);
    }
  };

  // Tap exercise → go to active workout
  const handleTapExercise = (exerciseIndex: number) => {
    if (!dayWorkout) return;
    hapticLight();
    navigate('/active-workout', { state: { workout: dayWorkout, startExerciseIndex: exerciseIndex } });
  };

  // Swipe right → go to exercise statistics
  const handleExerciseStats = (exerciseIndex: number) => {
    const ex = exercises[exerciseIndex];
    if (!ex) return;
    navigate(`/stats/exercise/${encodeURIComponent(ex.name)}`);
  };

  const dayNamesShort = lang === 'ru'
    ? ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isToday = isSameDay(selectedDate, today);
  const isSelected = (d: Date) => isSameDay(d, selectedDate);
  const hasWorkout = (d: Date) => workoutDates.has(d.toISOString().slice(0, 10));

  const exercises: ExerciseItem[] = dayWorkout?.exercises ?? [];

  return (
    <div className="h-[100dvh] flex flex-col bg-[#f5f5f5] dark:bg-[#1a1a2e] overflow-hidden">
      {/* ─── Horizontal calendar strip ─── */}
      <div className="bg-white dark:bg-[#16213e] shadow-sm shrink-0">
        <div className="max-w-[480px] mx-auto">
          <div className="px-5 pt-5 pb-1.5 flex items-center justify-between">
            <h1 className="text-base font-bold text-gray-900 dark:text-white capitalize">
              {selectedDate.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', { month: 'long', year: 'numeric' })}
            </h1>
            {!isToday && (
              <button
                onClick={() => {
                  setSelectedDate(today);
                  requestAnimationFrame(() => {
                    todayRef.current?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
                  });
                }}
                className="text-xs font-semibold text-[#9333ea] bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-full active:scale-95 transition-transform"
              >
                {t.home.today}
              </button>
            )}
          </div>
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-1 px-3 pb-3 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {dates.map((d, i) => {
              const sel = isSelected(d);
              const td = isSameDay(d, today);
              const hw = hasWorkout(d);
              return (
                <button
                  key={i}
                  ref={td ? todayRef : undefined}
                  onClick={() => setSelectedDate(d)}
                  className={`flex flex-col items-center justify-center shrink-0 w-11 h-14 rounded-xl transition-all
                    ${sel ? 'bg-[#9333ea] text-white shadow-lg shadow-purple-300 dark:shadow-purple-900/50'
                      : td ? 'bg-purple-50 dark:bg-purple-900/30 text-[#9333ea]'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                >
                  <span className={`text-[9px] font-medium leading-none mb-0.5 ${sel ? 'text-white/80' : 'text-gray-400 dark:text-gray-500'}`}>
                    {dayNamesShort[d.getDay()]}
                  </span>
                  <span className="text-sm font-bold leading-none">{d.getDate()}</span>
                  {hw ? <div className={`w-1 h-1 rounded-full mt-0.5 ${sel ? 'bg-white' : 'bg-[#9333ea]'}`} /> : <div className="w-1 h-1 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Day label ─── */}
      <div className="max-w-[480px] mx-auto w-full px-4 pt-3 pb-1 shrink-0 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize font-medium">
          {isToday ? t.home.today : selectedDate.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        {exercises.length > 0 && (
          selectMode ? (
            <button
              onClick={exitSelectMode}
              className="text-xs font-semibold text-[#9333ea] px-2 py-1 active:scale-95 transition-transform"
            >
              {t.home.done}
            </button>
          ) : (
            <button
              onClick={() => { setSelectMode(true); hapticLight(); }}
              className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-[#9333ea] active:scale-95 transition-all"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          )
        )}
      </div>

      {/* ─── Exercise list (scrollable) ─── */}
      <div ref={exerciseListRef} className="flex-1 overflow-y-auto max-w-[480px] mx-auto w-full px-4 pb-4">
        {/* Pull-to-refresh indicator */}
        {(pullDistance > 0 || isRefreshing) && (
          <div
            className="flex items-center justify-center transition-all"
            style={{ height: pullDistance }}
          >
            <div
              className={`w-6 h-6 border-2 border-[#7c3aed] border-t-transparent rounded-full ${
                isRefreshing ? 'animate-spin' : ''
              }`}
              style={!isRefreshing ? { transform: `rotate(${pullDistance * 4}deg)` } : undefined}
            />
          </div>
        )}
        {dayLoading && !isRefreshing ? (
          <div className="space-y-2 mt-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-[#16213e] rounded-2xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
              </div>
            ))}
          </div>
        ) : exercises.length > 0 ? (
          <div className="mt-2 animate-stagger">
            {/* Program badge */}
            {dayWorkout?.programId && (
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className="flex items-center gap-1.5 bg-[#9333ea]/10 dark:bg-[#9333ea]/20 text-[#9333ea] rounded-lg px-2.5 py-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">{t.programs?.title || 'Программа'}</span>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium truncate">{dayWorkout.name}</span>
              </div>
            )}
            {exercises.map((ex, idx) => (
              <SwipeExerciseCard
                key={idx}
                exercise={ex}
                onStats={() => handleExerciseStats(idx)}
                onDelete={() => handleDeleteExercise(idx)}
                onTap={() => handleTapExercise(idx)}
                t={t}
                selectMode={selectMode}
                selected={selectedIndices.has(idx)}
                onToggleSelect={() => toggleSelect(idx)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 min-h-[40vh] text-center">
            <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-3">
              <CalendarIcon className="w-8 h-8 text-[#9333ea] opacity-50" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t.home.noWorkoutToday}</p>
            {isToday && (
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">{t.home.createWorkout}</p>
            )}
          </div>
        )}
      </div>

      {/* ─── FAB buttons (centered) ─── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-end gap-4 z-50">
        <button
          onClick={() => navigate('/profile')}
          className="w-11 h-11 bg-[#7c3aed] rounded-full flex items-center justify-center shadow-lg shadow-purple-400/30 active:scale-95 transition-transform btn-ripple"
          aria-label={t.nav.profile}
        >
          <User className="w-5 h-5 text-white" strokeWidth={2} />
        </button>
        <button
          onClick={() => navigate('/exercises', { state: { date: selectedDate.toISOString().slice(0, 10) } })}
          className="w-14 h-14 bg-[#9333ea] rounded-full flex items-center justify-center shadow-xl shadow-purple-400/40 active:scale-95 transition-transform btn-ripple"
          aria-label={t.home.createWorkout}
        >
          <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
        </button>
      </div>

      {/* ─── Edit workout bottom-sheet ─── */}
      {editingWorkout && dayWorkout && (
        <EditWorkoutSheet
          workout={dayWorkout}
          onSave={handleSaveWorkout}
          onClose={() => setEditingWorkout(false)}
          t={t}
        />
      )}

      {/* Delete confirm modal */}
      {deleteTarget !== null && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center" onClick={() => setDeleteTarget(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative bg-white dark:bg-[#16213e] rounded-2xl p-6 mx-6 max-w-[340px] w-full shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t.exercises.deleteExercise}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">{t.exercises.confirmDelete}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm"
              >
                {t.common?.cancel || 'Отмена'}
              </button>
              <button
                onClick={confirmDeleteExercise}
                className="flex-1 py-2.5 rounded-xl bg-[#ef4444] text-white font-semibold text-sm active:bg-red-600"
              >
                {t.exercises.deleteExercise}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Multi-select action panel ─── */}
      {selectMode && selectedIndices.size > 0 && (
        <div className="fixed bottom-20 left-4 right-4 z-[100] max-w-[480px] mx-auto animate-slide-up">
          <div className="bg-white dark:bg-[#16213e] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">
              {t.home.selectedCount}: {selectedIndices.size}
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleRepeatToday}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 active:scale-95 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#f3e8ff] dark:bg-[#9333ea]/20 flex items-center justify-center">
                  <Copy className="w-4.5 h-4.5 text-[#9333ea]" />
                </div>
                <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">{t.home.repeatToday}</span>
              </button>
              <button
                onClick={handleRepeatWithResults}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 active:scale-95 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#dbeafe] dark:bg-[#3b82f6]/20 flex items-center justify-center">
                  <RotateCcw className="w-4.5 h-4.5 text-[#3b82f6]" />
                </div>
                <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">{t.home.repeatWithResults}</span>
              </button>
              <button
                onClick={() => setProgramModal(true)}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 active:scale-95 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#dcfce7] dark:bg-[#22c55e]/20 flex items-center justify-center">
                  <ClipboardList className="w-4.5 h-4.5 text-[#22c55e]" />
                </div>
                <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">{t.home.saveAsProgram}</span>
              </button>

            </div>
          </div>
        </div>
      )}



      {/* Program name modal */}
      {programModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center" onClick={() => setProgramModal(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white dark:bg-[#16213e] rounded-2xl p-6 mx-6 max-w-[340px] w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{t.home.saveAsProgram}</h3>
            <input
              value={programName}
              onChange={e => setProgramName(e.target.value)}
              placeholder={t.home.programName}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a2e] text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#9333ea] outline-none"
              autoFocus
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setProgramModal(false)} className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm">
                {t.common?.cancel || 'Отмена'}
              </button>
              <button onClick={handleSaveAsProgram} disabled={!programName.trim()} className="flex-1 py-2.5 rounded-xl bg-[#9333ea] text-white font-semibold text-sm active:bg-[#7c3aed] disabled:opacity-40">
                {t.home.saveChanges}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* slide-up animation */}
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  );
};

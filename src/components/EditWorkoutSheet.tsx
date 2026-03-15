import { useState } from 'react';
import { X } from 'lucide-react';
import type { useLanguage } from '@/i18n';
import type { ExerciseItem } from './SwipeExerciseCard';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function EditWorkoutSheet({ workout, onSave, onClose, t }: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  workout: any;
  onSave: (data: { name: string; date: string; notes: string; exercises: ExerciseItem[] }) => void;
  onClose: () => void;
  t: ReturnType<typeof useLanguage>['t'];
}) {
  const [name, setName] = useState(workout.name || '');
  const [date, setDate] = useState(() => {
    const d = workout.date ? new Date(workout.date) : new Date();
    return d.toISOString().slice(0, 10);
  });
  const [notes, setNotes] = useState(workout.notes || '');
  const [exercises, setExercises] = useState<{ _original: ExerciseItem; name: string; sets: { reps: number; weight: number }[] }[]>(() =>
    (workout.exercises || []).map((ex: ExerciseItem) => ({
      _original: ex,
      name: ex.name,
      sets: ex.sets.map(s => ({ reps: s.reps ?? 10, weight: s.weight ?? 0 })),
    }))
  );

  const updateSet = (exIdx: number, setIdx: number, field: 'reps' | 'weight', delta: number) => {
    setExercises(prev => prev.map((ex, ei) => ei !== exIdx ? ex : {
      ...ex,
      sets: ex.sets.map((s, si) => si !== setIdx ? s : { ...s, [field]: Math.max(0, s[field] + delta) }),
    }));
  };

  const addSet = (exIdx: number) => {
    setExercises(prev => prev.map((ex, ei) => ei !== exIdx ? ex : {
      ...ex,
      sets: [...ex.sets, { reps: ex.sets[ex.sets.length - 1]?.reps ?? 10, weight: ex.sets[ex.sets.length - 1]?.weight ?? 0 }],
    }));
  };

  const removeSet = (exIdx: number, setIdx: number) => {
    setExercises(prev => prev.map((ex, ei) => ei !== exIdx ? ex : {
      ...ex,
      sets: ex.sets.filter((_, si) => si !== setIdx),
    }));
  };

  const handleSave = () => {
    onSave({
      name,
      date,
      notes,
      exercises: exercises.map(ex => ({
        ...ex._original,
        name: ex.name,
        sets: ex.sets.map(s => ({ reps: s.reps, weight: s.weight, completed: false })),
      })) as ExerciseItem[],
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative w-full max-w-[480px] bg-white dark:bg-[#16213e] rounded-t-3xl p-5 pb-8 animate-slide-up max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t.home.editExercise}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {/* Workout name */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t.builder?.workoutName || 'Название'}</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a2e] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#9333ea]"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t.builder?.date || 'Дата'}</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a2e] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#9333ea]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t.builder?.notes || 'Заметки'}</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a2e] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#9333ea] resize-none"
            />
          </div>

          {/* Exercises + sets */}
          {exercises.map((ex, exIdx) => (
            <div key={exIdx}>
              <p className="text-sm font-semibold text-[#9333ea] mb-2">{ex.name}</p>
              <div className="space-y-1.5">
                {ex.sets.map((s, si) => (
                  <div key={si} className="flex items-center gap-2 bg-gray-50 dark:bg-[#1a1a2e] rounded-xl px-3 py-2">
                    <span className="text-xs font-semibold text-gray-400 w-10 shrink-0">{t.home.set} {si + 1}</span>
                    {/* Reps */}
                    <button onClick={() => updateSet(exIdx, si, 'reps', -1)} className="w-6 h-6 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold flex items-center justify-center">−</button>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white w-6 text-center">{s.reps}</span>
                    <button onClick={() => updateSet(exIdx, si, 'reps', 1)} className="w-6 h-6 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold flex items-center justify-center">+</button>
                    <span className="text-[10px] text-gray-400">{t.home.reps}</span>
                    <div className="ml-auto flex items-center gap-2">
                      <button onClick={() => updateSet(exIdx, si, 'weight', -2.5)} className="w-6 h-6 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold flex items-center justify-center">−</button>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white w-8 text-center">{s.weight}</span>
                      <button onClick={() => updateSet(exIdx, si, 'weight', 2.5)} className="w-6 h-6 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold flex items-center justify-center">+</button>
                      <span className="text-[10px] text-gray-400">{t.home.kg}</span>
                      {ex.sets.length > 1 && (
                        <button onClick={() => removeSet(exIdx, si)} className="w-6 h-6 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-500 text-xs font-bold flex items-center justify-center">✕</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => addSet(exIdx)}
                className="w-full py-1.5 mt-1.5 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-xs font-semibold text-gray-500 dark:text-gray-400"
              >
                + {t.home.addSet}
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3.5 bg-[#9333ea] text-white rounded-xl font-semibold text-base active:bg-[#7c3aed] transition-colors btn-ripple shrink-0"
        >
          {t.home.saveChanges}
        </button>
      </div>
    </div>
  );
}

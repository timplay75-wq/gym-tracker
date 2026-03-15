import { useState, useRef } from 'react';
import { BarChart3, Trash2, Check } from 'lucide-react';
import type { useLanguage } from '@/i18n';

const SWIPE_THRESHOLD = 60;
const TAP_THRESHOLD = 8;

export interface ExerciseItem {
  name: string;
  category?: string;
  sets: { weight?: number; reps?: number; completed?: boolean }[];
}

export function SwipeExerciseCard({ exercise, onStats, onDelete, onTap, t, selectMode, selected, onToggleSelect }: {
  exercise: ExerciseItem;
  onStats: () => void;
  onDelete: () => void;
  onTap: () => void;
  t: ReturnType<typeof useLanguage>['t'];
  selectMode?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
}) {
  const [offsetX, setOffsetX] = useState(0);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const isDragging = useRef(false);
  const didSwipe = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    startYRef.current = e.touches[0].clientY;
    isDragging.current = true;
    didSwipe.current = false;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const dx = e.touches[0].clientX - startXRef.current;
    if (Math.abs(dx) > TAP_THRESHOLD) didSwipe.current = true;
    setOffsetX(Math.max(-100, Math.min(100, dx)));
  };
  const handleTouchEnd = () => {
    isDragging.current = false;
    if (offsetX > SWIPE_THRESHOLD) { setOffsetX(80); }
    else if (offsetX < -SWIPE_THRESHOLD) { setOffsetX(-80); }
    else {
      setOffsetX(0);
      if (!didSwipe.current) onTap();
    }
  };

  // In select mode, disable swipe and show checkbox
  if (selectMode) {
    return (
      <div className="relative overflow-hidden rounded-2xl mb-2">
        <div
          className={`relative bg-white dark:bg-[#16213e] px-4 py-3.5 border z-10 cursor-pointer flex items-center gap-3 transition-colors ${
            selected ? 'border-[#9333ea] bg-[#f3e8ff] dark:bg-[#2d1b4e]' : 'border-gray-100 dark:border-gray-800'
          }`}
          onClick={onToggleSelect}
        >
          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
            selected ? 'bg-[#9333ea] border-[#9333ea]' : 'border-gray-300 dark:border-gray-600'
          }`}>
            {selected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{exercise.name}</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl mb-2 bg-[#f5f5f5] dark:bg-[#1a1a2e]">
      {/* Left — Stats */}
      <div
        className="absolute inset-y-0 left-0 w-20 flex items-center justify-center bg-[#9333ea] transition-opacity duration-150"
        style={{ opacity: offsetX > 0 ? Math.min(1, offsetX / 60) : 0, pointerEvents: offsetX > 0 ? 'auto' : 'none' }}
      >
        <button onClick={() => { setOffsetX(0); onStats(); }} className="flex flex-col items-center gap-0.5 text-white">
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] font-medium">{t.nav.stats ?? 'Стат.'}</span>
        </button>
      </div>
      {/* Right — Delete */}
      <div
        className="absolute inset-y-0 right-0 w-20 flex items-center justify-center bg-red-500 transition-opacity duration-150"
        style={{ opacity: offsetX < 0 ? Math.min(1, -offsetX / 60) : 0, pointerEvents: offsetX < 0 ? 'auto' : 'none' }}
      >
        <button onClick={() => { setOffsetX(0); onDelete(); }} className="flex flex-col items-center gap-0.5 text-white">
          <Trash2 className="w-5 h-5" />
          <span className="text-[10px] font-medium">{t.exercises.deleteExercise}</span>
        </button>
      </div>
      {/* Card — only exercise name */}
      <div
        className="relative bg-white dark:bg-[#16213e] px-4 py-3.5 border border-gray-100 dark:border-gray-800 z-10 transition-transform cursor-pointer"
        style={{ transform: `translateX(${offsetX}px)`, transition: isDragging.current ? 'none' : 'transform 0.25s ease' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => { if (offsetX === 0) onTap(); }}
      >
        <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{exercise.name}</h4>
      </div>
    </div>
  );
}

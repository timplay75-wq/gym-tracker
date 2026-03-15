import { useState, useRef, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n';
import { exercisesApi } from '@/services/api';
import { useToast } from '@/hooks/useToast';
import { Pencil, Trash2, Type } from 'lucide-react';

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

// ─── Swipeable exercise card ──────────────────────────
interface SwipeCardProps {
  exercise: string;
  categoryId: string;
  categoryName: string;
  isCustom: boolean;
  editMode: boolean;
  onCreate: () => void;
  onStats: () => void;
  onRename?: () => void;
  onDelete?: () => void;
  t: ReturnType<typeof useLanguage>['t'];
}

const SWIPE_THRESHOLD = 60;

function SwipeCard({ exercise, isCustom, editMode, onCreate, onStats, onRename, onDelete, t }: SwipeCardProps) {
  const [offsetX, setOffsetX] = useState(0);
  const startXRef = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (editMode) return;
    startXRef.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || editMode) return;
    const dx = e.touches[0].clientX - startXRef.current;
    setOffsetX(Math.max(-100, Math.min(100, dx)));
  };

  const handleTouchEnd = () => {
    if (editMode) return;
    isDragging.current = false;
    if (offsetX > SWIPE_THRESHOLD) {
      setOffsetX(80);
    } else {
      setOffsetX(0);
    }
  };

  const resetSwipe = () => setOffsetX(0);

  if (editMode) {
    return (
      <div className="relative overflow-hidden rounded-xl mb-2">
        <div className="bg-white dark:bg-[#16213e] border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3">
          <h3 className="font-semibold text-gray-900 dark:text-white flex-1 truncate">{exercise}</h3>
          {isCustom ? (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onRename}
                className="w-9 h-9 rounded-lg bg-[#f3e8ff] dark:bg-[#9333ea]/20 flex items-center justify-center active:scale-95 transition-transform"
              >
                <Type className="w-4 h-4 text-[#9333ea]" />
              </button>
              <button
                onClick={onDelete}
                className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center active:scale-95 transition-transform"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ) : (
            <span className="text-gray-300 dark:text-gray-600 shrink-0">
              🚫
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl mb-2 bg-[#f5f5f5] dark:bg-[#1a1a2e]">
      {/* Left side — Stats (revealed on swipe right) */}
      <div
        className="absolute inset-y-0 left-0 w-20 flex items-center justify-center bg-[#9333ea] transition-opacity duration-150"
        style={{ opacity: offsetX > 0 ? Math.min(1, offsetX / 60) : 0, pointerEvents: offsetX > 0 ? 'auto' : 'none' }}
      >
        <button
          onClick={() => { resetSwipe(); onStats(); }}
          className="flex flex-col items-center gap-0.5 text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-[10px] font-medium">{t.exercises.statsExercise}</span>
        </button>
      </div>

      {/* Card content (slides) */}
      <div
        className="relative bg-white dark:bg-[#16213e] border border-gray-100 dark:border-gray-800 p-4 transition-transform z-10"
        style={{ transform: `translateX(${offsetX}px)`, transition: isDragging.current ? 'none' : 'transform 0.25s ease' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{exercise}</h3>
        <button
          onClick={onCreate}
          className="w-full py-2.5 bg-[#9333ea] text-white rounded-lg font-semibold text-sm active:bg-[#7c3aed] transition-colors flex items-center justify-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          {t.exercises.createExercise}
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────
export const CategoryView = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const toast = useToast();
  const category = location.state?.category as Category;

  const defaultCategories: Record<string, Category> = {
    stretching: { id: 'stretching', name: t.exercises.stretching, count: 3, exercises: ['Растяжка грудных мышц', 'Растяжка задней поверхности бедра', 'Растяжка разгибателей спины'] },
    cardio: { id: 'cardio', name: t.exercises.cardio, count: 4, exercises: ['Беговая дорожка', 'Велотренажер', 'Степ тренажер', 'Эллиптический тренажер'] },
    chest: { id: 'chest', name: t.exercises.chest, count: 4, exercises: ['Жим гантелей на наклонной скамье', 'Жим штанги лежа', 'Отжимания', 'Сведение рук в тренажере'] },
    back: { id: 'back', name: t.exercises.back, count: 3, exercises: ['Подтягивания широким хватом', 'Становая тяга', 'Тяга нижнего блока'] },
    arms: { id: 'arms', name: t.exercises.arms, count: 4, exercises: ['Концентрированные подъемы на бицепс', 'Отжимания на брусьях', 'Подъем штанги на бицепс', 'Французский жим лежа со штангой'] },
    legs: { id: 'legs', name: t.exercises.legs, count: 4, exercises: ['Выпады со штангой', 'Жим ногами в тренажере', 'Приседания со штангой', 'Разгибания ног в тренажере'] },
    shoulders: { id: 'shoulders', name: t.exercises.shoulders, count: 3, exercises: ['Армейский жим стоя', 'Жим гантелей сидя', 'Разведение гантелей в стороны'] },
    abs: { id: 'abs', name: t.exercises.abs, count: 3, exercises: ['Горизонтальные скручивания', 'Подъем ног в висе', 'Скручивания на наклонной скамье'] },
  };

  const currentCategory = category || (categoryId ? defaultCategories[categoryId] : null);

  const [customExercises, setCustomExercises] = useState<{ id: string; name: string }[]>([]);

  // Edit mode
  const [editMode, setEditMode] = useState(false);
  const [renameModal, setRenameModal] = useState<{ id: string; name: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const catId = currentCategory?.id;
    if (!catId) return;
    const backendCat = categoryToBackend[catId];
    if (!backendCat) return;
    exercisesApi.getAll({ category: backendCat }).then((exercises: any[]) => {
      const custom = exercises
        .filter((e: any) => e.isCustom)
        .map((e: any) => ({ id: e._id || e.id, name: e.name }));
      setCustomExercises(custom);
    }).catch(() => {});
  }, [currentCategory?.id]);

  const reloadCustomExercises = () => {
    const catId = currentCategory?.id;
    if (!catId) return;
    const backendCat = categoryToBackend[catId];
    if (!backendCat) return;
    exercisesApi.getAll({ category: backendCat }).then((exercises: any[]) => {
      const custom = exercises
        .filter((e: any) => e.isCustom)
        .map((e: any) => ({ id: e._id || e.id, name: e.name }));
      setCustomExercises(custom);
    }).catch(() => {});
  };

  const handleRename = async () => {
    if (!renameModal || !newName.trim()) return;
    try {
      await exercisesApi.update(renameModal.id, { name: newName.trim() });
      toast.success(t.exercises.exerciseRenamed);
      setRenameModal(null);
      setNewName('');
      reloadCustomExercises();
    } catch {
      toast.error(t.errors?.saveFailed || 'Error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await exercisesApi.delete(deleteTarget.id);
      toast.success(t.exercises.exerciseDeleted);
      setDeleteTarget(null);
      reloadCustomExercises();
    } catch {
      toast.error(t.errors?.saveFailed || 'Error');
    }
  };

  const customNames = new Set(customExercises.map(e => e.name));

  if (!currentCategory) {
    return <div className="p-8 text-center text-gray-500">Категория не найдена</div>;
  }

  const allExercises = [...currentCategory.exercises, ...customExercises.map(e => e.name)];

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a2e] pb-8">
      <div className="max-w-[480px] mx-auto px-4">
        {/* Header */}
        <header className="pt-6 pb-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex-1">{currentCategory.name}</h1>
          {editMode ? (
            <button
              onClick={() => setEditMode(false)}
              className="text-xs font-semibold text-[#9333ea] px-2 py-1 active:scale-95 transition-transform"
            >
              {t.exercises.done}
            </button>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-[#9333ea] active:scale-95 transition-all"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
        </header>

        {/* Exercise cards */}
        <div className="space-y-0">
          {allExercises.map((exercise, index) => {
            const isCustom = customNames.has(exercise);
            const customEx = customExercises.find(e => e.name === exercise);
            return (
              <SwipeCard
                key={index}
                exercise={exercise}
                categoryId={currentCategory.id}
                categoryName={currentCategory.name}
                isCustom={isCustom}
                editMode={editMode}
                t={t}
                onCreate={() => navigate('/setup-exercise', {
                  state: { exerciseName: exercise, categoryId: currentCategory.id, categoryName: currentCategory.name }
                })}
                onStats={() => navigate(`/stats/exercise/${encodeURIComponent(exercise)}`)}
                onRename={customEx ? () => { setRenameModal(customEx); setNewName(customEx.name); } : undefined}
                onDelete={customEx ? () => setDeleteTarget(customEx) : undefined}
              />
            );
          })}
        </div>
      </div>

      {/* Rename modal */}
      {renameModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center" onClick={() => setRenameModal(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white dark:bg-[#16213e] rounded-2xl p-6 mx-6 max-w-[340px] w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{t.exercises.renameExercise}</h3>
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder={t.exercises.newName}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a2e] text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#9333ea] outline-none"
              autoFocus
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setRenameModal(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm">
                {t.common?.cancel || 'Отмена'}
              </button>
              <button onClick={handleRename} disabled={!newName.trim() || newName.trim() === renameModal.name} className="flex-1 py-2.5 rounded-xl bg-[#9333ea] text-white font-semibold text-sm active:bg-[#7c3aed] disabled:opacity-40">
                {t.home?.saveChanges || 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center" onClick={() => setDeleteTarget(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white dark:bg-[#16213e] rounded-2xl p-6 mx-6 max-w-[340px] w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t.exercises.deleteExercise}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">{t.exercises.confirmDelete}</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm">
                {t.common?.cancel || 'Отмена'}
              </button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-[#ef4444] text-white font-semibold text-sm active:bg-red-600">
                {t.exercises.deleteExercise}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

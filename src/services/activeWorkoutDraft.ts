import type { Workout } from '@/types';

/**
 * Черновик активной тренировки.
 *
 * Раньше состояние экрана жило только в location.state, поэтому reload,
 * pull-to-refresh или убитый Android-ом WebView стирали все введённые подходы.
 */
const DRAFT_KEY = 'gym-tracker-active-draft';

/** Старше суток черновик уже не восстанавливаем — тренировка точно закончена. */
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export interface DraftSet {
  weight: string;
  reps: string;
}

export interface ActiveWorkoutDraft {
  workout: Workout;
  exerciseIndex: number;
  sets: DraftSet[];
  savedAt: number;
}

export function saveDraft(workout: Workout, exerciseIndex: number, sets: DraftSet[]): void {
  try {
    const draft: ActiveWorkoutDraft = { workout, exerciseIndex, sets, savedAt: Date.now() };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Переполненный localStorage не должен ломать саму тренировку
  }
}

export function loadDraft(): ActiveWorkoutDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;

    const draft = JSON.parse(raw) as ActiveWorkoutDraft;
    if (!draft?.workout || !Array.isArray(draft.sets) || typeof draft.savedAt !== 'number') {
      return null;
    }
    if (Date.now() - draft.savedAt > MAX_AGE_MS) {
      clearDraft();
      return null;
    }

    // JSON превращает Date в строку — возвращаем обратно, экран ждёт Date.
    draft.workout.date = new Date(draft.workout.date);
    return draft;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}

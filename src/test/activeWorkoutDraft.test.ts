import { describe, it, expect, beforeEach } from 'vitest';
import { saveDraft, loadDraft, clearDraft } from '../services/activeWorkoutDraft';
import type { Workout } from '@/types';

const workout = {
  id: '507f191e810c19729de860ea',
  name: 'Ноги',
  date: new Date('2026-02-11T10:00:00Z'),
  exercises: [{ id: 'e1', name: 'Присед', sets: [] }],
} as unknown as Workout;

describe('черновик активной тренировки', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('без сохранённого черновика возвращает null', () => {
    expect(loadDraft()).toBeNull();
  });

  it('переживает перезагрузку страницы', () => {
    saveDraft(workout, 0, [{ weight: '80', reps: '5' }]);

    // Регрессия: состояние экрана жило только в location.state, поэтому
    // reload или убитый WebView стирали все введённые подходы.
    const restored = loadDraft();

    expect(restored).not.toBeNull();
    expect(restored!.sets).toEqual([{ weight: '80', reps: '5' }]);
    expect(restored!.exerciseIndex).toBe(0);
    expect(restored!.workout.name).toBe('Ноги');
  });

  it('восстанавливает date как Date, а не строку', () => {
    saveDraft(workout, 0, [{ weight: '80', reps: '5' }]);
    const restored = loadDraft();
    expect(restored!.workout.date).toBeInstanceOf(Date);
  });

  it('запоминает индекс упражнения', () => {
    saveDraft(workout, 3, [{ weight: '60', reps: '10' }]);
    expect(loadDraft()!.exerciseIndex).toBe(3);
  });

  it('clearDraft удаляет черновик', () => {
    saveDraft(workout, 0, [{ weight: '80', reps: '5' }]);
    clearDraft();
    expect(loadDraft()).toBeNull();
  });

  it('черновик старше суток не восстанавливается', () => {
    saveDraft(workout, 0, [{ weight: '80', reps: '5' }]);

    const raw = JSON.parse(localStorage.getItem('gym-tracker-active-draft')!);
    raw.savedAt = Date.now() - 25 * 60 * 60 * 1000;
    localStorage.setItem('gym-tracker-active-draft', JSON.stringify(raw));

    expect(loadDraft()).toBeNull();
  });

  it('битый JSON не роняет загрузку', () => {
    localStorage.setItem('gym-tracker-active-draft', 'не json');
    expect(loadDraft()).toBeNull();
  });
});

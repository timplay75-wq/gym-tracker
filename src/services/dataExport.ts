import { workoutsApi, programsApi, exercisesApi } from './api';

// ─── Types ────────────────────────────────────────

export interface ExportData {
  version: '1.0';
  exportedAt: string;
  workouts: unknown[];
  exercises: unknown[];
  programs: unknown[];
}

export interface ImportPreview {
  workouts: number;
  exercises: number;
  programs: number;
}

// ─── Helpers ──────────────────────────────────────

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function formatDate(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toISOString().slice(0, 10);
}

// ─── Export JSON ──────────────────────────────────

export async function exportAllJSON(): Promise<void> {
  const [workoutsRes, exercises, programs] = await Promise.all([
    workoutsApi.getAll({ limit: 9999 }),
    exercisesApi.getAll(),
    programsApi.getAll(),
  ]);

  const data: ExportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    workouts: workoutsRes.workouts,
    exercises: exercises,
    programs: programs,
  };

  const filename = `gym-tracker-backup-${formatDate(new Date())}.json`;
  downloadFile(JSON.stringify(data, null, 2), filename, 'application/json');
}

// ─── Export CSV ───────────────────────────────────

export async function exportWorkoutsCSV(): Promise<void> {
  const res = await workoutsApi.getAll({ limit: 9999 });

  const header = 'Date,Workout Name,Status,Duration (min),Total Volume (kg),Total Sets,Total Reps,Exercises';
  const rows = res.workouts.map(w => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wo = w as any;
    const exSummary = (wo.exercises || [])
      .map((ex: { name: string; sets: { reps?: number; weight?: number }[] }) => {
        const setsStr = ex.sets.map(s => `${s.reps ?? 0}x${s.weight ?? 0}kg`).join(', ');
        return `${ex.name}: ${setsStr}`;
      })
      .join('; ');

    return [
      formatDate(wo.date),
      `"${(wo.name || '').replace(/"/g, '""')}"`,
      wo.status || 'planned',
      wo.duration || 0,
      wo.totalVolume || 0,
      wo.totalSets || 0,
      wo.totalReps || 0,
      `"${exSummary.replace(/"/g, '""')}"`,
    ].join(',');
  });

  const csv = [header, ...rows].join('\n');
  const filename = `gym-tracker-workouts-${formatDate(new Date())}.csv`;
  downloadFile(csv, filename, 'text/csv;charset=utf-8');
}

// ─── Import JSON ─────────────────────────────────

export function validateImportFile(content: string): { valid: boolean; data?: ExportData; error?: string; preview?: ImportPreview } {
  try {
    const data = JSON.parse(content);
    if (!data.version || !data.exportedAt) {
      return { valid: false, error: 'Invalid backup format: missing version or exportedAt' };
    }
    if (!Array.isArray(data.workouts)) {
      return { valid: false, error: 'Invalid backup format: workouts must be an array' };
    }
    return {
      valid: true,
      data,
      preview: {
        workouts: data.workouts?.length || 0,
        exercises: data.exercises?.length || 0,
        programs: data.programs?.length || 0,
      },
    };
  } catch {
    return { valid: false, error: 'Invalid JSON file' };
  }
}

export async function importData(
  data: ExportData,
  _mode: 'merge' | 'replace'
): Promise<{ workouts: number; exercises: number; programs: number }> {
  let importedWorkouts = 0;
  let importedExercises = 0;
  let importedPrograms = 0;

  // Import workouts
  if (data.workouts?.length) {
    for (const w of data.workouts) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const workout = w as any;
        // Strip _id and id — server will assign new ones
        const { _id, id, userId, createdAt, updatedAt, __v, ...rest } = workout;
        void _id; void id; void userId; void createdAt; void updatedAt; void __v;
        // Clean exercise ids too
        if (rest.exercises) {
          rest.exercises = rest.exercises.map((ex: Record<string, unknown>) => {
            const { _id: exId, id: eid, personalRecords, ...exRest } = ex;
            void exId; void eid; void personalRecords;
            if (exRest.sets) {
              exRest.sets = (exRest.sets as Record<string, unknown>[]).map((s: Record<string, unknown>) => {
                const { _id: sId, id: sid, ...sRest } = s;
                void sId; void sid;
                return sRest;
              });
            }
            return exRest;
          });
        }
        await workoutsApi.create(rest);
        importedWorkouts++;
      } catch {
        // Skip failed items
      }
    }
  }

  // Import custom exercises
  if (data.exercises?.length) {
    for (const ex of data.exercises) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const exercise = ex as any;
        const { _id, id, userId, createdAt, updatedAt, __v, ...rest } = exercise;
        void _id; void id; void userId; void createdAt; void updatedAt; void __v;
        await exercisesApi.create(rest);
        importedExercises++;
      } catch {
        // Skip duplicates or invalid
      }
    }
  }

  // Import programs
  if (data.programs?.length) {
    for (const p of data.programs) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const program = p as any;
        const { _id, id, userId, createdAt, updatedAt, __v, ...rest } = program;
        void _id; void id; void userId; void createdAt; void updatedAt; void __v;
        await programsApi.create(rest);
        importedPrograms++;
      } catch {
        // Skip duplicates or invalid
      }
    }
  }

  return { workouts: importedWorkouts, exercises: importedExercises, programs: importedPrograms };
}

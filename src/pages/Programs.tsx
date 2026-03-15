import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { programsApi, workoutsApi } from '@/services/api';
import { useLanguage } from '@/i18n';
import { getTemplates } from '@/data/programTemplates';
import type { Program, ProgramDay } from '@/data/programTemplates';

/* ───── иконки ───── */
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const ChevronDown = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronUp = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
  </svg>
);

/* ───── основной компонент ───── */
export function Programs() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [tab, setTab] = useState<'my' | 'templates'>('my');
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const templates = getTemplates(t);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await programsApi.getAll() as Program[];
      setPrograms(data);
    } catch {
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPrograms(); }, [fetchPrograms]);

  /* действия */
  const handleActivate = async (id: string, isActive: boolean) => {
    try {
      if (isActive) {
        // deactivate: update isActive=false
        await programsApi.update(id, { isActive: false });
      } else {
        await programsApi.activate(id);
      }
      await fetchPrograms();
    } catch { /* ignore */ }
  };

  const handleDelete = (id: string) => setDeleteConfirmId(id);

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await programsApi.delete(deleteConfirmId);
      setPrograms((prev) => prev.filter((p) => p._id !== deleteConfirmId));
    } catch { /* ignore */ } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleUseTemplate = async (tpl: typeof templates[0]) => {
    try {
      await programsApi.create({
        name: tpl.name,
        description: tpl.description,
        durationWeeks: tpl.durationWeeks,
        days: tpl.days,
      });
      setTab('my');
      await fetchPrograms();
    } catch { /* ignore */ }
  };

  const handleStartWorkout = async (day: ProgramDay) => {
    try {
      const saved = await workoutsApi.create({
        name: day.name,
        date: new Date(),
        status: 'in-progress' as const,
        exercises: day.exercises.map((ex) => ({
          name: ex.name,
          category: ex.category,
          type: 'strength' as const,
          sets: Array.from({ length: ex.sets }, () => ({
            weight: ex.weight,
            reps: ex.reps,
            restTime: ex.restTime,
            completed: false,
          })),
        })),
      });
      navigate('/active-workout', { state: { workout: saved } });
    } catch {
      /* ignore */
    }
  };

  const dayLabel = (dow: string) => {
    const map = t.programs.dayNamesShort as Record<string, string>;
    return map[dow] || dow;
  };

  /* ───── рендер ───── */
  return (
    <div className="max-w-[480px] mx-auto px-4 pt-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-xl font-bold text-[#1e1b4b] dark:text-white">{t.programs.title}</h1>
        </div>
        <button
          onClick={() => navigate('/create-program')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#9333ea] text-white text-sm font-medium hover:bg-[#7c3aed] active:bg-[#6d28d9] transition-colors"
        >
          <PlusIcon />
          {t.programs.createNew}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('my')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
            tab === 'my' ? 'bg-[#9333ea] text-white' : 'bg-[#f3e8ff] dark:bg-purple-900/30 text-[#7c3aed]'
          }`}
        >
          {t.programs.myPrograms}
        </button>
        <button
          onClick={() => setTab('templates')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
            tab === 'templates' ? 'bg-[#9333ea] text-white' : 'bg-[#f3e8ff] dark:bg-purple-900/30 text-[#7c3aed]'
          }`}
        >
          {t.programs.templates}
        </button>
      </div>

      {/* ── My Programs ── */}
      {tab === 'my' && (
        <>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-[#f3e8ff] flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-[#9333ea]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1e1b4b] dark:text-white mb-1">{t.programs.noPrograms}</h3>
              <p className="text-sm text-[#6b7280] dark:text-gray-400">{t.programs.noProgramsDesc}</p>
            </div>
          ) : (
            <div className="space-y-3 animate-stagger">
              {programs.map((prog) => {
                const isExpanded = expandedId === prog._id;
                const totalExercises = prog.days.reduce((s, d) => s + d.exercises.length, 0);

                return (
                  <div key={prog._id} className="bg-white dark:bg-[#16213e] rounded-2xl shadow-sm border border-[#e5e7eb] dark:border-gray-700 overflow-hidden">
                    {/* Card header */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : prog._id)}
                      className="w-full p-4 flex items-center justify-between text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-[#1e1b4b] dark:text-white truncate">{prog.name}</span>
                          {prog.isActive && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#22c55e] text-white font-medium">{t.programs.active}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#6b7280] dark:text-gray-400">
                          <span>{prog.days.length} {t.programs.days}</span>
                          <span>{totalExercises} {t.programs.exercises}</span>
                          {prog.durationWeeks && <span>{prog.durationWeeks} {t.programs.weeks}</span>}
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp /> : <ChevronDown />}
                    </button>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-[#f3f4f6] dark:border-gray-700">
                        {prog.description && (
                          <p className="text-xs text-[#6b7280] dark:text-gray-400 mt-3 mb-3">{prog.description}</p>
                        )}

                        {/* Days list */}
                        <div className="space-y-2 mb-3">
                          {prog.days.map((day, i) => (
                            <div key={day._id || i} className="bg-[#f9fafb] dark:bg-[#1a1a2e] rounded-xl p-3">
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#e9d5ff] text-[#7c3aed] font-medium">
                                    {dayLabel(day.dayOfWeek)}
                                  </span>
                                  <span className="text-sm font-medium text-[#1e1b4b] dark:text-white">{day.name}</span>
                                </div>
                                <button
                                  onClick={() => handleStartWorkout(day)}
                                  className="text-xs px-2.5 py-1 rounded-lg bg-[#9333ea] text-white font-medium hover:bg-[#7c3aed] transition-colors"
                                >
                                  {t.programs.startWorkout}
                                </button>
                              </div>
                              <div className="text-xs text-[#6b7280] dark:text-gray-400">
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate('/create-program', { state: { program: prog } })}
                            className="flex-1 py-2 rounded-xl text-sm font-medium bg-[#f3e8ff] text-[#7c3aed] hover:bg-[#e9d5ff] transition-colors"
                          >
                            {t.programs.editProgram}
                          </button>
                          <button
                            onClick={() => handleActivate(prog._id, prog.isActive)}
                            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                              prog.isActive
                                ? 'bg-[#f3f4f6] dark:bg-gray-800 text-[#6b7280] dark:text-gray-400 hover:bg-[#e5e7eb] dark:hover:bg-gray-700'
                                : 'bg-[#f3e8ff] dark:bg-purple-900/30 text-[#7c3aed] hover:bg-[#e9d5ff]'
                            }`}
                          >
                            {prog.isActive ? t.programs.deactivate : t.programs.activate}
                          </button>
                          <button
                            onClick={() => handleDelete(prog._id)}
                            className="p-2 rounded-xl text-[#ef4444] bg-[#fef2f2] hover:bg-[#fee2e2] transition-colors"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── Templates ── */}
      {tab === 'templates' && (
        <div className="space-y-3 animate-stagger">
          {templates.map((tpl) => (
            <div key={tpl.id} className="bg-white dark:bg-[#16213e] rounded-2xl shadow-sm border border-[#e5e7eb] dark:border-gray-700 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-[#1e1b4b] dark:text-white">{tpl.name}</h3>
                  <p className="text-xs text-[#6b7280] dark:text-gray-400 mt-0.5">{tpl.description}</p>
                </div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: tpl.color + '20' }}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tpl.color }} />
                </div>
              </div>

              {/* Days preview */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {tpl.days.map((d, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[#f3f4f6] dark:bg-gray-800 text-[#374151] dark:text-gray-300 font-medium">
                    {dayLabel(d.dayOfWeek)}: {d.name}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6b7280] dark:text-gray-400">
                </span>
                <button
                  onClick={() => handleUseTemplate(tpl)}
                  className="px-4 py-1.5 rounded-xl bg-[#9333ea] text-white text-sm font-medium hover:bg-[#7c3aed] active:bg-[#6d28d9] transition-colors"
                >
                  {t.programs.useTemplate}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══ Delete Confirm Modal ═══ */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirmId(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white dark:bg-[#16213e] rounded-2xl shadow-xl p-6 w-full max-w-[320px]" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 className="text-center font-bold text-gray-900 dark:text-white mb-1">{t.programs.title}</h3>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-5">{t.programs.deleteConfirm}</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                {t.common.cancel}
              </button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">
                {t.common.delete || 'Удалить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { programsApi, workoutsApi } from '@/services/api';
import { useLanguage } from '@/i18n';
import { getTemplates } from '@/data/programTemplates';
import type { Program } from '@/data/programTemplates';

const todayStr = () => new Date().toISOString().slice(0, 10);

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
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const [applyModal, setApplyModal] = useState<{ prog: Program; date: string } | null>(null);
  const [applying, setApplying] = useState(false);

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

  const confirmDeleteAll = async () => {
    setDeletingAll(true);
    try {
      await Promise.all(programs.map(p => programsApi.delete(p._id)));
      setPrograms([]);
    } catch { /* ignore */ } finally {
      setDeletingAll(false);
      setDeleteAllConfirm(false);
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

  const handleApply = async () => {
    if (!applyModal) return;
    setApplying(true);
    const { prog, date } = applyModal;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = prog as any;
    // поддерживаем оба формата: exercises на верхнем уровне И days[].exercises
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allExercises: any[] = p.exercises?.length
      ? p.exercises
      : prog.days.flatMap((d: any) => d.exercises || []);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await workoutsApi.getAll({ limit: 50 }) as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const match = res.workouts?.find((w: any) => {
        const wd = typeof w.date === 'string' ? w.date.slice(0, 10) : new Date(w.date).toISOString().slice(0, 10);
        return wd === date;
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newExercises = allExercises.map((ex: any) => ({
        name: ex.name,
        category: ex.category || 'other',
        sets: [{ weight: ex.weight || 0, reps: ex.reps || 10, completed: false }],
      }));
      if (match) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await workoutsApi.update((match as any).id || (match as any)._id, {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          exercises: [...(match as any).exercises, ...newExercises],
        });
      } else {
        await workoutsApi.create({ name: prog.name, date: new Date(date).toISOString(), exercises: newExercises });
      }
      setApplyModal(null);
      navigate('/', { state: { date } });
    } catch { /* ignore */ } finally {
      setApplying(false);
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
        <div className="flex items-center gap-2">
          {programs.length > 0 && tab === 'my' && (
            <button
              onClick={() => setDeleteAllConfirm(true)}
              className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              title="Удалить всё"
            >
              <TrashIcon />
            </button>
          )}
          <button
            onClick={() => navigate('/create-program')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#9333ea] text-white text-sm font-medium hover:bg-[#7c3aed] active:bg-[#6d28d9] transition-colors"
          >
            <PlusIcon />
            {t.programs.createNew}
          </button>
        </div>
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

                        {/* Exercise list — flat */}
                        <div className="mt-3 mb-4 space-y-1.5">
                          {(prog as any).exercises?.length
                            ? (prog as any).exercises.map((ex: any, ei: number) => (
                              <div key={ei} className="flex items-center gap-2 py-1.5 px-2 bg-[#f9fafb] dark:bg-[#1a1a2e] rounded-xl">
                                <div className="w-2 h-2 rounded-full bg-[#9333ea] flex-shrink-0" />
                                <span className="text-sm text-[#1e1b4b] dark:text-white flex-1">{ex.name}</span>
                                <span className="text-xs text-[#6b7280] dark:text-gray-500">
                                  {typeof ex.sets === 'number' ? `${ex.sets}×${ex.reps}` : `${ex.sets?.length ?? 1}×${ex.sets?.[0]?.reps ?? '—'}`}
                                </span>
                              </div>
                            ))
                            : prog.days.flatMap((d, di) => d.exercises.map((ex, ei) => (
                            <div key={`${di}-${ei}`} className="flex items-center gap-2 py-1.5 px-2 bg-[#f9fafb] dark:bg-[#1a1a2e] rounded-xl">
                              <div className="w-2 h-2 rounded-full bg-[#9333ea] flex-shrink-0" />
                              <span className="text-sm text-[#1e1b4b] dark:text-white flex-1">{ex.name}</span>
                              <span className="text-xs text-[#6b7280] dark:text-gray-500">
                                {typeof ex.sets === 'number' ? `${ex.sets}×${ex.reps}` : `${(ex.sets as any)?.length ?? 1}×${(ex.sets as any)?.[0]?.reps ?? '—'}`}
                              </span>
                            </div>
                          )))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setApplyModal({ prog, date: todayStr() })}
                            className="flex-1 py-2 rounded-xl text-sm font-semibold bg-[#9333ea] text-white hover:bg-[#7c3aed] transition-colors"
                          >
                            {t.programs.applyToDay}
                          </button>
                          <button
                            onClick={() => navigate('/create-program', { state: { program: prog } })}
                            className="py-2 px-3 rounded-xl text-sm font-medium bg-[#f3e8ff] text-[#7c3aed] hover:bg-[#e9d5ff] transition-colors"
                          >
                            {t.programs.editProgram}
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

      {/* ═══ Delete ALL Confirm Modal ═══ */}
      {deleteAllConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDeleteAllConfirm(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white dark:bg-[#16213e] rounded-2xl shadow-xl p-6 w-full max-w-[320px]" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 className="text-center font-bold text-gray-900 dark:text-white mb-1">Удалить все программы?</h3>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-5">Будет удалено {programs.length} программ(ы). Это действие нельзя отменить.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteAllConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                {t.common.cancel}
              </button>
              <button onClick={confirmDeleteAll} disabled={deletingAll} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                {deletingAll && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Удалить все
              </button>
            </div>
          </div>
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

      {/* ═══ Apply to Day Modal ═══ */}
      {applyModal && (
        <div className="fixed inset-0 z-50 flex items-end" onClick={() => setApplyModal(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative w-full max-w-[480px] mx-auto bg-white dark:bg-[#16213e] rounded-t-3xl px-4 pt-5 pb-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-5" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{t.programs.applyToDay}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{applyModal.prog.name}</p>
            <div className="mb-4">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{t.programs.selectDate}</label>
              <input
                type="date"
                value={applyModal.date}
                onChange={e => setApplyModal({ ...applyModal, date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f1629] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9333ea]"
              />
            </div>
            <button
              onClick={handleApply}
              disabled={applying}
              className="w-full py-3.5 bg-[#9333ea] text-white rounded-2xl font-semibold text-base disabled:opacity-50 hover:bg-[#7c3aed] transition-colors"
            >
              {applying ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t.programs.apply}
                </span>
              ) : t.programs.apply}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

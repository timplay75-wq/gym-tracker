import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine,
} from 'recharts';
import { metricsApi } from '@/services/api';
import type { BodyMeasurement } from '@/services/api';
import { useLanguage } from '@/i18n';
import { useToastContext } from '@/contexts/ToastContext';

/* ─── helpers ─── */
const todayStr = () => new Date().toISOString().slice(0, 10);

const shortDate = (iso: string) => {
  const [, m, d] = iso.split('-');
  return `${d}.${m}`;
};

const calcBmi = (weight: number, heightCm: number) => {
  if (!heightCm || heightCm < 50) return null;
  return Math.round((weight / Math.pow(heightCm / 100, 2)) * 10) / 10;
};

type Period = '30' | '90' | 'all';

/* ─── custom tooltip ─── */
interface TooltipPayload {
  value: number;
  payload: { date: string };
}
function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null;
  const { value, payload: { date } } = payload[0];
  return (
    <div className="bg-white dark:bg-[#1e1e3a] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 shadow-lg text-sm">
      <p className="text-gray-500 dark:text-gray-400 text-xs">{shortDate(date)}</p>
      <p className="font-bold text-gray-900 dark:text-white">{value} кг</p>
    </div>
  );
}

/* ─── main component ─── */
export function BodyMetrics() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { showToast } = useToastContext();
  const bm = t.bodyMetrics;

  const [entries, setEntries] = useState<BodyMeasurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('30');
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirmDate, setDeleteConfirmDate] = useState<string | null>(null);

  // persistent height for BMI
  const [heightCm, setHeightCm] = useState<number>(() => {
    const raw = localStorage.getItem('gym-body-height');
    return raw ? parseFloat(raw) : 0;
  });

  // form state
  const [formDate, setFormDate] = useState(todayStr());
  const [formWeight, setFormWeight] = useState('');
  const [formHeight, setFormHeight] = useState(() => localStorage.getItem('gym-body-height') ?? '');
  const [formNotes, setFormNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await metricsApi.getAll();
      setEntries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // filter by period
  const filtered = (() => {
    if (period === 'all') return [...entries].reverse();
    const days = period === '30' ? 30 : 90;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return [...entries].filter(e => new Date(e.date) >= cutoff).reverse();
  })();

  // stats
  const weights = filtered.map(e => e.weight);
  const minW = weights.length ? Math.min(...weights) : null;
  const maxW = weights.length ? Math.max(...weights) : null;
  const avgW = weights.length ? Math.round((weights.reduce((a, b) => a + b, 0) / weights.length) * 10) / 10 : null;
  const latest = entries[0] ?? null;
  const oldest = filtered[0] ?? null;
  const change = latest && oldest && latest._id !== oldest._id
    ? Math.round((latest.weight - oldest.weight) * 10) / 10
    : null;

  const bmi = latest && heightCm ? calcBmi(latest.weight, heightCm) : null;
  const bmiInfo = (v: number) => {
    if (v < 18.5) return { text: bm.bmiUnderweight, color: 'text-blue-500' };
    if (v < 25)   return { text: bm.bmiNormal,      color: 'text-green-500' };
    if (v < 30)   return { text: bm.bmiOverweight,  color: 'text-orange-500' };
    return             { text: bm.bmiObese,         color: 'text-red-500' };
  };

  const openForm = () => {
    setFormDate(todayStr());
    setFormWeight('');
    setFormNotes('');
    setFormHeight(heightCm ? String(heightCm) : '');
    setShowForm(true);
  };

  const handleSave = async () => {
    const w = parseFloat(formWeight.replace(',', '.'));
    if (!formWeight || isNaN(w) || w <= 0 || w > 500) return;
    const h = parseFloat(formHeight.replace(',', '.'));
    if (formHeight && !isNaN(h) && h >= 50 && h <= 300) {
      localStorage.setItem('gym-body-height', String(h));
      setHeightCm(h);
    }
    setSaving(true);
    try {
      await metricsApi.upsert({ date: formDate, weight: w, notes: formNotes.trim() || undefined });
      showToast(bm.saved, 'success');
      setShowForm(false);
      await load();
    } catch (err) {
      console.error(err);
      showToast(t.common.error, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (date: string) => setDeleteConfirmDate(date);

  const confirmDelete = async () => {
    if (!deleteConfirmDate) return;
    try {
      await metricsApi.delete(deleteConfirmDate);
      showToast(bm.deleteEntry, 'success');
      await load();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteConfirmDate(null);
    }
  };

  const periods: { id: Period; label: string }[] = [
    { id: '30', label: bm.period30 },
    { id: '90', label: bm.period90 },
    { id: 'all', label: bm.periodAll },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a2e] pb-24">
      <div className="max-w-[480px] mx-auto px-4">

        {/* ── Header ── */}
        <div className="pt-4 pb-2 flex items-center gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{bm.title}</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">{bm.subtitle}</p>
          </div>
        </div>

        {/* ── Stats strip ── */}
        {latest && (
          <div className="grid grid-cols-2 gap-2 mt-3 mb-4">
            <div className="bg-white dark:bg-[#16213e] rounded-2xl p-3 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{bm.current}</p>
              <p className="text-2xl font-bold text-[#7c3aed]">{latest.weight}</p>
              <p className="text-xs text-gray-400">{bm.kg}</p>
            </div>
            <div className="bg-white dark:bg-[#16213e] rounded-2xl p-3 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{bm.change}</p>
              <p className={`text-2xl font-bold ${change === null ? 'text-gray-400' : change > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {change === null ? '—' : `${change > 0 ? '+' : ''}${change}`}
              </p>
              <p className="text-xs text-gray-400">{bm.kg}</p>
            </div>
            <div className="bg-white dark:bg-[#16213e] rounded-2xl p-3 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">min → max</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{minW ?? '—'} → {maxW ?? '—'}</p>
              <p className="text-xs text-gray-400">avg: {avgW ?? '—'}</p>
            </div>
            <div className="bg-white dark:bg-[#16213e] rounded-2xl p-3 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{bm.bmi}</p>
              {bmi ? (
                <>
                  <p className={`text-2xl font-bold ${bmiInfo(bmi).color}`}>{bmi}</p>
                  <p className={`text-xs ${bmiInfo(bmi).color}`}>{bmiInfo(bmi).text}</p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-gray-300 dark:text-gray-600">—</p>
                  <p className="text-xs text-gray-400">{bm.heightLabel}</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── Period selector ── */}
        <div className="flex gap-2 mb-4">
          {periods.map(p => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`flex-1 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                period === p.id
                  ? 'bg-[#7c3aed] text-white'
                  : 'bg-white dark:bg-[#16213e] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* ── Chart ── */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length < 2 ? (
          <div className="bg-white dark:bg-[#16213e] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 flex flex-col items-center text-center mb-4">
            <div className="w-16 h-16 bg-[#f3e8ff] dark:bg-[#9333ea]/20 rounded-full flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-[#9333ea]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5m0 15V21m9-9h-1.5M4.5 12H3m15.364-6.364-1.06 1.06M6.696 17.304l-1.06 1.06M18.364 18.364l-1.06-1.06M6.696 6.696 5.636 5.636M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="font-semibold text-gray-800 dark:text-white mb-1">{bm.noData}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{bm.noDataSub}</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#16213e] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-4">
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filtered} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={shortDate}
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    interval="preserveStartEnd"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {avgW && (
                    <ReferenceLine y={avgW} stroke="#9ca3af" strokeDasharray="4 4" strokeOpacity={0.6} />
                  )}
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    dot={{ fill: '#7c3aed', r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: '#7c3aed' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── History list ── */}
        {entries.length > 0 && (
          <div className="bg-white dark:bg-[#16213e] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden mb-4">
            {entries.slice(0, 20).map((entry, idx) => (
              <div
                key={entry._id}
                className={`flex items-center gap-3 px-4 py-3 ${idx < entries.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-[#7c3aed]">{entry.weight}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{entry.date}</p>
                  {entry.notes && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{entry.notes}</p>
                  )}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 shrink-0">{bm.kg}</p>
                <button
                  onClick={() => handleDelete(entry.date)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-gray-400 hover:text-red-500 shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── FAB — fixed bottom right ── */}
      <button
        onClick={openForm}
        className="fixed bottom-6 right-4 z-40 w-14 h-14 bg-[#7c3aed] text-white rounded-full shadow-xl shadow-purple-400/40 flex items-center justify-center hover:bg-[#6d28d9] active:scale-95 transition-all"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* ── Add entry bottom sheet ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end">
          {/* backdrop — только он закрывает модалку */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowForm(false)}
          />
          {/* контент — блокирует все события вверх, включая Backspace */}
          <div
            className="relative w-full max-w-[480px] mx-auto bg-white dark:bg-[#16213e] rounded-t-3xl px-4 pt-5 pb-8 shadow-2xl"
            onClick={e => e.stopPropagation()}
            onKeyDown={e => e.stopPropagation()}
          >
            {/* handle */}
            <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-5" />

            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{bm.addEntry}</h2>

            <div className="space-y-3">
              {/* weight input */}
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{bm.weightLabel}</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={formWeight}
                  onChange={e => setFormWeight(e.target.value)}
                  placeholder="70.5"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f1629] text-gray-900 dark:text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent"
                  autoFocus
                />
              </div>

              {/* height for BMI */}
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{bm.heightLabel}</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={formHeight}
                  onChange={e => setFormHeight(e.target.value)}
                  placeholder={bm.heightPlaceholder}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f1629] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent"
                />
              </div>

              {/* live BMI preview */}
              {(() => {
                const pw = parseFloat(formWeight.replace(',', '.'));
                const ph = parseFloat(formHeight.replace(',', '.'));
                const preview = pw > 0 && ph >= 50 ? calcBmi(pw, ph) : null;
                if (!preview) return null;
                const { text, color } = bmiInfo(preview);
                return (
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-[#0f1629] rounded-xl border border-gray-100 dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{bm.bmi}:</span>
                    <span className={`text-sm font-bold ${color}`}>{preview}</span>
                    <span className={`text-xs ${color}`}>— {text}</span>
                  </div>
                );
              })()}

              {/* date */}
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{bm.datePlaceholder}</label>
                <input
                  type="date"
                  value={formDate}
                  max={todayStr()}
                  onChange={e => setFormDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f1629] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent"
                />
              </div>

              {/* notes */}
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{bm.notesPlaceholder}</label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  maxLength={200}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f1629] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={!formWeight || saving}
              className="mt-5 w-full py-3.5 bg-[#7c3aed] text-white rounded-2xl font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6d28d9] transition-colors"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {bm.save}
                </span>
              ) : bm.save}
            </button>
          </div>
        </div>
      )}

      {/* ═══ Delete Confirm Modal ═══ */}
      {deleteConfirmDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirmDate(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white dark:bg-[#16213e] rounded-2xl shadow-xl p-6 w-full max-w-[320px]" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 className="text-center font-bold text-gray-900 dark:text-white mb-1">{bm.title}</h3>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-5">{bm.confirmDelete}</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmDate(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
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

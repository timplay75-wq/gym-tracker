import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { statsApi } from '@/services/api';
import { useLanguage } from '@/i18n';

/* ───── типы ───── */
interface SetData {
  weight: number;
  reps: number;
}

interface HistoryEntry {
  date: string;
  sets: SetData[];
  maxWeight: number;
  maxReps: number;
  totalVolume: number;
  totalReps: number;
  setsCount: number;
}

interface PersonalRecord {
  value: number;
  date: string | null;
}

interface ExerciseData {
  exerciseName: string;
  totalSessions: number;
  isDoubleWeight: boolean;
  isBodyweight: boolean;
  personalRecords: {
    maxWeight: PersonalRecord;
    maxReps: PersonalRecord;
    maxVolume: PersonalRecord;
  };
  history: HistoryEntry[];
}

/* ───── компонент ───── */
export function ExerciseStats() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [data, setData] = useState<ExerciseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!name) return;
    setLoading(true);
    statsApi.getExerciseHistory(name)
      .then((res) => setData(res))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [name]);

  /* helpers */
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  };

  const formatDateFull = (dateStr: string | null) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatVolume = (v: number) =>
    v >= 1000 ? `${(v / 1000).toFixed(1)}т` : `${Math.round(v)}`;

  /* ───── skeleton ───── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a2e] pb-28">
        <div className="max-w-[480px] mx-auto px-4 py-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            <div className="h-7 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="h-52 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          <div className="h-52 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ───── error state ───── */
  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a2e] pb-28 flex flex-col items-center justify-center px-4">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => navigate(-1)} className="text-[#9333ea] font-medium">
          {t.exerciseStats.back}
        </button>
      </div>
    );
  }

  /* ───── empty state ───── */
  if (!data || data.history.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a2e] pb-28 flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 rounded-full bg-[#f3e8ff] flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-[#9333ea]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m6 0h6m0 0v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h-6" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.exerciseStats.noData}</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-4">{t.exerciseStats.noDataDesc}</p>
        <button onClick={() => navigate(-1)} className="text-[#9333ea] font-medium">
          {t.exerciseStats.back}
        </button>
      </div>
    );
  }

  const { personalRecords: pr, history, isDoubleWeight, isBodyweight } = data;

  /* weight display helper */
  const displayWeight = (w: number) => {
    if (isDoubleWeight) return w * 2;
    return w;
  };

  const weightLabel = (w: number) => {
    if (isBodyweight) {
      if (w > 0) return `${t.exerciseStats.bwPlus || 'СВ +'} ${w} ${t.exerciseStats.kg}`;
      return t.exercises.bodyweight || 'СВ';
    }
    return `${displayWeight(w)} ${t.exerciseStats.kg}`;
  };

  /* chart data */
  const chartData = history.map((h) => ({
    date: formatDate(h.date),
    weight: isBodyweight ? h.maxReps : displayWeight(h.maxWeight),
    volume: isBodyweight ? h.totalReps : (isDoubleWeight ? h.totalVolume * 2 : h.totalVolume),
    reps: h.totalReps,
  }));

  /* last set comparison helper for 12.4 */
  const reversedHistory = [...history].reverse();
  const getLastSetDiff = (): string | null => {
    if (reversedHistory.length < 2) return null;
    const latestSets = reversedHistory[0].sets;
    const prevSets = reversedHistory[1].sets;
    if (!latestSets.length || !prevSets.length) return null;
    const last = latestSets[latestSets.length - 1];
    const prev = prevSets[prevSets.length - 1];
    if (isBodyweight && last.weight === 0 && prev.weight === 0) {
      const diff = last.reps - prev.reps;
      if (diff > 0) return `+${diff} ${t.exerciseStats.reps}`;
      if (diff < 0) return `${diff} ${t.exerciseStats.reps}`;
      return `= ${t.exerciseStats.same || 'прежний'}`;
    }
    const wDiff = displayWeight(last.weight) - displayWeight(prev.weight);
    if (wDiff !== 0) return `${wDiff > 0 ? '+' : ''}${wDiff} ${t.exerciseStats.kg}`;
    const rDiff = last.reps - prev.reps;
    if (rDiff !== 0) return `${rDiff > 0 ? '+' : ''}${rDiff} ${t.exerciseStats.reps}`;
    return `= ${t.exerciseStats.same || 'прежний'}`;
  };
  const lastSetDiff = getLastSetDiff();

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a2e] pb-28">
      <div className="max-w-[480px] mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
              {decodeURIComponent(name || '')}
            </h1>
            <div className="flex items-center gap-1.5">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {data.totalSessions} {t.exerciseStats.sessions}
              </p>
              {isDoubleWeight && (
                <span className="text-[10px] font-bold bg-[#f3e8ff] text-[#9333ea] px-1.5 py-0.5 rounded">
                  {t.exerciseStats.doubleWeightTag}
                </span>
              )}
              {isBodyweight && (
                <span className="text-[10px] font-bold bg-[#dbeafe] text-[#3b82f6] px-1.5 py-0.5 rounded">
                  {t.exercises.bodyweight}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Personal Records */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="text-lg">🏆</span>
            {t.exerciseStats.personalRecords}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {isBodyweight ? (
              <>
                <PRCard
                  label={t.exerciseStats.maxReps}
                  value={`${pr.maxReps.value}`}
                  unit={t.exerciseStats.reps}
                  date={formatDateFull(pr.maxReps.date)}
                  color="bg-[#dbeafe]"
                  iconColor="text-[#3b82f6]"
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  }
                />
                <PRCard
                  label={t.exerciseStats.bestVolume}
                  value={`${pr.maxVolume.value > 0 ? formatVolume(pr.maxVolume.value) : pr.maxReps.value}`}
                  unit={pr.maxVolume.value > 0 ? t.exerciseStats.kg : t.exerciseStats.reps}
                  date={formatDateFull(pr.maxVolume.value > 0 ? pr.maxVolume.date : pr.maxReps.date)}
                  color="bg-[#dcfce7]"
                  iconColor="text-[#22c55e]"
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m6 0h6m0 0v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h-6" />
                    </svg>
                  }
                />
                {pr.maxWeight.value > 0 && (
                  <PRCard
                    label={t.exerciseStats.maxWeight}
                    value={`+${pr.maxWeight.value}`}
                    unit={t.exerciseStats.kg}
                    date={formatDateFull(pr.maxWeight.date)}
                    color="bg-[#fef3c7]"
                    iconColor="text-[#f59e0b]"
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    }
                  />
                )}
              </>
            ) : (
              <>
                <PRCard
                  label={t.exerciseStats.maxWeight}
                  value={`${displayWeight(pr.maxWeight.value)}`}
                  unit={t.exerciseStats.kg}
                  date={formatDateFull(pr.maxWeight.date)}
                  color="bg-[#fef3c7]"
                  iconColor="text-[#f59e0b]"
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  }
                />
                <PRCard
                  label={t.exerciseStats.maxReps}
                  value={`${pr.maxReps.value}`}
                  unit={t.exerciseStats.reps}
                  date={formatDateFull(pr.maxReps.date)}
                  color="bg-[#dbeafe]"
                  iconColor="text-[#3b82f6]"
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  }
                />
                <PRCard
                  label={t.exerciseStats.bestVolume}
                  value={formatVolume(isDoubleWeight ? pr.maxVolume.value * 2 : pr.maxVolume.value)}
                  unit={t.exerciseStats.kg}
                  date={formatDateFull(pr.maxVolume.date)}
                  color="bg-[#dcfce7]"
                  iconColor="text-[#22c55e]"
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m6 0h6m0 0v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h-6" />
                    </svg>
                  }
                />
              </>
            )}
          </div>
        </section>

        {/* Weight/Reps Progress Chart */}
        {chartData.length > 0 && (
          <section className="bg-gray-50 dark:bg-[#16213e] rounded-2xl p-4">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              {isBodyweight ? (t.exerciseStats.repsProgress || 'Прогресс повторений') : t.exerciseStats.weightProgress}
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                  domain={isBodyweight ? ['dataMin - 2', 'dataMax + 2'] : ['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,.1)' }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [
                    isBodyweight
                      ? `${Number(value)} ${t.exerciseStats.reps}`
                      : `${Number(value)} ${t.exerciseStats.kg}`,
                    isBodyweight ? t.exerciseStats.maxReps : t.exerciseStats.maxWeight,
                  ]}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  labelFormatter={(label: any) => String(label)}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#9333ea"
                  strokeWidth={2.5}
                  dot={{ fill: '#9333ea', r: 4 }}
                  activeDot={{ r: 6, fill: '#7c3aed' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </section>
        )}

        {/* Volume/Total Reps Progress Chart */}
        {chartData.length > 0 && (
          <section className="bg-gray-50 dark:bg-[#16213e] rounded-2xl p-4">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              {isBodyweight ? (t.exerciseStats.totalRepsProgress || 'Общие повторения') : t.exerciseStats.volumeProgress}
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => isBodyweight ? String(v) : (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
                  width={40}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,.1)' }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [
                    isBodyweight
                      ? `${Number(value)} ${t.exerciseStats.reps}`
                      : `${Math.round(Number(value))} ${t.exerciseStats.kg}`,
                    isBodyweight ? t.exerciseStats.totalReps : t.exerciseStats.totalVolume,
                  ]}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  labelFormatter={(label: any) => String(label)}
                />
                <Bar dataKey="volume" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </section>
        )}

        {/* History Timeline */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
            {t.exerciseStats.history}
          </h2>
          <div className="space-y-3">
            {reversedHistory.map((entry, idx) => {
              const isLatest = idx === 0;
              const lastSetIdx = entry.sets.length - 1;
              return (
              <div
                key={idx}
                className="bg-gray-50 dark:bg-[#16213e] rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {new Date(entry.date).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {entry.setsCount} {t.exerciseStats.setsCount} · {entry.totalReps} {t.exerciseStats.totalReps}
                  </span>
                </div>

                {/* Sets grid */}
                <div className="grid grid-cols-2 gap-2">
                  {entry.sets.map((set, si) => {
                    const isHighlighted = isLatest && si === lastSetIdx;
                    return (
                    <div
                      key={si}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                        isHighlighted
                          ? 'bg-[#9333ea]/10 border border-[#9333ea]/40'
                          : 'bg-white dark:bg-[#1a1a2e]'
                      }`}
                    >
                      <span className="text-xs text-gray-400 font-medium w-4">
                        {si + 1}
                      </span>
                      {isBodyweight && set.weight === 0 ? (
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {set.reps} {t.exerciseStats.reps}
                        </span>
                      ) : (
                        <>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {weightLabel(set.weight)}
                          </span>
                          <span className="text-xs text-gray-500">
                            × {set.reps}
                          </span>
                        </>
                      )}
                      {isHighlighted && lastSetDiff && (
                        <span className={`ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                          lastSetDiff.startsWith('+')
                            ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
                            : lastSetDiff.startsWith('-') || lastSetDiff.startsWith('−')
                              ? 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                              : 'text-gray-500 bg-gray-100 dark:text-gray-400 dark:bg-gray-700'
                        }`}>
                          {lastSetDiff}
                        </span>
                      )}
                    </div>
                    );
                  })}
                </div>

                {/* Volume footer */}
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {isBodyweight ? t.exerciseStats.totalReps : t.exerciseStats.totalVolume}
                  </span>
                  <span className="text-sm font-semibold text-[#9333ea]">
                    {isBodyweight
                      ? `${entry.totalReps} ${t.exerciseStats.reps}`
                      : `${formatVolume(isDoubleWeight ? entry.totalVolume * 2 : entry.totalVolume)} ${t.exerciseStats.kg}`
                    }
                  </span>
                </div>
              </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ───── PRCard ───── */
function PRCard({
  label,
  value,
  unit,
  date,
  color,
  iconColor,
  icon,
}: {
  label: string;
  value: string;
  unit: string;
  date: string;
  color: string;
  iconColor: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 dark:bg-[#16213e] rounded-2xl p-3 flex flex-col gap-1.5">
      <div className={`w-8 h-8 rounded-lg ${color} ${iconColor} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <span className="text-xl font-bold text-gray-900 dark:text-white">{value}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{unit}</span>
      </div>
      <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">{label}</p>
      <p className="text-[10px] text-gray-400 truncate">{date}</p>
    </div>
  );
}

export default ExerciseStats;

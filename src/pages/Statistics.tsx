import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { statsApi } from '@/services/api';
import { useLanguage } from '@/i18n';

/* ───── цвета для circular/pie chart ───── */
const COLORS = ['#9333ea', '#7c3aed', '#a855f7', '#c084fc', '#d8b4fe', '#6d28d9', '#8b5cf6', '#e9d5ff'];

const CATEGORY_COLORS: Record<string, string> = {
  chest: '#ef4444',
  back: '#3b82f6',
  legs: '#22c55e',
  shoulders: '#f59e0b',
  arms: '#ec4899',
  core: '#06b6d4',
  cardio: '#f97316',
  other: '#6b7280',
};

/* ───── типы ───── */
type Period = 'week' | 'month' | 'year' | 'all';

interface Summary {
  totalWorkouts: number;
  thisMonthWorkouts: number;
  lastMonthWorkouts: number;
  totalVolume: number;
  avgDuration: number;
  currentStreak: number;
}

interface WeeklyData {
  week: string;
  count: number;
  volume: number;
  duration: number;
}

interface TopExercise {
  _id: string;
  category: string;
  totalVolume: number;
  totalSets: number;
  maxWeight: number;
  timesPerformed: number;
}

interface MuscleData {
  _id: string;
  volume: number;
  sets: number;
  exerciseCount: number;
}

/* ───── компонент ───── */
export function Statistics() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>('month');
  const [summary, setSummary] = useState<Summary | null>(null);
  const [weekly, setWeekly] = useState<WeeklyData[]>([]);
  const [topExercises, setTopExercises] = useState<TopExercise[]>([]);
  const [muscles, setMuscles] = useState<MuscleData[]>([]);
  const [weekdays, setWeekdays] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [topSort, setTopSort] = useState<'volume' | 'frequency'>('volume');
  const [showAllExercises, setShowAllExercises] = useState(false);

  const categoryLabel = useCallback(
    (cat: string) => {
      const map: Record<string, string> = {
        chest: t.exercises.chest,
        back: t.exercises.back,
        legs: t.exercises.legs,
        shoulders: t.exercises.shoulders,
        arms: t.exercises.arms,
        core: t.exercises.abs,
        cardio: t.exercises.cardio,
        other: 'Other',
      };
      return map[cat] || cat;
    },
    [t],
  );

  /* загрузка данных */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.allSettled([
      statsApi.getSummary(),
      statsApi.getWeekly(),
      statsApi.getTopExercises(),
      statsApi.getMuscleDistribution(period === 'all' ? undefined : period),
      statsApi.getWeekdayFrequency(),
    ])
      .then(([sRes, wRes, exRes, mRes, wdRes]) => {
        if (cancelled) return;
        if (sRes.status === 'fulfilled') setSummary(sRes.value);
        if (wRes.status === 'fulfilled') setWeekly(wRes.value);
        if (exRes.status === 'fulfilled') setTopExercises(exRes.value);
        if (mRes.status === 'fulfilled') setMuscles(mRes.value);
        if (wdRes.status === 'fulfilled') setWeekdays(wdRes.value);

        const failures = [sRes, wRes, exRes, mRes].filter((r) => r.status === 'rejected');
        if (failures.length) console.error('Stats load errors:', failures);
      })
      .finally(() => !cancelled && setLoading(false));

    return () => { cancelled = true; };
  }, [period]);

  /* helpers */
  const formatVolume = (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}т` : `${Math.round(v)}`);

  const periods: { key: Period; label: string }[] = [
    { key: 'week', label: t.stats.week },
    { key: 'month', label: t.stats.month },
    { key: 'year', label: t.stats.year },
    { key: 'all', label: t.stats.allTime },
  ];

  /* pie data */
  const pieData = muscles.map((m) => ({
    name: categoryLabel(m._id),
    value: m.volume,
    color: CATEGORY_COLORS[m._id] || '#6b7280',
  }));
  const totalPieVolume = pieData.reduce((s, d) => s + d.value, 0);

  /* weekday data */
  const DAY_LABELS_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const DAY_LABELS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayLabels = t.stats.title === 'Статистика' ? DAY_LABELS_RU : DAY_LABELS_EN;
  const weekdayData = weekdays.map((count, i) => ({
    day: dayLabels[i],
    count,
  }));

  /* sorted top exercises */
  const sortedExercises = [...topExercises].sort((a, b) =>
    topSort === 'volume' ? b.totalVolume - a.totalVolume : b.timesPerformed - a.timesPerformed,
  );

  /* week chart — format label */
  const weekChartData = weekly.map((w, i) => ({
    ...w,
    label: `${t.stats.weekShort}${i + 1}`,
  }));

  /* ───── skeleton ───── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a2e] pb-28">
        <div className="max-w-[480px] mx-auto px-4 py-6 space-y-6">
          <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="h-52 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          <div className="h-52 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  /* ───── empty state ───── */
  if (!summary || summary.totalWorkouts === 0) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a2e] pb-28 flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 rounded-full bg-[#f3e8ff] flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-[#9333ea]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m6 0h6m0 0v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h-6" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.stats.noData}</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center">{t.stats.noDataDesc}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a2e] pb-28">
      <div className="max-w-[480px] mx-auto px-4 py-6 space-y-6 animate-stagger">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t.stats.title}</h1>
        </div>

        {/* Period selector */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                period === p.key
                  ? 'bg-[#9333ea] text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-2 gap-3">
          <OverviewCard
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            iconBg="bg-[#f3e8ff]"
            iconColor="text-[#9333ea]"
            value={String(summary.totalWorkouts)}
            label={t.stats.totalWorkouts}
          />
          <OverviewCard
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            iconBg="bg-[#dcfce7]"
            iconColor="text-[#22c55e]"
            value={formatVolume(summary.totalVolume)}
            unit={t.stats.kg}
            label={t.stats.totalVolume}
          />
          <OverviewCard
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            iconBg="bg-[#dbeafe]"
            iconColor="text-[#3b82f6]"
            value={String(summary.avgDuration)}
            unit={t.stats.min}
            label={t.stats.avgDuration}
          />
          <OverviewCard
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            }
            iconBg="bg-[#fef3c7]"
            iconColor="text-[#f59e0b]"
            value={String(summary.currentStreak)}
            unit={t.stats.days}
            label={t.stats.currentStreak}
          />
        </div>

        {/* Volume trend bar chart */}
        {weekChartData.length > 0 && (
          <section className="bg-gray-50 dark:bg-[#16213e] rounded-2xl p-4">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">{t.stats.volumeTrend}</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weekChartData} barCategoryGap="20%">
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
                  width={40}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,.1)' }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [`${Math.round(Number(value))} ${t.stats.kg}`, t.stats.volume]}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  labelFormatter={(label: any) => String(label)}
                />
                <Bar dataKey="volume" fill="#9333ea" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </section>
        )}

        {/* Weekday frequency chart */}
        {weekdayData.some(d => d.count > 0) && (
          <section className="bg-gray-50 dark:bg-[#16213e] rounded-2xl p-4">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">{t.stats.weekdayFrequency}</h2>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weekdayData} barCategoryGap="20%">
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,.1)' }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [`${value}`, t.stats.workoutsCount]}
                />
                <Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </section>
        )}

        {/* Muscle group distribution */}
        {pieData.length > 0 && (
          <section className="bg-gray-50 dark:bg-[#16213e] rounded-2xl p-4">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">{t.stats.muscleDistribution}</h2>
            <div className="flex items-center">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={entry.name} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2 pl-2">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-gray-700 dark:text-gray-300 truncate">{d.name}</span>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 font-medium ml-2">
                      {totalPieVolume > 0 ? Math.round((d.value / totalPieVolume) * 100) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Top exercises */}
        {sortedExercises.length > 0 && (
          <section className="bg-gray-50 dark:bg-[#16213e] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">{t.stats.topExercises}</h2>
              <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-0.5">
                <button
                  onClick={() => setTopSort('volume')}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                    topSort === 'volume' ? 'bg-white dark:bg-[#1a1a2e] text-[#9333ea] shadow-sm' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {t.stats.byVolume}
                </button>
                <button
                  onClick={() => setTopSort('frequency')}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                    topSort === 'frequency' ? 'bg-white dark:bg-[#1a1a2e] text-[#9333ea] shadow-sm' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {t.stats.byFrequency}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {(showAllExercises ? sortedExercises : sortedExercises.slice(0, 5)).map((ex, i) => {
                const maxVal = topSort === 'volume'
                  ? sortedExercises[0]?.totalVolume || 1
                  : sortedExercises[0]?.timesPerformed || 1;
                const val = topSort === 'volume' ? ex.totalVolume : ex.timesPerformed;
                const pct = Math.round((val / maxVal) * 100);

                return (
                  <div
                    key={ex._id}
                    onClick={() => navigate(`/stats/exercise/${encodeURIComponent(ex._id)}`)}
                    className="cursor-pointer active:opacity-70 transition-opacity"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 w-5">{i + 1}</span>
                        <span className="font-medium text-sm text-gray-900 dark:text-white truncate max-w-[180px]">{ex._id}</span>
                        <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-[#9333ea]">
                        {topSort === 'volume'
                          ? `${formatVolume(ex.totalVolume)} ${t.stats.kg}`
                          : `${ex.timesPerformed} ${t.stats.times}`}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: CATEGORY_COLORS[ex.category] || '#9333ea',
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                      <span>{categoryLabel(ex.category)}</span>
                      <span>{ex.totalSets} {t.stats.sets}</span>
                      <span>max {ex.maxWeight} {t.stats.kg}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {sortedExercises.length > 5 && (
              <button
                onClick={() => setShowAllExercises(!showAllExercises)}
                className="w-full mt-3 py-2 text-sm font-medium text-[#9333ea] hover:bg-[#f3e8ff] rounded-xl transition-colors"
              >
                {showAllExercises
                  ? `${t.stats.showLess} \u25B2`
                  : `${t.stats.showAll} (${sortedExercises.length}) \u25BC`}
              </button>
            )}
          </section>
        )}

        {/* Monthly comparison */}
        <section className="bg-gray-50 dark:bg-[#16213e] rounded-2xl p-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">{t.stats.thisMonth} vs {t.stats.lastMonth}</h2>
          <div className="flex gap-3">
            <div className="flex-1 bg-white dark:bg-[#1a1a2e] rounded-xl p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-[#9333ea]">{summary.thisMonthWorkouts}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.stats.thisMonth}</p>
            </div>
            <div className="flex-1 bg-white dark:bg-[#1a1a2e] rounded-xl p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-gray-400">{summary.lastMonthWorkouts}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.stats.lastMonth}</p>
            </div>
            <div className="flex-1 bg-white dark:bg-[#1a1a2e] rounded-xl p-3 text-center shadow-sm">
              {(() => {
                const diff = summary.thisMonthWorkouts - summary.lastMonthWorkouts;
                const color = diff > 0 ? 'text-[#22c55e]' : diff < 0 ? 'text-[#ef4444]' : 'text-gray-400';
                const prefix = diff > 0 ? '+' : '';
                return (
                  <>
                    <p className={`text-2xl font-bold ${color}`}>{prefix}{diff}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">±</p>
                  </>
                );
              })()}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ───── OverviewCard ───── */
function OverviewCard({
  icon,
  iconBg,
  iconColor,
  value,
  unit,
  label,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  value: string;
  unit?: string;
  label: string;
}) {
  return (
    <div className="bg-gray-50 dark:bg-[#16213e] rounded-2xl p-4 flex flex-col gap-2">
      <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
        {unit && <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{unit}</span>}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}

export default Statistics;

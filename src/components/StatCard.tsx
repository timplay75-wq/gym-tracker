import type { ReactNode } from 'react';

type TrendDirection = 'up' | 'down' | 'neutral';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    direction: TrendDirection;
    value: string | number;
  };
  subtitle?: string;
  className?: string;
}

export function StatCard({ title, value, icon, trend, subtitle, className = '' }: StatCardProps) {
  const trendIcons = {
    up: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ),
    down: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
    neutral: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    ),
  };

  const trendColors = {
    up: 'text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-900/20',
    down: 'text-error-600 dark:text-error-400 bg-error-100 dark:bg-error-900/20',
    neutral: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800',
  };

  return (
    <div
      className={`
        bg-white dark:bg-gray-800
        rounded-xl p-6
        shadow-md hover:shadow-lg
        transition-all duration-300
        border border-gray-100 dark:border-gray-700
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Title */}
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>

          {/* Value */}
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {value}
          </p>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}

          {/* Trend */}
          {trend && (
            <div className={`
              inline-flex items-center gap-1 px-2 py-1 rounded-full mt-2
              ${trendColors[trend.direction]}
            `}>
              {trendIcons[trend.direction]}
              <span className="text-xs font-semibold">{trend.value}</span>
            </div>
          )}
        </div>

        {/* Icon */}
        {icon && (
          <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-xl text-primary-600 dark:text-primary-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

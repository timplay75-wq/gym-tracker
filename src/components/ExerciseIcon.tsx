import { getMuscleGroupEmoji, getEquipmentEmoji } from '../constants/emojis';
import { MUSCLE_ICONS, getMuscleIcon } from '../constants/muscleIcons';

interface ExerciseIconProps {
  /** Категория мышечной группы */
  muscleGroup?: string;
  /** Тип оборудования */
  equipment?: string;
  /** Кастомный эмодзи */
  emoji?: string;
  /** URL изображения */
  imageUrl?: string;
  /** Анатомическая иконка мышцы */
  anatomyIcon?: {
    category: keyof typeof MUSCLE_ICONS;
    muscle: string;
  };
  /** Размер иконки */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Дополнительные CSS классы */
  className?: string;
  /** Альтернативный текст для изображения */
  alt?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 text-lg',
  md: 'w-10 h-10 text-2xl',
  lg: 'w-14 h-14 text-4xl',
  xl: 'w-20 h-20 text-5xl',
};

/**
 * Компонент для отображения иконки упражнения
 * Поддерживает эмодзи, изображения и автоматический выбор иконки по категории
 */
export function ExerciseIcon({
  muscleGroup,
  equipment,
  emoji,
  imageUrl,
  anatomyIcon,
  size = 'md',
  className = '',
  alt = 'Exercise icon',
}: ExerciseIconProps) {
  const baseClasses = `
    inline-flex items-center justify-center
    rounded-xl
    bg-gradient-to-br from-primary-50 to-primary-100
    dark:from-primary-900/20 dark:to-primary-800/20
    border border-primary-200 dark:border-primary-700
    transition-all duration-200
    ${sizeClasses[size]}
  `;

  // Получить путь к анатомической иконке если указана
  const anatomyImageUrl = anatomyIcon 
    ? getMuscleIcon(anatomyIcon.category, anatomyIcon.muscle)
    : null;

  // Приоритет: anatomyIcon > imageUrl
  const finalImageUrl = anatomyImageUrl || imageUrl;

  // Если есть URL изображения (обычное или анатомическое)
  if (finalImageUrl) {
    return (
      <div className={`${baseClasses} ${className} overflow-hidden p-0`}>
        <img
          src={finalImageUrl}
          alt={alt}
          className="w-full h-full object-contain p-1"
          loading="lazy"
        />
      </div>
    );
  }

  // Определяем какой эмодзи показывать
  const displayEmoji = emoji || 
    (muscleGroup ? getMuscleGroupEmoji(muscleGroup) : undefined) ||
    (equipment ? getEquipmentEmoji(equipment) : undefined) ||
    '💪';

  return (
    <div 
      className={`${baseClasses} ${className}`}
      role="img"
      aria-label={alt}
    >
      <span className="select-none">{displayEmoji}</span>
    </div>
  );
}

// Дополнительные варианты компонента

interface CategoryBadgeProps {
  category: string;
  emoji?: string;
  className?: string;
}

/**
 * Бейдж категории с эмодзи
 */
export function CategoryBadge({ category, emoji, className = '' }: CategoryBadgeProps) {
  const displayEmoji = emoji || getMuscleGroupEmoji(category);
  
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1
        text-sm font-medium
        rounded-full
        bg-primary-100 dark:bg-primary-900/30
        text-primary-700 dark:text-primary-300
        border border-primary-200 dark:border-primary-700
        ${className}
      `}
    >
      <span className="text-base">{displayEmoji}</span>
      <span className="capitalize">{category}</span>
    </span>
  );
}

interface StatusBadgeProps {
  status: 'completed' | 'inProgress' | 'planned' | 'skipped';
  className?: string;
}

/**
 * Бейдж статуса с иконкой
 */
export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const statusConfig = {
    completed: { emoji: '✅', label: 'Выполнено', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
    inProgress: { emoji: '⏳', label: 'В процессе', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
    planned: { emoji: '📅', label: 'Запланировано', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
    skipped: { emoji: '⏭️', label: 'Пропущено', color: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300' },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1
        text-xs font-medium
        rounded-full
        ${config.color}
        ${className}
      `}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </span>
  );
}

interface AchievementBadgeProps {
  achievement: string;
  emoji?: string;
  unlocked?: boolean;
  className?: string;
}

/**
 * Бейдж достижения
 */
export function AchievementBadge({ 
  achievement, 
  emoji = '🏆', 
  unlocked = true,
  className = '' 
}: AchievementBadgeProps) {
  return (
    <div
      className={`
        inline-flex flex-col items-center gap-2 p-4
        rounded-2xl
        ${unlocked 
          ? 'bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20 border-2 border-yellow-400 dark:border-yellow-600' 
          : 'bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 opacity-50'
        }
        transition-all duration-300
        hover:scale-105
        ${className}
      `}
    >
      <span className={`text-4xl ${!unlocked && 'grayscale'}`}>{emoji}</span>
      <span className={`text-sm font-medium text-center ${unlocked ? 'text-yellow-900 dark:text-yellow-100' : 'text-gray-600 dark:text-gray-400'}`}>
        {achievement}
      </span>
    </div>
  );
}

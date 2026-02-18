import React from 'react';
import { ExerciseIcon } from './ExerciseIcon';
import { MUSCLE_ICONS } from '../constants/muscleIcons';

interface MuscleInfo {
  category: keyof typeof MUSCLE_ICONS;
  muscle: string;
  name?: string;
  isPrimary?: boolean; // Основная или вспомогательная мышца
}

interface MuscleGroupProps {
  /** Список задействованных мышц */
  muscles: MuscleInfo[];
  /** Размер иконок */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Показывать имена мышц */
  showLabels?: boolean;
  /** Вертикальное или горизонтальное расположение */
  layout?: 'horizontal' | 'vertical' | 'grid';
  /** Дополнительные CSS классы */
  className?: string;
}

/**
 * Компонент для отображения нескольких мышечных групп одновременно
 * Используется для упражнений, задействующих несколько мышц
 * 
 * @example
 * // Жим лёжа (грудь + трицепс + передние дельты)
 * <MuscleGroup 
 *   muscles={[
 *     { category: 'chest', muscle: 'pectoralisMajor', name: 'Грудь', isPrimary: true },
 *     { category: 'arms', muscle: 'tricepsBrachii', name: 'Трицепс', isPrimary: false },
 *     { category: 'shoulders', muscle: 'deltoidAnterior', name: 'Передние дельты', isPrimary: false }
 *   ]}
 *   showLabels
 * />
 */
export function MuscleGroup({
  muscles,
  size = 'md',
  showLabels = true,
  layout = 'horizontal',
  className = '',
}: MuscleGroupProps) {
  const layoutClasses = {
    horizontal: 'flex flex-row items-center gap-3',
    vertical: 'flex flex-col items-start gap-3',
    grid: 'grid grid-cols-2 gap-3',
  };

  return (
    <div className={`${layoutClasses[layout]} ${className}`}>
      {muscles.map((muscle, index) => (
        <div
          key={`${muscle.category}-${muscle.muscle}-${index}`}
          className="flex items-center gap-2"
        >
          <div className="relative">
            <ExerciseIcon
              anatomyIcon={{
                category: muscle.category,
                muscle: muscle.muscle,
              }}
              size={size}
              className={muscle.isPrimary ? 'ring-2 ring-primary-500' : 'opacity-75'}
            />
            {muscle.isPrimary && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white dark:border-gray-800" />
            )}
          </div>
          {showLabels && muscle.name && (
            <div className="flex flex-col">
              <span className={`text-sm ${muscle.isPrimary ? 'font-bold' : 'font-normal text-gray-600 dark:text-gray-400'}`}>
                {muscle.name}
              </span>
              {muscle.isPrimary && (
                <span className="text-xs text-primary-600 dark:text-primary-400">
                  Основная
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Упрощенный компонент для быстрого отображения основной и вспомогательных мышц
 */
interface SimpleMuscleGroupProps {
  primary: MuscleInfo;
  secondary?: MuscleInfo[];
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function SimpleMuscleGroup({
  primary,
  secondary = [],
  size = 'md',
  className = '',
}: SimpleMuscleGroupProps) {
  return (
    <MuscleGroup
      muscles={[
        { ...primary, isPrimary: true },
        ...secondary.map((m) => ({ ...m, isPrimary: false })),
      ]}
      size={size}
      showLabels
      layout="vertical"
      className={className}
    />
  );
}

/**
 * Компонент для отображения мышечной карты (анатомическая схема)
 * Показывает все мышцы с выделением активных
 */
interface MuscleMapProps {
  /** Активные (задействованные) мышцы */
  activeMuscles: MuscleInfo[];
  /** Показывать все мышцы или только активные */
  showAll?: boolean;
  /** Размер карты */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MuscleMap({
  activeMuscles,
  showAll = false,
  size = 'md',
  className = '',
}: MuscleMapProps) {
  const sizeClasses = {
    sm: 'w-32',
    md: 'w-48',
    lg: 'w-64',
  };

  // Группируем мышцы по категориям
  const musclesByCategory = activeMuscles.reduce((acc, muscle) => {
    if (!acc[muscle.category]) {
      acc[muscle.category] = [];
    }
    acc[muscle.category].push(muscle);
    return acc;
  }, {} as Record<string, MuscleInfo[]>);

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      {/* Передняя часть тела */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-2">
        <h4 className="text-xs font-bold mb-2 text-center">Передняя часть</h4>
        <div className="grid grid-cols-3 gap-2">
          {/* Грудь */}
          {musclesByCategory.chest?.length > 0 && (
            <div className="col-span-3 flex justify-center gap-1">
              {musclesByCategory.chest.map((m, i) => (
                <ExerciseIcon
                  key={i}
                  anatomyIcon={{ category: m.category, muscle: m.muscle }}
                  size="sm"
                  className={m.isPrimary ? 'ring-2 ring-primary-500' : ''}
                />
              ))}
            </div>
          )}
          {/* Плечи */}
          {musclesByCategory.shoulders?.length > 0 && (
            <div className="col-span-3 flex justify-center gap-2">
              {musclesByCategory.shoulders.map((m, i) => (
                <ExerciseIcon
                  key={i}
                  anatomyIcon={{ category: m.category, muscle: m.muscle }}
                  size="sm"
                  className={m.isPrimary ? 'ring-2 ring-primary-500' : ''}
                />
              ))}
            </div>
          )}
          {/* Руки */}
          {musclesByCategory.arms?.length > 0 && (
            <div className="col-span-3 flex justify-around">
              {musclesByCategory.arms.map((m, i) => (
                <ExerciseIcon
                  key={i}
                  anatomyIcon={{ category: m.category, muscle: m.muscle }}
                  size="sm"
                  className={m.isPrimary ? 'ring-2 ring-primary-500' : ''}
                />
              ))}
            </div>
          )}
          {/* Пресс */}
          {musclesByCategory.core?.length > 0 && (
            <div className="col-span-3 flex justify-center gap-1">
              {musclesByCategory.core.map((m, i) => (
                <ExerciseIcon
                  key={i}
                  anatomyIcon={{ category: m.category, muscle: m.muscle }}
                  size="sm"
                  className={m.isPrimary ? 'ring-2 ring-primary-500' : ''}
                />
              ))}
            </div>
          )}
          {/* Ноги */}
          {musclesByCategory.legs?.length > 0 && (
            <div className="col-span-3 flex justify-around">
              {musclesByCategory.legs.map((m, i) => (
                <ExerciseIcon
                  key={i}
                  anatomyIcon={{ category: m.category, muscle: m.muscle }}
                  size="sm"
                  className={m.isPrimary ? 'ring-2 ring-primary-500' : ''}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Задняя часть тела */}
      {musclesByCategory.back?.length > 0 && (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="text-xs font-bold mb-2 text-center">Задняя часть</h4>
          <div className="flex flex-col items-center gap-2">
            {musclesByCategory.back.map((m, i) => (
              <ExerciseIcon
                key={i}
                anatomyIcon={{ category: m.category, muscle: m.muscle }}
                size="sm"
                className={m.isPrimary ? 'ring-2 ring-primary-500' : ''}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

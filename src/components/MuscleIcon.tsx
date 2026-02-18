import { type MuscleGroup, MUSCLE_NAMES } from '../constants/muscleEmojis';

interface MuscleIconProps {
  muscle: MuscleGroup;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MuscleIcon = ({ 
  muscle, 
  size = 'md', 
  className = '' 
}: MuscleIconProps) => {
  // Размеры иконок в пикселях
  const sizes = {
    sm: 16,  // Размер обычного текста
    md: 20,  // Чуть крупнее
    lg: 24,  // Крупный
  };

  const iconSize = sizes[size];

  return (
    <img
      src={`/muscle-icons/${muscle}.png`}
      alt={MUSCLE_NAMES[muscle]}
      width={iconSize}
      height={iconSize}
      className={`inline-block ${className}`}
      style={{ verticalAlign: 'middle' }}
      onError={(e) => {
        // Если иконка не найдена, показываем placeholder
        e.currentTarget.style.display = 'none';
        e.currentTarget.insertAdjacentHTML(
          'afterend',
          `<span class="inline-block w-${iconSize} h-${iconSize} bg-gray-200 rounded" title="Иконка не найдена"></span>`
        );
      }}
    />
  );
};

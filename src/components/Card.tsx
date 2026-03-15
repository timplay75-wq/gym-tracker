import type { ReactNode } from 'react';

type CardVariant = 'default' | 'elevated' | 'glass' | 'interactive';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

export function Card({
  variant = 'default',
  padding = 'md',
  className = '',
  children,
  onClick,
}: CardProps) {
  // Variant styles (iOS Minimalist)
  const variantClasses = {
    default: 'bg-white dark:bg-[#16213e] shadow-sm',
    elevated: 'bg-white dark:bg-[#16213e] shadow-md transition-shadow duration-200',
    glass: 'bg-white/10 backdrop-blur-lg border border-primary-500',
    interactive: 'bg-white dark:bg-[#16213e] shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 active:scale-[0.99]',
  };

  // Padding styles
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

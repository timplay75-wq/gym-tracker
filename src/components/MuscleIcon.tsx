/**
 * SVG muscle-body icons. Each shows a simplified human silhouette
 * with the relevant muscle group highlighted in purple.
 */

interface Props {
  size?: number;
  className?: string;
}

const HEAD = <ellipse cx="24" cy="7.5" rx="5.5" ry="6" fill="none" stroke="#6b7280" strokeWidth="1.4" />;

function ChestIcon({ size = 44, className = '' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 60" fill="none" className={className}>
      {HEAD}
      <path d="M16 13C11 15 9 19 9 24v6h30v-6c0-5-2-9-7-11z" fill="#9333ea" opacity="0.9" />
      <path d="M9 30v13h7v11h4V43h8v11h4V43h7V30" stroke="#6b7280" strokeWidth="1.4" fill="none" />
      <path d="M16 13L8 21l-2 10M32 13l8 8 2 10" stroke="#6b7280" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function BackIcon({ size = 44, className = '' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 60" fill="none" className={className}>
      {HEAD}
      <path d="M16 13C11 15 9 19 9 24v16h30V24c0-5-2-9-7-11z" fill="#9333ea" opacity="0.9" />
      <path d="M9 40v3h7v11h4V43h8v11h4V43h7v-3" stroke="#6b7280" strokeWidth="1.4" fill="none" />
      <path d="M16 13L8 21l-2 10M32 13l8 8 2 10" stroke="#6b7280" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function LegsIcon({ size = 44, className = '' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 60" fill="none" className={className}>
      {HEAD}
      <path d="M16 13C11 15 9 19 9 25v10h30V25c0-6-2-10-7-12z" fill="none" stroke="#6b7280" strokeWidth="1.4" />
      <path d="M9 35v8h7v14h4V43h8v14h4V43h7v-8z" fill="#9333ea" opacity="0.9" />
      <path d="M16 13L8 21l-2 10M32 13l8 8 2 10" stroke="#6b7280" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ArmsIcon({ size = 44, className = '' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 60" fill="none" className={className}>
      {HEAD}
      <path d="M16 13C11 15 9 19 9 28v15h7v11h4V43h8v11h4V43h7V28c0-9-2-13-7-15z" fill="none" stroke="#6b7280" strokeWidth="1.4" />
      <path d="M16 13L7 22l-2 12 3 1 2-11 8-9z" fill="#9333ea" opacity="0.9" />
      <path d="M32 13l9 9 2 12-3 1-2-11-8-9z" fill="#9333ea" opacity="0.9" />
    </svg>
  );
}

function ShouldersIcon({ size = 44, className = '' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 60" fill="none" className={className}>
      {HEAD}
      <ellipse cx="10.5" cy="17" rx="5.5" ry="4.5" fill="#9333ea" opacity="0.9" transform="rotate(-20 10.5 17)" />
      <ellipse cx="37.5" cy="17" rx="5.5" ry="4.5" fill="#9333ea" opacity="0.9" transform="rotate(20 37.5 17)" />
      <path d="M16 13C13 15 10 18 9 22v21h7v11h4V43h8v11h4V43h7V22c-1-4-4-7-7-9z" fill="none" stroke="#6b7280" strokeWidth="1.4" />
      <path d="M10.5 21L7 30l-1 8M37.5 21l3 9 1 8" stroke="#6b7280" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function AbsIcon({ size = 44, className = '' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 60" fill="none" className={className}>
      {HEAD}
      <path d="M16 13C11 15 9 19 9 23v6h30v-6c0-4-2-8-7-10z" fill="none" stroke="#6b7280" strokeWidth="1.4" />
      <path d="M9 29v14h30V29z" fill="#9333ea" opacity="0.9" />
      <line x1="24" y1="29" x2="24" y2="43" stroke="white" strokeWidth="0.9" opacity="0.5" />
      <line x1="9" y1="34" x2="39" y2="34" stroke="white" strokeWidth="0.9" opacity="0.5" />
      <line x1="9" y1="39" x2="39" y2="39" stroke="white" strokeWidth="0.9" opacity="0.5" />
      <path d="M9 43v1h7v11h4V44h8v11h4V44h7v-1" stroke="#6b7280" strokeWidth="1.4" fill="none" />
      <path d="M16 13L8 21l-2 10M32 13l8 8 2 10" stroke="#6b7280" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function CardioIcon({ size = 44, className = '' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 60" fill="none" className={className}>
      {HEAD}
      <path d="M16 13C11 15 9 19 9 28v15h7v11h4V43h8v11h4V43h7V28c0-9-2-13-7-15z" fill="none" stroke="#6b7280" strokeWidth="1.4" />
      <path d="M24 33c0 0-9-5.5-9-11 0-2.8 2.2-5 5-5 1.8 0 3.2.9 4 2.2A4.8 4.8 0 0128 17c2.8 0 5 2.2 5 5 0 5.5-9 11-9 11z" fill="#9333ea" opacity="0.95" />
      <path d="M16 13L8 21l-2 10M32 13l8 8 2 10" stroke="#6b7280" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function StretchingIcon({ size = 44, className = '' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 60" fill="none" className={className}>
      {HEAD}
      <path d="M16 13C11 15 9 19 9 28v15h7v11h4V43h8v11h4V43h7V28c0-9-2-13-7-15z" fill="#9333ea" opacity="0.3" stroke="#9333ea" strokeWidth="1.4" />
      <path d="M16 13L5 19l-2 13 3 .5L8 21l9-9z" fill="#9333ea" opacity="0.7" />
      <path d="M32 13l11 6 2 13-3 .5L40 21l-9-9z" fill="#9333ea" opacity="0.7" />
    </svg>
  );
}

// ─── Public map ───────────────────────────────────────────────────────────────

export const CATEGORY_ICONS: Record<string, (props: Props) => JSX.Element> = {
  chest:      ChestIcon,
  back:       BackIcon,
  legs:       LegsIcon,
  arms:       ArmsIcon,
  shoulders:  ShouldersIcon,
  abs:        AbsIcon,
  cardio:     CardioIcon,
  stretching: StretchingIcon,
};

/** Convenience component: pass category id as `muscle` prop */
export function MuscleIcon({ muscle, size = 44, className = '' }: { muscle: string; size?: number; className?: string }) {
  const Icon = CATEGORY_ICONS[muscle];
  if (!Icon) return null;
  return <Icon size={size} className={className} />;
}

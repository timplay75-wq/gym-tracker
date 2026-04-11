import type { ReactElement } from 'react';

/**
 * Muscle-group icons matching Leonardo.ai line-art style.
 * Uses currentColor — auto white in dark theme, dark in light theme.
 */

interface Props {
  size?: number;
  className?: string;
}

const S = 'currentColor';

/* ── Chest: front torso, solid pecs, line-art outline ───── */
function ChestIcon({ size = 40, className = '' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={S} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* collarbone / shoulder outline */}
      <path d="M8 16c4-6 10-10 16-12M56 16c-4-6-10-10-16-12" />
      {/* outer torso */}
      <path d="M8 16c-2 6-3 14-2 22 1 6 3 10 6 14M56 16c2 6 3 14 2 22-1 6-3 10-6 14" />
      {/* deltoid hints */}
      <path d="M6 18c-2 3-3 6-2 10M58 18c2 3 3 6 2 10" />
      {/* solid pec muscles */}
      <path d="M14 18c2-2 6-4 10-4 3 0 5 1 7 3 1 2 1 5-1 8-2 3-5 5-9 6-4 1-7 0-9-2-2-2-2-5-1-8 1-2 2-3 3-3z" fill={S} stroke="none" />
      <path d="M50 18c-2-2-6-4-10-4-3 0-5 1-7 3-1 2-1 5 1 8 2 3 5 5 9 6 4 1 7 0 9-2 2-2 2-5 1-8-1-2-2-3-3-3z" fill={S} stroke="none" />
      {/* sternum line */}
      <line x1="32" y1="8" x2="32" y2="50" strokeWidth="1.5" />
      {/* pec lower crease */}
      <path d="M18 30c4 2 8 2 13 0M46 30c-4 2-8 2-13 0" />
      {/* abs hint lines */}
      <path d="M26 36h12M26 42h12M26 48h12" strokeWidth="1" opacity="0.5" />
      {/* side serratus */}
      <path d="M12 28c2 1 3 3 4 5M52 28c-2 1-3 3-4 5" strokeWidth="1.5" />
      <path d="M14 34c1 1 2 2 3 3M50 34c-1 1-2 2-3 3" strokeWidth="1.5" />
    </svg>
  );
}

/* ── Back: rear torso, lats + spine ─────────────────────── */
function BackIcon({ size = 40, className = '' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={S} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* neck */}
      <path d="M28 4c2-1 4-1 8 0" />
      {/* trapezius */}
      <path d="M28 4c-6 2-12 4-18 10M36 4c6 2 12 4 18 10" />
      {/* shoulder caps */}
      <path d="M10 14c-3 2-5 5-6 9M54 14c3 2 5 5 6 9" />
      {/* outer torso */}
      <path d="M4 23c0 8 2 16 6 24 2 4 5 7 8 9M60 23c0 8-2 16-6 24-2 4-5 7-8 9" />
      {/* waist taper */}
      <path d="M18 56c4 1 8 2 14 2s10-1 14-2" />
      {/* spine line with arrow */}
      <line x1="32" y1="6" x2="32" y2="52" strokeWidth="1.5" />
      <path d="M30 48l2 6 2-6" strokeWidth="1.5" />
      {/* scapula lines */}
      <path d="M20 16c2 4 2 10 0 16M44 16c-2 4-2 10 0 16" />
      {/* lat outline inner */}
      <path d="M24 18c-4 4-6 10-7 18M40 18c4 4 6 10 7 18" />
      {/* lower back crease */}
      <path d="M22 42c3-2 6-3 10-3s7 1 10 3" strokeWidth="1.5" />
      {/* rib hints */}
      <path d="M16 22c2 0 4 1 6 2M48 22c-2 0-4 1-6 2" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

/* ── Legs: only legs from waist down ────────────────────── */
function LegsIcon({ size = 40, className = '' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={S} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* waistband */}
      <path d="M10 4h44" strokeWidth="2.5" />
      {/* left leg outer */}
      <path d="M10 4c-1 8-2 16-2 26 0 8 1 14 2 20l2 10" />
      {/* left leg inner */}
      <path d="M28 4c-1 8-2 18-3 26-1 8 0 14 1 20l1 10" />
      {/* right leg outer */}
      <path d="M54 4c1 8 2 16 2 26 0 8-1 14-2 20l-2 10" />
      {/* right leg inner */}
      <path d="M36 4c1 8 2 18 3 26 1 8 0 14-1 20l-1 10" />
      {/* quad muscle solid fill left */}
      <path d="M12 8c-1 6-1 12 0 18 1 4 3 6 6 7 3 0 5-2 7-6 1-5 1-12 0-18-2-1-4-2-7-2s-5 1-6 1z" fill={S} stroke="none" opacity="0.85" />
      {/* quad muscle solid fill right */}
      <path d="M52 8c1 6 1 12 0 18-1 4-3 6-6 7-3 0-5-2-7-6-1-5-1-12 0-18 2-1 4-2 7-2s5 1 6 1z" fill={S} stroke="none" opacity="0.85" />
      {/* knee caps */}
      <ellipse cx="18" cy="34" rx="4" ry="2.5" strokeWidth="1.5" />
      <ellipse cx="46" cy="34" rx="4" ry="2.5" strokeWidth="1.5" />
      {/* calf muscle hints */}
      <path d="M14 38c-1 4-1 8 0 12M22 38c1 4 1 8 0 12" strokeWidth="1" opacity="0.6" />
      <path d="M50 38c1 4 1 8 0 12M42 38c-1 4-1 8 0 12" strokeWidth="1" opacity="0.6" />
      {/* center gap */}
      <path d="M32 4v6" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

/* ── Arms: single bent arm, bicep curl pose ─────────────── */
function ArmsIcon({ size = 40, className = '' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={S} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* shoulder deltoid cap */}
      <path d="M48 20c6-4 10-8 10-14 0-3-2-5-5-4" />
      {/* upper arm back (tricep side) */}
      <path d="M53 2c-4 4-10 12-14 22" />
      {/* upper arm front (bicep side) */}
      <path d="M48 20c-2 2-4 3-6 4" />
      {/* bicep peak bulge */}
      <path d="M42 24c-4 1-8 0-10-4-2-4-2-10 0-14" />
      {/* elbow area */}
      <path d="M39 24c-2 1-3 1-5 0" />
      {/* forearm */}
      <path d="M32 6c-4 2-8 4-12 4" />
      <path d="M34 24c-6 1-12-2-16-6" />
      {/* fist */}
      <path d="M20 10c-3-1-5-1-6 1-2 2-1 4 1 6 2 1 4 1 5-1" />
      {/* bicep muscle separation line */}
      <path d="M36 8c-1 4-1 10 2 14" strokeWidth="1.5" opacity="0.5" />
      {/* tricep detail */}
      <path d="M46 10c-1 3-2 7-3 10" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

/* ── Shoulders: front torso, solid delts ────────────────── */
function ShouldersIcon({ size = 40, className = '' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={S} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* neck */}
      <path d="M28 8c2-2 4-2 8 0" />
      {/* trapezius slope */}
      <path d="M28 8c-4 1-8 3-12 6M36 8c4 1 8 3 12 6" />
      {/* left deltoid solid */}
      <path d="M6 14c-2 3-3 7-2 12 1 4 3 7 6 9 3 1 6 0 8-3 2-3 3-8 2-12-1-4-4-6-7-7-3-1-5 0-7 1z" fill={S} stroke="none" />
      {/* right deltoid solid */}
      <path d="M58 14c2 3 3 7 2 12-1 4-3 7-6 9-3 1-6 0-8-3-2-3-3-8-2-12 1-4 4-6 7-7 3-1 5 0 7 1z" fill={S} stroke="none" />
      {/* deltoid 3-head separation left */}
      <path d="M10 14c1 4 1 8 0 12M14 13c0 4-1 9-2 13" stroke={S} strokeWidth="1" opacity="0.3" />
      {/* deltoid 3-head separation right */}
      <path d="M54 14c-1 4-1 8 0 12M50 13c0 4 1 9 2 13" stroke={S} strokeWidth="1" opacity="0.3" />
      {/* upper arm lines */}
      <path d="M12 34c0 6 0 12 1 18M52 34c0 6 0 12-1 18" strokeWidth="1.5" opacity="0.4" />
      <path d="M20 34c0 6 0 12-1 18M44 34c0 6 0 12 1 18" strokeWidth="1.5" opacity="0.4" />
      {/* torso outline */}
      <path d="M20 14v40M44 14v40" strokeWidth="1" opacity="0.25" />
      {/* collarbone */}
      <path d="M16 12c5-1 10-1 16-1s11 0 16 1" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}

/* ── Abs: isolated six-pack ─────────────────────────────── */
function AbsIcon({ size = 40, className = '' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={S} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* outer torso shape - just midsection */}
      <path d="M16 2c-4 2-6 6-7 12-1 8 0 16 2 24 2 6 5 12 9 16 3 3 7 5 12 5s9-2 12-5c4-4 7-10 9-16 2-8 3-16 2-24-1-6-3-10-7-12" />
      {/* linea alba center line */}
      <line x1="32" y1="4" x2="32" y2="56" strokeWidth="2" />
      {/* six-pack blocks - left */}
      <rect x="20" y="8" width="10" height="10" rx="2" fill={S} stroke="none" opacity="0.8" />
      <rect x="20" y="22" width="10" height="10" rx="2" fill={S} stroke="none" opacity="0.8" />
      <rect x="20" y="36" width="10" height="10" rx="2" fill={S} stroke="none" opacity="0.8" />
      {/* six-pack blocks - right */}
      <rect x="34" y="8" width="10" height="10" rx="2" fill={S} stroke="none" opacity="0.8" />
      <rect x="34" y="22" width="10" height="10" rx="2" fill={S} stroke="none" opacity="0.8" />
      <rect x="34" y="36" width="10" height="10" rx="2" fill={S} stroke="none" opacity="0.8" />
      {/* V-cut at bottom */}
      <path d="M22 50c3 3 6 5 10 6 4-1 7-3 10-6" strokeWidth="1.5" />
      {/* obliques side lines */}
      <path d="M14 16c-1 4-1 8 0 12M50 16c1 4 1 8 0 12" strokeWidth="1.5" opacity="0.4" />
      <path d="M12 30c0 4 1 8 3 12M52 30c0 4-1 8-3 12" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}

/* ── Cardio: torso outline with anatomical heart ────────── */
function CardioIcon({ size = 40, className = '' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={S} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* shoulder / collarbone */}
      <path d="M6 14c6-4 12-8 20-10M58 14c-6-4-12-8-20-10" />
      {/* torso sides */}
      <path d="M6 14c-2 6-2 14-1 22 1 6 3 10 5 14M58 14c2 6 2 14 1 22-1 6-3 10-5 14" />
      {/* waist */}
      <path d="M10 50c6 2 12 4 22 4s16-2 22-4" />
      {/* navel */}
      <ellipse cx="32" cy="44" rx="1.5" ry="1" strokeWidth="1" />
      {/* anatomical heart */}
      <g transform="translate(22,14)" strokeWidth="1.8">
        <path d="M10 18C4 14 0 10 0 6 0 2 3 0 6 0c2 0 3 1 4 3C11 1 12 0 14 0c3 0 6 2 6 6 0 4-4 8-10 12z" fill={S} stroke="none" opacity="0.15" />
        <path d="M10 18C4 14 0 10 0 6 0 2 3 0 6 0c2 0 3 1 4 3C11 1 12 0 14 0c3 0 6 2 6 6 0 4-4 8-10 12z" />
        {/* aorta */}
        <path d="M8 2c-1-2 0-3 2-3M12 2c1-2 0-3-2-3" strokeWidth="1.5" />
        {/* ventricle line */}
        <path d="M10 6v8" strokeWidth="1" opacity="0.5" />
        {/* pulse arcs */}
        <path d="M-3 8c-1-2-1-4 0-6M23 8c1-2 1-4 0-6" strokeWidth="1" opacity="0.4" />
      </g>
      {/* rib hints */}
      <path d="M14 20c3-1 6-1 8 0M50 20c-3-1-6-1-8 0" strokeWidth="1" opacity="0.3" />
      <path d="M12 26c4-1 7-1 10 0M52 26c-4-1-7-1-10 0" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

/* ── Stretching: rolled yoga mat ────────────────────────── */
function StretchingIcon({ size = 40, className = '' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={S} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* mat flat part */}
      <path d="M8 42l22-14 28 10-22 14z" />
      {/* mat thickness */}
      <path d="M8 42l0-2 22-14 0 2" strokeWidth="1.5" />
      <path d="M58 38l0-2-22-14 0 2" strokeWidth="1.5" opacity="0.5" />
      {/* rolled part cylinder */}
      <ellipse cx="22" cy="24" rx="12" ry="5" />
      <path d="M10 24c0-4 5-7 12-7s12 3 12 7" />
      {/* spiral on roll end */}
      <ellipse cx="13" cy="24" rx="5" ry="5" />
      <ellipse cx="13" cy="24" rx="3" ry="3" opacity="0.6" />
      <circle cx="13" cy="24" r="1.2" fill={S} stroke="none" />
      {/* roll texture lines */}
      <path d="M18 19c0 2 0 8 0 10M24 20c0 2 0 6 0 8" strokeWidth="1" opacity="0.4" />
      {/* mat strap */}
      <ellipse cx="28" cy="36" rx="2" ry="1" strokeWidth="1.5" />
    </svg>
  );
}

// ─── Public map ───────────────────────────────────────────────────────────────

export const CATEGORY_ICONS: Record<string, (props: Props) => ReactElement> = {
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
export function MuscleIcon({ muscle, size = 40, className = '' }: { muscle: string; size?: number; className?: string }) {
  const Icon = CATEGORY_ICONS[muscle];
  if (!Icon) return null;
  return <Icon size={size} className={className} />;
}

import type { ReactElement } from 'react';

/**
 * Muscle-group icons — PNG from Leonardo.ai where available,
 * SVG fallback for the rest. PNG icons use CSS invert for dark mode.
 */

interface Props {
  size?: number;
  className?: string;
}

const S = 'currentColor';

/* ── PNG icon wrapper ───────────────────────────────────── */
function PngIcon({ src, size = 40, className = '' }: Props & { src: string }) {
  return (
    <img
      src={src}
      width={size}
      height={size}
      alt=""
      className={`dark:invert ${className}`}
      style={{ objectFit: 'contain' }}
    />
  );
}

/* ── Categories with PNG icons ──────────────────────────── */

function ChestIcon({ size = 40, className = '' }: Props) {
  return <PngIcon src="/muscle-icons/chest.jpg" size={size} className={className} />;
}

function BackIcon({ size = 40, className = '' }: Props) {
  return <PngIcon src="/muscle-icons/back.jpg" size={size} className={className} />;
}

function ArmsIcon({ size = 40, className = '' }: Props) {
  return <PngIcon src="/muscle-icons/arms-light.jpg" size={size} className={className} />;
}

function CardioIcon({ size = 40, className = '' }: Props) {
  return <PngIcon src="/muscle-icons/cardio.jpg" size={size} className={className} />;
}

function StretchingIcon({ size = 40, className = '' }: Props) {
  return <PngIcon src="/muscle-icons/stretching.jpg" size={size} className={className} />;
}

/* ── SVG fallbacks for missing PNGs ─────────────────────── */
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

/* ── Shoulders: front torso, solid delts (SVG fallback) ─── */
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

import type { ReactElement } from 'react';

/**
 * Anatomical muscle-group icons — isolated muscle illustrations.
 * Uses currentColor so they adapt to light/dark mode automatically.
 */

interface Props {
  size?: number;
  className?: string;
}

/* ── Chest: pectoral muscles front view ─────────────────── */
function ChestIcon({ size = 40, className = '' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="currentColor" className={className}>
      {/* left pec */}
      <path d="M10 22c0-4 3-8 8-10 4-1.5 9-1 12 2 2 2 2.5 5 2 8-.5 3-3 6-7 8-4 2-9 2-12 0-2-1.5-3-4.5-3-8z" />
      {/* right pec */}
      <path d="M54 22c0-4-3-8-8-10-4-1.5-9-1-12 2-2 2-2.5 5-2 8 .5 3 3 6 7 8 4 2 9 2 12 0 2-1.5 3-4.5 3-8z" />
      {/* sternum line */}
      <path d="M32 11v22" stroke="currentColor" strokeWidth="1.2" opacity="0.3" fill="none" />
      {/* muscle fiber lines left */}
      <path d="M16 16c4 1 8 3 10 6M14 22c4 0 8 1 11 3M16 28c3-1 7-1 10 0" stroke="currentColor" strokeWidth="0.8" opacity="0.2" fill="none" />
      {/* muscle fiber lines right */}
      <path d="M48 16c-4 1-8 3-10 6M50 22c-4 0-8 1-11 3M48 28c-3-1-7-1-10 0" stroke="currentColor" strokeWidth="0.8" opacity="0.2" fill="none" />
      {/* lower chest shadow */}
      <path d="M15 30c5 3 12 4 17 3M49 30c-5 3-12 4-17 3" stroke="currentColor" strokeWidth="1" opacity="0.15" fill="none" />
      {/* collarbone hints */}
      <path d="M8 12c6-2 14-3 24-3 10 0 18 1 24 3" stroke="currentColor" strokeWidth="1.5" opacity="0.2" fill="none" />
      {/* abs hint below */}
      <path d="M24 36v14M32 34v18M40 36v14" stroke="currentColor" strokeWidth="0.8" opacity="0.12" fill="none" />
      <path d="M22 40h20M22 46h20" stroke="currentColor" strokeWidth="0.8" opacity="0.1" fill="none" />
    </svg>
  );
}

/* ── Back: lats + traps ─────────────────────────────────── */
function BackIcon({ size = 40, className = '' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="currentColor" className={className}>
      {/* trapezius */}
      <path d="M24 4c-3 2-8 6-12 14-2 4-3 8-2 10 2 0 6-5 10-8 3-2 6-4 12-4s9 2 12 4c4 3 8 8 10 8 1-2 0-6-2-10C48 10 43 6 40 4c-3-1-5-1-8-1s-5 0-8 1z" />
      {/* left lat */}
      <path d="M8 28c-1 4 0 10 2 16 2 5 5 9 8 11 3 2 6 2 8 0 2-3 3-7 3-12 0-4-1-8-3-11-3-4-7-6-11-6-3 0-6 0-7 2z" />
      {/* right lat */}
      <path d="M56 28c1 4 0 10-2 16-2 5-5 9-8 11-3 2-6 2-8 0-2-3-3-7-3-12 0-4 1-8 3-11 3-4 7-6 11-6 3 0 6 0 7 2z" />
      {/* spine */}
      <path d="M32 8v50" stroke="currentColor" strokeWidth="1.2" opacity="0.25" fill="none" />
      {/* muscle striations */}
      <path d="M12 32c3-1 6 0 9 2M14 38c3-1 6 0 8 2M16 44c2-1 4 0 6 1" stroke="currentColor" strokeWidth="0.7" opacity="0.2" fill="none" />
      <path d="M52 32c-3-1-6 0-9 2M50 38c-3-1-6 0-8 2M48 44c-2-1-4 0-6 1" stroke="currentColor" strokeWidth="0.7" opacity="0.2" fill="none" />
    </svg>
  );
}

/* ── Legs: quads + hams ─────────────────────────────────── */
function LegsIcon({ size = 40, className = '' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="currentColor" className={className}>
      {/* left quad */}
      <path d="M10 4c-2 4-3 10-3 18 0 8 1 14 3 20 2 5 4 8 7 10 2 1 5 1 7-1 2-3 3-8 3-14 0-6-1-13-3-18-2-6-5-10-8-13-2-2-4-3-6-2z" />
      {/* right quad */}
      <path d="M54 4c2 4 3 10 3 18 0 8-1 14-3 20-2 5-4 8-7 10-2 1-5 1-7-1-2-3-3-8-3-14 0-6 1-13 3-18 2-6 5-10 8-13 2-2 4-3 6-2z" />
      {/* inner separation */}
      <path d="M27 8c1 8 2 18 2 26s-1 14-2 18M37 8c-1 8-2 18-2 26s1 14 2 18" stroke="currentColor" strokeWidth="0.8" opacity="0.2" fill="none" />
      {/* quad muscle divisions */}
      <path d="M14 14c2 4 3 10 3 16M12 30c2 2 5 4 8 4" stroke="currentColor" strokeWidth="0.7" opacity="0.18" fill="none" />
      <path d="M50 14c-2 4-3 10-3 16M52 30c-2 2-5 4-8 4" stroke="currentColor" strokeWidth="0.7" opacity="0.18" fill="none" />
      {/* calf hints */}
      <path d="M18 52c0 3 1 6 3 9M46 52c0 3-1 6-3 9" stroke="currentColor" strokeWidth="1.5" opacity="0.15" fill="none" />
      {/* knee caps */}
      <ellipse cx="21" cy="44" rx="3" ry="2" opacity="0.12" />
      <ellipse cx="43" cy="44" rx="3" ry="2" opacity="0.12" />
    </svg>
  );
}

/* ── Arms: bicep + tricep ───────────────────────────────── */
function ArmsIcon({ size = 40, className = '' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="currentColor" className={className}>
      {/* left arm — bicep */}
      <path d="M8 8c-3 5-4 12-3 20 1 6 3 11 6 15 3 3 6 5 9 4 3-1 5-4 5-9 0-5-2-11-4-16-3-6-6-10-9-13-2-2-3-2-4-1z" />
      {/* right arm — bicep */}
      <path d="M56 8c3 5 4 12 3 20-1 6-3 11-6 15-3 3-6 5-9 4-3-1-5-4-5-9 0-5 2-11 4-16 3-6 6-10 9-13 2-2 3-2 4-1z" />
      {/* bicep peak left */}
      <path d="M10 18c2-1 5 1 7 5 2 3 3 7 2 10" stroke="currentColor" strokeWidth="0.8" opacity="0.2" fill="none" />
      {/* bicep peak right */}
      <path d="M54 18c-2-1-5 1-7 5-2 3-3 7-2 10" stroke="currentColor" strokeWidth="0.8" opacity="0.2" fill="none" />
      {/* forearms */}
      <path d="M18 46c1 4 2 8 4 12 1 2 2 3 4 4M46 46c-1 4-2 8-4 12-1 2-2 3-4 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" fill="none" />
      {/* muscle split line */}
      <path d="M12 12c0 8 1 16 4 24M52 12c0 8-1 16-4 24" stroke="currentColor" strokeWidth="0.7" opacity="0.15" fill="none" />
      {/* fist hints */}
      <circle cx="26" cy="60" r="3" opacity="0.2" />
      <circle cx="38" cy="60" r="3" opacity="0.2" />
    </svg>
  );
}

/* ── Shoulders: deltoids ────────────────────────────────── */
function ShouldersIcon({ size = 40, className = '' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="currentColor" className={className}>
      {/* left deltoid - 3 heads */}
      <path d="M6 18c-1-5 2-10 7-14 4-3 8-3 11-1 2 2 3 5 2 9-1 4-4 8-8 11-4 2-7 3-10 1-2-1-2-3-2-6z" />
      {/* right deltoid */}
      <path d="M58 18c1-5-2-10-7-14-4-3-8-3-11-1-2 2-3 5-2 9 1 4 4 8 8 11 4 2 7 3 10 1 2-1 2-3 2-6z" />
      {/* front delt division left */}
      <path d="M14 6c0 4-1 8-3 12" stroke="currentColor" strokeWidth="0.8" opacity="0.2" fill="none" />
      {/* rear delt division left */}
      <path d="M10 8c1 4 0 8-1 12" stroke="currentColor" strokeWidth="0.8" opacity="0.2" fill="none" />
      {/* front delt division right */}
      <path d="M50 6c0 4 1 8 3 12" stroke="currentColor" strokeWidth="0.8" opacity="0.2" fill="none" />
      {/* rear delt division right */}
      <path d="M54 8c-1 4 0 8 1 12" stroke="currentColor" strokeWidth="0.8" opacity="0.2" fill="none" />
      {/* neck / trap connection */}
      <path d="M22 4c3-2 6-3 10-3s7 1 10 3" stroke="currentColor" strokeWidth="2" opacity="0.25" fill="none" />
      {/* upper arm connection */}
      <path d="M16 24c-1 6-2 12-2 18M48 24c1 6 2 12 2 18" stroke="currentColor" strokeWidth="2" opacity="0.18" fill="none" />
      {/* torso hint */}
      <path d="M22 10v40M42 10v40" stroke="currentColor" strokeWidth="1" opacity="0.08" fill="none" />
    </svg>
  );
}

/* ── Abs: six-pack ──────────────────────────────────────── */
function AbsIcon({ size = 40, className = '' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="currentColor" className={className}>
      {/* outer abs shape */}
      <path d="M18 2c-4 2-7 6-8 12v14c0 6 1 12 4 18 2 4 5 8 8 10 3 2 6 3 10 3s7-1 10-3c3-2 6-6 8-10 3-6 4-12 4-18V14c-1-6-4-10-8-12-3-2-7-2-10-2s-7 0-10 2z" opacity="0.85" />
      {/* linea alba (center line) */}
      <path d="M32 4v54" stroke="currentColor" strokeWidth="2.5" opacity="0.15" fill="none" />
      {/* horizontal separations — the "packs" */}
      <path d="M20 16h24" stroke="currentColor" strokeWidth="2" opacity="0.15" fill="none" />
      <path d="M19 28h26" stroke="currentColor" strokeWidth="2" opacity="0.15" fill="none" />
      <path d="M20 40h24" stroke="currentColor" strokeWidth="2" opacity="0.15" fill="none" />
      {/* serratus hints on sides */}
      <path d="M16 14c-3 2-4 6-4 10M48 14c3 2 4 6 4 10" stroke="currentColor" strokeWidth="1" opacity="0.15" fill="none" />
      <path d="M14 26c-2 3-2 6-1 9M50 26c2 3 2 6 1 9" stroke="currentColor" strokeWidth="1" opacity="0.15" fill="none" />
      {/* V-cut at bottom */}
      <path d="M24 48c3 4 5 6 8 7 3-1 5-3 8-7" stroke="currentColor" strokeWidth="1" opacity="0.18" fill="none" />
    </svg>
  );
}

/* ── Cardio: heart with pulse ───────────────────────────── */
function CardioIcon({ size = 40, className = '' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="currentColor" className={className}>
      {/* heart */}
      <path d="M32 56C16 42 4 32 4 20 4 12 10 4 18 4c5 0 10 3 14 9C36 7 41 4 46 4c8 0 14 8 14 16 0 12-12 22-28 36z" />
      {/* heartbeat line */}
      <path d="M8 30h12l3-8 4 16 4-12 3 6h14" stroke="currentColor" strokeWidth="2" opacity="0.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* heart shine */}
      <path d="M18 14c-3 1-5 4-5 8" stroke="currentColor" strokeWidth="1.5" opacity="0.15" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ── Stretching: flexible figure ────────────────────────── */
function StretchingIcon({ size = 40, className = '' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="currentColor" className={className}>
      {/* head */}
      <circle cx="32" cy="8" r="6" />
      {/* torso - curved stretch */}
      <path d="M32 14c-2 6-6 12-4 22 1 5 3 8 4 10" strokeWidth="5" stroke="currentColor" fill="none" strokeLinecap="round" />
      {/* right arm - reaching up */}
      <path d="M30 18c6-4 14-8 22-6" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" />
      {/* left arm - reaching down */}
      <path d="M28 22c-6 2-12 6-16 12" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" />
      {/* right leg - lunge */}
      <path d="M32 46c4 2 10 6 16 10" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" />
      {/* left leg - extended */}
      <path d="M30 44c-4 4-12 8-18 8" strokeWidth="4.5" stroke="currentColor" fill="none" strokeLinecap="round" />
      {/* movement arcs */}
      <path d="M52 8c2 2 3 4 2 6M56 10c1 1 1 3 0 4" stroke="currentColor" strokeWidth="1.5" opacity="0.25" fill="none" strokeLinecap="round" />
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

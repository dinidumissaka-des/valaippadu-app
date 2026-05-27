export type Zone = 'GO' | 'CAUTION' | 'STOP';

export const ZONE_COLORS = {
  GO:      { primary: '#16a34a', background: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  CAUTION: { primary: '#d97706', background: '#fffbeb', text: '#b45309', border: '#fde68a' },
  STOP:    { primary: '#dc2626', background: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
} as const;

export const PALETTE = {
  bg:            '#f8fafc',   // slate-50
  surface:       '#ffffff',
  border:        '#e2e8f0',   // slate-200
  borderStrong:  '#cbd5e1',   // slate-300
  textPrimary:   '#0f172a',   // slate-900
  textSecondary: '#64748b',   // slate-500
  textMuted:     '#94a3b8',   // slate-400
  live:          '#16a34a',   // green-600
  simulated:     '#94a3b8',   // slate-400
  accent:        '#0ea5e9',   // sky-500
} as const;

export function getZone(score: number): Zone {
  if (score >= 75) return 'GO';
  if (score >= 40) return 'CAUTION';
  return 'STOP';
}

// Expo Router template compatibility
export default {
  light: { text: '#0f172a', background: '#f8fafc', tint: '#16a34a', tabIconDefault: '#94a3b8', tabIconSelected: '#16a34a' },
  dark:  { text: '#0f172a', background: '#f8fafc', tint: '#16a34a', tabIconDefault: '#94a3b8', tabIconSelected: '#16a34a' },
};

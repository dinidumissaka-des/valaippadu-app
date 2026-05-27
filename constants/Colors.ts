export type Zone = 'GO' | 'CAUTION' | 'STOP';

export const ZONE_COLORS = {
  GO:      { primary: '#22c55e', background: '#052e16', text: '#86efac' },
  CAUTION: { primary: '#f59e0b', background: '#451a03', text: '#fcd34d' },
  STOP:    { primary: '#ef4444', background: '#450a0a', text: '#fca5a5' },
} as const;

export const PALETTE = {
  bg:            '#0a0f1e',
  surface:       '#111827',
  border:        '#1e293b',
  textPrimary:   '#f1f5f9',
  textSecondary: '#94a3b8',
  live:          '#22c55e',
  simulated:     '#64748b',
} as const;

export function getZone(score: number): Zone {
  if (score >= 75) return 'GO';
  if (score >= 40) return 'CAUTION';
  return 'STOP';
}

// Kept for Expo Router template compatibility
export default {
  light: { text: '#f1f5f9', background: '#0a0f1e', tint: '#22c55e', tabIconDefault: '#475569', tabIconSelected: '#22c55e' },
  dark:  { text: '#f1f5f9', background: '#0a0f1e', tint: '#22c55e', tabIconDefault: '#475569', tabIconSelected: '#22c55e' },
};

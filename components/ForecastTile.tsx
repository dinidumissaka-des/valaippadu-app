'use client';
import { ZONE_COLORS } from '../constants/Colors';
import { ForecastDay } from '../services/cssCalculator';

const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TODAY    = new Date().toISOString().split('T')[0];

interface Props {
  day:      ForecastDay;
  onPress?: () => void;
}

export function ForecastTile({ day, onPress }: Props) {
  const colors  = ZONE_COLORS[day.zone];
  const isToday = day.date === TODAY;
  const label   = isToday ? 'Today' : DAY_ABBR[new Date(day.date + 'T00:00:00').getDay()];

  return (
    <button
      onClick={onPress}
      className="mr-1.5 bg-white rounded-xl border p-2 flex flex-col items-center hover:border-slate-300 transition-colors"
      style={{ width: 44, minWidth: 44, borderColor: isToday ? colors.primary : '#e2e8f0' }}
    >
      <span style={{ fontSize: 9, color: '#94a3b8', marginBottom: 4 }}>{label}</span>
      <span style={{ color: colors.primary, fontFamily: 'var(--font-manrope)', fontWeight: 500, fontSize: 13 }}>
        {day.css_score}
      </span>
      <div className="w-full mt-1.5 bg-slate-100 rounded overflow-hidden" style={{ height: 3 }}>
        <div style={{ width: `${day.css_score}%`, height: 3, backgroundColor: colors.primary, borderRadius: 2 }} />
      </div>
    </button>
  );
}

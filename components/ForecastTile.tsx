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
      className="mr-2.5 flex flex-col items-center transition-all active:scale-95"
      style={{
        width: 52,
        minWidth: 52,
        borderRadius: 16,
        padding: '10px 6px',
        backgroundColor: isToday ? colors.primary : '#FFFFFF',
        boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <span style={{ fontSize: 10, color: isToday ? 'rgba(255,255,255,0.8)' : '#B0B0B0', marginBottom: 6, fontWeight: 500 }}>
        {label}
      </span>
      <span style={{
        color: isToday ? '#fff' : colors.primary,
        fontFamily: 'var(--font-manrope)',
        fontWeight: 700,
        fontSize: 15,
        lineHeight: '18px',
      }}>
        {day.css_score}
      </span>
      <div
        className="w-full mt-2 rounded-full overflow-hidden"
        style={{ height: 3, backgroundColor: isToday ? 'rgba(255,255,255,0.3)' : '#EEEEEE' }}
      >
        <div style={{
          width: `${day.css_score}%`,
          height: 3,
          backgroundColor: isToday ? 'rgba(255,255,255,0.9)' : colors.primary,
          borderRadius: 2,
        }} />
      </div>
    </button>
  );
}

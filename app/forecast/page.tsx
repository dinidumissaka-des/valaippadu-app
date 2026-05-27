'use client';
import { useWeatherContext } from '../../context/WeatherContext';
import { useLanguage } from '../../hooks/useLanguage';
import { ZONE_COLORS } from '../../constants/Colors';
import { ForecastDay } from '../../services/cssCalculator';

const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function ForecastRow({ day, isToday }: { day: ForecastDay; isToday: boolean }) {
  const { t }   = useLanguage();
  const colors  = ZONE_COLORS[day.zone];
  const dateObj = new Date(day.date + 'T00:00:00');
  const zoneKey = day.zone.toLowerCase() as 'go' | 'caution' | 'stop';

  return (
    <div
      className="bg-white rounded-xl border border-slate-200 p-4 mb-3 overflow-hidden relative"
      style={isToday ? { borderColor: colors.border, borderWidth: 1.5 } : {}}
    >
      {isToday && (
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ backgroundColor: colors.primary }} />
      )}
      <div className="flex justify-between items-start mb-3 pl-2">
        <div>
          <p style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: 15, color: '#0f172a', margin: 0 }}>
            {DAY_NAMES[dateObj.getDay()]}
          </p>
          <p style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0' }}>
            {dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </p>
        </div>
        <div className="text-right">
          <p style={{ color: colors.primary, fontFamily: 'var(--font-manrope)', fontWeight: 800, fontSize: 28, margin: 0, lineHeight: 1 }}>
            {day.css_score}
          </p>
          <p style={{ fontSize: 11, fontFamily: 'var(--font-manrope)', fontWeight: 600, color: colors.text, margin: '2px 0 0' }}>
            {t(zoneKey)}
          </p>
        </div>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden ml-2">
        <div className="h-full rounded-full" style={{ width: `${day.css_score}%`, backgroundColor: colors.primary }} />
      </div>
    </div>
  );
}

export default function ForecastPage() {
  const { forecast, loading } = useWeatherContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">
      <div className="px-4 bg-white border-b border-slate-100" style={{ paddingTop: 52, paddingBottom: 12 }}>
        <p style={{ fontFamily: 'var(--font-manrope)', fontWeight: 800, fontSize: 15, color: '#0f172a', margin: 0 }}>
          7-Day Forecast
        </p>
      </div>
      <div className="p-4 pb-10">
        {forecast.map((day) => (
          <ForecastRow key={day.date} day={day} isToday={day.date === today} />
        ))}
      </div>
    </div>
  );
}

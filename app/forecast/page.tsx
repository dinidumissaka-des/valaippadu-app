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
      style={{
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: '16px 20px',
        marginBottom: 12,
        boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
        borderLeft: isToday ? `4px solid ${colors.primary}` : undefined,
        paddingLeft: isToday ? 16 : 20,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: 16, color: '#222222', margin: 0 }}>
            {isToday ? 'Today' : DAY_NAMES[dateObj.getDay()]}
          </p>
          <p style={{ fontSize: 12, color: '#B0B0B0', margin: '3px 0 0' }}>
            {dateObj.toLocaleDateString([], { weekday: isToday ? 'long' : undefined, month: 'short', day: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ backgroundColor: colors.primary + '15', borderRadius: 9999, padding: '3px 10px' }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-manrope)', fontWeight: 700, color: colors.primary }}>
              {t(zoneKey)}
            </span>
          </div>
          <span style={{ color: colors.primary, fontFamily: 'var(--font-manrope)', fontWeight: 800, fontSize: 28, lineHeight: 1 }}>
            {day.css_score}
          </span>
        </div>
      </div>
      <div style={{ height: 6, backgroundColor: '#EEEEEE', borderRadius: 9999, overflow: 'hidden' }}>
        <div style={{ width: `${day.css_score}%`, height: '100%', backgroundColor: colors.primary, borderRadius: 9999, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

export default function ForecastPage() {
  const { forecast, loading } = useWeatherContext();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#F7F7F7' }}>
        <div style={{ width: 32, height: 32, border: '2.5px solid #222222', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ backgroundColor: '#F7F7F7', minHeight: '100vh' }}>
      <div style={{ backgroundColor: '#fff', padding: '52px 20px 16px', borderBottom: '1px solid #EEEEEE', position: 'sticky', top: 0, zIndex: 40 }}>
        <p style={{ fontFamily: 'var(--font-manrope)', fontWeight: 800, fontSize: 20, color: '#222222', margin: 0 }}>
          7-Day Forecast
        </p>
      </div>
      <div style={{ padding: '16px 16px 24px' }}>
        {forecast.map((day) => (
          <ForecastRow key={day.date} day={day} isToday={day.date === today} />
        ))}
      </div>
    </div>
  );
}

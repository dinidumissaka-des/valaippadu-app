'use client';
import { Fish, CloudOff, RefreshCw } from 'lucide-react';
import { useWeatherContext } from '../context/WeatherContext';
import { useLanguage } from '../hooks/useLanguage';
import { ZONE_COLORS } from '../constants/Colors';
import { CSSGauge } from '../components/CSSGauge';
import { ParameterCard } from '../components/ParameterCard';
import { ForecastTile } from '../components/ForecastTile';
import { AlertBanner } from '../components/AlertBanner';
import { CoordinatorNote } from '../components/CoordinatorNote';
import { LanguageToggle } from '../components/LanguageToggle';
import { useRouter } from 'next/navigation';

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skel({ w, h, r = 10 }: { w: number | string; h: number; r?: number }) {
  return (
    <div style={{ width: w as any, height: h, borderRadius: r, backgroundColor: '#EEEEEE', flexShrink: 0 }} />
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ backgroundColor: '#F7F7F7', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#fff', padding: '52px 20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EEEEEE' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Skel w={40} h={40} r={14} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><Skel w={80} h={14} r={7} /><Skel w={130} h={11} r={6} /></div>
        </div>
        <Skel w={72} h={32} r={9999} />
      </div>
      {/* Gauge card */}
      <div style={{ margin: '16px 16px 0', backgroundColor: '#fff', borderRadius: 20, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)' }}>
        <Skel w={148} h={148} r={74} />
        <div style={{ marginTop: 12 }}><Skel w={150} h={11} r={6} /></div>
      </div>
      {/* Params */}
      <div style={{ margin: '20px 0 0', padding: '0 16px' }}>
        <Skel w={120} h={11} r={5} />
        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          {[0,1,2,3,4].map(i => <Skel key={i} w={76} h={110} r={16} />)}
        </div>
      </div>
    </div>
  );
}

// ── Error state ───────────────────────────────────────────────────────────────
function ErrorState({ onRetry }: { onRetry: () => void }) {
  const { t } = useLanguage();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#F7F7F7', padding: '0 32px' }}>
      <CloudOff size={52} color="#B0B0B0" />
      <p style={{ fontFamily: 'var(--font-manrope)', fontWeight: 600, fontSize: 18, color: '#222222', marginTop: 20, marginBottom: 8, textAlign: 'center' }}>
        {t('error_load')}
      </p>
      <p style={{ fontFamily: 'var(--font-manrope)', fontSize: 14, color: '#717171', marginBottom: 28, textAlign: 'center' }}>
        Check your connection and try again.
      </p>
      <button
        onClick={onRetry}
        style={{ backgroundColor: '#222222', borderRadius: 9999, padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <RefreshCw size={16} color="#fff" />
        <span style={{ fontFamily: 'var(--font-manrope)', fontWeight: 600, fontSize: 14, color: '#fff' }}>
          {t('retry')}
        </span>
      </button>
    </div>
  );
}

// ── Home ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { current, forecast, loading, refreshing, error, refetch, lang, lastUpdated } = useWeatherContext();
  const { t } = useLanguage();
  const router = useRouter();

  if (loading) return <LoadingSkeleton />;
  if (error && !current) return <ErrorState onRetry={refetch} />;

  const zone      = current?.zone ?? 'CAUTION';
  const score     = current?.css_score ?? 0;
  const params    = current?.parameters;
  const note      = current?.coordinator_note;
  const showAlert = zone === 'STOP';
  const colors    = ZONE_COLORS[zone];

  const updatedStr = lastUpdated?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const nextStr    = lastUpdated
    ? new Date(lastUpdated.getTime() + 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  const now       = new Date();
  const dayNames  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const dayLabel  = `${dayNames[now.getDay()]}, ${now.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
  const hasSimulated = params ? Object.values(params).some(r => r.source === 'SIMULATED') : false;

  return (
    <div style={{ backgroundColor: '#F7F7F7', minHeight: '100vh' }}>

      {/* ── Header ── */}
      <div style={{
        backgroundColor: '#fff',
        padding: '52px 20px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #EEEEEE',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 14,
            backgroundColor: colors.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Fish size={20} color="#fff" strokeWidth={1.8} />
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-manrope)', fontWeight: 800, fontSize: 16, color: '#222222', margin: 0, lineHeight: '20px' }}>
              {t('app_name')}
            </p>
            <p style={{ fontFamily: 'var(--font-noto-tamil)', fontSize: 10, color: '#B0B0B0', margin: 0, lineHeight: '14px' }}>
              {dayLabel}
            </p>
          </div>
        </div>
        <LanguageToggle />
      </div>

      {/* Pull-to-refresh indicator */}
      {refreshing && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0', backgroundColor: '#F7F7F7' }}>
          <div style={{ width: 20, height: 20, border: `2px solid ${colors.primary}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      )}

      {/* ── Gauge card ── */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: 20,
          padding: '28px 20px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
        }}>
          {/* Zone pill at top */}
          <div style={{
            backgroundColor: colors.primary + '15',
            borderRadius: 9999,
            padding: '4px 14px',
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-manrope)', fontWeight: 700, color: colors.primary, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              {zone} ZONE
            </span>
          </div>

          <CSSGauge score={score} zone={zone} lang={lang} />

          {updatedStr && (
            <p style={{ fontSize: 11, color: '#B0B0B0', marginTop: 12, fontFamily: 'var(--font-manrope)', margin: '12px 0 0', textAlign: 'center' }}>
              Updated {updatedStr}{nextStr ? ` · Next ${nextStr}` : ''}
            </p>
          )}
        </div>
      </div>

      {/* ── Coordinator note + Alert ── */}
      {(note || showAlert) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 0 0' }}>
          {note && <CoordinatorNote text={note.text} postedAt={note.posted_at} />}
          {showAlert && <AlertBanner />}
        </div>
      )}

      {/* ── Parameters ── */}
      {params && (
        <div style={{ paddingTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: 12 }}>
            <span style={{ fontSize: 16, fontFamily: 'var(--font-manrope)', fontWeight: 700, color: '#222222' }}>
              {t('today_conditions')}
            </span>
            <button onClick={() => router.push('/parameters')}>
              <span style={{ fontSize: 13, fontFamily: 'var(--font-manrope)', fontWeight: 600, color: '#FF385C' }}>
                {t('details')} →
              </span>
            </button>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar" style={{ padding: '0 20px 4px' }}>
            {(Object.keys(params) as Array<keyof typeof params>).map((k) => (
              <ParameterCard key={k} paramKey={k} reading={params[k]} onPress={() => router.push('/parameters')} />
            ))}
          </div>
        </div>
      )}

      {/* ── Forecast ── */}
      {forecast.length > 0 && (
        <div style={{ paddingTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: 12 }}>
            <span style={{ fontSize: 16, fontFamily: 'var(--font-manrope)', fontWeight: 700, color: '#222222' }}>
              {t('forecast')}
            </span>
            <button onClick={() => router.push('/forecast')}>
              <span style={{ fontSize: 13, fontFamily: 'var(--font-manrope)', fontWeight: 600, color: '#FF385C' }}>
                {t('see_all')} →
              </span>
            </button>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar" style={{ padding: '0 20px 4px' }}>
            {forecast.map((d) => (
              <ForecastTile key={d.date} day={d} onPress={() => router.push('/forecast')} />
            ))}
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      {params && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, paddingTop: 20, paddingBottom: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: hasSimulated ? '#C47D00' : '#008A05' }} />
          <span style={{ fontSize: 11, color: '#B0B0B0', fontFamily: 'var(--font-manrope)' }}>
            {hasSimulated ? t('simulated') : t('live')}
          </span>
        </div>
      )}
    </div>
  );
}

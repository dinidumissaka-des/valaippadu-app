'use client';
import { Fish, CloudOff } from 'lucide-react';
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
function Skel({ w, h, r = 8 }: { w: number | string; h: number; r?: number }) {
  return <div style={{ width: w as any, height: h, borderRadius: r, backgroundColor: '#e2e8f0' }} />;
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col bg-slate-50">
      <div className="flex justify-between items-center px-4 bg-white border-b border-slate-100" style={{ paddingTop: 56, paddingBottom: 12 }}>
        <div className="flex items-center gap-2.5">
          <Skel w={32} h={32} r={10} />
          <div className="flex flex-col gap-1.5"><Skel w={80} h={13} r={6} /><Skel w={130} h={10} r={5} /></div>
        </div>
        <Skel w={64} h={28} r={8} />
      </div>
      <div className="mx-4 mt-4 bg-white rounded-2xl border border-slate-200 flex flex-col items-center py-6">
        <Skel w={148} h={148} r={74} />
        <div className="mt-3"><Skel w={140} h={10} r={5} /></div>
      </div>
      <div className="mt-5 px-4"><Skel w={110} h={9} r={4} />
        <div className="flex gap-2 mt-3">{[0,1,2,3,4].map(i => <Skel key={i} w={72} h={82} r={12} />)}</div>
      </div>
      <div className="mt-5 px-4"><Skel w={100} h={9} r={4} />
        <div className="flex gap-1.5 mt-3">{[0,1,2,3,4,5,6].map(i => <Skel key={i} w={44} h={72} r={12} />)}</div>
      </div>
    </div>
  );
}

// ── Error state ───────────────────────────────────────────────────────────────
function ErrorState({ onRetry }: { onRetry: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-8">
      <CloudOff size={48} color="#94a3b8" />
      <p style={{ fontFamily: 'var(--font-manrope)', fontWeight: 600, fontSize: 16, color: '#475569', marginTop: 16, marginBottom: 20, textAlign: 'center' }}>
        {t('error_load')}
      </p>
      <button
        onClick={onRetry}
        style={{ backgroundColor: '#0f172a', borderRadius: 12, padding: '10px 28px' }}
      >
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

  const now    = new Date();
  const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const dayLabel = `${days[now.getDay()]}, ${now.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;

  const hasSimulated = params ? Object.values(params).some(r => r.source === 'SIMULATED') : false;

  return (
    <div className="flex flex-col bg-slate-50 pb-6">
      {/* Header */}
      <div className="flex justify-between items-center px-4 bg-white border-b border-slate-100" style={{ paddingTop: 52, paddingBottom: 12 }}>
        <div className="flex items-center gap-2.5">
          <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Fish size={16} color="#fff" />
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-manrope)', fontWeight: 800, fontSize: 15, color: '#0f172a', margin: 0, lineHeight: '19px' }}>
              {t('app_name')}
            </p>
            <p style={{ fontFamily: 'var(--font-noto-tamil)', fontSize: 9, color: '#94a3b8', margin: 0, lineHeight: '13px' }}>
              வல்லிபாடு · {dayLabel}
            </p>
          </div>
        </div>
        <LanguageToggle />
      </div>

      {/* Pull-to-refresh indicator */}
      {refreshing && (
        <div className="flex justify-center py-2">
          <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: colors.primary, borderTopColor: 'transparent' }} />
        </div>
      )}

      {/* Gauge */}
      <div className="mx-4 mt-4 bg-white rounded-2xl border flex flex-col items-center py-5" style={{ borderColor: colors.border }}>
        <CSSGauge score={score} zone={zone} lang={lang} />
        {updatedStr && (
          <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 6, fontFamily: 'var(--font-manrope)', margin: '6px 0 0' }}>
            {t('updated')} {updatedStr}{nextStr ? `  ·  ${t('next_update')} ${nextStr}` : ''}
          </p>
        )}
      </div>

      {/* Coordinator note */}
      {note && <div className="mt-3"><CoordinatorNote text={note.text} postedAt={note.posted_at} /></div>}

      {/* Alert */}
      {showAlert && <div className="mt-3"><AlertBanner /></div>}

      {/* Parameters */}
      {params && (
        <div className="mt-5">
          <div className="flex justify-between items-center px-4 mb-3">
            <span style={{ fontSize: 10, fontFamily: 'var(--font-manrope)', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              {t('today_conditions')}
            </span>
            <button onClick={() => router.push('/parameters')}>
              <span style={{ fontSize: 12, fontFamily: 'var(--font-manrope)', fontWeight: 600, color: colors.primary }}>
                {t('details')} →
              </span>
            </button>
          </div>
          <div className="flex overflow-x-auto px-4 hide-scrollbar pb-1">
            {(Object.keys(params) as Array<keyof typeof params>).map((k) => (
              <ParameterCard key={k} paramKey={k} reading={params[k]} onPress={() => router.push('/parameters')} />
            ))}
          </div>
        </div>
      )}

      {/* Forecast */}
      {forecast.length > 0 && (
        <div className="mt-5">
          <div className="flex justify-between items-center px-4 mb-3">
            <span style={{ fontSize: 10, fontFamily: 'var(--font-manrope)', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              {t('forecast')}
            </span>
            <button onClick={() => router.push('/forecast')}>
              <span style={{ fontSize: 12, fontFamily: 'var(--font-manrope)', fontWeight: 600, color: colors.primary }}>
                {t('see_all')} →
              </span>
            </button>
          </div>
          <div className="flex overflow-x-auto px-4 hide-scrollbar pb-1">
            {forecast.map((d) => (
              <ForecastTile key={d.date} day={d} onPress={() => router.push('/forecast')} />
            ))}
          </div>
        </div>
      )}

      {/* Data source footer */}
      {params && (
        <div className="flex items-center justify-center gap-1.5 mt-5 px-4">
          <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: hasSimulated ? '#d97706' : '#16a34a' }} />
          <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'var(--font-manrope)' }}>
            {hasSimulated ? t('simulated') : t('live')}
          </span>
        </div>
      )}
    </div>
  );
}

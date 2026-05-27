'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWeatherContext } from '../../context/WeatherContext';
import { useLanguage } from '../../hooks/useLanguage';
import { ZONE_COLORS, Zone } from '../../constants/Colors';
import { CSSGauge } from '../../components/CSSGauge';
import { CoordinatorNote } from '../../components/CoordinatorNote';
import { ParameterGaugeBar } from '../../components/ParameterGaugeBar';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { postCoordinatorNote, deleteCoordinatorNote } from '../../services/api';
import { ParamKey } from '../../constants/thresholds';
import { cn } from '../../lib/utils';

const PARAM_ORDER: ParamKey[] = ['salinity', 'temperature', 'rainfall', 'wave_height', 'turbidity'];
const ZONES: Zone[] = ['GO', 'CAUTION', 'STOP'];

export default function CoordinatorPage() {
  const { current, loading, lang, clearNote, refetch } = useWeatherContext();
  const { t } = useLanguage();
  const router = useRouter();

  const [noteText,     setNoteText]     = useState('');
  const [overrideZone, setOverrideZone] = useState<Zone | null>(null);
  const [sending,      setSending]      = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  const zone  = current?.zone  ?? 'CAUTION';
  const score = current?.css_score ?? 0;
  const note  = current?.coordinator_note;

  async function handleSend() {
    if (!noteText.trim()) return;
    setSending(true);
    setError(null);
    try {
      await postCoordinatorNote(noteText.trim(), overrideZone);
      setNoteText('');
      setOverrideZone(null);
      await refetch();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  async function handleClearNote() {
    try {
      await deleteCoordinatorNote();
      clearNote();
    } catch (e: any) {
      setError(e.message);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">
      <div className="px-4 bg-white border-b border-slate-100" style={{ paddingTop: 52, paddingBottom: 12 }}>
        <p style={{ fontFamily: 'var(--font-manrope)', fontWeight: 800, fontSize: 15, color: '#0f172a', margin: 0 }}>
          {t('coordinator_dashboard')}
        </p>
      </div>

      <div className="flex flex-col items-center py-6">
        <CSSGauge score={score} zone={zone} lang={lang} />
      </div>

      <div className="px-4 flex flex-col gap-4 pb-10">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            <p style={{ fontSize: 12, color: '#dc2626', margin: 0 }}>{error}</p>
          </div>
        )}

        {note && (
          <CoordinatorNote text={note.text} postedAt={note.posted_at} onClear={handleClearNote} showClear />
        )}

        <Card>
          <CardHeader><CardTitle>{t('post_note')}</CardTitle></CardHeader>
          <CardContent>
            <textarea
              className="w-full border border-slate-200 rounded-lg p-3 text-slate-900 text-sm bg-slate-50 resize-none focus:outline-none focus:border-slate-400"
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write a message for farmers…"
            />

            <p className="text-slate-500 text-xs mt-3 mb-2">{t('override_zone')}</p>
            <div className="flex gap-2 mb-4">
              <button
                className={cn('px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors',
                  overrideZone === null ? 'border-slate-400 bg-slate-100 text-slate-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50')}
                onClick={() => setOverrideZone(null)}
              >
                —
              </button>
              {ZONES.map((z) => {
                const c      = ZONE_COLORS[z];
                const active = overrideZone === z;
                return (
                  <button
                    key={z}
                    className="px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors"
                    style={active ? { borderColor: c.primary, backgroundColor: c.background, color: c.primary } : { borderColor: '#e2e8f0', color: '#64748b' }}
                    onClick={() => setOverrideZone(z)}
                  >
                    {t(z.toLowerCase() as any)}
                  </button>
                );
              })}
            </div>

            <Button variant="success" disabled={!noteText.trim()} loading={sending} onClick={handleSend}>
              {t('send_to_farmers')}
            </Button>
          </CardContent>
        </Card>

        {current?.parameters && (
          <Card>
            <CardHeader><CardTitle>All Parameters</CardTitle></CardHeader>
            <CardContent>
              {PARAM_ORDER.map((k) => (
                <ParameterGaugeBar key={k} paramKey={k} value={current.parameters[k].value} source={current.parameters[k].source} />
              ))}
            </CardContent>
          </Card>
        )}

        <Button variant="outline" onClick={() => router.push('/coordinator/simulator')}>
          {t('open_simulator')} →
        </Button>
      </div>
    </div>
  );
}

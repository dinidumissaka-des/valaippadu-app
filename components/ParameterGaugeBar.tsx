'use client';
import { useEffect, useState } from 'react';
import { THRESHOLDS, ParamKey } from '../constants/thresholds';
import { useLanguage } from '../hooks/useLanguage';
import { StringKey } from '../constants/strings';

interface Props {
  paramKey: ParamKey;
  value:    number;
  source:   'LIVE' | 'SIMULATED';
}

export function ParameterGaugeBar({ paramKey, value, source }: Props) {
  const { t }   = useLanguage();
  const thresh  = THRESHOLDS[paramKey] as any;
  const { min, max, unit } = thresh;
  const frac = Math.max(0, Math.min(1, (value - min) / (max - min)));

  const [pos, setPos] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setPos(frac));
    return () => cancelAnimationFrame(id);
  }, [frac]);

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <span className="text-slate-800 font-semibold text-sm">{t(paramKey as StringKey)}</span>
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: 14, color: '#0f172a' }}>
            {value} {unit}
          </span>
          <div className="flex items-center gap-1">
            <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: source === 'LIVE' ? '#16a34a' : '#94a3b8' }} />
            <span style={{ fontSize: 10, color: source === 'LIVE' ? '#16a34a' : '#94a3b8' }}>
              {source === 'LIVE' ? 'Live' : 'Sim'}
            </span>
          </div>
        </div>
      </div>

      <div className="h-3 flex rounded-full overflow-hidden relative">
        <div style={{ flex: 1, background: '#fee2e2' }} />
        <div style={{ flex: 1, background: '#fef3c7' }} />
        <div style={{ flex: 2, background: '#dcfce7' }} />
        <div style={{ flex: 1, background: '#fef3c7' }} />
        <div style={{ flex: 1, background: '#fee2e2' }} />
        <div style={{
          position:  'absolute',
          top:       -2,
          left:      `${pos * 100}%`,
          width:     7,
          height:    19,
          marginLeft: -3.5,
          borderRadius: 4,
          backgroundColor: '#0f172a',
          boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
          transition: 'left 0.6s cubic-bezier(0.33,1,0.68,1)',
        }} />
      </div>

      {thresh.green && (
        <p className="text-slate-400 text-xs mt-1">
          {t('optimal')}: {thresh.green[0]}–{thresh.green[1]} {unit}
        </p>
      )}
    </div>
  );
}

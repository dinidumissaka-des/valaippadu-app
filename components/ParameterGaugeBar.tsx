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

  const isLive = source === 'LIVE';

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <span style={{ fontFamily: 'var(--font-manrope)', fontWeight: 600, fontSize: 14, color: '#222222' }}>
          {t(paramKey as StringKey)}
        </span>
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: 15, color: '#222222' }}>
            {value} <span style={{ fontWeight: 400, color: '#B0B0B0', fontSize: 12 }}>{unit}</span>
          </span>
          <div
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full"
            style={{ backgroundColor: isLive ? '#EDFFF0' : '#F7F7F7' }}
          >
            <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: isLive ? '#008A05' : '#B0B0B0' }} />
            <span style={{ fontSize: 10, color: isLive ? '#008A05' : '#B0B0B0', fontWeight: 500 }}>
              {isLive ? 'Live' : 'Sim'}
            </span>
          </div>
        </div>
      </div>

      <div className="h-2.5 flex rounded-full overflow-hidden relative">
        <div style={{ flex: 1, background: '#FECACA' }} />
        <div style={{ flex: 1, background: '#FDE68A' }} />
        <div style={{ flex: 2, background: '#BBF7D0' }} />
        <div style={{ flex: 1, background: '#FDE68A' }} />
        <div style={{ flex: 1, background: '#FECACA' }} />
        <div
          style={{
            position:  'absolute',
            top:       -3,
            left:      `${pos * 100}%`,
            width:     8,
            height:    22,
            marginLeft: -4,
            borderRadius: 4,
            backgroundColor: '#222222',
            boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
            transition: 'left 0.6s cubic-bezier(0.33,1,0.68,1)',
          }}
        />
      </div>

      {thresh.green && (
        <p style={{ fontSize: 11, color: '#B0B0B0', marginTop: 6 }}>
          Optimal: {thresh.green[0]}–{thresh.green[1]} {unit}
        </p>
      )}
    </div>
  );
}

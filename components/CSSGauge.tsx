'use client';
import { useEffect, useRef, useState } from 'react';
import { Zone, ZONE_COLORS } from '../constants/Colors';
import { STRINGS, Lang } from '../constants/strings';

function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polarToCartesian(cx, cy, r, end);
  const e = polarToCartesian(cx, cy, r, start);
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${end - start <= 180 ? '0' : '1'} 0 ${e.x} ${e.y}`;
}

interface Props {
  score:       number;
  zone:        Zone;
  size?:       number;
  showLabels?: boolean;
  lang?:       Lang;
}

export function CSSGauge({ score, zone, size = 148, showLabels = true, lang = 'ta' }: Props) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const target = Math.max(0, Math.min(100, score));
    const from   = display;
    const t0     = performance.now();
    const dur    = 800;

    function tick(now: number) {
      const p    = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (target - from) * ease));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [score]);

  const cx  = size / 2;
  const cy  = size / 2;
  const r   = size / 2 - 14;
  const sw  = 12;
  const SA  = 135;
  const TS  = 270;

  const track    = describeArc(cx, cy, r, SA, SA + TS);
  const progress = display > 0 ? describeArc(cx, cy, r, SA, SA + (display / 100) * TS) : '';

  const colors  = ZONE_COLORS[zone];
  const zoneKey = zone.toLowerCase() as 'go' | 'caution' | 'stop';

  return (
    <div style={{ width: size, height: size, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ position: 'absolute', inset: 0 }}>
        <path d={track}    stroke="#e2e8f0"       strokeWidth={sw} strokeLinecap="round" fill="none" />
        {progress && <path d={progress} stroke={colors.primary} strokeWidth={sw} strokeLinecap="round" fill="none" />}
      </svg>
      {showLabels && (
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ color: colors.primary, fontFamily: 'var(--font-manrope)', fontWeight: 500, fontSize: 40, lineHeight: '44px' }}>
            {display}
          </div>
          <div style={{ color: colors.primary, fontFamily: 'var(--font-manrope)', fontWeight: 600, fontSize: 13 }}>
            {STRINGS[lang][zoneKey]}
          </div>
          <div style={{ color: colors.primary, fontFamily: 'var(--font-noto-tamil)', fontSize: 11 }}>
            {STRINGS.ta[zoneKey]}
          </div>
        </div>
      )}
    </div>
  );
}

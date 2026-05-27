'use client';
import { Droplets, Thermometer, CloudRain, Waves, Eye } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { ParameterReading } from '../services/cssCalculator';
import { StringKey } from '../constants/strings';

const ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  salinity:    Droplets,
  temperature: Thermometer,
  rainfall:    CloudRain,
  wave_height: Waves,
  turbidity:   Eye,
};

const ZONE_COLOR: Record<string, string> = {
  GREEN: '#16a34a',
  AMBER: '#d97706',
  RED:   '#dc2626',
};

interface Props {
  paramKey: string;
  reading:  ParameterReading;
  onPress?: () => void;
}

export function ParameterCard({ paramKey, reading, onPress }: Props) {
  const { t }  = useLanguage();
  const Icon   = ICONS[paramKey] ?? Eye;
  const color  = ZONE_COLOR[reading.zone] ?? '#64748b';
  const dotClr = reading.source === 'LIVE' ? '#16a34a' : '#94a3b8';

  return (
    <button
      onClick={onPress}
      className="mr-2 bg-white rounded-xl border border-slate-200 p-2 flex flex-col items-center hover:border-slate-300 transition-colors"
      style={{ width: 72, minWidth: 72 }}
    >
      <Icon size={16} color="#94a3b8" />
      <span style={{ color, fontFamily: 'var(--font-manrope)', fontWeight: 500, fontSize: 14, lineHeight: '22px' }}>
        {reading.value}
      </span>
      <span className="text-slate-400 text-center leading-none" style={{ fontSize: 9 }}>{reading.unit}</span>
      <div className="flex items-center gap-1 mt-1 w-full justify-center">
        <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: dotClr, flexShrink: 0 }} />
        <span className="text-slate-400 truncate" style={{ fontSize: 10, maxWidth: 48 }}>
          {t(paramKey as StringKey)}
        </span>
      </div>
    </button>
  );
}

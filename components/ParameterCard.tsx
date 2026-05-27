'use client';
import { Droplets, Thermometer, CloudRain, Waves, Eye } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { ParameterReading } from '../services/cssCalculator';
import { StringKey } from '../constants/strings';

const ICONS: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  salinity:    Droplets,
  temperature: Thermometer,
  rainfall:    CloudRain,
  wave_height: Waves,
  turbidity:   Eye,
};

const ZONE_COLOR: Record<string, string> = {
  GREEN: '#008A05',
  AMBER: '#C47D00',
  RED:   '#C13515',
};

interface Props {
  paramKey: string;
  reading:  ParameterReading;
  onPress?: () => void;
}

export function ParameterCard({ paramKey, reading, onPress }: Props) {
  const { t }  = useLanguage();
  const Icon   = ICONS[paramKey] ?? Eye;
  const color  = ZONE_COLOR[reading.zone] ?? '#717171';
  const isLive = reading.source === 'LIVE';

  return (
    <button
      onClick={onPress}
      className="mr-3 bg-white flex flex-col items-center transition-all active:scale-95"
      style={{
        width: 76,
        minWidth: 76,
        borderRadius: 16,
        padding: '12px 8px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div
        style={{
          width: 36, height: 36, borderRadius: 12,
          backgroundColor: color + '15',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 8,
        }}
      >
        <Icon size={18} color={color} strokeWidth={1.8} />
      </div>
      <span style={{ color, fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: 16, lineHeight: '20px' }}>
        {reading.value}
      </span>
      <span style={{ color: '#B0B0B0', fontSize: 10, marginTop: 1 }}>{reading.unit}</span>
      <span style={{ color: '#717171', fontSize: 10, marginTop: 4, textAlign: 'center', lineHeight: '13px' }} className="truncate w-full text-center">
        {t(paramKey as StringKey)}
      </span>
      <div
        style={{
          width: 5, height: 5, borderRadius: '50%',
          backgroundColor: isLive ? '#008A05' : '#B0B0B0',
          marginTop: 5,
        }}
      />
    </button>
  );
}

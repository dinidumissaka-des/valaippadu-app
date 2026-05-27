'use client';
import { THRESHOLDS, ParamKey } from '../constants/thresholds';
import { useLanguage } from '../hooks/useLanguage';
import { StringKey } from '../constants/strings';

const STEPS: Record<ParamKey, number> = {
  salinity:    0.5,
  temperature: 0.5,
  rainfall:    1,
  wave_height: 0.05,
  turbidity:   0.5,
};

interface Props {
  paramKey: ParamKey;
  value:    number;
  onChange: (val: number) => void;
}

export function SimulatorSlider({ paramKey, value, onChange }: Props) {
  const { t }  = useLanguage();
  const thresh = THRESHOLDS[paramKey] as any;
  const { min, max, unit } = thresh;

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <span className="text-slate-700 font-semibold text-sm">{t(paramKey as StringKey)}</span>
        <span style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: 14, color: '#0f172a' }}>
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={STEPS[paramKey]}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <div className="flex justify-between mt-1">
        <span className="text-slate-400 text-xs">{min} {unit}</span>
        <span className="text-slate-400 text-xs">{max} {unit}</span>
      </div>
    </div>
  );
}

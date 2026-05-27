'use client';
import { useState } from 'react';
import { useWeatherContext } from '../../../context/WeatherContext';
import { useLanguage } from '../../../hooks/useLanguage';
import { ZONE_COLORS, getZone } from '../../../constants/Colors';
import { CSSGauge } from '../../../components/CSSGauge';
import { SimulatorSlider } from '../../../components/SimulatorSlider';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { calculateCSS, ParameterValues } from '../../../services/cssCalculator';
import { ParamKey } from '../../../constants/thresholds';
import { TriangleAlert } from 'lucide-react';

const SLIDERS: ParamKey[] = ['salinity', 'temperature', 'rainfall', 'wave_height', 'turbidity'];

const DEFAULTS: ParameterValues = {
  salinity:    32,
  temperature: 28,
  rainfall:    5,
  wave_height: 0.4,
  turbidity:   10,
};

export default function SimulatorPage() {
  const { current, lang } = useWeatherContext();
  const { t } = useLanguage();

  const liveDefaults: ParameterValues = current
    ? {
        salinity:    current.parameters.salinity.value,
        temperature: current.parameters.temperature.value,
        rainfall:    current.parameters.rainfall.value,
        wave_height: current.parameters.wave_height.value,
        turbidity:   current.parameters.turbidity.value,
      }
    : DEFAULTS;

  const [params, setParams] = useState<ParameterValues>(liveDefaults);
  const score  = calculateCSS(params);
  const zone   = getZone(score);

  function updateParam(key: ParamKey, val: number) {
    setParams((prev) => ({ ...prev, [key]: parseFloat(val.toFixed(2)) }));
  }

  return (
    <div className="flex flex-col bg-slate-50 min-h-screen pb-12">
      {/* Warning banner */}
      <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border-b border-amber-200">
        <TriangleAlert size={16} color="#92400e" />
        <span style={{ fontFamily: 'var(--font-manrope)', fontWeight: 600, fontSize: 13, color: '#92400e' }}>
          {t('simulator_mode')} — {t('simulator_not_real')}
        </span>
      </div>

      <div className="flex flex-col items-center py-6">
        <CSSGauge score={score} zone={zone} lang={lang} />
      </div>

      <div className="px-4 flex flex-col gap-4">
        <Card>
          <CardHeader><CardTitle>Adjust Parameters</CardTitle></CardHeader>
          <CardContent>
            {SLIDERS.map((k) => (
              <SimulatorSlider
                key={k}
                paramKey={k}
                value={params[k as keyof ParameterValues]}
                onChange={(v) => updateParam(k, v)}
              />
            ))}
          </CardContent>
        </Card>

        <Button variant="outline" onClick={() => setParams(liveDefaults)}>
          {t('reset_to_live')}
        </Button>
      </div>
    </div>
  );
}

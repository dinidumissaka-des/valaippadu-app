import { THRESHOLDS } from '../constants/thresholds';
import { Zone, getZone } from '../constants/Colors';

export interface ParameterValues {
  salinity:    number;
  temperature: number;
  rainfall:    number;
  wave_height: number;
  turbidity:   number;
}

export interface ParameterReading {
  value:  number;
  unit:   string;
  zone:   'GREEN' | 'AMBER' | 'RED';
  source: 'LIVE' | 'SIMULATED';
}

export interface WeatherData {
  css_score: number;
  zone: Zone;
  timestamp: string;
  coordinator_note: {
    text: string;
    override_zone: Zone | null;
    posted_at: string;
  } | null;
  parameters: {
    salinity:    ParameterReading;
    temperature: ParameterReading;
    rainfall:    ParameterReading;
    wave_height: ParameterReading;
    turbidity:   ParameterReading;
  };
}

export interface ForecastDay {
  date:      string;
  css_score: number;
  zone:      Zone;
}

function normalise(value: number, param: keyof ParameterValues): number {
  const t = THRESHOLDS[param];

  if (param === 'salinity' || param === 'temperature') {
    const p = t as typeof THRESHOLDS.salinity;
    const [gLow, gHigh] = p.green;
    const [aLowMin, aLowMax] = p.amberLow;
    const [aHighMin, aHighMax] = p.amberHigh;

    if (value >= gLow && value <= gHigh) return 1.0;
    if (value >= aLowMin && value <= aLowMax) {
      return 0.5 + 0.5 * ((value - aLowMin) / (aLowMax - aLowMin + 1));
    }
    if (value >= aHighMin && value <= aHighMax) {
      return 0.5 + 0.5 * ((aHighMax - value) / (aHighMax - aHighMin + 1));
    }
    return 0.0;
  }

  // rainfall, wave_height, turbidity — unidirectional
  const p = t as typeof THRESHOLDS.rainfall;
  const [gMin, gMax] = p.green;
  const [aMin, aMax] = p.amber;

  if (value <= gMax) return 1.0;
  if (value <= aMax) return 0.5 + 0.5 * ((aMax - value) / (aMax - aMin));
  return 0.0;
}

export function calculateCSS(params: ParameterValues): number {
  return Math.round(
    normalise(params.salinity,    'salinity')    * THRESHOLDS.salinity.weight    * 100 +
    normalise(params.temperature, 'temperature') * THRESHOLDS.temperature.weight * 100 +
    normalise(params.rainfall,    'rainfall')    * THRESHOLDS.rainfall.weight    * 100 +
    normalise(params.wave_height, 'wave_height') * THRESHOLDS.wave_height.weight * 100 +
    normalise(params.turbidity,   'turbidity')   * THRESHOLDS.turbidity.weight   * 100
  );
}

export function getParamZone(value: number, param: keyof ParameterValues): 'GREEN' | 'AMBER' | 'RED' {
  const n = normalise(value, param);
  if (n >= 0.9) return 'GREEN';
  if (n >= 0.4) return 'AMBER';
  return 'RED';
}

export { getZone };

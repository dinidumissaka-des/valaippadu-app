import { calculateCSS, getParamZone, ParameterValues } from '../services/cssCalculator';
import { getZone } from '../constants/Colors';

const LAT    = process.env.LAT               ?? '9.2167';
const LNG    = process.env.LNG               ?? '80.2833';
const WX     = process.env.OPEN_METEO_BASE   ?? 'https://api.open-meteo.com/v1';
const MARINE = process.env.OPEN_METEO_MARINE ?? 'https://marine-api.open-meteo.com/v1';

type Note = { text: string; override_zone: string | null; posted_at: string } | null;
let coordinatorNote: Note = null;

function mockConditions(rainfall = 5, waveHeight = 0.4) {
  const h = new Date().getHours();
  return {
    salinity:  parseFloat((32 + 3 * Math.sin(h / 6) - (rainfall > 20 ? 8 : 0)).toFixed(1)),
    turbidity: parseFloat((8 + Math.random() * 5 + (waveHeight > 1 ? 15 : 0)).toFixed(1)),
  };
}

function reading(value: number, unit: string, param: keyof ParameterValues, source: 'LIVE' | 'SIMULATED') {
  return { value, unit, zone: getParamZone(value, param), source };
}

function fullMock() {
  const h          = new Date().getHours();
  const rainfall   = parseFloat((5 + Math.random() * 10).toFixed(1));
  const waveHeight = parseFloat((0.3 + Math.random() * 0.4).toFixed(2));
  const { salinity, turbidity } = mockConditions(rainfall, waveHeight);
  const temperature = parseFloat((27 + 2 * Math.sin(h / 12)).toFixed(1));
  const params: ParameterValues = { salinity, temperature, rainfall, wave_height: waveHeight, turbidity };
  const score = calculateCSS(params);
  return {
    css_score: score,
    zone:      getZone(score),
    timestamp: new Date().toISOString(),
    coordinator_note: null as Note,
    parameters: {
      salinity:    reading(salinity,    'ppt', 'salinity',    'SIMULATED'),
      temperature: reading(temperature, '°C',  'temperature', 'SIMULATED'),
      rainfall:    reading(rainfall,    'mm',  'rainfall',    'SIMULATED'),
      wave_height: reading(waveHeight,  'm',   'wave_height', 'SIMULATED'),
      turbidity:   reading(turbidity,   'NTU', 'turbidity',   'SIMULATED'),
    },
  };
}

async function fetchWx() {
  const url = `${WX}/forecast?latitude=${LAT}&longitude=${LNG}&hourly=temperature_2m,precipitation&daily=precipitation_sum,temperature_2m_max&timezone=Asia/Colombo&forecast_days=8`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8000), next: { revalidate: 0 } } as any);
  if (!res.ok) throw new Error('wx');
  return res.json();
}

async function fetchMarine() {
  const url = `${MARINE}/marine?latitude=${LAT}&longitude=${LNG}&hourly=wave_height&timezone=Asia/Colombo&forecast_days=8`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8000), next: { revalidate: 0 } } as any);
  if (!res.ok) throw new Error('marine');
  return res.json();
}

export async function getCurrentConditions() {
  try {
    const [wx, marine] = await Promise.all([fetchWx(), fetchMarine()]);
    const h    = new Date().getHours();
    const temp = wx.hourly.temperature_2m[h] ?? wx.hourly.temperature_2m[0];
    const rain = wx.hourly.precipitation[h]  ?? wx.hourly.precipitation[0];
    const wave = marine.hourly.wave_height[h] ?? marine.hourly.wave_height[0];
    const { salinity, turbidity } = mockConditions(rain, wave);
    const params: ParameterValues = { salinity, temperature: temp, rainfall: rain, wave_height: wave, turbidity };
    const score = calculateCSS(params);
    return {
      css_score: score,
      zone:      getZone(score),
      timestamp: new Date().toISOString(),
      coordinator_note: coordinatorNote,
      parameters: {
        salinity:    reading(salinity, 'ppt', 'salinity',    'SIMULATED'),
        temperature: reading(temp,     '°C',  'temperature', 'LIVE'),
        rainfall:    reading(rain,     'mm',  'rainfall',    'LIVE'),
        wave_height: reading(wave,     'm',   'wave_height', 'LIVE'),
        turbidity:   reading(turbidity,'NTU', 'turbidity',   'SIMULATED'),
      },
    };
  } catch {
    const mock = fullMock();
    mock.coordinator_note = coordinatorNote;
    return mock;
  }
}

export async function getForecast() {
  try {
    const [wx, marine] = await Promise.all([fetchWx(), fetchMarine()]);
    const days = [];
    for (let i = 1; i <= 7; i++) {
      const rain = wx.daily?.precipitation_sum?.[i] ?? 5;
      const temp = wx.daily?.temperature_2m_max?.[i] ?? 28;
      const wave = marine.hourly?.wave_height?.[i * 24] ?? 0.4;
      const { salinity, turbidity } = mockConditions(rain, wave);
      const score = calculateCSS({ salinity, temperature: temp, rainfall: rain, wave_height: wave, turbidity });
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({ date: d.toISOString().split('T')[0], css_score: score, zone: getZone(score) });
    }
    return { forecast: days };
  } catch {
    const days = [];
    for (let i = 1; i <= 7; i++) {
      const d    = new Date();
      d.setDate(d.getDate() + i);
      const rain = Math.random() * 40;
      const wave = Math.random() * 1.5;
      const sal  = 32 + 3 * Math.random() - (rain > 20 ? 6 : 0);
      const temp = 27 + Math.random() * 4;
      const turb = 8 + Math.random() * 5 + (wave > 1 ? 15 : 0);
      const score = calculateCSS({ salinity: sal, temperature: temp, rainfall: rain, wave_height: wave, turbidity: turb });
      days.push({ date: d.toISOString().split('T')[0], css_score: score, zone: getZone(score) });
    }
    return { forecast: days };
  }
}

export function setCoordinatorNote(text: string, override_zone?: string | null): Note {
  coordinatorNote = { text, override_zone: override_zone ?? null, posted_at: new Date().toISOString() };
  return coordinatorNote;
}

export function clearCoordinatorNote() {
  coordinatorNote = null;
}

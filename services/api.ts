import { WeatherData, ForecastDay } from './cssCalculator';

export async function fetchCurrentWeather(): Promise<WeatherData> {
  const res = await fetch('/api/weather/current', { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchForecast(): Promise<{ forecast: ForecastDay[] }> {
  const res = await fetch('/api/weather/forecast', { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function postCoordinatorNote(text: string, override_zone?: string | null) {
  const res = await fetch('/api/coordinator/note', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ text, override_zone: override_zone ?? null }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function deleteCoordinatorNote() {
  const res = await fetch('/api/coordinator/note', { method: 'DELETE' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

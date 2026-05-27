import { WeatherData, ForecastDay } from './cssCalculator';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function fetchCurrentWeather(): Promise<WeatherData> {
  const res = await fetch(`${BASE_URL}/api/weather/current`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchForecast(): Promise<{ forecast: ForecastDay[] }> {
  const res = await fetch(`${BASE_URL}/api/weather/forecast`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function postCoordinatorNote(text: string, override_zone?: string | null): Promise<{ success: boolean; posted_at: string }> {
  const res = await fetch(`${BASE_URL}/api/coordinator/note`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, override_zone: override_zone ?? null }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function deleteCoordinatorNote(): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/coordinator/note`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

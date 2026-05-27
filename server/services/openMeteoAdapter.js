const axios = require('axios');
const { generateFullMock, generateForecastMock, generateMockConditions, buildReading } = require('./mockDataService');
const { calculateCSS, getZone } = require('./cssCalculator');

const LAT = process.env.LAT || '9.2167';
const LNG = process.env.LNG || '80.2833';
const WEATHER_BASE = process.env.OPEN_METEO_BASE || 'https://api.open-meteo.com/v1';
const MARINE_BASE  = process.env.OPEN_METEO_MARINE || 'https://marine-api.open-meteo.com/v1';

// In-memory coordinator note store (would be a DB in production)
let coordinatorNote = null;

async function fetchOpenMeteo() {
  const url = `${WEATHER_BASE}/forecast?latitude=${LAT}&longitude=${LNG}&hourly=temperature_2m,precipitation,windspeed_10m&daily=precipitation_sum,temperature_2m_max,temperature_2m_min&timezone=Asia/Colombo&forecast_days=8`;
  const res = await axios.get(url, { timeout: 8000 });
  return res.data;
}

async function fetchOpenMeteoMarine() {
  const url = `${MARINE_BASE}/marine?latitude=${LAT}&longitude=${LNG}&hourly=wave_height&timezone=Asia/Colombo&forecast_days=8`;
  const res = await axios.get(url, { timeout: 8000 });
  return res.data;
}

function pickCurrentHour(hourlyArray) {
  const now = new Date();
  return hourlyArray[now.getHours()] ?? hourlyArray[0];
}

async function getCurrentConditions() {
  try {
    const [weather, marine] = await Promise.all([fetchOpenMeteo(), fetchOpenMeteoMarine()]);

    const temperature = pickCurrentHour(weather.hourly.temperature_2m);
    const rainfall    = pickCurrentHour(weather.hourly.precipitation);
    const waveHeight  = pickCurrentHour(marine.hourly.wave_height);
    const { salinity, turbidity } = generateMockConditions(rainfall, waveHeight);

    const params = { salinity, temperature, rainfall, wave_height: waveHeight, turbidity };
    const score  = calculateCSS(params);

    return {
      css_score: score,
      zone:      getZone(score),
      timestamp: new Date().toISOString(),
      coordinator_note: coordinatorNote,
      parameters: {
        salinity:    buildReading(salinity,    'ppt', 'salinity',    'SIMULATED'),
        temperature: buildReading(temperature, '°C',  'temperature', 'LIVE'),
        rainfall:    buildReading(rainfall,    'mm',  'rainfall',    'LIVE'),
        wave_height: buildReading(waveHeight,  'm',   'wave_height', 'LIVE'),
        turbidity:   buildReading(turbidity,   'NTU', 'turbidity',   'SIMULATED'),
      },
    };
  } catch {
    const mock = generateFullMock();
    mock.coordinator_note = coordinatorNote;
    return mock;
  }
}

async function getForecast() {
  try {
    const [weather, marine] = await Promise.all([fetchOpenMeteo(), fetchOpenMeteoMarine()]);

    const forecast = [];
    for (let i = 1; i <= 7; i++) {
      const rainfall    = weather.daily?.precipitation_sum?.[i] ?? 5;
      const tempMax     = weather.daily?.temperature_2m_max?.[i] ?? 28;
      const waveHourIdx = i * 24;
      const waveHeight  = marine.hourly?.wave_height?.[waveHourIdx] ?? 0.4;
      const { salinity, turbidity } = generateMockConditions(rainfall, waveHeight);
      const score = calculateCSS({ salinity, temperature: tempMax, rainfall, wave_height: waveHeight, turbidity });
      const d = new Date();
      d.setDate(d.getDate() + i);
      forecast.push({ date: d.toISOString().split('T')[0], css_score: score, zone: getZone(score) });
    }
    return { forecast };
  } catch {
    return generateForecastMock();
  }
}

function setCoordinatorNote(text, override_zone) {
  coordinatorNote = { text, override_zone: override_zone ?? null, posted_at: new Date().toISOString() };
  return coordinatorNote;
}

function clearCoordinatorNote() {
  coordinatorNote = null;
}

module.exports = { getCurrentConditions, getForecast, setCoordinatorNote, clearCoordinatorNote };

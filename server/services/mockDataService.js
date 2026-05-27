const { calculateCSS, getZone, getParamZone } = require('./cssCalculator');

function generateMockConditions(rainfall = 5, waveHeight = 0.4) {
  const hour = new Date().getHours();
  const salinity  = parseFloat((32 + 3 * Math.sin(hour / 6) - (rainfall > 20 ? 8 : 0)).toFixed(1));
  const turbidity = parseFloat((8 + Math.random() * 5 + (waveHeight > 1 ? 15 : 0)).toFixed(1));
  return { salinity, turbidity };
}

function buildReading(value, unit, param, source) {
  return { value, unit, zone: getParamZone(value, param), source };
}

function generateFullMock() {
  const hour     = new Date().getHours();
  const rainfall = parseFloat((5 + Math.random() * 10).toFixed(1));
  const waveHeight = parseFloat((0.3 + Math.random() * 0.4).toFixed(2));
  const { salinity, turbidity } = generateMockConditions(rainfall, waveHeight);
  const temperature = parseFloat((27 + 2 * Math.sin(hour / 12)).toFixed(1));

  const params = { salinity, temperature, rainfall, wave_height: waveHeight, turbidity };
  const score  = calculateCSS(params);

  return {
    css_score: score,
    zone:      getZone(score),
    timestamp: new Date().toISOString(),
    coordinator_note: null,
    parameters: {
      salinity:    buildReading(salinity,    'ppt', 'salinity',    'SIMULATED'),
      temperature: buildReading(temperature, '°C',  'temperature', 'SIMULATED'),
      rainfall:    buildReading(rainfall,    'mm',  'rainfall',    'SIMULATED'),
      wave_height: buildReading(waveHeight,  'm',   'wave_height', 'SIMULATED'),
      turbidity:   buildReading(turbidity,   'NTU', 'turbidity',   'SIMULATED'),
    },
  };
}

function generateForecastMock() {
  const forecast = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const rain = Math.random() * 40;
    const wave = Math.random() * 1.5;
    const sal  = 32 + 3 * Math.random() - (rain > 20 ? 6 : 0);
    const temp = 27 + Math.random() * 4;
    const turb = 8 + Math.random() * 5 + (wave > 1 ? 15 : 0);
    const score = calculateCSS({ salinity: sal, temperature: temp, rainfall: rain, wave_height: wave, turbidity: turb });
    forecast.push({
      date:      d.toISOString().split('T')[0],
      css_score: score,
      zone:      getZone(score),
    });
  }
  return { forecast };
}

module.exports = { generateFullMock, generateMockConditions, generateForecastMock, buildReading };

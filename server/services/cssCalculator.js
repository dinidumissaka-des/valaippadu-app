const thresholds = require('../config/thresholds.json');

function normalise(value, param) {
  const t = thresholds[param];

  if (param === 'salinity' || param === 'temperature') {
    const [gLow, gHigh]     = t.green;
    const [aLowMin, aLowMax]   = t.amberLow;
    const [aHighMin, aHighMax] = t.amberHigh;
    if (value >= gLow && value <= gHigh) return 1.0;
    if (value >= aLowMin && value <= aLowMax)
      return 0.5 + 0.5 * ((value - aLowMin) / (aLowMax - aLowMin + 1));
    if (value >= aHighMin && value <= aHighMax)
      return 0.5 + 0.5 * ((aHighMax - value) / (aHighMax - aHighMin + 1));
    return 0.0;
  }

  const [gMin, gMax] = t.green;
  const [aMin, aMax] = t.amber;
  if (value <= gMax) return 1.0;
  if (value <= aMax) return 0.5 + 0.5 * ((aMax - value) / (aMax - aMin));
  return 0.0;
}

function calculateCSS(params) {
  return Math.round(
    normalise(params.salinity,    'salinity')    * thresholds.salinity.weight    * 100 +
    normalise(params.temperature, 'temperature') * thresholds.temperature.weight * 100 +
    normalise(params.rainfall,    'rainfall')    * thresholds.rainfall.weight    * 100 +
    normalise(params.wave_height, 'wave_height') * thresholds.wave_height.weight * 100 +
    normalise(params.turbidity,   'turbidity')   * thresholds.turbidity.weight   * 100
  );
}

function getZone(score) {
  if (score >= 75) return 'GO';
  if (score >= 40) return 'CAUTION';
  return 'STOP';
}

function getParamZone(value, param) {
  const n = normalise(value, param);
  if (n >= 0.9) return 'GREEN';
  if (n >= 0.4) return 'AMBER';
  return 'RED';
}

module.exports = { calculateCSS, getZone, getParamZone, normalise };

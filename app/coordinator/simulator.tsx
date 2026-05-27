import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useWeatherContext } from '../../context/WeatherContext';
import { useLanguage } from '../../hooks/useLanguage';
import { PALETTE, ZONE_COLORS, getZone } from '../../constants/Colors';
import { CSSGauge } from '../../components/CSSGauge';
import { SimulatorSlider } from '../../components/SimulatorSlider';
import { calculateCSS, ParameterValues } from '../../services/cssCalculator';
import { ParamKey } from '../../constants/thresholds';

const SLIDERS: ParamKey[] = ['salinity', 'temperature', 'rainfall', 'wave_height', 'turbidity'];

const DEFAULTS: ParameterValues = {
  salinity:    32,
  temperature: 28,
  rainfall:    5,
  wave_height: 0.4,
  turbidity:   10,
};

export default function SimulatorScreen() {
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

  const score = calculateCSS(params);
  const zone  = getZone(score);

  function updateParam(key: ParamKey, val: number) {
    setParams((prev) => ({ ...prev, [key]: parseFloat(val.toFixed(1)) }));
  }

  function resetToLive() {
    setParams(liveDefaults);
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* Simulator warning banner */}
      <View style={styles.warning}>
        <Text style={styles.warningText}>⚠️  {t('simulator_mode')} — {t('simulator_not_real')}</Text>
      </View>

      {/* Live gauge */}
      <View style={styles.gaugeWrap}>
        <CSSGauge score={score} zone={zone} lang={lang} />
      </View>

      {/* Sliders */}
      <View style={styles.sliders}>
        {SLIDERS.map((k) => (
          <SimulatorSlider
            key={k}
            paramKey={k}
            value={params[k as keyof ParameterValues]}
            onChange={(v) => updateParam(k, v)}
          />
        ))}
      </View>

      {/* Reset */}
      <TouchableOpacity style={styles.resetBtn} onPress={resetToLive}>
        <Text style={styles.resetText}>{t('reset_to_live')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:      { flex: 1, backgroundColor: PALETTE.bg },
  content:     { paddingBottom: 48 },
  warning:     { backgroundColor: '#451a03', borderLeftWidth: 4, borderLeftColor: '#f59e0b', paddingHorizontal: 16, paddingVertical: 12, marginBottom: 0 },
  warningText: { color: '#fcd34d', fontWeight: '700', fontSize: 13 },
  gaugeWrap:   { alignItems: 'center', paddingVertical: 24 },
  sliders:     { paddingHorizontal: 20 },
  resetBtn:    { marginHorizontal: 16, padding: 14, backgroundColor: PALETTE.surface, borderRadius: 8, borderWidth: 1, borderColor: PALETTE.border, alignItems: 'center', marginTop: 8 },
  resetText:   { color: PALETTE.textSecondary, fontSize: 14 },
});

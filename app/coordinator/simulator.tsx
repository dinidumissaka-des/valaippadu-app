import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useWeatherContext } from '../../context/WeatherContext';
import { useLanguage } from '../../hooks/useLanguage';
import { ZONE_COLORS, getZone } from '../../constants/Colors';
import { CSSGauge } from '../../components/CSSGauge';
import { SimulatorSlider } from '../../components/SimulatorSlider';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
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

  const score  = calculateCSS(params);
  const zone   = getZone(score);
  const colors = ZONE_COLORS[zone];

  function updateParam(key: ParamKey, val: number) {
    setParams((prev) => ({ ...prev, [key]: parseFloat(val.toFixed(1)) }));
  }

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ paddingBottom: 48 }}>
      {/* Warning banner */}
      <View className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex-row items-center gap-2">
        <Text className="text-base">⚠️</Text>
        <Text className="text-amber-800 font-semibold text-sm">{t('simulator_mode')} — {t('simulator_not_real')}</Text>
      </View>

      {/* Gauge */}
      <View className="items-center py-6">
        <CSSGauge score={score} zone={zone} lang={lang} />
      </View>

      <View className="px-4 gap-4">
        {/* Sliders card */}
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

        <Button variant="outline" onPress={() => setParams(liveDefaults)}>
          <Text className="text-slate-700 font-semibold text-sm">{t('reset_to_live')}</Text>
        </Button>
      </View>
    </ScrollView>
  );
}

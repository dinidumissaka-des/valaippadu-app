import React from 'react';
import { ScrollView, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useWeatherContext } from '../context/WeatherContext';
import { PALETTE } from '../constants/Colors';
import { ParameterGaugeBar } from '../components/ParameterGaugeBar';
import { ParamKey } from '../constants/thresholds';

const PARAM_ORDER: ParamKey[] = ['salinity', 'temperature', 'rainfall', 'wave_height', 'turbidity'];

export default function ParametersScreen() {
  const { current, loading } = useWeatherContext();

  if (loading || !current) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={PALETTE.live} size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {PARAM_ORDER.map((key) => {
        const reading = current.parameters[key];
        return (
          <ParameterGaugeBar
            key={key}
            paramKey={key}
            value={reading.value}
            source={reading.source}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:  { flex: 1, backgroundColor: PALETTE.bg },
  content: { padding: 20, paddingBottom: 40 },
  center:  { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: PALETTE.bg },
});

import React from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';
import { useWeatherContext } from '../context/WeatherContext';
import { ParameterGaugeBar } from '../components/ParameterGaugeBar';
import { Card, CardContent } from '../components/ui/card';
import { ParamKey } from '../constants/thresholds';

const PARAM_ORDER: ParamKey[] = ['salinity', 'temperature', 'rainfall', 'wave_height', 'turbidity'];

export default function ParametersScreen() {
  const { current, loading } = useWeatherContext();

  if (loading || !current) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator color="#16a34a" size="large" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Card>
        <CardContent className="pt-4">
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
        </CardContent>
      </Card>
    </ScrollView>
  );
}

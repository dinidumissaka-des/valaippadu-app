import React from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { StringKey } from '../constants/strings';
import { useLanguage } from '../hooks/useLanguage';
import { ParamKey, THRESHOLDS } from '../constants/thresholds';
import { ParameterValues } from '../services/cssCalculator';

interface Props {
  paramKey: ParamKey;
  value:    number;
  onChange: (v: number) => void;
}

export function SimulatorSlider({ paramKey, value, onChange }: Props) {
  const { t }  = useLanguage();
  const thresh = THRESHOLDS[paramKey] as any;

  return (
    <View className="mb-4">
      <View className="flex-row justify-between mb-1">
        <Text className="text-slate-700 font-semibold text-sm">{t(paramKey as StringKey)}</Text>
        <Text className="text-slate-900 text-sm" style={{ fontFamily: 'IBMPlexMono_700Bold' }}>
          {value.toFixed(1)} {thresh.unit}
        </Text>
      </View>
      <Slider
        style={{ width: '100%', height: 32 }}
        minimumValue={thresh.min}
        maximumValue={thresh.max}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor="#0ea5e9"
        maximumTrackTintColor="#e2e8f0"
        thumbTintColor="#0f172a"
        step={0.1}
      />
    </View>
  );
}

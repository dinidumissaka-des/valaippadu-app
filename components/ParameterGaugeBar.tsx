import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { useSharedValue, withTiming, Easing, useAnimatedStyle } from 'react-native-reanimated';
import { Badge } from './ui/badge';
import { THRESHOLDS, ParamKey } from '../constants/thresholds';
import { useLanguage } from '../hooks/useLanguage';
import { StringKey } from '../constants/strings';

interface Props {
  paramKey: ParamKey;
  value:    number;
  source:   'LIVE' | 'SIMULATED';
}

export function ParameterGaugeBar({ paramKey, value, source }: Props) {
  const { t } = useLanguage();
  const thresh = THRESHOLDS[paramKey] as any;
  const { min, max, unit } = thresh;

  const fraction = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const markerPos = useSharedValue(0);

  useEffect(() => {
    markerPos.value = withTiming(fraction, { duration: 600, easing: Easing.out(Easing.cubic) });
  }, [value]);

  const markerStyle = useAnimatedStyle(() => ({
    left: `${markerPos.value * 100}%` as any,
  }));

  return (
    <View className="mb-5">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-slate-800 font-semibold text-sm">{t(paramKey as StringKey)}</Text>
        <View className="flex-row items-center gap-2">
          <Text className="text-slate-900 font-bold text-sm" style={{ fontFamily: 'Manrope_700Bold' }}>
            {value} {unit}
          </Text>
          <Badge variant={source === 'LIVE' ? 'live' : 'simulated'}>
            {t(source.toLowerCase() as StringKey)}
          </Badge>
        </View>
      </View>

      <View className="h-3 flex-row rounded-full overflow-hidden relative">
        <View className="flex-1 bg-red-100" />
        <View className="flex-1 bg-amber-100" />
        <View className="flex-[2] bg-green-100" />
        <View className="flex-1 bg-amber-100" />
        <View className="flex-1 bg-red-100" />
        <Animated.View
          style={[markerStyle, {
            position: 'absolute', top: -2, width: 7, height: 19,
            borderRadius: 4, backgroundColor: '#0f172a', marginLeft: -3.5,
            shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 3, elevation: 3,
          }]}
        />
      </View>

      {thresh.green && (
        <Text className="text-slate-400 text-xs mt-1">
          {t('optimal')}: {thresh.green[0]}–{thresh.green[1]} {unit}
        </Text>
      )}
    </View>
  );
}

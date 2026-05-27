import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StringKey } from '../constants/strings';
import { useLanguage } from '../hooks/useLanguage';
import { ParameterReading } from '../services/cssCalculator';
import { ZONE_COLORS } from '../constants/Colors';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const ICONS: Record<string, IoniconName> = {
  salinity:    'water-outline',
  temperature: 'thermometer-outline',
  rainfall:    'rainy-outline',
  wave_height: 'navigate-outline',
  turbidity:   'eye-off-outline',
};

const ZONE_TEXT: Record<string, string> = {
  GREEN: '#16a34a',
  AMBER: '#d97706',
  RED:   '#dc2626',
};

interface Props {
  paramKey: string;
  reading:  ParameterReading;
  onPress?: () => void;
}

export function ParameterCard({ paramKey, reading, onPress }: Props) {
  const { t } = useLanguage();
  const zoneColor = ZONE_TEXT[reading.zone] ?? '#64748b';
  const dotColor  = reading.source === 'LIVE' ? '#16a34a' : '#94a3b8';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="mr-2 bg-white rounded-xl border border-slate-200 p-2 items-center"
      style={{ width: 72 }}
    >
      <Ionicons name={ICONS[paramKey] ?? 'analytics-outline'} size={16} color="#94a3b8" style={{ marginBottom: 4 }} />

      <Text style={{ color: zoneColor, fontFamily: 'Manrope_500Medium', fontSize: 14, lineHeight: 18 }}>
        {reading.value}
      </Text>
      <Text className="text-slate-400 text-center" style={{ fontSize: 9 }}>{reading.unit}</Text>
      <View className="flex-row items-center gap-1 mt-1">
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: dotColor }} />
        <Text className="text-slate-400" style={{ fontSize: 10 }} numberOfLines={1}>
          {t(paramKey as StringKey)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

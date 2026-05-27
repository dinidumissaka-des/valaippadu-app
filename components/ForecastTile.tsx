import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { ZONE_COLORS } from '../constants/Colors';
import { ForecastDay } from '../services/cssCalculator';

const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface Props {
  day:     ForecastDay;
  onPress?: () => void;
}

export function ForecastTile({ day, onPress }: Props) {
  const colors  = ZONE_COLORS[day.zone];
  const dayName = DAY_ABBR[new Date(day.date + 'T00:00:00').getDay()];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className="mr-2 w-16 bg-white rounded-xl border border-slate-200 p-2.5 items-center"
      style={{ borderColor: colors.border }}
    >
      <Text className="text-slate-500 text-xs mb-2">{dayName}</Text>
      <View className="rounded-lg px-1.5 py-0.5 mb-2" style={{ backgroundColor: colors.background }}>
        <Text style={{ color: colors.primary, fontFamily: 'Manrope_800ExtraBold', fontSize: 18 }}>
          {day.css_score}
        </Text>
      </View>
      <View className="w-5 rounded-sm" style={{ height: Math.max(3, (day.css_score / 100) * 28), backgroundColor: colors.primary }} />
    </TouchableOpacity>
  );
}

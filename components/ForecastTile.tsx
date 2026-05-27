import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { ZONE_COLORS } from '../constants/Colors';
import { ForecastDay } from '../services/cssCalculator';

const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TODAY    = new Date().toISOString().split('T')[0];

interface Props {
  day:     ForecastDay;
  onPress?: () => void;
}

export function ForecastTile({ day, onPress }: Props) {
  const colors   = ZONE_COLORS[day.zone];
  const isToday  = day.date === TODAY;
  const dayName  = isToday ? 'Today' : DAY_ABBR[new Date(day.date + 'T00:00:00').getDay()];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="mr-1.5 bg-white rounded-xl border p-2 items-center"
      style={{ width: 44, borderColor: isToday ? colors.primary : '#e2e8f0' }}
    >
      <Text className="text-center mb-1" style={{ fontSize: 9, color: '#94a3b8' }}>{dayName}</Text>
      <Text style={{ color: colors.primary, fontFamily: 'Manrope_500Medium', fontSize: 13 }}>
        {day.css_score}
      </Text>
      {/* Score bar */}
      <View className="w-full mt-1.5 bg-slate-100 rounded-sm overflow-hidden" style={{ height: 3 }}>
        <View style={{ width: `${day.css_score}%`, height: 3, backgroundColor: colors.primary, borderRadius: 2 }} />
      </View>
    </TouchableOpacity>
  );
}

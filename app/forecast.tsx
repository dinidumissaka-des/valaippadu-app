import React from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { useWeatherContext } from '../context/WeatherContext';
import { useLanguage } from '../hooks/useLanguage';
import { ZONE_COLORS } from '../constants/Colors';
import { ForecastDay } from '../services/cssCalculator';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function ForecastRow({ day, isToday }: { day: ForecastDay; isToday: boolean }) {
  const { t }    = useLanguage();
  const colors   = ZONE_COLORS[day.zone];
  const dateObj  = new Date(day.date + 'T00:00:00');
  const dayName  = DAY_NAMES[dateObj.getDay()];
  const dateStr  = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
  const zoneKey  = day.zone.toLowerCase() as 'go' | 'caution' | 'stop';

  return (
    <View
      className="bg-white rounded-xl border border-slate-200 p-4 mb-3 overflow-hidden"
      style={isToday ? { borderColor: colors.border, borderWidth: 1.5 } : {}}
    >
      {isToday && (
        <View className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ backgroundColor: colors.primary }} />
      )}
      <View className="flex-row justify-between items-start mb-3 pl-2">
        <View>
          <Text className="text-slate-900 font-bold text-base">{dayName}</Text>
          <Text className="text-slate-400 text-xs mt-0.5">{dateStr}</Text>
        </View>
        <View className="items-end">
          <Text style={{ color: colors.primary, fontFamily: 'IBMPlexMono_700Bold', fontSize: 28 }}>
            {day.css_score}
          </Text>
          <Text className="text-xs font-semibold" style={{ color: colors.text }}>
            {t(zoneKey)}
          </Text>
        </View>
      </View>
      <View className="h-2 bg-slate-100 rounded-full overflow-hidden ml-2">
        <View
          className="h-full rounded-full"
          style={{ width: `${day.css_score}%`, backgroundColor: colors.primary }}
        />
      </View>
    </View>
  );
}

export default function ForecastScreen() {
  const { forecast, loading } = useWeatherContext();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator color="#16a34a" size="large" />
      </View>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      {forecast.map((day) => (
        <ForecastRow key={day.date} day={day} isToday={day.date === today} />
      ))}
    </ScrollView>
  );
}

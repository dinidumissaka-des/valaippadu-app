import React from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useWeatherContext } from '../context/WeatherContext';
import { useLanguage } from '../hooks/useLanguage';
import { PALETTE, ZONE_COLORS, Zone } from '../constants/Colors';
import { ForecastDay } from '../services/cssCalculator';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function ForecastRow({ day, isToday }: { day: ForecastDay; isToday: boolean }) {
  const { t } = useLanguage();
  const colors   = ZONE_COLORS[day.zone];
  const dateObj  = new Date(day.date + 'T00:00:00');
  const dayName  = DAY_NAMES[dateObj.getDay()];
  const dateStr  = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
  const barWidth = `${day.css_score}%` as any;
  const zoneKey  = day.zone.toLowerCase() as 'go' | 'caution' | 'stop';

  return (
    <View style={[styles.row, isToday && styles.todayRow]}>
      {isToday && <View style={[styles.todayAccent, { backgroundColor: colors.primary }]} />}
      <View style={styles.rowHeader}>
        <Text style={styles.dayName}>{dayName}</Text>
        <Text style={styles.dateStr}>{dateStr}</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: barWidth, backgroundColor: colors.primary }]} />
      </View>
      <View style={styles.rowFooter}>
        <Text style={[styles.zoneLabel, { color: colors.primary }]}>
          {t(zoneKey)} · {t(zoneKey)}
        </Text>
        <Text style={[styles.scoreNum, { color: colors.primary }]}>{day.css_score}</Text>
      </View>
    </View>
  );
}

export default function ForecastScreen() {
  const { forecast, loading } = useWeatherContext();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={PALETTE.live} size="large" />
      </View>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {forecast.map((day, i) => (
        <ForecastRow key={day.date} day={day} isToday={day.date === today} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:      { flex: 1, backgroundColor: PALETTE.bg },
  content:     { padding: 16, paddingBottom: 40 },
  center:      { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: PALETTE.bg },
  row: {
    backgroundColor: PALETTE.surface,
    borderRadius:    8,
    padding:         16,
    marginBottom:    10,
    borderWidth:     1,
    borderColor:     PALETTE.border,
    overflow:        'hidden',
  },
  todayRow:    { borderColor: '#475569' },
  todayAccent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, borderRadius: 3 },
  rowHeader:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  dayName:     { color: PALETTE.textPrimary, fontWeight: '700', fontSize: 14 },
  dateStr:     { color: PALETTE.textSecondary, fontSize: 13 },
  barTrack:    { height: 10, backgroundColor: PALETTE.border, borderRadius: 5, overflow: 'hidden', marginBottom: 8 },
  barFill:     { height: '100%', borderRadius: 5 },
  rowFooter:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  zoneLabel:   { fontSize: 12, fontWeight: '600', letterSpacing: 1 },
  scoreNum:    { fontFamily: 'IBMPlexMono_700Bold', fontSize: 20 },
});

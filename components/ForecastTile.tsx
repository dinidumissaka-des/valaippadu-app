import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { ZONE_COLORS, PALETTE, Zone } from '../constants/Colors';
import { ForecastDay } from '../services/cssCalculator';

interface Props {
  day:     ForecastDay;
  onPress?: () => void;
}

const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ForecastTile({ day, onPress }: Props) {
  const colors  = ZONE_COLORS[day.zone];
  const dayName = DAY_ABBR[new Date(day.date + 'T00:00:00').getDay()];

  return (
    <TouchableOpacity style={[styles.tile, { borderColor: colors.primary + '40' }]} onPress={onPress} activeOpacity={0.75}>
      <Text style={styles.day}>{dayName}</Text>
      <View style={[styles.scoreBubble, { backgroundColor: colors.background }]}>
        <Text style={[styles.score, { color: colors.primary }]}>{day.css_score}</Text>
      </View>
      <View style={[styles.bar, { backgroundColor: colors.primary, height: Math.max(2, (day.css_score / 100) * 32) }]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: PALETTE.surface,
    borderRadius:    8,
    padding:         10,
    width:           72,
    marginRight:     8,
    alignItems:      'center',
    borderWidth:     1,
  },
  day:         { color: PALETTE.textSecondary, fontSize: 11, marginBottom: 6 },
  scoreBubble: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginBottom: 6 },
  score:       { fontFamily: 'IBMPlexMono_700Bold', fontSize: 18 },
  bar:         { width: 24, borderRadius: 2, alignSelf: 'center' },
});

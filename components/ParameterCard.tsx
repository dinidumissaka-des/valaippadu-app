import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { PALETTE } from '../constants/Colors';
import { StringKey } from '../constants/strings';
import { useLanguage } from '../hooks/useLanguage';
import { ParameterReading } from '../services/cssCalculator';

const ZONE_DOT: Record<string, string> = {
  GREEN: '#22c55e',
  AMBER: '#f59e0b',
  RED:   '#ef4444',
};

const ICONS: Record<string, string> = {
  salinity:    '🧂',
  temperature: '🌡️',
  rainfall:    '🌧️',
  wave_height: '🌊',
  turbidity:   '💧',
};

interface Props {
  paramKey: string;
  reading:  ParameterReading;
  onPress?: () => void;
}

export function ParameterCard({ paramKey, reading, onPress }: Props) {
  const { t } = useLanguage();
  const dotColor = ZONE_DOT[reading.zone];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <Text style={styles.icon}>{ICONS[paramKey] ?? '📊'}</Text>
      <Text style={styles.value}>
        {reading.value}
        <Text style={styles.unit}> {reading.unit}</Text>
      </Text>
      <Text style={styles.label}>{t(paramKey as StringKey)}</Text>
      <View style={styles.sourceBadge}>
        <View style={[styles.dot, { backgroundColor: reading.source === 'LIVE' ? PALETTE.live : PALETTE.simulated }]} />
        <Text style={styles.sourceText}>{t(reading.source.toLowerCase() as StringKey)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: PALETTE.surface,
    borderRadius:    8,
    padding:         14,
    width:           110,
    marginRight:     10,
    borderWidth:     1,
    borderColor:     PALETTE.border,
    alignItems:      'center',
  },
  icon:       { fontSize: 22, marginBottom: 6 },
  value:      { fontSize: 20, fontFamily: 'IBMPlexMono_700Bold', color: PALETTE.textPrimary },
  unit:       { fontSize: 12, color: PALETTE.textSecondary, fontFamily: 'IBMPlexMono_400Regular' },
  label:      { fontSize: 11, color: PALETTE.textSecondary, marginTop: 4, textAlign: 'center' },
  sourceBadge:{ flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  dot:        { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  sourceText: { fontSize: 9, color: PALETTE.textSecondary, letterSpacing: 0.5 },
});

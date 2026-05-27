import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withTiming, Easing, useAnimatedStyle } from 'react-native-reanimated';
import { PALETTE } from '../constants/Colors';
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
  const thresh = THRESHOLDS[paramKey];
  const { min, max, unit } = thresh as any;

  const clampedFraction = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const markerPos = useSharedValue(0);

  useEffect(() => {
    markerPos.value = withTiming(clampedFraction, { duration: 600, easing: Easing.out(Easing.cubic) });
  }, [value]);

  const markerStyle = useAnimatedStyle(() => ({
    left: `${markerPos.value * 100}%` as any,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{t(paramKey as StringKey)}</Text>
        <View style={styles.rightRow}>
          <Text style={styles.value}>{value} {unit}</Text>
          <View style={[styles.dot, { backgroundColor: source === 'LIVE' ? PALETTE.live : PALETTE.simulated }]} />
          <Text style={styles.source}>{t(source.toLowerCase() as StringKey)}</Text>
        </View>
      </View>

      <View style={styles.track}>
        {/* Red → Amber → Green → Amber → Red segments */}
        <View style={[styles.seg, { flex: 1, backgroundColor: '#450a0a' }]} />
        <View style={[styles.seg, { flex: 1, backgroundColor: '#451a03' }]} />
        <View style={[styles.seg, { flex: 2, backgroundColor: '#052e16' }]} />
        <View style={[styles.seg, { flex: 1, backgroundColor: '#451a03' }]} />
        <View style={[styles.seg, { flex: 1, backgroundColor: '#450a0a' }]} />

        {/* Marker */}
        <Animated.View style={[styles.marker, markerStyle]} />
      </View>

      {(thresh as any).green && (
        <Text style={styles.optimal}>
          {t('optimal')}: {(thresh as any).green[0]}–{(thresh as any).green[1]} {unit}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  header:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  label:     { color: PALETTE.textPrimary, fontSize: 13, fontWeight: '600', letterSpacing: 0.5 },
  rightRow:  { flexDirection: 'row', alignItems: 'center' },
  value:     { color: PALETTE.textPrimary, fontFamily: 'IBMPlexMono_700Bold', fontSize: 13, marginRight: 6 },
  dot:       { width: 7, height: 7, borderRadius: 4, marginRight: 4 },
  source:    { color: PALETTE.textSecondary, fontSize: 10 },
  track:     { height: 12, flexDirection: 'row', borderRadius: 6, overflow: 'hidden', position: 'relative' },
  seg:       { height: '100%' },
  marker:    {
    position:      'absolute',
    top:           -3,
    width:         6,
    height:        18,
    borderRadius:  3,
    backgroundColor: '#ffffff',
    marginLeft:    -3,
    shadowColor:   '#000',
    shadowOpacity: 0.6,
    shadowRadius:  4,
    elevation:     4,
  },
  optimal: { color: PALETTE.textSecondary, fontSize: 11, marginTop: 4 },
});

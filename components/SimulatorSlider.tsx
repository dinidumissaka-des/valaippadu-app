import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { PALETTE } from '../constants/Colors';
import { useLanguage } from '../hooks/useLanguage';
import { StringKey } from '../constants/strings';
import { ParamKey, THRESHOLDS } from '../constants/thresholds';

interface Props {
  paramKey: ParamKey;
  value:    number;
  onChange: (v: number) => void;
}

export function SimulatorSlider({ paramKey, value, onChange }: Props) {
  const { t } = useLanguage();
  const thresh = THRESHOLDS[paramKey] as any;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>{t(paramKey as StringKey)}</Text>
        <Text style={styles.value}>{value.toFixed(1)} {thresh.unit}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={thresh.min}
        maximumValue={thresh.max}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor='#f59e0b'
        maximumTrackTintColor={PALETTE.border}
        thumbTintColor='#f1f5f9'
        step={0.1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  row:       { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label:     { color: PALETTE.textPrimary, fontSize: 13, fontWeight: '600' },
  value:     { color: PALETTE.textSecondary, fontFamily: 'IBMPlexMono_700Bold', fontSize: 13 },
  slider:    { width: '100%', height: 32 },
});

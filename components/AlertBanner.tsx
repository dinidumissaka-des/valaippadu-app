import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../hooks/useLanguage';

export function AlertBanner() {
  const { t } = useLanguage();
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>⚠️  {t('do_not_cultivate')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#450a0a',
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical:   12,
    marginBottom:      12,
  },
  text: { color: '#fca5a5', fontWeight: '700', fontSize: 14, letterSpacing: 0.5 },
});

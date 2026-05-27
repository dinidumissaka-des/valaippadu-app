import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PALETTE } from '../constants/Colors';
import { useLanguage } from '../hooks/useLanguage';

interface Props {
  text:      string;
  postedAt?: string;
  onClear?:  () => void;
  showClear?: boolean;
}

export function CoordinatorNote({ text, postedAt, onClear, showClear = false }: Props) {
  const { t } = useLanguage();
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.heading}>📋  {t('coordinator_message')}</Text>
        {showClear && onClear && (
          <TouchableOpacity onPress={onClear}>
            <Text style={styles.clear}>{t('clear_note')}</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.body}>{text}</Text>
      {postedAt && (
        <Text style={styles.time}>{new Date(postedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#451a03',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    paddingHorizontal: 16,
    paddingVertical:   12,
    marginBottom:      12,
    borderRadius:      4,
  },
  row:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  heading: { color: '#fcd34d', fontWeight: '700', fontSize: 12, letterSpacing: 0.5 },
  clear:   { color: '#f59e0b', fontSize: 12, textDecorationLine: 'underline' },
  body:    { color: '#fde68a', fontSize: 14, lineHeight: 20 },
  time:    { color: '#92400e', fontSize: 10, marginTop: 6 },
});

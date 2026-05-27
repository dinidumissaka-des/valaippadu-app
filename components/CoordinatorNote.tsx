import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../hooks/useLanguage';

interface Props {
  text:       string;
  postedAt?:  string;
  onClear?:   () => void;
  showClear?: boolean;
}

export function CoordinatorNote({ text, postedAt, onClear, showClear = false }: Props) {
  const { t } = useLanguage();
  return (
    <View className="mx-4 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 flex-row gap-2">
      <Ionicons name="chatbubble-ellipses-outline" size={15} color="#d97706" style={{ marginTop: 1 }} />
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text style={{ fontSize: 10, fontFamily: 'Manrope_600SemiBold', color: '#92400e', textTransform: 'uppercase', letterSpacing: 0.6 }}>
            {t('coordinator_message')}
          </Text>
          {showClear && onClear && (
            <TouchableOpacity onPress={onClear}>
              <Text style={{ fontSize: 10, color: '#d97706', textDecorationLine: 'underline' }}>{t('clear_note')}</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={{ fontSize: 12, color: '#92400e', lineHeight: 17, fontFamily: 'Manrope_400Regular' }}>
          {text}
        </Text>
        {postedAt && (
          <Text style={{ fontSize: 9, color: '#d97706', marginTop: 4 }}>
            {new Date(postedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
      </View>
    </View>
  );
}

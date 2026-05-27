import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../hooks/useLanguage';

export function AlertBanner() {
  const { t } = useLanguage();
  return (
    <View className="mx-4 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 flex-row items-center gap-2">
      <Ionicons name="warning-outline" size={16} color="#dc2626" />
      <View className="flex-1">
        <Text style={{ fontSize: 12, fontFamily: 'Manrope_600SemiBold', color: '#dc2626' }}>
          {t('do_not_cultivate')}
        </Text>
        <Text style={{ fontSize: 10, fontFamily: 'NotoSansTamil_400Regular', color: '#dc2626', marginTop: 1 }}>
          இன்று பயிரிட வேண்டாம்
        </Text>
      </View>
    </View>
  );
}

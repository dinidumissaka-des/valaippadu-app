import React from 'react';
import { View, Text } from 'react-native';
import { useLanguage } from '../hooks/useLanguage';

export function AlertBanner() {
  const { t } = useLanguage();
  return (
    <View className="mx-4 mb-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex-row items-center gap-2">
      <Text className="text-base">⛔</Text>
      <Text className="text-red-700 font-bold text-sm flex-1">{t('do_not_cultivate')}</Text>
    </View>
  );
}

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
    <View className="mx-4 mb-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-amber-800 font-bold text-xs tracking-wider uppercase">
          📋  {t('coordinator_message')}
        </Text>
        {showClear && onClear && (
          <TouchableOpacity onPress={onClear}>
            <Text className="text-amber-600 text-xs underline">{t('clear_note')}</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text className="text-amber-900 text-sm leading-5">{text}</Text>
      {postedAt && (
        <Text className="text-amber-400 text-xs mt-2">
          {new Date(postedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      )}
    </View>
  );
}

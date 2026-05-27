import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { cn } from '../lib/utils';
import { useLanguage } from '../hooks/useLanguage';

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <View className="flex-row rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
      <TouchableOpacity
        className={cn('px-3 py-1.5', lang === 'en' && 'bg-white border-r border-slate-200')}
        onPress={() => setLang('en')}
      >
        <Text className={cn('text-xs font-semibold', lang === 'en' ? 'text-slate-900' : 'text-slate-400')}>EN</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={cn('px-3 py-1.5', lang === 'ta' && 'bg-white')}
        onPress={() => setLang('ta')}
      >
        <Text className={cn('text-xs font-semibold', lang === 'ta' ? 'text-slate-900' : 'text-slate-400')}>தமிழ்</Text>
      </TouchableOpacity>
    </View>
  );
}

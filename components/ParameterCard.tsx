import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { StringKey } from '../constants/strings';
import { useLanguage } from '../hooks/useLanguage';
import { ParameterReading } from '../services/cssCalculator';

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
  const zoneColors: Record<string, string> = {
    GREEN: 'text-green-600',
    AMBER: 'text-amber-600',
    RED:   'text-red-600',
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75} className="mr-3">
      <Card className="w-28">
        <CardContent className="p-3 items-center">
          <Text className="text-2xl mb-2">{ICONS[paramKey] ?? '📊'}</Text>
          <Text className={`font-bold text-lg ${zoneColors[reading.zone]}`} style={{ fontFamily: 'Manrope_800ExtraBold' }}>
            {reading.value}
          </Text>
          <Text className="text-slate-400 text-xs">{reading.unit}</Text>
          <Text className="text-slate-600 text-xs mt-1 text-center" numberOfLines={1}>
            {t(paramKey as StringKey)}
          </Text>
          <Badge
            variant={reading.source === 'LIVE' ? 'live' : 'simulated'}
            className="mt-2"
          >
            {t(reading.source.toLowerCase() as StringKey)}
          </Badge>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
}

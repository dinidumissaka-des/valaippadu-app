import React from 'react';
import { ScrollView, View, Text, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useWeatherContext } from '../../context/WeatherContext';
import { useLanguage } from '../../hooks/useLanguage';
import { ZONE_COLORS } from '../../constants/Colors';
import { CSSGauge } from '../../components/CSSGauge';
import { ParameterCard } from '../../components/ParameterCard';
import { ForecastTile } from '../../components/ForecastTile';
import { AlertBanner } from '../../components/AlertBanner';
import { CoordinatorNote } from '../../components/CoordinatorNote';
import { LanguageToggle } from '../../components/LanguageToggle';
import { Separator } from '../../components/ui/separator';

export default function HomeScreen() {
  const { current, forecast, loading, refreshing, refresh, lang } = useWeatherContext();
  const { t } = useLanguage();
  const router = useRouter();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator color="#16a34a" size="large" />
      </View>
    );
  }

  const zone      = current?.zone ?? 'CAUTION';
  const score     = current?.css_score ?? 0;
  const showAlert = score < 40;
  const params    = current?.parameters;
  const note      = current?.coordinator_note;
  const updatedAt = current?.timestamp ? new Date(current.timestamp) : null;
  const colors    = ZONE_COLORS[zone];

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#16a34a" />}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 pt-14 pb-3 bg-white border-b border-slate-100">
        <View>
          <Text className="text-slate-900 font-bold text-base" style={{ fontFamily: 'IBMPlexMono_700Bold' }}>
            🌊 Valaippadu
          </Text>
          <Text className="text-slate-400 text-xs mt-0.5">Cultivation Suitability</Text>
        </View>
        <LanguageToggle />
      </View>

      {/* Gauge card */}
      <View className="mx-4 mt-4 bg-white rounded-2xl border border-slate-200 items-center py-6 shadow-sm"
        style={{ borderColor: colors.border }}>
        <CSSGauge score={score} zone={zone} lang={lang} />
        <View className="flex-row items-center mt-2 gap-2">
          <View className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
          <Text className="text-slate-500 text-xs">
            {updatedAt
              ? `${t('updated')} ${updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              : 'Loading…'}
          </Text>
        </View>
      </View>

      {/* Coordinator note */}
      {note && <View className="mt-3"><CoordinatorNote text={note.text} postedAt={note.posted_at} /></View>}

      {/* Alert */}
      {showAlert && <View className="mt-3"><AlertBanner /></View>}

      <View className="px-4 mt-5">
        <Separator />
      </View>

      {/* Parameters */}
      {params && (
        <View className="mt-4 px-4">
          <Text className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-3">
            {t('today_conditions')}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {(Object.keys(params) as Array<keyof typeof params>).map((k) => (
              <ParameterCard
                key={k}
                paramKey={k}
                reading={params[k]}
                onPress={() => router.push('/parameters')}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Forecast */}
      {forecast.length > 0 && (
        <View className="mt-5 px-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-slate-500 text-xs font-bold tracking-widest uppercase">
              {t('forecast')}
            </Text>
            <TouchableOpacity onPress={() => router.push('/forecast')}>
              <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                {t('see_all')} →
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {forecast.slice(0, 5).map((d) => (
              <ForecastTile key={d.date} day={d} onPress={() => router.push('/forecast')} />
            ))}
          </ScrollView>
        </View>
      )}

      <View className="h-10" />
    </ScrollView>
  );
}

import React from 'react';
import {
  ScrollView, View, Text, RefreshControl,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWeatherContext } from '../../context/WeatherContext';
import { useLanguage } from '../../hooks/useLanguage';
import { ZONE_COLORS } from '../../constants/Colors';
import { CSSGauge } from '../../components/CSSGauge';
import { ParameterCard } from '../../components/ParameterCard';
import { ForecastTile } from '../../components/ForecastTile';
import { AlertBanner } from '../../components/AlertBanner';
import { CoordinatorNote } from '../../components/CoordinatorNote';
import { LanguageToggle } from '../../components/LanguageToggle';

// ─── Skeleton ────────────────────────────────────────────────────────────────

function Skel({ w, h, r = 8 }: { w: number | string; h: number; r?: number }) {
  return (
    <View style={{ width: w as any, height: h, borderRadius: r, backgroundColor: '#e2e8f0' }} />
  );
}

function LoadingSkeleton() {
  return (
    <ScrollView className="flex-1 bg-slate-50" scrollEnabled={false}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 bg-white border-b border-slate-100"
        style={{ paddingTop: 56, paddingBottom: 12 }}>
        <View className="flex-row items-center gap-2.5">
          <Skel w={32} h={32} r={16} />
          <View>
            <Skel w={80} h={13} r={6} />
            <View style={{ marginTop: 5 }}><Skel w={130} h={10} r={5} /></View>
          </View>
        </View>
        <Skel w={64} h={28} r={14} />
      </View>

      {/* Gauge */}
      <View className="mx-4 mt-4 bg-white rounded-2xl border border-slate-200 items-center py-6">
        <Skel w={148} h={148} r={74} />
        <View style={{ marginTop: 10 }}><Skel w={140} h={10} r={5} /></View>
      </View>

      {/* Params label + cards */}
      <View className="mt-5 px-4">
        <Skel w={110} h={9} r={4} />
        <View className="flex-row gap-2 mt-3">
          {[0, 1, 2, 3, 4].map((i) => <Skel key={i} w={72} h={82} r={12} />)}
        </View>
      </View>

      {/* Forecast label + tiles */}
      <View className="mt-5 px-4">
        <Skel w={100} h={9} r={4} />
        <View className="flex-row gap-1.5 mt-3">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => <Skel key={i} w={44} h={72} r={12} />)}
        </View>
      </View>
    </ScrollView>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

function ErrorState({ onRetry }: { onRetry: () => void }) {
  const { t } = useLanguage();
  return (
    <View className="flex-1 items-center justify-center bg-slate-50 px-8">
      <Ionicons name="cloud-offline-outline" size={48} color="#94a3b8" />
      <Text style={{ fontFamily: 'Manrope_600SemiBold', fontSize: 16, color: '#475569', marginTop: 16, marginBottom: 20, textAlign: 'center' }}>
        {t('error_load')}
      </Text>
      <TouchableOpacity
        onPress={onRetry}
        style={{ backgroundColor: '#0f172a', borderRadius: 12, paddingHorizontal: 28, paddingVertical: 12 }}
      >
        <Text style={{ fontFamily: 'Manrope_600SemiBold', fontSize: 14, color: '#ffffff' }}>
          {t('retry')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Home screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const { current, forecast, loading, refreshing, error, refresh, refetch, lang, lastUpdated, clearNote } = useWeatherContext();
  const { t } = useLanguage();
  const router = useRouter();

  if (loading) return <LoadingSkeleton />;
  if (error && !current) return <ErrorState onRetry={refetch} />;

  const zone      = current?.zone ?? 'CAUTION';
  const score     = current?.css_score ?? 0;
  const params    = current?.parameters;
  const note      = current?.coordinator_note;
  const showAlert = zone === 'STOP';
  const colors    = ZONE_COLORS[zone];

  const updatedStr = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;
  const nextStr = lastUpdated
    ? new Date(lastUpdated.getTime() + 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  const hasSimulated = params
    ? Object.values(params).some((r) => r.source === 'SIMULATED')
    : false;

  const now      = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayLabel = `${dayNames[now.getDay()]}, ${now.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {/* ── Header ── */}
      <View
        className="flex-row justify-between items-center px-4 bg-white border-b border-slate-100"
        style={{ paddingTop: 56, paddingBottom: 12 }}
      >
        <View className="flex-row items-center gap-2.5">
          <View style={{
            width: 32, height: 32, borderRadius: 10,
            backgroundColor: colors.primary,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Ionicons name="fish-outline" size={16} color="#ffffff" />
          </View>
          <View>
            <Text style={{ fontFamily: 'Manrope_800ExtraBold', fontSize: 15, color: '#0f172a', lineHeight: 19 }}>
              {t('app_name')}
            </Text>
            <Text style={{ fontFamily: 'NotoSansTamil_400Regular', fontSize: 9, color: '#94a3b8', lineHeight: 13 }}>
              வல்லிபாடு · {dayLabel}
            </Text>
          </View>
        </View>
        <LanguageToggle />
      </View>

      {/* ── Gauge card ── */}
      <View
        className="mx-4 mt-4 bg-white rounded-2xl border items-center py-5"
        style={{ borderColor: colors.border }}
      >
        <CSSGauge score={score} zone={zone} lang={lang} />
        {updatedStr && (
          <Text style={{ fontSize: 10, color: '#94a3b8', marginTop: 6, fontFamily: 'Manrope_400Regular' }}>
            {t('updated')} {updatedStr}
            {nextStr ? `  ·  ${t('next_update')} ${nextStr}` : ''}
          </Text>
        )}
      </View>

      {/* ── Coordinator note ── */}
      {note && (
        <View className="mt-3">
          <CoordinatorNote
            text={note.text}
            postedAt={note.posted_at}
            showClear={false}
          />
        </View>
      )}

      {/* ── Alert banner ── */}
      {showAlert && <View className="mt-3"><AlertBanner /></View>}

      {/* ── Parameters ── */}
      {params && (
        <View className="mt-5">
          <View className="flex-row justify-between items-center px-4 mb-3">
            <Text style={{ fontSize: 10, fontFamily: 'Manrope_600SemiBold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8 }}>
              {t('today_conditions')}
            </Text>
            <TouchableOpacity onPress={() => router.push('/parameters')}>
              <Text style={{ fontSize: 12, fontFamily: 'Manrope_600SemiBold', color: colors.primary }}>
                {t('details')} →
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
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

      {/* ── 7-day forecast ── */}
      {forecast.length > 0 && (
        <View className="mt-5">
          <View className="flex-row justify-between items-center px-4 mb-3">
            <Text style={{ fontSize: 10, fontFamily: 'Manrope_600SemiBold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8 }}>
              {t('forecast')}
            </Text>
            <TouchableOpacity onPress={() => router.push('/forecast')}>
              <Text style={{ fontSize: 12, fontFamily: 'Manrope_600SemiBold', color: colors.primary }}>
                {t('see_all')} →
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {forecast.map((d) => (
              <ForecastTile key={d.date} day={d} onPress={() => router.push('/forecast')} />
            ))}
          </ScrollView>
        </View>
      )}

      {/* ── Footer data-source row ── */}
      {params && (
        <View className="flex-row items-center justify-center gap-1.5 mt-5 px-4">
          <View style={{
            width: 6, height: 6, borderRadius: 3,
            backgroundColor: hasSimulated ? '#d97706' : '#16a34a',
          }} />
          <Text style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'Manrope_400Regular' }}>
            {hasSimulated ? t('simulated') : t('live')}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

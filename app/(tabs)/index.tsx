import React from 'react';
import {
  ScrollView, View, Text, StyleSheet, RefreshControl,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useWeatherContext } from '../../context/WeatherContext';
import { useLanguage } from '../../hooks/useLanguage';
import { PALETTE, ZONE_COLORS } from '../../constants/Colors';
import { CSSGauge } from '../../components/CSSGauge';
import { ParameterCard } from '../../components/ParameterCard';
import { ForecastTile } from '../../components/ForecastTile';
import { AlertBanner } from '../../components/AlertBanner';
import { CoordinatorNote } from '../../components/CoordinatorNote';
import { LanguageToggle } from '../../components/LanguageToggle';

export default function HomeScreen() {
  const { current, forecast, loading, refreshing, refresh, lang } = useWeatherContext();
  const { t } = useLanguage();
  const router = useRouter();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={PALETTE.live} size="large" />
      </View>
    );
  }

  const zone     = current?.zone ?? 'CAUTION';
  const score    = current?.css_score ?? 0;
  const showAlert = score < 40;
  const params   = current?.parameters;
  const note     = current?.coordinator_note;
  const updatedAt = current?.timestamp ? new Date(current.timestamp) : null;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={PALETTE.live} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🌊 Valaippadu</Text>
        <LanguageToggle />
      </View>

      {/* Gauge */}
      <View style={styles.gaugeWrap}>
        <CSSGauge score={score} zone={zone} lang={lang} />
      </View>

      {/* Coordinator note */}
      {note && (
        <CoordinatorNote text={note.text} postedAt={note.posted_at} />
      )}

      {/* Alert */}
      {showAlert && <AlertBanner />}

      {/* Parameters */}
      {params && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('today_conditions')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
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

      {/* Forecast strip */}
      {forecast.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>{t('forecast')}</Text>
            <TouchableOpacity onPress={() => router.push('/forecast')}>
              <Text style={[styles.seeAll, { color: ZONE_COLORS[zone].primary }]}>{t('see_all')} →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
            {forecast.slice(0, 5).map((d) => (
              <ForecastTile key={d.date} day={d} onPress={() => router.push('/forecast')} />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Footer */}
      {updatedAt && (
        <Text style={styles.footer}>
          {t('updated')} {updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:       { flex: 1, backgroundColor: PALETTE.bg },
  content:      { paddingBottom: 40 },
  center:       { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: PALETTE.bg },
  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12, backgroundColor: PALETTE.surface, borderBottomWidth: 1, borderBottomColor: PALETTE.border },
  headerTitle:  { color: PALETTE.textPrimary, fontFamily: 'IBMPlexMono_700Bold', fontSize: 16, letterSpacing: 1 },
  gaugeWrap:    { alignItems: 'center', paddingVertical: 28 },
  section:      { paddingHorizontal: 16, marginBottom: 20 },
  sectionTitle: { color: PALETTE.textSecondary, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 },
  sectionRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  seeAll:       { fontSize: 13, fontWeight: '600' },
  hScroll:      { overflow: 'visible' },
  footer:       { textAlign: 'center', color: PALETTE.textSecondary, fontSize: 11, marginTop: 8 },
});

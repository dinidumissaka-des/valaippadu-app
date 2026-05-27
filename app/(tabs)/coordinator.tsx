import React, { useState } from 'react';
import {
  ScrollView, View, Text, TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useWeatherContext } from '../../context/WeatherContext';
import { useLanguage } from '../../hooks/useLanguage';
import { ZONE_COLORS, Zone } from '../../constants/Colors';
import { CSSGauge } from '../../components/CSSGauge';
import { CoordinatorNote } from '../../components/CoordinatorNote';
import { ParameterGaugeBar } from '../../components/ParameterGaugeBar';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { postCoordinatorNote, deleteCoordinatorNote } from '../../services/api';
import { ParamKey } from '../../constants/thresholds';
import { cn } from '../../lib/utils';

const PARAM_ORDER: ParamKey[] = ['salinity', 'temperature', 'rainfall', 'wave_height', 'turbidity'];
const ZONES: Zone[] = ['GO', 'CAUTION', 'STOP'];

export default function CoordinatorScreen() {
  const { current, loading, lang, clearNote, refetch } = useWeatherContext();
  const { t } = useLanguage();
  const router = useRouter();

  const [noteText,     setNoteText]     = useState('');
  const [overrideZone, setOverrideZone] = useState<Zone | null>(null);
  const [sending,      setSending]      = useState(false);

  const zone  = current?.zone  ?? 'CAUTION';
  const score = current?.css_score ?? 0;
  const note  = current?.coordinator_note;

  async function handleSend() {
    if (!noteText.trim()) return;
    setSending(true);
    try {
      await postCoordinatorNote(noteText.trim(), overrideZone);
      setNoteText('');
      setOverrideZone(null);
      await refetch();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSending(false);
    }
  }

  async function handleClearNote() {
    try {
      await deleteCoordinatorNote();
      clearNote();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator color="#16a34a" size="large" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white border-b border-slate-100 px-4 pt-14 pb-3">
        <Text className="text-slate-900 font-bold text-base" style={{ fontFamily: 'IBMPlexMono_700Bold' }}>
          {t('coordinator_dashboard')}
        </Text>
      </View>

      {/* Gauge */}
      <View className="items-center py-6">
        <CSSGauge score={score} zone={zone} lang={lang} />
      </View>

      <View className="px-4 gap-4 pb-10">
        {/* Active note */}
        {note && (
          <CoordinatorNote
            text={note.text}
            postedAt={note.posted_at}
            onClear={handleClearNote}
            showClear
          />
        )}

        {/* Post note */}
        <Card>
          <CardHeader>
            <CardTitle>{t('post_note')}</CardTitle>
          </CardHeader>
          <CardContent>
            <TextInput
              className="border border-slate-200 rounded-lg p-3 text-slate-900 text-sm bg-slate-50 min-h-[80px]"
              multiline
              numberOfLines={3}
              value={noteText}
              onChangeText={setNoteText}
              placeholder="Write a message for farmers…"
              placeholderTextColor="#94a3b8"
              textAlignVertical="top"
            />

            <Text className="text-slate-500 text-xs mt-3 mb-2">{t('override_zone')}</Text>
            <View className="flex-row gap-2 mb-4">
              <View
                className={cn('px-3 py-2 rounded-lg border', overrideZone === null ? 'border-slate-400 bg-slate-100' : 'border-slate-200')}
                onTouchEnd={() => setOverrideZone(null)}
              >
                <Text className="text-slate-600 text-xs font-semibold">—</Text>
              </View>
              {ZONES.map((z) => {
                const c = ZONE_COLORS[z];
                const active = overrideZone === z;
                return (
                  <View
                    key={z}
                    className="px-3 py-2 rounded-lg border"
                    style={active ? { borderColor: c.primary, backgroundColor: c.background } : { borderColor: '#e2e8f0' }}
                    onTouchEnd={() => setOverrideZone(z)}
                  >
                    <Text className="text-xs font-semibold" style={{ color: active ? c.primary : '#64748b' }}>
                      {t(z.toLowerCase() as any)}
                    </Text>
                  </View>
                );
              })}
            </View>

            <Button
              variant="success"
              onPress={handleSend}
              disabled={!noteText.trim()}
              loading={sending}
            >
              {t('send_to_farmers')}
            </Button>
          </CardContent>
        </Card>

        {/* Parameters */}
        {current?.parameters && (
          <Card>
            <CardHeader><CardTitle>All Parameters</CardTitle></CardHeader>
            <CardContent>
              {PARAM_ORDER.map((k) => (
                <ParameterGaugeBar
                  key={k}
                  paramKey={k}
                  value={current.parameters[k].value}
                  source={current.parameters[k].source}
                />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Simulator link */}
        <Button variant="outline" onPress={() => router.push('/coordinator/simulator')}>
          <Text className="text-slate-700 font-semibold text-sm">{t('open_simulator')} →</Text>
        </Button>
      </View>
    </ScrollView>
  );
}

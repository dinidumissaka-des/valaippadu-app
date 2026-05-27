import React, { useState } from 'react';
import {
  ScrollView, View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useWeatherContext } from '../../context/WeatherContext';
import { useLanguage } from '../../hooks/useLanguage';
import { PALETTE, ZONE_COLORS, Zone } from '../../constants/Colors';
import { CSSGauge } from '../../components/CSSGauge';
import { CoordinatorNote } from '../../components/CoordinatorNote';
import { ParameterGaugeBar } from '../../components/ParameterGaugeBar';
import { postCoordinatorNote, deleteCoordinatorNote } from '../../services/api';
import { ParamKey } from '../../constants/thresholds';

const PARAM_ORDER: ParamKey[] = ['salinity', 'temperature', 'rainfall', 'wave_height', 'turbidity'];
const ZONES: Zone[] = ['GO', 'CAUTION', 'STOP'];

export default function CoordinatorScreen() {
  const { current, loading, lang, clearNote, refetch } = useWeatherContext();
  const { t } = useLanguage();
  const router = useRouter();

  const [noteText,      setNoteText]      = useState('');
  const [overrideZone,  setOverrideZone]  = useState<Zone | null>(null);
  const [sending,       setSending]       = useState(false);

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
      <View style={styles.center}>
        <ActivityIndicator color={PALETTE.live} size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('coordinator_dashboard')}</Text>
      </View>

      {/* Gauge */}
      <View style={styles.gaugeWrap}>
        <CSSGauge score={score} zone={zone} lang={lang} />
      </View>

      {/* Active note */}
      {note && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('active_note')}</Text>
          <CoordinatorNote
            text={note.text}
            postedAt={note.posted_at}
            onClear={handleClearNote}
            showClear
          />
        </View>
      )}

      {/* Post note form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('post_note')}</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={3}
          value={noteText}
          onChangeText={setNoteText}
          placeholder="Write a message for farmers…"
          placeholderTextColor={PALETTE.textSecondary}
        />

        {/* Zone override picker */}
        <Text style={styles.overrideLabel}>{t('override_zone')}</Text>
        <View style={styles.zoneRow}>
          <TouchableOpacity
            style={[styles.zoneBtn, overrideZone === null && styles.zoneBtnActive]}
            onPress={() => setOverrideZone(null)}
          >
            <Text style={styles.zoneBtnText}>—</Text>
          </TouchableOpacity>
          {ZONES.map((z) => (
            <TouchableOpacity
              key={z}
              style={[styles.zoneBtn, overrideZone === z && { backgroundColor: ZONE_COLORS[z].background, borderColor: ZONE_COLORS[z].primary }]}
              onPress={() => setOverrideZone(z)}
            >
              <Text style={[styles.zoneBtnText, overrideZone === z && { color: ZONE_COLORS[z].primary }]}>{t(z.toLowerCase() as any)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.sendBtn, (!noteText.trim() || sending) && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!noteText.trim() || sending}
        >
          <Text style={styles.sendBtnText}>{sending ? '…' : t('send_to_farmers')}</Text>
        </TouchableOpacity>
      </View>

      {/* Parameter bars */}
      {current?.parameters && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Parameters</Text>
          {PARAM_ORDER.map((k) => (
            <ParameterGaugeBar
              key={k}
              paramKey={k}
              value={current.parameters[k].value}
              source={current.parameters[k].source}
            />
          ))}
        </View>
      )}

      {/* Simulator link */}
      <TouchableOpacity style={styles.simLink} onPress={() => router.push('/coordinator/simulator')}>
        <Text style={styles.simLinkText}>{t('open_simulator')} →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:         { flex: 1, backgroundColor: PALETTE.bg },
  content:        { paddingBottom: 48 },
  center:         { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: PALETTE.bg },
  header:         { paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12, backgroundColor: PALETTE.surface, borderBottomWidth: 1, borderBottomColor: PALETTE.border },
  headerTitle:    { color: PALETTE.textPrimary, fontFamily: 'IBMPlexMono_700Bold', fontSize: 15, letterSpacing: 1 },
  gaugeWrap:      { alignItems: 'center', paddingVertical: 24 },
  section:        { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle:   { color: PALETTE.textSecondary, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 },
  input: {
    backgroundColor: PALETTE.surface,
    borderWidth:     1,
    borderColor:     PALETTE.border,
    borderRadius:    8,
    padding:         12,
    color:           PALETTE.textPrimary,
    fontSize:        14,
    minHeight:       88,
    textAlignVertical: 'top',
    marginBottom:    12,
  },
  overrideLabel:  { color: PALETTE.textSecondary, fontSize: 12, marginBottom: 8 },
  zoneRow:        { flexDirection: 'row', gap: 8, marginBottom: 16 },
  zoneBtn:        { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6, borderWidth: 1, borderColor: PALETTE.border, backgroundColor: PALETTE.surface },
  zoneBtnActive:  { borderColor: PALETTE.textSecondary },
  zoneBtnText:    { color: PALETTE.textSecondary, fontWeight: '600', fontSize: 13 },
  sendBtn:        { backgroundColor: '#22c55e', borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  sendBtnDisabled:{ backgroundColor: '#1a3d25' },
  sendBtnText:    { color: '#052e16', fontWeight: '800', fontSize: 14, letterSpacing: 1 },
  simLink:        { marginHorizontal: 16, padding: 14, backgroundColor: PALETTE.surface, borderRadius: 8, borderWidth: 1, borderColor: PALETTE.border, alignItems: 'center' },
  simLinkText:    { color: PALETTE.textSecondary, fontSize: 14 },
});

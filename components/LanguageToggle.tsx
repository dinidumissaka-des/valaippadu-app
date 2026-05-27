import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { PALETTE } from '../constants/Colors';
import { useLanguage } from '../hooks/useLanguage';

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={[styles.btn, lang === 'en' && styles.active]}
        onPress={() => setLang('en')}
      >
        <Text style={[styles.text, lang === 'en' && styles.activeText]}>EN</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity
        style={[styles.btn, lang === 'ta' && styles.active]}
        onPress={() => setLang('ta')}
      >
        <Text style={[styles.text, lang === 'ta' && styles.activeText]}>தமிழ்</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row:        { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: PALETTE.border, borderRadius: 6 },
  btn:        { paddingHorizontal: 10, paddingVertical: 5 },
  active:     { backgroundColor: PALETTE.border },
  text:       { color: PALETTE.textSecondary, fontSize: 12, fontWeight: '600' },
  activeText: { color: PALETTE.textPrimary },
  divider:    { width: 1, height: '100%', backgroundColor: PALETTE.border },
});

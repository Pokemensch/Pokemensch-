import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { COLORS, FONTS } from '../constants/theme';

const SPORT_OPTIONS = [
  'Kraftsport', 'Laufen', 'Fussball', 'Kampfsport', 'Schwimmen',
  'Yoga', 'Klettern', 'Tennis', 'Radfahren', 'Tanzen', 'Schach', 'Wandern',
];

const DEGREE_OPTIONS = [
  { key: 'hauptschule', label: 'Hauptschule' },
  { key: 'realschule', label: 'Realschule' },
  { key: 'abitur', label: 'Abitur' },
  { key: 'ausbildung', label: 'Ausbildung' },
  { key: 'meister', label: 'Meister' },
  { key: 'bachelor', label: 'Bachelor' },
  { key: 'master', label: 'Master / Diplom' },
  { key: 'staatsexamen', label: 'Staatsexamen' },
  { key: 'promotion', label: 'Promotion (Dr.)' },
];

export default function CreateProfileScreen() {
  const [profession, setProfession] = useState('');
  const [yearsExp, setYearsExp] = useState('');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  function toggleItem(item: string, list: string[], setter: (v: string[]) => void) {
    if (list.includes(item)) setter(list.filter(i => i !== item));
    else setter([...list, item]);
  }

  async function handleSave() {
    if (!profession.trim()) {
      Alert.alert('Fehler', 'Bitte gib deinen Beruf ein.');
      return;
    }
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    const { error } = await supabase.from('life_inputs').upsert({
      user_id: user.id,
      profession: profession.trim(),
      years_experience: parseInt(yearsExp) || 0,
      sports: selectedSports,
      body: { weight: parseFloat(weight) || 0, height: parseFloat(height) || 0 },
      degrees: selectedDegrees,
      hobbies: [],
    }, { onConflict: 'user_id' });

    setSaving(false);
    if (error) {
      Alert.alert('Fehler', error.message);
    } else {
      router.replace('/(tabs)/dashboard');
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <Text style={styles.sectionTitle}>Dein Beruf</Text>
        <TextInput
          style={styles.input}
          placeholder="z.B. Maurer, Anwalt, Designer..."
          placeholderTextColor={COLORS.textDim}
          value={profession}
          onChangeText={setProfession}
        />

        <Text style={styles.sectionTitle}>Jahre Berufserfahrung</Text>
        <TextInput
          style={styles.input}
          placeholder="z.B. 5"
          placeholderTextColor={COLORS.textDim}
          value={yearsExp}
          onChangeText={setYearsExp}
          keyboardType="numeric"
        />

        <Text style={styles.sectionTitle}>Abschlüsse</Text>
        <View style={styles.chipContainer}>
          {DEGREE_OPTIONS.map(d => (
            <TouchableOpacity
              key={d.key}
              style={[styles.chip, selectedDegrees.includes(d.key) && styles.chipActive]}
              onPress={() => toggleItem(d.key, selectedDegrees, setSelectedDegrees)}
            >
              <Text style={[styles.chipText, selectedDegrees.includes(d.key) && styles.chipTextActive]}>
                {d.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Sportarten</Text>
        <View style={styles.chipContainer}>
          {SPORT_OPTIONS.map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, selectedSports.includes(s) && styles.chipActive]}
              onPress={() => toggleItem(s, selectedSports, setSelectedSports)}
            >
              <Text style={[styles.chipText, selectedSports.includes(s) && styles.chipTextActive]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Körperdaten (optional)</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.inputHalf]}
            placeholder="Gewicht (kg)"
            placeholderTextColor={COLORS.textDim}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.inputHalf]}
            placeholder="Größe (cm)"
            placeholderTextColor={COLORS.textDim}
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Speichert...' : 'Charakter erstellen'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: FONTS.size.lg, fontWeight: 'bold', color: COLORS.text, marginTop: 20, marginBottom: 10 },
  input: {
    backgroundColor: COLORS.card, borderRadius: 10, padding: 14,
    fontSize: FONTS.size.md, color: COLORS.text,
  },
  inputHalf: { flex: 1, marginRight: 8 },
  row: { flexDirection: 'row' },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: COLORS.card, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: COLORS.cardLight,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.textDim, fontSize: FONTS.size.sm },
  chipTextActive: { color: '#fff' },
  saveButton: {
    backgroundColor: COLORS.primary, borderRadius: 12, padding: 18,
    alignItems: 'center', marginTop: 30,
  },
  buttonDisabled: { opacity: 0.5 },
  saveButtonText: { color: '#fff', fontSize: FONTS.size.lg, fontWeight: 'bold' },
});

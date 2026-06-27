import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { COLORS, FONTS } from '../constants/theme';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAuth() {
    if (!email || !password) {
      Alert.alert('Fehler', 'Bitte E-Mail und Passwort eingeben.');
      return;
    }
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) Alert.alert('Login fehlgeschlagen', error.message);
      else router.replace('/(tabs)/dashboard');
    } else {
      if (!displayName) {
        Alert.alert('Fehler', 'Bitte einen Anzeigenamen eingeben.');
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      });
      if (error) Alert.alert('Registrierung fehlgeschlagen', error.message);
      else {
        Alert.alert('Geschafft!', 'Dein Account wurde erstellt. Du kannst jetzt loslegen.');
        router.replace('/(tabs)/dashboard');
      }
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>POKEMENSCH</Text>
        <Text style={styles.subtitle}>Spiel dich selbst.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{isLogin ? 'Einloggen' : 'Account erstellen'}</Text>

          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Anzeigename"
              placeholderTextColor={COLORS.textDim}
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="E-Mail"
            placeholderTextColor={COLORS.textDim}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Passwort"
            placeholderTextColor={COLORS.textDim}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleAuth}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? '...' : isLogin ? 'Einloggen' : 'Registrieren'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchButton}>
            <Text style={styles.switchText}>
              {isLogin ? 'Noch kein Account? Registrieren' : 'Schon einen Account? Einloggen'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: FONTS.size.title, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center' },
  subtitle: { fontSize: FONTS.size.lg, color: COLORS.textDim, textAlign: 'center', marginBottom: 40 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: 24 },
  cardTitle: { fontSize: FONTS.size.xl, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 },
  input: {
    backgroundColor: COLORS.cardLight, borderRadius: 10, padding: 14,
    fontSize: FONTS.size.md, color: COLORS.text, marginBottom: 12,
  },
  button: {
    backgroundColor: COLORS.primary, borderRadius: 10, padding: 16,
    alignItems: 'center', marginTop: 8,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: FONTS.size.lg, fontWeight: 'bold' },
  switchButton: { marginTop: 16, alignItems: 'center' },
  switchText: { color: COLORS.textDim, fontSize: FONTS.size.sm },
});

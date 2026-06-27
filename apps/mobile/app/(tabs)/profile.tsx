import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { COLORS, FONTS } from '../../constants/theme';

export default function ProfileScreen() {
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert('Fehler', error.message);
    else router.replace('/auth');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Einstellungen</Text>

      <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/create-profile')}>
        <Text style={styles.menuText}>Profil bearbeiten</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.menuItem, styles.logoutButton]} onPress={handleLogout}>
        <Text style={[styles.menuText, styles.logoutText]}>Ausloggen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 20 },
  title: { fontSize: FONTS.size.xl, fontWeight: 'bold', color: COLORS.text, marginBottom: 24 },
  menuItem: {
    backgroundColor: COLORS.card, borderRadius: 12, padding: 16, marginBottom: 12,
  },
  menuText: { fontSize: FONTS.size.md, color: COLORS.text },
  logoutButton: { marginTop: 20, backgroundColor: COLORS.cardLight },
  logoutText: { color: COLORS.primary },
});

import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { COLORS, FONTS } from '../../constants/theme';

// Inline game-logic (can't import workspace packages in Expo Go easily)
type CharacterClass = 'krieger' | 'magier' | 'schurke' | 'priester';
type Element = 'wasser' | 'feuer' | 'schatten' | 'licht' | 'erde' | 'sturm';

const CLASS_LABELS: Record<CharacterClass, string> = {
  krieger: 'Krieger', magier: 'Magier', schurke: 'Schurke', priester: 'Priester',
};

const CLASS_MECHANIC: Record<CharacterClass, string> = {
  krieger: 'Reaktions-Schlag', magier: 'Wissens-Resonanz', schurke: 'Combo-Flow', priester: 'Atemrhythmus',
};

const ELEMENT_LABELS: Record<Element, string> = {
  wasser: 'Wasser', feuer: 'Feuer', schatten: 'Schatten', licht: 'Licht', erde: 'Erde', sturm: 'Sturm',
};

const PROFESSION_CLASS_MAP: [string[], CharacterClass, Element][] = [
  [['maurer', 'schreiner', 'tischler', 'zimmerer', 'dachdecker', 'maler', 'lackierer', 'betonbauer'], 'krieger', 'erde'],
  [['elektriker', 'elektroniker', 'mechaniker', 'mechatroniker', 'schlosser', 'installateur', 'klempner'], 'krieger', 'feuer'],
  [['logistik', 'lager', 'fahrer', 'transport', 'post'], 'krieger', 'erde'],
  [['polizei', 'soldat', 'feuerwehr', 'rettung', 'sicherheit'], 'krieger', 'erde'],
  [['sportler', 'trainer', 'fitness'], 'krieger', 'sturm'],
  [['anwalt', 'jurist', 'richter', 'notar', 'recht', 'verwaltung', 'beamte', 'steuerberater'], 'magier', 'licht'],
  [['programmierer', 'entwickler', 'software', 'informatik', 'it', 'ingenieur', 'techniker'], 'magier', 'sturm'],
  [['wissenschaft', 'forscher', 'professor', 'lehrer'], 'magier', 'licht'],
  [['vertrieb', 'verkauf', 'marketing', 'handel', 'kaufmann', 'makler', 'berater'], 'schurke', 'sturm'],
  [['designer', 'grafik', 'design', 'medien', 'fotograf', 'kreativ', 'journalist', 'autor'], 'schurke', 'schatten'],
  [['koch', 'gastro', 'bäcker', 'konditor', 'metzger'], 'schurke', 'feuer'],
  [['pflege', 'krankenpfleger', 'arzt', 'medizin', 'therapeut', 'apotheker', 'zahnarzt'], 'priester', 'licht'],
  [['sozial', 'erzieher', 'pädagoge', 'coaching', 'coach', 'psychologe', 'betreuer'], 'priester', 'licht'],
];

function classifyProfession(prof: string): { class: CharacterClass; element: Element } {
  const lower = prof.toLowerCase();
  for (const [keywords, cls, elem] of PROFESSION_CLASS_MAP) {
    if (keywords.some(kw => lower.includes(kw))) return { class: cls, element: elem };
  }
  return { class: 'krieger', element: 'erde' };
}

interface Stats { str: number; aus: number; int: number; ges: number; wil: number; cha: number }

const STAT_LABELS: Record<keyof Stats, string> = {
  str: 'Stärke', aus: 'Ausdauer', int: 'Intelligenz', ges: 'Geschick', wil: 'Wille', cha: 'Charisma',
};

function calcStats(profession: string, yearsExp: number, sports: string[], body: any, degrees: string[]): Stats {
  const { class: cls } = classifyProfession(profession);
  const biases: Record<CharacterClass, Stats> = {
    krieger:  { str: 3, aus: 2, int: 0, ges: 1, wil: 1, cha: 0 },
    magier:   { str: 0, aus: 0, int: 3, ges: 0, wil: 2, cha: 2 },
    schurke:  { str: 0, aus: 0, int: 1, ges: 3, wil: 0, cha: 2 },
    priester: { str: 0, aus: 1, int: 2, ges: 0, wil: 2, cha: 2 },
  };
  const bias = biases[cls];
  const stats: Stats = {
    str: 8 + bias.str, aus: 8 + bias.aus, int: 8 + bias.int,
    ges: 8 + bias.ges, wil: 8 + bias.wil, cha: 8 + bias.cha,
  };

  const exp = Math.min(Math.log(yearsExp + 1) * 3, 15);
  stats.aus += Math.round(exp * 0.5);
  stats.wil += Math.round(exp * 0.3);

  const degreeBonuses: Record<string, Partial<Stats>> = {
    hauptschule: { int: 1 }, realschule: { int: 2 }, abitur: { int: 3 },
    ausbildung: { str: 1, aus: 1, ges: 1 }, meister: { aus: 3, wil: 2, cha: 1 },
    bachelor: { int: 3 }, master: { int: 4, wil: 2 },
    staatsexamen: { int: 4, wil: 3 }, promotion: { int: 6, wil: 2 },
  };
  for (const d of degrees) {
    const b = degreeBonuses[d];
    if (b) for (const [k, v] of Object.entries(b)) stats[k as keyof Stats] += v;
  }

  for (const [k, v] of Object.entries(stats)) stats[k as keyof Stats] = Math.max(1, Math.round(v));
  return stats;
}

export default function DashboardScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [lifeInputs, setLifeInputs] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [profileRes, lifeRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('life_inputs').select('*').eq('user_id', user.id).single(),
    ]);

    if (profileRes.data) setProfile(profileRes.data);
    if (lifeRes.data) setLifeInputs(lifeRes.data);
  }, []);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  if (!lifeInputs) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Willkommen bei Pokemensch!</Text>
          <Text style={styles.emptyText}>
            Erstelle deinen Charakter aus deinem echten Leben.
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push('/create-profile')}
          >
            <Text style={styles.createButtonText}>Charakter erstellen</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const { class: charClass, element } = classifyProfession(lifeInputs.profession);
  const stats = calcStats(
    lifeInputs.profession,
    lifeInputs.years_experience,
    lifeInputs.sports || [],
    lifeInputs.body || {},
    lifeInputs.degrees || [],
  );
  const maxStat = Math.max(...Object.values(stats));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scroll}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.charName}>{profile?.display_name || 'Held'}</Text>
        <Text style={styles.profession}>{lifeInputs.profession}</Text>
        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: COLORS[charClass] }]}>
            <Text style={styles.badgeText}>{CLASS_LABELS[charClass]}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: COLORS[element] }]}>
            <Text style={styles.badgeText}>{ELEMENT_LABELS[element]}</Text>
          </View>
        </View>
        <Text style={styles.mechanic}>Kampfstil: {CLASS_MECHANIC[charClass]}</Text>
      </View>

      {/* Werte */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Werte</Text>
        {(Object.entries(stats) as [keyof Stats, number][]).map(([key, value]) => (
          <View key={key} style={styles.statRow}>
            <Text style={styles.statLabel}>{STAT_LABELS[key]}</Text>
            <View style={styles.statBarBg}>
              <View style={[styles.statBarFill, { width: `${(value / maxStat) * 100}%`, backgroundColor: COLORS[charClass] }]} />
            </View>
            <Text style={styles.statValue}>{value}</Text>
          </View>
        ))}
      </View>

      {/* Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Profil</Text>
        <Text style={styles.infoRow}>Erfahrung: {lifeInputs.years_experience} Jahre</Text>
        {lifeInputs.sports?.length > 0 && (
          <Text style={styles.infoRow}>Sport: {lifeInputs.sports.join(', ')}</Text>
        )}
        {lifeInputs.degrees?.length > 0 && (
          <Text style={styles.infoRow}>Abschlüsse: {lifeInputs.degrees.join(', ')}</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push('/create-profile')}
      >
        <Text style={styles.editButtonText}>Profil bearbeiten</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 20, paddingBottom: 40 },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: FONTS.size.xl, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 },
  emptyText: { fontSize: FONTS.size.md, color: COLORS.textDim, textAlign: 'center', marginBottom: 30 },
  createButton: { backgroundColor: COLORS.primary, borderRadius: 12, paddingHorizontal: 32, paddingVertical: 16 },
  createButtonText: { color: '#fff', fontSize: FONTS.size.lg, fontWeight: 'bold' },

  header: { alignItems: 'center', marginBottom: 24 },
  charName: { fontSize: FONTS.size.xxl, fontWeight: 'bold', color: COLORS.text },
  profession: { fontSize: FONTS.size.lg, color: COLORS.textDim, marginTop: 4 },
  badges: { flexDirection: 'row', gap: 8, marginTop: 12 },
  badge: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: FONTS.size.sm },
  mechanic: { color: COLORS.textDim, fontSize: FONTS.size.sm, marginTop: 8 },

  statsCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, marginBottom: 16 },
  statsTitle: { fontSize: FONTS.size.lg, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 },
  statRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  statLabel: { width: 90, fontSize: FONTS.size.sm, color: COLORS.textDim },
  statBarBg: { flex: 1, height: 10, backgroundColor: COLORS.cardLight, borderRadius: 5, marginHorizontal: 8 },
  statBarFill: { height: 10, borderRadius: 5 },
  statValue: { width: 30, textAlign: 'right', fontSize: FONTS.size.md, fontWeight: 'bold', color: COLORS.text },

  infoCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, marginBottom: 16 },
  infoTitle: { fontSize: FONTS.size.lg, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 },
  infoRow: { fontSize: FONTS.size.md, color: COLORS.textDim, marginBottom: 6 },

  editButton: { backgroundColor: COLORS.cardLight, borderRadius: 12, padding: 16, alignItems: 'center' },
  editButtonText: { color: COLORS.text, fontSize: FONTS.size.md },
});

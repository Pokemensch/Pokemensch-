import { Tabs } from 'expo-router';
import { COLORS } from '../../constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: COLORS.card, borderTopColor: COLORS.cardLight },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textDim,
        headerStyle: { backgroundColor: COLORS.bg },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{ title: 'Charakter', tabBarLabel: 'Charakter' }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profil', tabBarLabel: 'Profil' }}
      />
    </Tabs>
  );
}

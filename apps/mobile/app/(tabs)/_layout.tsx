import { Tabs } from 'expo-router';
import { BottomNavigation } from '../../src/design-system/components';

export default function TabsLayout() {
  return <Tabs tabBar={(props) => <BottomNavigation {...props} />} screenOptions={{ headerShown: false }} initialRouteName="index">
    <Tabs.Screen name="index" options={{ title: 'Home' }} />
    <Tabs.Screen name="quests" options={{ title: 'Quests' }} />
    <Tabs.Screen name="goals" options={{ title: 'Goals' }} />
    <Tabs.Screen name="achievements" options={{ title: 'Achievements' }} />
    <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
  </Tabs>;
}

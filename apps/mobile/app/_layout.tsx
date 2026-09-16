import { Stack } from 'expo-router';
import '../global.css';
import { QuestProvider } from '../src/features/quests/QuestProvider';
export default function RootLayout() {
  return <QuestProvider><Stack screenOptions={{ headerShown: false }} /></QuestProvider>;
}

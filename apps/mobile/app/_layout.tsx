import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Redirect, useRouter, useSegments } from 'expo-router';
import '../global.css';
import { QuestProvider } from '../src/features/quests/QuestProvider';
import { AuthProvider, useAuth } from '../src/features/auth/AuthProvider';

function AuthGate() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated && !inAuthGroup) router.replace('/login');
    if (isAuthenticated && inAuthGroup) router.replace('/(tabs)');
  }, [inAuthGroup, isAuthenticated, isLoading, router]);

  if (isLoading) return null;
  if (!isAuthenticated && !inAuthGroup) return <Redirect href="/login" />;
  if (isAuthenticated && inAuthGroup) return <Redirect href="/(tabs)" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return <AuthProvider><QuestProvider><AuthGate /></QuestProvider></AuthProvider>;
}

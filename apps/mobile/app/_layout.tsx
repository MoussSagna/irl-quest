import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Redirect, useRouter, useSegments } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import '../global.css';
import { QuestProvider } from '../src/features/quests/QuestProvider';
import { AuthProvider, useAuth } from '../src/features/auth/AuthProvider';
import { colors, spacing, typography } from '../src/design-system/tokens';

function AuthGate() {
  const { isAuthenticated, isLoading, configurationError } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated && !inAuthGroup) router.replace('/login');
    if (isAuthenticated && inAuthGroup) router.replace('/(tabs)');
  }, [inAuthGroup, isAuthenticated, isLoading, router]);

  if (isLoading) return null;
  if (configurationError) {
    return <View style={styles.errorScreen}><Text style={styles.eyebrow}>IRL QUEST</Text><Text style={styles.title}>API configuration needed</Text><Text style={styles.message}>{configurationError.message}</Text></View>;
  }
  if (!isAuthenticated && !inAuthGroup) return <Redirect href="/login" />;
  if (isAuthenticated && inAuthGroup) return <Redirect href="/(tabs)" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return <AuthProvider><QuestProvider><AuthGate /></QuestProvider></AuthProvider>;
}

const styles = StyleSheet.create({
  errorScreen: { flex: 1, justifyContent: 'center', padding: spacing.xl, backgroundColor: colors.background },
  eyebrow: { color: colors.primary, ...typography.label, letterSpacing: 2, marginBottom: spacing.md },
  title: { color: colors.ink, ...typography.title, marginBottom: spacing.md },
  message: { color: colors.muted, ...typography.body },
});

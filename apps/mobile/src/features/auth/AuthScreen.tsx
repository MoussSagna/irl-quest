import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Screen } from '../../design-system/components';
import { colors, spacing, typography } from '../../design-system/tokens';
import { useAuth } from './AuthProvider';

type AuthScreenProps = { mode: 'login' | 'register' };

export function AuthScreen({ mode }: AuthScreenProps) {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isRegister = mode === 'register';

  const submit = async () => {
    setError('');
    if (!email.trim() || !email.includes('@')) return setError('Enter a valid email address.');
    if (password.length < 8) return setError('Password must contain at least 8 characters.');
    if (isRegister && !name.trim()) return setError('Enter your name.');
    if (isRegister && password !== confirmation) return setError('Passwords do not match.');
    setLoading(true);
    try {
      if (isRegister) await signUp(name.trim(), email.trim(), password);
      else await signIn(email.trim(), password);
      router.replace('/(tabs)');
    } catch (requestError) {
      setError((requestError as Error).message || 'Unable to authenticate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return <Screen><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboard}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <Text style={styles.eyebrow}>IRL QUEST</Text>
    <Text style={styles.title}>{isRegister ? 'Begin your quest.' : 'Welcome back, Explorer.'}</Text>
    <Text style={styles.subtitle}>{isRegister ? 'Create your account and turn progress into a game.' : 'Continue your real-world progression.'}</Text>
    <Card style={styles.form}>
      {isRegister && <Field label="Name" value={name} onChangeText={setName} placeholder="Your display name" testID="auth-name" />}
      <Field label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" testID="auth-email" />
      <Field label="Password" value={password} onChangeText={setPassword} placeholder="At least 8 characters" secureTextEntry testID="auth-password" />
      {isRegister && <Field label="Confirm password" value={confirmation} onChangeText={setConfirmation} placeholder="Repeat your password" secureTextEntry testID="auth-confirm-password" />}
      {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
      <Pressable accessibilityRole="button" accessibilityLabel={isRegister ? 'Register' : 'Login'} disabled={loading} onPress={submit} style={[styles.submit, loading && styles.disabled]}><Text style={styles.submitText}>{loading ? 'Loading…' : isRegister ? 'Create account' : 'Login'}</Text></Pressable>
    </Card>
    <Pressable accessibilityRole="button" onPress={() => router.replace(isRegister ? '/login' : '/register')} style={styles.switch}><Text style={styles.switchText}>{isRegister ? 'Already have an account? Login' : 'New to IRL Quest? Create an account'}</Text></Pressable>
  </ScrollView></KeyboardAvoidingView></Screen>;
}

function Field(props: React.ComponentProps<typeof TextInput> & { label: string }) {
  const { label, ...inputProps } = props;
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={label} placeholderTextColor={colors.muted} style={styles.input} {...inputProps} /></View>;
}

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl },
  eyebrow: { color: colors.primary, ...typography.label, letterSpacing: 2, marginBottom: spacing.md },
  title: { color: colors.ink, ...typography.title, marginBottom: spacing.sm },
  subtitle: { color: colors.muted, ...typography.body, marginBottom: spacing.xxl },
  form: { gap: spacing.md },
  field: { gap: spacing.xs },
  label: { color: colors.ink, ...typography.label },
  input: { minHeight: 48, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: spacing.md, color: colors.ink, backgroundColor: colors.background, ...typography.body },
  submit: { minHeight: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, marginTop: spacing.sm },
  submitText: { color: colors.white, ...typography.body, fontWeight: '800' },
  disabled: { opacity: 0.55 },
  error: { color: colors.coral, ...typography.caption },
  switch: { alignItems: 'center', padding: spacing.xl },
  switchText: { color: colors.primary, ...typography.body, fontWeight: '700' },
});

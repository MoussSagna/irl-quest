import React, { PropsWithChildren } from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, Text, View, ViewProps, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radii, spacing, typography } from '../tokens';

export function Screen({ children, ...props }: PropsWithChildren<ViewProps>) {
  return <SafeAreaView edges={['top']} style={styles.screen} {...props}>{children}</SafeAreaView>;
}

export function Card({ children, style, ...props }: PropsWithChildren<ViewProps>) {
  return <View style={[styles.card, style]} {...props}>{children}</View>;
}

type ButtonProps = Omit<PressableProps, 'style'> & { label: string; variant?: 'primary' | 'secondary' | 'ghost'; icon?: string; style?: StyleProp<ViewStyle> };
export function Button({ label, variant = 'primary', icon, style, ...props }: ButtonProps) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} style={({ pressed }) => [
    styles.button, variant === 'secondary' && styles.secondaryButton, variant === 'ghost' && styles.ghostButton,
    pressed && styles.pressed, style,
  ]} {...props}>
    <Text style={[styles.buttonText, variant !== 'primary' && styles.secondaryText]}>{icon ? `${icon}  ` : ''}{label}</Text>
  </Pressable>;
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  card: { backgroundColor: colors.surface, borderRadius: radii.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  button: { minHeight: 48, paddingHorizontal: spacing.xl, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  secondaryButton: { backgroundColor: colors.primarySoft },
  ghostButton: { backgroundColor: 'transparent', paddingHorizontal: spacing.md },
  buttonText: { color: colors.white, ...typography.body, fontWeight: '700' },
  secondaryText: { color: colors.primaryDark },
  pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
});

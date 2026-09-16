import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../tokens';

export function ScreenHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return <View style={styles.header}>{eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}<Text style={styles.title}>{title}</Text>{description && <Text style={styles.description}>{description}</Text>}</View>;
}

const styles = StyleSheet.create({ header: { marginBottom: spacing.xl }, eyebrow: { color: colors.primary, ...typography.label, letterSpacing: 1, marginBottom: spacing.xs }, title: { color: colors.ink, ...typography.title, fontSize: 30 }, description: { color: colors.muted, ...typography.body, marginTop: spacing.sm } });

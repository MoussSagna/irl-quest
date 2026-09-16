import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from './Primitives';
import { ProgressBar } from './Progression';
import { colors, spacing, typography } from '../tokens';
export type Goal = {
  id: string;
  title: string;
  detail: string;
  current: number;
  target: number;
  unit: string;
  nextStep?: string;
  status?: 'active' | 'completed' | 'paused';
  icon?: string;
};
export function GoalCard({ goal }: { goal: Goal }) {
  const value = goal.target ? Math.min(goal.current / goal.target, 1) : 0;
  return <Card style={styles.card}><View style={styles.row}><Text style={styles.icon}>{goal.icon ?? '🎯'}</Text><View style={styles.copy}><Text style={styles.title}>{goal.title}</Text><Text style={styles.detail}>{goal.detail}</Text></View><Text style={styles.count}>{goal.current}/{goal.target} {goal.unit}</Text></View><ProgressBar value={value} color={value >= 1 ? colors.mint : colors.blue} /><View style={styles.footer}><Text style={styles.progress}>{value >= 1 ? 'Goal complete!' : `${Math.round(value * 100)}% complete`}</Text>{goal.nextStep && value < 1 && <Text style={styles.nextStep}>Next: {goal.nextStep}</Text>}</View></Card>;
}
const styles = StyleSheet.create({ card: { marginBottom: spacing.md }, row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg }, icon: { fontSize: 27 }, copy: { flex: 1 }, title: { color: colors.ink, ...typography.body, fontWeight: '800' }, detail: { color: colors.muted, ...typography.caption, marginTop: 2 }, count: { color: colors.blue, ...typography.label }, footer: { gap: spacing.xs }, progress: { color: colors.muted, ...typography.caption, marginTop: spacing.sm }, nextStep: { color: colors.ink, ...typography.caption } });

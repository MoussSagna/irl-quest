import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../tokens';
import { Button, Card } from './Primitives';
import { ProgressBar } from './Progression';
import { clampProgress, questStatusLabel } from './helpers';

export type QuestStatus = 'locked' | 'available' | 'in-progress' | 'completed' | 'failed';
export type Quest = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xp: number;
  status: QuestStatus;
  progress?: number;
  deadline?: string;
  icon?: string;
};

export function QuestCard({ quest, onPress, onComplete }: { quest: Quest; onPress?: () => void; onComplete?: () => void }) {
  const locked = quest.status === 'locked';
  const statusLabel = questStatusLabel(quest.status);
  const content = <Card style={[styles.card, locked && styles.locked]}>
    <View style={styles.top}><View style={[styles.icon, locked && styles.lockedIcon]}><Text style={styles.iconText}>{locked ? '🔒' : quest.icon ?? '✦'}</Text></View><View style={styles.titleWrap}><Text style={styles.status}>{statusLabel}</Text><Text style={styles.title}>{quest.title}</Text></View><Text style={styles.xp}>+{quest.xp} XP</Text></View>
    <Text style={styles.description}>{quest.description}</Text>
    <View style={styles.meta}>
      <Text style={styles.metaText}>{quest.category}</Text>
      <Text style={styles.metaText}>{quest.difficulty}</Text>
      {quest.deadline && <Text style={styles.metaText}>{quest.deadline}</Text>}
    </View>
    {quest.status === 'in-progress' && <View style={styles.progress}><ProgressBar value={clampProgress(quest.progress ?? 0)} color={colors.primary} /><Text style={styles.progressText}>{Math.round(clampProgress(quest.progress ?? 0) * 100)}%</Text></View>}
    {quest.status === 'available' && <Button label="Start quest" onPress={onPress} style={styles.action} />}
    {quest.status === 'in-progress' && <Button label="Complete quest" onPress={onComplete} style={styles.action} />}
    {quest.status === 'completed' && <Text style={styles.complete}>✓ Completed</Text>}
    {quest.status === 'failed' && <Text style={styles.failed}>Try again tomorrow</Text>}
  </Card>;
  return onPress && !locked ? <Pressable accessibilityRole="button" accessibilityLabel={`${quest.title}, ${statusLabel.toLowerCase()}`} onPress={onPress}>{content}</Pressable> : content;
}
const styles = StyleSheet.create({
  card: { marginBottom: spacing.md }, locked: { opacity: 0.58 }, top: { flexDirection: 'row', alignItems: 'center', gap: spacing.md }, icon: { width: 44, height: 44, borderRadius: radii.md, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }, lockedIcon: { backgroundColor: colors.surfaceMuted }, iconText: { fontSize: 21 }, titleWrap: { flex: 1 }, status: { color: colors.primary, ...typography.label, letterSpacing: 0.5 }, title: { color: colors.ink, ...typography.heading, fontSize: 17, lineHeight: 22 }, xp: { color: colors.amber, ...typography.label }, description: { color: colors.muted, ...typography.body, marginTop: spacing.md }, meta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md }, metaText: { color: colors.muted, ...typography.caption, textTransform: 'capitalize' }, progress: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center', marginTop: spacing.lg }, progressText: { color: colors.muted, ...typography.caption }, action: { marginTop: spacing.lg }, complete: { color: colors.mint, ...typography.caption, fontWeight: '700', marginTop: spacing.md }, failed: { color: colors.coral, ...typography.caption, marginTop: spacing.md },
});

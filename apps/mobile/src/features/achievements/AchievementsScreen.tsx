import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AchievementBadge, Card, ProgressBar, Screen, ScreenHeader } from '../../design-system/components';
import { colors, spacing, typography } from '../../design-system/tokens';
import { mockData } from '../shared/mockData';

const rarityColors = { common: colors.muted, rare: colors.blue, epic: colors.violet, legendary: colors.achievement };
export default function AchievementsScreen() {
  return <Screen><ScrollView contentContainerStyle={styles.content}><ScreenHeader eyebrow="YOUR COLLECTION" title="Achievements" description="Every milestone tells part of your story." /><View style={styles.grid}>{mockData.achievements.map((achievement) => <Card key={achievement.id} style={[styles.card, { borderColor: rarityColors[achievement.rarity] }]}><AchievementBadge title={achievement.title} icon={achievement.icon} unlocked={achievement.unlocked} rarity={achievement.rarity} /><Text style={styles.description}>{achievement.description}</Text><Text style={[styles.reward, { color: rarityColors[achievement.rarity] }]}>+{achievement.reward} XP</Text>{!achievement.unlocked && <ProgressBar value={achievement.progress ?? 0} color={rarityColors[achievement.rarity]} />}</Card>)}</View></ScrollView></Screen>;
}
const styles = StyleSheet.create({ content: { padding: spacing.xl, paddingBottom: spacing.xxxl }, grid: { gap: spacing.md }, card: { alignItems: 'center', gap: spacing.md }, description: { color: colors.muted, ...typography.body, textAlign: 'center' }, reward: { ...typography.label } });

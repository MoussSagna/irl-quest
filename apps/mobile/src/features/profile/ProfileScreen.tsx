import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar, Card, LevelBadge, Screen, ScreenHeader, StreakBadge, XPBar } from '../../design-system/components';
import { colors, spacing, typography } from '../../design-system/tokens';
import { mockData } from '../shared/mockData';

export default function ProfileScreen() {
  const { player } = mockData;
  return <Screen><ScrollView contentContainerStyle={styles.content}><View style={styles.identity}><Avatar initials={player.initials} size={84} /><ScreenHeader eyebrow="PLAYER PROFILE" title={player.name} description="Explorer of the everyday." /></View><Card style={styles.progress}><View style={styles.row}><LevelBadge level={player.level} /><StreakBadge days={player.streak} /></View><XPBar current={player.currentXp} needed={player.nextLevelXp} /></Card><View style={styles.stats}>{[['Quests completed', player.totalQuestsCompleted], ['Goals completed', player.goalsCompleted], ['Achievements', mockData.achievements.filter((item) => item.unlocked).length]].map(([label, value]) => <Card key={String(label)} style={styles.stat}><Text style={styles.value}>{value}</Text><Text style={styles.label}>{label}</Text></Card>)}</View><ScreenHeader eyebrow="PREFERENCES" title="Settings" /><Card><Text style={styles.setting}>Account and privacy</Text><Text style={styles.setting}>Gameplay preferences</Text><Text style={styles.setting}>About IRL Quest</Text></Card></ScrollView></Screen>;
}
const styles = StyleSheet.create({ content: { padding: spacing.xl, paddingBottom: spacing.xxxl }, identity: { alignItems: 'center', gap: spacing.lg }, progress: { marginBottom: spacing.lg }, row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xl }, stats: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl }, stat: { flex: 1, padding: spacing.md }, value: { color: colors.primary, ...typography.title, fontSize: 24 }, label: { color: colors.muted, ...typography.caption, marginTop: spacing.xs }, setting: { color: colors.ink, ...typography.body, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border } });

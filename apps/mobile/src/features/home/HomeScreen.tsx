import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { AchievementBadge, Avatar, Card, GoalCard, LevelBadge, QuestCard, Screen, ScreenHeader, StreakBadge, XPBar } from '../../design-system/components';
import { colors, spacing, typography } from '../../design-system/tokens';
import { mockData } from '../shared/mockData';
import { useQuestStore } from '../quests/QuestProvider';

export default function HomeScreen() {
  const { player, quests, completeQuest } = useQuestStore();
  const mainQuest = quests.find((quest) => quest.id === 'run') ?? quests[0];
  return <Screen>
    <StatusBar barStyle="light-content" />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}><View><Text style={styles.eyebrow}>YOUR CHARACTER</Text><Text style={styles.greeting}>{player.name}</Text><Text style={styles.role}>Explorer · Level {player.level}</Text></View><Avatar initials={player.initials} size={58} /></View>
      <Card style={styles.xpCard}><View style={styles.xpTop}><LevelBadge level={player.level} /><StreakBadge days={player.streak} /></View><XPBar current={player.currentXp} needed={player.nextLevelXp} /></Card>
      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Main quest</Text><Text style={styles.reward}>HIGH REWARD</Text></View>
      <QuestCard quest={mainQuest} onComplete={() => completeQuest(mainQuest.id)} />
      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Today’s quests</Text><Text style={styles.seeAll}>3 active</Text></View>
      {quests.filter((quest) => quest.deadline === 'Today').map((quest) => <QuestCard key={quest.id} quest={quest} onPress={() => undefined} onComplete={() => completeQuest(quest.id)} />)}
      <View style={[styles.sectionHeader, styles.sectionGap]}><Text style={styles.sectionTitle}>Active goals</Text><Text style={styles.seeAll}>View all</Text></View>
      {mockData.goals.slice(0, 2).map((goal) => <GoalCard key={goal.id} goal={goal} />)}
      <ScreenHeader eyebrow="COLLECTION" title="Recent achievements" />
      <Card style={styles.achievements}>{mockData.achievements.slice(0, 3).map((achievement) => <AchievementBadge key={achievement.id} title={achievement.title} icon={achievement.icon} rarity={achievement.rarity} unlocked={achievement.unlocked} />)}</Card>
    </ScrollView>
  </Screen>;
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl },
  eyebrow: { color: colors.primary, ...typography.label, letterSpacing: 1, marginBottom: spacing.xs },
  greeting: { color: colors.ink, ...typography.title, fontSize: 30 },
  role: { color: colors.muted, ...typography.body, marginTop: spacing.xs },
  xpCard: { backgroundColor: colors.surfaceMuted, borderColor: colors.border, marginBottom: spacing.xl },
  xpTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  sectionGap: { marginTop: spacing.lg },
  sectionTitle: { color: colors.ink, ...typography.heading },
  seeAll: { color: colors.primary, ...typography.caption, fontWeight: '700' },
  reward: { color: colors.amber, ...typography.label },
  achievements: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: spacing.xl },
});

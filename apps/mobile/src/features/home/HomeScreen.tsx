import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { AchievementBadge, Avatar, Card, Goal, GoalCard, LevelBadge, Quest, QuestCard, Screen, StreakBadge, XPBar } from '../../design-system/components';
import { colors, spacing, typography } from '../../design-system/tokens';

const quests: Quest[] = [
  { id: 'morning', title: 'Morning momentum', description: 'Start your day with a 10-minute walk outside.', category: 'Health', difficulty: 'easy', xp: 80, status: 'in-progress', progress: 0.6, icon: '☀️', deadline: 'Today' },
  { id: 'connect', title: 'Make a connection', description: 'Send a thoughtful message to someone you care about.', category: 'Relationships', difficulty: 'medium', xp: 120, status: 'available', icon: '💬', deadline: 'Today' },
  { id: 'focus', title: 'Deep focus', description: 'Complete a distraction-free 25-minute focus session.', category: 'Focus', difficulty: 'hard', xp: 150, status: 'locked', icon: '🎧' },
];
const goals: Goal[] = [
  { id: 'move', title: 'Move your body', detail: 'Keep your energy flowing', current: 3, target: 5, unit: 'days', nextStep: 'Complete a 20-minute walk', icon: '🏃' },
  { id: 'learn', title: 'Learn something new', detail: 'Small steps, big growth', current: 2, target: 2, unit: 'sessions', nextStep: 'Choose a new topic', icon: '💡' },
];

export default function HomeScreen() {
  return <Screen>
    <StatusBar barStyle="light-content" />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}><View><Text style={styles.eyebrow}>WEDNESDAY, SEPTEMBER 16</Text><Text style={styles.greeting}>Good morning, Alex <Text>👋</Text></Text></View><Avatar initials="AL" /></View>
      <Card style={styles.xpCard}><View style={styles.xpTop}><LevelBadge level={7} /><StreakBadge days={12} /></View><XPBar current={680} needed={1000} /></Card>
      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Today’s quests</Text><Text style={styles.seeAll}>See all</Text></View>
      {quests.map((quest) => <QuestCard key={quest.id} quest={quest} onPress={quest.status === 'available' ? () => undefined : undefined} />)}
      <View style={[styles.sectionHeader, styles.goalsHeader]}><Text style={styles.sectionTitle}>Your goals</Text><Text style={styles.seeAll}>View goals</Text></View>
      {goals.map((goal) => <GoalCard key={goal.id} goal={goal} />)}
      <Text style={[styles.sectionTitle, styles.achievementsTitle]}>Recent achievements</Text>
      <Card style={styles.achievements}><AchievementBadge title="First quest" icon="🌱" /><AchievementBadge title="On fire" icon="🔥" /><AchievementBadge title="Early bird" icon="🌅" unlocked={false} /></Card>
    </ScrollView>
  </Screen>;
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl },
  eyebrow: { color: colors.muted, ...typography.label, letterSpacing: 0.7, marginBottom: spacing.xs },
  greeting: { color: colors.ink, ...typography.title, fontSize: 25 },
  xpCard: { backgroundColor: colors.surfaceMuted, borderColor: colors.border, marginBottom: spacing.xxxl },
  xpTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  sectionTitle: { color: colors.ink, ...typography.heading },
  seeAll: { color: colors.primary, ...typography.caption, fontWeight: '700' },
  goalsHeader: { marginTop: spacing.lg },
  achievementsTitle: { marginTop: spacing.lg, marginBottom: spacing.md },
  achievements: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: spacing.xl },
});

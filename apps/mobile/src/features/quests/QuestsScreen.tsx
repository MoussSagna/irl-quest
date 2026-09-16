import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, QuestCard, Screen, ScreenHeader } from '../../design-system/components';
import { colors, spacing, typography } from '../../design-system/tokens';
import { useQuestStore } from './QuestProvider';

type Filter = 'All' | 'Today' | 'Active' | 'Completed';
export default function QuestsScreen() {
  const { quests, completeQuest } = useQuestStore();
  const [filter, setFilter] = useState<Filter>('All');
  const filtered = useMemo(() => quests.filter((quest) => filter === 'All' || (filter === 'Today' ? quest.deadline === 'Today' : filter === 'Active' ? quest.status === 'available' || quest.status === 'in-progress' : quest.status === 'completed')), [filter, quests]);
  return <Screen><ScrollView contentContainerStyle={styles.content}><ScreenHeader eyebrow="YOUR ADVENTURES" title="Quests" description="Small actions become a legendary life." /><View style={styles.filters}>{(['All', 'Today', 'Active', 'Completed'] as Filter[]).map((item) => <Button key={item} label={item} variant={filter === item ? 'primary' : 'secondary'} onPress={() => setFilter(item)} style={styles.filter} />)}</View>{filtered.length ? filtered.map((quest) => <QuestCard key={quest.id} quest={quest} onPress={() => undefined} onComplete={() => completeQuest(quest.id)} />) : <Text style={styles.empty}>No quests in this chapter yet.</Text>}</ScrollView></Screen>;
}
const styles = StyleSheet.create({ content: { padding: spacing.xl, paddingBottom: spacing.xxxl }, filters: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl, flexWrap: 'wrap' }, filter: { minHeight: 40, paddingHorizontal: spacing.md }, empty: { color: colors.muted, ...typography.body, textAlign: 'center', marginTop: spacing.xxxl } });

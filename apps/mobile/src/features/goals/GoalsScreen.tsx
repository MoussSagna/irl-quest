import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { GoalCard, Screen, ScreenHeader } from '../../design-system/components';
import { colors, spacing, typography } from '../../design-system/tokens';
import { mockData } from '../shared/mockData';

export default function GoalsScreen() {
  return <Screen><ScrollView contentContainerStyle={styles.content}><ScreenHeader eyebrow="LONG GAME" title="Goals" description="Your biggest quests, broken into achievable steps." />{mockData.goals.map((goal) => <GoalCard key={goal.id} goal={goal} />)}{!mockData.goals.length && <Text style={styles.empty}>Your next chapter starts with a goal.</Text>}</ScrollView></Screen>;
}
const styles = StyleSheet.create({ content: { padding: spacing.xl, paddingBottom: spacing.xxxl }, empty: { color: colors.muted, ...typography.body, textAlign: 'center', marginTop: spacing.xxxl } });

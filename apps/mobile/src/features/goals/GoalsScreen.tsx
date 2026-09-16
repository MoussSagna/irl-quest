import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { GoalCard, Screen, ScreenHeader } from '../../design-system/components';
import { Button } from '../../design-system/components/Primitives';
import { colors, spacing, typography } from '../../design-system/tokens';
import { useGoals } from './useGoals';

export default function GoalsScreen() {
  const { data: goals = [], isLoading, isError, error, refetch, create } = useGoals();
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('');
  const [formError, setFormError] = useState('');

  const submit = async () => {
    setFormError('');
    const numericTarget = Number(target);
    if (!title.trim() || !category.trim() || !unit.trim() || !Number.isInteger(numericTarget) || numericTarget <= 0) {
      setFormError('Complete the title, category, target and unit.');
      return;
    }
    try {
      await create.mutateAsync({ title: title.trim(), description: description.trim(), category: category.trim(), target: numericTarget, unit: unit.trim() });
      setTitle('');
      setDescription('');
      setCategory('');
      setTarget('');
      setUnit('');
      setFormOpen(false);
    } catch (requestError) {
      setFormError((requestError as Error).message || 'Unable to create this goal.');
    }
  };

  return <Screen><ScrollView contentContainerStyle={styles.content}>
    <ScreenHeader eyebrow="LONG GAME" title="Goals" description="Your biggest quests, broken into achievable steps." />
    <Button label={formOpen ? 'Close' : 'Create goal'} onPress={() => setFormOpen((open) => !open)} style={styles.createButton} />
    {formOpen && <View style={styles.form}><Field label="Title" value={title} onChangeText={setTitle} placeholder="Learn Korean" /><Field label="Description" value={description} onChangeText={setDescription} placeholder="Describe your long-term goal" /><Field label="Category" value={category} onChangeText={setCategory} placeholder="Languages" /><Field label="Target" value={target} onChangeText={setTarget} placeholder="100" keyboardType="number-pad" /><Field label="Unit" value={unit} onChangeText={setUnit} placeholder="sessions" />{!!formError && <Text accessibilityRole="alert" style={styles.error}>{formError}</Text>}<Button label={create.isPending ? 'Creating…' : 'Save goal'} disabled={create.isPending} onPress={submit} /></View>}
    {isLoading && <View style={styles.state}><ActivityIndicator color={colors.primary} /><Text style={styles.stateText}>Loading goals…</Text></View>}
    {isError && <View style={styles.state}><Text style={styles.error}>{(error as Error)?.message || 'Unable to load goals.'}</Text><Pressable accessibilityRole="button" accessibilityLabel="Retry goals" onPress={() => refetch()}><Text style={styles.retry}>Retry</Text></Pressable></View>}
    {!isLoading && !isError && goals.map((goal) => <GoalCard key={goal.id} goal={{ id: goal.id, title: goal.title, detail: goal.description || goal.category, current: goal.progress, target: goal.target, unit: goal.unit, status: goal.status, nextStep: goal.status === 'completed' ? undefined : `Continue your ${goal.category.toLowerCase()} journey` }} />)}
    {!isLoading && !isError && !goals.length && <Text style={styles.empty}>Your next chapter starts with a goal.</Text>}
  </ScrollView></Screen>;
}

function Field(props: React.ComponentProps<typeof TextInput> & { label: string }) {
  const { label, ...inputProps } = props;
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={label} placeholderTextColor={colors.muted} style={styles.input} {...inputProps} /></View>;
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  createButton: { marginBottom: spacing.lg },
  form: { gap: spacing.md, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18, padding: spacing.lg, marginBottom: spacing.lg },
  field: { gap: spacing.xs },
  label: { color: colors.ink, ...typography.label },
  input: { minHeight: 46, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: spacing.md, color: colors.ink, backgroundColor: colors.background, ...typography.body },
  error: { color: colors.coral, ...typography.caption },
  state: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxxl },
  stateText: { color: colors.muted, ...typography.body },
  retry: { color: colors.primary, ...typography.body, fontWeight: '700' },
  empty: { color: colors.muted, ...typography.body, textAlign: 'center', marginTop: spacing.xxxl },
});

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../tokens';

const icons: Record<string, string> = { index: '⌂', quests: '⚔', goals: '◆', achievements: '✦', profile: '◉' };

type NavigationProps = {
  state: { index: number; routes: readonly { key: string; name: string }[] };
  descriptors: Record<string, { options: { title?: string } }>;
  navigation: { navigate: (name: string) => void };
};

export function BottomNavigation({ state, descriptors, navigation }: NavigationProps) {
  return <View style={styles.bar} accessibilityRole="tablist">
    {state.routes.map((route, index) => {
      const focused = state.index === index;
      const label = descriptors[route.key].options.title ?? route.name;
      return <Pressable key={route.key} accessibilityRole="tab" accessibilityState={{ selected: focused }} accessibilityLabel={String(label)} onPress={() => navigation.navigate(route.name)} style={[styles.item, focused && styles.active]}>
        <Text style={[styles.icon, focused && styles.activeText]}>{icons[route.name] ?? '•'}</Text>
        <Text style={[styles.label, focused && styles.activeText]}>{label}</Text>
      </Pressable>;
    })}
  </View>;
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: spacing.xs, paddingTop: spacing.sm, paddingBottom: spacing.md },
  item: { flex: 1, minHeight: 52, alignItems: 'center', justifyContent: 'center', gap: 2, borderRadius: radii.md },
  active: { backgroundColor: colors.primarySoft },
  icon: { color: colors.muted, fontSize: 19, lineHeight: 22 },
  label: { color: colors.muted, ...typography.caption, fontWeight: '700' },
  activeText: { color: colors.primary },
});

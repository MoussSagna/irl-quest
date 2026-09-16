import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { House, Swords, Target, Trophy, UserRound } from 'lucide-react-native';
import { colors, radii, spacing } from '../tokens';

const icons = {
  index: House,
  quests: Swords,
  goals: Target,
  achievements: Trophy,
  profile: UserRound,
} as const;

type NavigationProps = {
  state: { index: number; routes: readonly { key: string; name: string }[] };
  descriptors: Record<string, { options: { title?: string } }>;
  navigation: { navigate: (name: string) => void };
  insets?: { bottom: number };
};

export function BottomNavigation({ state, descriptors, navigation, insets = { bottom: 0 } }: NavigationProps) {
  return <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.md) }]} accessibilityRole="tablist">
    {state.routes.map((route, index) => {
      const focused = state.index === index;
      const Icon = icons[route.name as keyof typeof icons] ?? Target;
      const label = descriptors[route.key].options.title ?? route.name;
      return <Pressable
        key={route.key}
        testID={`nav-tab-${route.name}`}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={String(label)}
        onPress={() => navigation.navigate(route.name)}
        style={({ pressed }) => [styles.item, focused && styles.active, pressed && styles.pressed]}
      >
        <View style={[styles.iconWrap, focused && styles.activeIconWrap]}>
          <Icon testID={`nav-icon-${route.name}`} size={focused ? 24 : 22} strokeWidth={focused ? 2.5 : 2} color={focused ? colors.primary : colors.muted} />
        </View>
      </Pressable>;
    })}
  </View>;
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: spacing.sm, paddingTop: spacing.sm, shadowColor: colors.white, shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 12 },
  item: { flex: 1, minHeight: 56, alignItems: 'center', justifyContent: 'center', borderRadius: radii.lg },
  active: { backgroundColor: colors.primarySoft },
  iconWrap: { width: 48, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md },
  activeIconWrap: { backgroundColor: colors.surfaceMuted },
  pressed: { opacity: 0.72, transform: [{ scale: 0.94 }] },
});

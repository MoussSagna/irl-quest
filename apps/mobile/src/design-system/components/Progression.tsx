import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../tokens';
import { clampProgress } from './helpers';

export function ProgressBar({ value, color = colors.primary, height = 8 }: { value: number; color?: string; height?: number }) {
  const progress = clampProgress(value);
  const width = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(width, { toValue: progress, duration: 450, useNativeDriver: false }).start(); }, [progress, width]);
  return <View accessible accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 1, now: progress }} style={[styles.track, { height }]}>
    <Animated.View style={[styles.fill, { backgroundColor: color, height, width: width.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
  </View>;
}

export function XPBar({ current, needed }: { current: number; needed: number }) {
  return <View accessible accessibilityLabel={`${current} of ${needed} XP`}>
    <View style={styles.xpHeader}><Text style={styles.xpLabel}>XP PROGRESS</Text><Text style={styles.xpValue}>{current} / {needed} XP</Text></View>
    <ProgressBar value={needed ? current / needed : 0} height={10} color={colors.amber} />
  </View>;
}

export function LevelBadge({ level }: { level: number }) {
  return <View style={styles.level}><Text style={styles.levelStar}>✦</Text><View><Text style={styles.levelCaption}>LEVEL</Text><Text style={styles.levelNumber}>{level}</Text></View></View>;
}

export function StreakBadge({ days }: { days: number }) {
  return <View accessibilityLabel={`${days} day streak`} style={styles.streak}><Text style={styles.streakIcon}>🔥</Text><View><Text style={styles.streakNumber}>{days}</Text><Text style={styles.streakCaption}>day streak</Text></View></View>;
}

export function AchievementBadge({ title, icon = '🏆', unlocked = true, rarity }: { title: string; icon?: string; unlocked?: boolean; rarity?: string }) {
  return <View accessibilityLabel={`${title}${unlocked ? ', unlocked' : ', locked'}`} style={[styles.achievement, !unlocked && styles.achievementLocked]}><Text style={styles.achievementIcon}>{unlocked ? icon : '🔒'}</Text><Text style={styles.achievementTitle}>{title}</Text>{rarity && <Text style={styles.achievementRarity}>{rarity}</Text>}</View>;
}

export function Avatar({ initials, size = 48 }: { initials: string; size?: number }) {
  return <View accessibilityLabel={`Avatar ${initials}`} style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}><Text style={[styles.avatarText, { fontSize: size * 0.34 }]}>{initials}</Text></View>;
}

const styles = StyleSheet.create({
  track: { overflow: 'hidden', backgroundColor: colors.surfaceMuted, borderRadius: radii.pill },
  fill: { borderRadius: radii.pill },
  xpHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  xpLabel: { color: colors.muted, ...typography.label, letterSpacing: 0.6 },
  xpValue: { color: colors.ink, ...typography.caption, fontWeight: '700' },
  level: { backgroundColor: colors.primary, borderRadius: radii.md, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  levelStar: { color: '#D9D5FF', fontSize: 25 },
  levelCaption: { color: '#D9D5FF', ...typography.label, fontSize: 10 },
  levelNumber: { color: colors.white, fontSize: 20, fontWeight: '800' },
  streak: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.amberSoft, borderRadius: radii.md, padding: spacing.md },
  streakIcon: { fontSize: 22 }, streakNumber: { color: colors.ink, fontSize: 18, fontWeight: '800' }, streakCaption: { color: colors.muted, ...typography.caption },
  achievement: { alignItems: 'center', gap: 6, minWidth: 76 }, achievementLocked: { opacity: 0.45 }, achievementIcon: { fontSize: 28 }, achievementTitle: { color: colors.muted, ...typography.label, textAlign: 'center' }, achievementRarity: { color: colors.achievement, ...typography.caption, textTransform: 'capitalize' },
  avatar: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft }, avatarText: { color: colors.primaryDark, fontWeight: '800' },
});

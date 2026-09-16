import type { Goal } from '../../design-system/components/GoalCard';
import type { Quest } from '../../design-system/components/QuestCard';

export type Player = {
  name: string;
  initials: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  streak: number;
  totalQuestsCompleted: number;
  goalsCompleted: number;
};

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward: number;
  rarity: AchievementRarity;
  unlocked: boolean;
  progress?: number;
};

export type AppMockData = {
  player: Player;
  quests: Quest[];
  goals: Goal[];
  achievements: Achievement[];
};

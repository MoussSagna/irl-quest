import type { AppMockData } from './types';

export const mockData: AppMockData = {
  player: {
    name: 'Alex',
    initials: 'AL',
    level: 12,
    currentXp: 7450,
    nextLevelXp: 10000,
    streak: 13,
    totalQuestsCompleted: 48,
    goalsCompleted: 3,
  },
  quests: [
    { id: 'morning', title: 'Morning momentum', description: 'Start your day with a 10-minute walk outside.', category: 'Health', difficulty: 'easy', xp: 80, status: 'in-progress', progress: 0.6, icon: '☀️', deadline: 'Today' },
    { id: 'connect', title: 'Make a connection', description: 'Send a thoughtful message to someone you care about.', category: 'Relationships', difficulty: 'medium', xp: 120, status: 'available', icon: '💬', deadline: 'Today' },
    { id: 'focus', title: 'Deep focus', description: 'Complete a distraction-free 25-minute focus session.', category: 'Focus', difficulty: 'hard', xp: 150, status: 'locked', icon: '🎧' },
    { id: 'language', title: 'Practice Spanish', description: 'Learn five new words and use them in a sentence.', category: 'Languages', difficulty: 'medium', xp: 100, status: 'available', icon: '🗣️', deadline: 'Tomorrow' },
    { id: 'journal', title: 'Reflect and reset', description: 'Write three lines about a win from this week.', category: 'Personal', difficulty: 'easy', xp: 60, status: 'completed', icon: '✍️' },
    { id: 'run', title: 'Run your first 10K', description: 'Complete a steady training run toward your main quest.', category: 'Fitness', difficulty: 'hard', xp: 240, status: 'failed', icon: '🏃', deadline: 'Friday' },
  ],
  goals: [
    { id: 'move', title: 'Move your body', detail: 'Keep your energy flowing', current: 3, target: 5, unit: 'days', nextStep: 'Complete a 20-minute walk', status: 'active', icon: '🏃' },
    { id: 'learn', title: 'Learn something new', detail: 'Small steps, big growth', current: 2, target: 2, unit: 'sessions', nextStep: 'Choose a new topic', status: 'completed', icon: '💡' },
    { id: 'travel', title: 'Plan a Japan adventure', detail: 'Turn inspiration into an itinerary', current: 2, target: 8, unit: 'steps', nextStep: 'Save three places to visit', status: 'active', icon: '🗺️' },
  ],
  achievements: [
    { id: 'first', title: 'First quest', description: 'Complete your first real-life quest.', icon: '🌱', reward: 100, rarity: 'common', unlocked: true },
    { id: 'fire', title: 'On fire', description: 'Keep a 7-day streak alive.', icon: '🔥', reward: 250, rarity: 'rare', unlocked: true },
    { id: 'explorer', title: 'Explorer', description: 'Complete quests in five categories.', icon: '🧭', reward: 500, rarity: 'epic', unlocked: false, progress: 0.6 },
    { id: 'legend', title: 'Legendary arc', description: 'Reach level 25.', icon: '✦', reward: 1000, rarity: 'legendary', unlocked: false, progress: 0.48 },
  ],
};

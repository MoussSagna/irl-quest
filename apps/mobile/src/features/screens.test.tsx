import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { QuestProvider } from './quests/QuestProvider';
import QuestsScreen from './quests/QuestsScreen';
import GoalsScreen from './goals/GoalsScreen';
import AchievementsScreen from './achievements/AchievementsScreen';
import ProfileScreen from './profile/ProfileScreen';

jest.mock('./goals/useGoals', () => ({
  useGoals: () => ({
    data: [{
      id: 'move',
      title: 'Move your body',
      description: 'Keep your energy flowing',
      category: 'Fitness',
      progress: 3,
      target: 5,
      unit: 'days',
      status: 'active',
    }],
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
    create: { isPending: false, mutateAsync: jest.fn() },
  }),
}));

jest.mock('./auth/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({ user: null, signOut: jest.fn() }),
}));

function withProvider(element: React.ReactElement) {
  return render(<QuestProvider>{element}</QuestProvider>);
}

describe('mobile feature screens', () => {
  it('filters quests', () => {
    const screen = withProvider(<QuestsScreen />);
    expect(screen.getByText('Quests')).toBeTruthy();
    fireEvent.press(screen.getAllByRole('button', { name: 'Completed' })[0]);
    expect(screen.getByText('Reflect and reset')).toBeTruthy();
  });

  it('completes an in-progress quest and updates its state', () => {
    const screen = withProvider(<QuestsScreen />);
    fireEvent.press(screen.getAllByRole('button', { name: 'Complete quest' })[0]);
    expect(screen.getByText('✓ Completed')).toBeTruthy();
  });

  it('renders goals and their next steps', () => {
    const screen = withProvider(<GoalsScreen />);
    expect(screen.getByText('Goals')).toBeTruthy();
    expect(screen.getByText('Next: Continue your fitness journey')).toBeTruthy();
  });

  it('renders unlocked and locked achievement rarities', () => {
    const screen = withProvider(<AchievementsScreen />);
    expect(screen.getByText('Achievements')).toBeTruthy();
    expect(screen.getByText('legendary')).toBeTruthy();
    expect(screen.getByText('Explorer')).toBeTruthy();
  });

  it('renders profile stats and settings', () => {
    const screen = withProvider(<ProfileScreen />);
    expect(screen.getByText('PLAYER PROFILE')).toBeTruthy();
    expect(screen.getByText('Quests completed')).toBeTruthy();
    expect(screen.getByText('Gameplay preferences')).toBeTruthy();
  });
});

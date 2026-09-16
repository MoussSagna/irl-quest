import { render, fireEvent } from '@testing-library/react-native';
import { GoalCard } from '../GoalCard';
import { QuestCard, type Quest } from '../QuestCard';

const quest: Quest = {
  id: 'quest-1',
  title: 'Morning momentum',
  description: 'Take a short walk outside.',
  category: 'Health',
  difficulty: 'easy',
  xp: 80,
  status: 'available',
  deadline: 'Today',
};

describe('QuestCard', () => {
  it('renders quest details and starts an available quest', () => {
    const onPress = jest.fn();
    const screen = render(<QuestCard quest={quest} onPress={onPress} />);

    expect(screen.getByText('Morning momentum')).toBeTruthy();
    expect(screen.getByText('+80 XP')).toBeTruthy();
    expect(screen.getByText('Health')).toBeTruthy();
    expect(screen.getByText('Today')).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Morning momentum, available' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders the completed state without a start action', () => {
    const screen = render(<QuestCard quest={{ ...quest, status: 'completed' }} onPress={jest.fn()} />);

    expect(screen.getByText('✓ Completed')).toBeTruthy();
    expect(screen.queryByText('Start quest')).toBeNull();
  });
});

describe('GoalCard', () => {
  it('renders progress percentage and next step', () => {
    const screen = render(<GoalCard goal={{
      id: 'goal-1',
      title: 'Build a reading habit',
      detail: 'Read consistently',
      current: 4,
      target: 10,
      unit: 'books',
      nextStep: 'Read 10 pages',
    }} />);

    expect(screen.getByText('Build a reading habit')).toBeTruthy();
    expect(screen.getByText('40% complete')).toBeTruthy();
    expect(screen.getByText('Next: Read 10 pages')).toBeTruthy();
  });
});

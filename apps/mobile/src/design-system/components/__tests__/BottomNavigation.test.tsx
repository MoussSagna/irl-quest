import { render, fireEvent } from '@testing-library/react-native';
import { BottomNavigation } from '../BottomNavigation';

describe('BottomNavigation', () => {
  const routes = [
    { key: 'home', name: 'index' },
    { key: 'quests', name: 'quests' },
    { key: 'goals', name: 'goals' },
    { key: 'achievements', name: 'achievements' },
    { key: 'profile', name: 'profile' },
  ];
  const descriptors = Object.fromEntries([
    ['home', 'Home'],
    ['quests', 'Quests'],
    ['goals', 'Goals'],
    ['achievements', 'Achievements'],
    ['profile', 'Profile'],
  ].map(([key, title]) => [key, { options: { title } }]));

  it('renders five icon-only tabs with accessible labels', () => {
    const screen = render(<BottomNavigation state={{ index: 0, routes }} descriptors={descriptors} navigation={{ navigate: jest.fn() }} />);

    expect(screen.getAllByRole('tab')).toHaveLength(5);
    expect(screen.getByTestId('nav-icon-index')).toBeTruthy();
    expect(screen.getByTestId('nav-icon-quests')).toBeTruthy();
    expect(screen.getByTestId('nav-icon-goals')).toBeTruthy();
    expect(screen.getByTestId('nav-icon-achievements')).toBeTruthy();
    expect(screen.getByTestId('nav-icon-profile')).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Home' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Quests' })).toBeTruthy();
    expect(screen.queryByText('Home')).toBeNull();
    expect(screen.queryByText('Quests')).toBeNull();
  });

  it('marks the active tab and navigates when another tab is pressed', () => {
    const navigate = jest.fn();
    const screen = render(<BottomNavigation state={{ index: 0, routes }} descriptors={descriptors} navigation={{ navigate }} />);

    fireEvent.press(screen.getByRole('tab', { name: 'Quests' }));
    expect(screen.getByRole('tab', { name: 'Home' })).toBeTruthy();
    expect(navigate).toHaveBeenCalledWith('quests');
    expect(screen.getByRole('tab', { name: 'Home' }).props.accessibilityState.selected).toBe(true);
    expect(screen.getByRole('tab', { name: 'Quests' }).props.accessibilityState.selected).toBe(false);
  });
});

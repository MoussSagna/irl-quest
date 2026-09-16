import { render } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';

describe('HomeScreen', () => {
  it('renders the player dashboard and daily progression sections', () => {
    const screen = render(<HomeScreen />);

    expect(screen.getByText(/Good morning, Alex/)).toBeTruthy();
    expect(screen.getByText('Today’s quests')).toBeTruthy();
    expect(screen.getByText('Morning momentum')).toBeTruthy();
    expect(screen.getByText('Your goals')).toBeTruthy();
    expect(screen.getByText('Recent achievements')).toBeTruthy();
    expect(screen.getByLabelText('680 of 1000 XP')).toBeTruthy();
  });
});

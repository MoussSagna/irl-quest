import { render } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
import { QuestProvider } from '../../quests/QuestProvider';

describe('HomeScreen', () => {
  it('renders the player dashboard and daily progression sections', () => {
    const screen = render(<QuestProvider><HomeScreen /></QuestProvider>);

    expect(screen.getByText('Alex')).toBeTruthy();
    expect(screen.getByText('Today’s quests')).toBeTruthy();
    expect(screen.getByText('Morning momentum')).toBeTruthy();
    expect(screen.getByText('Active goals')).toBeTruthy();
    expect(screen.getByText('Recent achievements')).toBeTruthy();
    expect(screen.getByLabelText('7450 of 10000 XP')).toBeTruthy();
  });
});

import { render, fireEvent } from '@testing-library/react-native';
import { BottomNavigation } from '../BottomNavigation';

describe('BottomNavigation', () => {
  it('renders tabs and navigates when a tab is pressed', () => {
    const navigate = jest.fn();
    const screen = render(<BottomNavigation state={{ index: 0, routes: [{ key: 'home', name: 'index' }, { key: 'quests', name: 'quests' }] }} descriptors={{ home: { options: { title: 'Home' } }, quests: { options: { title: 'Quests' } } }} navigation={{ navigate }} />);

    fireEvent.press(screen.getByRole('tab', { name: 'Quests' }));
    expect(screen.getByRole('tab', { name: 'Home' })).toBeTruthy();
    expect(navigate).toHaveBeenCalledWith('quests');
  });
});

import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Button, Card } from '../Primitives';

describe('Button', () => {
  it('renders its label and invokes the press callback', () => {
    const onPress = jest.fn();
    const screen = render(<Button label="Start quest" onPress={onPress} />);

    fireEvent.press(screen.getByRole('button', { name: 'Start quest' }));

    expect(screen.getByText('Start quest')).toBeTruthy();
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not invoke the callback when disabled', () => {
    const onPress = jest.fn();
    const screen = render(<Button label="Locked quest" onPress={onPress} disabled />);

    fireEvent.press(screen.getByRole('button', { name: 'Locked quest' }));

    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('Card', () => {
  it('renders its content', () => {
    const screen = render(<Card><Text>Quest details</Text></Card>);

    expect(screen.getByText('Quest details')).toBeTruthy();
  });
});

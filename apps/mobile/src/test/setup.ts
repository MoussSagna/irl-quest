import { cleanup } from '@testing-library/react-native';
import { Animated } from 'react-native';

afterEach(() => {
  cleanup();
});

jest.spyOn(Animated, 'timing').mockImplementation(() => ({
  start: (callback?: (result: { finished: boolean }) => void) => callback?.({ finished: true }),
  stop: jest.fn(),
  reset: jest.fn(),
  _start: jest.fn(),
  _isUsingNativeDriver: jest.fn(() => false),
} as Animated.CompositeAnimation));

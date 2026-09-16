import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { AuthScreen } from '../AuthScreen';

const mockReplace = jest.fn();
const mockSignIn = jest.fn();
const mockSignUp = jest.fn();

jest.mock('expo-router', () => ({ useRouter: () => ({ replace: mockReplace }) }));
jest.mock('../AuthProvider', () => ({ useAuth: () => ({ signIn: mockSignIn, signUp: mockSignUp }) }));

describe('AuthScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('validates login fields before submitting', () => {
    const screen = render(<AuthScreen mode="login" />);
    fireEvent.press(screen.getByRole('button', { name: 'Login' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email address.');
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('submits login and navigates after success', async () => {
    mockSignIn.mockResolvedValue(undefined);
    const screen = render(<AuthScreen mode="login" />);
    fireEvent.changeText(screen.getByLabelText('Email'), 'hero@example.com');
    fireEvent.changeText(screen.getByLabelText('Password'), 'correct-horse');
    fireEvent.press(screen.getByRole('button', { name: 'Login' }));
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/(tabs)'));
    expect(mockSignIn).toHaveBeenCalledWith('hero@example.com', 'correct-horse');
  });

  it('renders register fields and reports request errors', async () => {
    mockSignUp.mockRejectedValue(new Error('Email already registered.'));
    const screen = render(<AuthScreen mode="register" />);
    fireEvent.changeText(screen.getByLabelText('Name'), 'Hero');
    fireEvent.changeText(screen.getByLabelText('Email'), 'hero@example.com');
    fireEvent.changeText(screen.getByLabelText('Password'), 'correct-horse');
    fireEvent.changeText(screen.getByLabelText('Confirm password'), 'correct-horse');
    fireEvent.press(screen.getByRole('button', { name: 'Register' }));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Email already registered.'));
    expect(mockSignUp).toHaveBeenCalledWith('Hero', 'hero@example.com', 'correct-horse');
  });
});

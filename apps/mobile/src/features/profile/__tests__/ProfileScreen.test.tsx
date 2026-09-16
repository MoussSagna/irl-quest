import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import ProfileScreen from '../ProfileScreen';

const mockReplace = jest.fn();
const mockSignOut = jest.fn();

jest.mock('expo-router', () => ({ useRouter: () => ({ replace: mockReplace }) }));
jest.mock('../../auth/AuthProvider', () => ({
  useAuth: () => ({
    user: { id: '1', name: 'Hero', email: 'hero@example.com' },
    signOut: mockSignOut,
  }),
}));

describe('ProfileScreen authentication', () => {
  it('shows the server user and logs out to login', async () => {
    mockSignOut.mockResolvedValue(undefined);
    const screen = render(<ProfileScreen />);
    expect(screen.getByText('Hero')).toBeTruthy();
    expect(screen.getByText('hero@example.com')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Logout' }));
    await waitFor(() => expect(mockSignOut).toHaveBeenCalled());
    expect(mockReplace).toHaveBeenCalledWith('/login');
  });
});

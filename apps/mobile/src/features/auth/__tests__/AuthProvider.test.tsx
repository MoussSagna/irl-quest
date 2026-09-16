import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { AuthProvider, authQueryClient, useAuth } from '../AuthProvider';

jest.mock('../api', () => ({ apiClient: { me: jest.fn(), signIn: jest.fn(), signUp: jest.fn(), signOut: jest.fn() } }));
import { apiClient } from '../api';

const mockMe = apiClient.me as jest.Mock;

function Probe() {
  const auth = useAuth();
  return <>{auth.isLoading ? <Text>loading</Text> : <Text>{auth.isAuthenticated ? auth.user?.email : 'signed-out'}</Text>}</>;
}

import { Text } from 'react-native';

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authQueryClient.clear();
  });

  it('starts loading and exposes the authenticated user from /api/me', async () => {
    mockMe.mockResolvedValue({ user: { id: '1', name: 'Hero', email: 'hero@example.com' } });
    const screen = render(<AuthProvider><Probe /></AuthProvider>);
    expect(screen.getByText('loading')).toBeTruthy();
    await waitFor(() => expect(mockMe).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByText('hero@example.com')).toBeTruthy());
  });

  it('exposes an unauthenticated state when /api/me fails', async () => {
    mockMe.mockRejectedValue(new Error('Unauthorized'));
    const screen = render(<AuthProvider><Probe /></AuthProvider>);
    await waitFor(() => expect(screen.getByText('signed-out')).toBeTruthy());
  });
});

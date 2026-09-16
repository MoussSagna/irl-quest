import React, { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SessionUser } from '@irl-quest/api-client';
import { apiClient } from './api';

type AuthContextValue = {
  user: SessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: Error | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);
export const authQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, gcTime: 0 },
    mutations: { retry: false },
  },
});

function AuthState({ children }: PropsWithChildren) {
  const client = useQueryClient();
  const [actionError, setActionError] = useState<Error | null>(null);
  const currentUser = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => (await apiClient.me()).user,
  });
  const signInMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => apiClient.signIn(email, password),
    onSuccess: (result) => client.setQueryData(['auth', 'me'], result.user),
  });
  const signUpMutation = useMutation({
    mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) => apiClient.signUp(name, email, password),
    onSuccess: (result) => client.setQueryData(['auth', 'me'], result.user),
  });
  const signOutMutation = useMutation({
    mutationFn: () => apiClient.signOut(),
    onSuccess: () => client.setQueryData(['auth', 'me'], null),
  });

  const value = useMemo<AuthContextValue>(() => ({
    user: currentUser.data ?? null,
    isLoading: currentUser.isLoading,
    isAuthenticated: Boolean(currentUser.data),
    signIn: async (email, password) => {
      setActionError(null);
      try { await signInMutation.mutateAsync({ email, password }); } catch (error) { setActionError(error as Error); throw error; }
    },
    signUp: async (name, email, password) => {
      setActionError(null);
      try { await signUpMutation.mutateAsync({ name, email, password }); } catch (error) { setActionError(error as Error); throw error; }
    },
    signOut: async () => {
      setActionError(null);
      try { await signOutMutation.mutateAsync(); } catch (error) { setActionError(error as Error); throw error; }
    },
    error: actionError ?? (currentUser.error as Error | null),
  }), [actionError, currentUser.data, currentUser.error, currentUser.isLoading, signInMutation, signOutMutation, signUpMutation]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: PropsWithChildren) {
  return <QueryClientProvider client={authQueryClient}><AuthState>{children}</AuthState></QueryClientProvider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}

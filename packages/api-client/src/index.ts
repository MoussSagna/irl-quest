import type { HealthResponse } from '@irl-quest/types';

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

export type Goal = {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  target: number;
  progress: number;
  unit: string;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  updatedAt: string;
};

export type GoalInput = Omit<Pick<Goal, 'title' | 'description' | 'category' | 'target' | 'progress' | 'unit' | 'status'>, 'progress' | 'status'> & {
  progress?: number;
  status?: Goal['status'];
};

export type CookieStorage = {
  get: () => Promise<string | null>;
  set: (cookie: string) => Promise<void>;
  clear: () => Promise<void>;
};

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const readError = async (response: Response) => {
  try {
    const body = await response.json() as { message?: string; error?: string };
    return body.message ?? body.error ?? 'Something went wrong. Please try again.';
  } catch {
    return 'Something went wrong. Please try again.';
  }
};

export const createApiClient = (baseUrl: string, cookies?: CookieStorage) => {
  const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
    const headers = new Headers(init.headers);
    if (init.body !== undefined && !headers.has('content-type')) {
      headers.set('content-type', 'application/json');
    }
    const cookie = await cookies?.get();
    if (cookie) headers.set('cookie', cookie);

    const response = await fetch(`${baseUrl.replace(/\/$/, '')}${path}`, { ...init, headers });
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) await cookies?.set(setCookie.split(';')[0]);
    if (!response.ok) throw new ApiError(response.status, await readError(response));
    return response.status === 204 ? undefined as T : response.json() as Promise<T>;
  };

  return {
    health: () => request<HealthResponse>('/health'),
    me: () => request<{ user: SessionUser }>('/api/me'),
    signIn: (email: string, password: string) => request<{ user: SessionUser }>('/api/auth/sign-in/email', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
    signUp: (name: string, email: string, password: string) => request<{ user: SessionUser }>('/api/auth/sign-up/email', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
    goals: () => request<{ goals: Goal[] }>('/api/goals'),
    goal: (id: string) => request<{ goal: Goal }>(`/api/goals/${id}`),
    createGoal: (input: GoalInput) => request<{ goal: Goal }>('/api/goals', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
    updateGoal: (id: string, input: Partial<GoalInput>) => request<{ goal: Goal }>(`/api/goals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),
    deleteGoal: (id: string) => request<void>(`/api/goals/${id}`, { method: 'DELETE' }),
    signOut: async () => {
      try {
        await request('/api/auth/sign-out', { method: 'POST' });
      } finally {
        await cookies?.clear();
      }
    },
  };
};

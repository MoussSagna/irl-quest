import type { MiddlewareHandler } from 'hono';
import { auth } from '../auth/config.js';

export type AuthSession = typeof auth.$Infer.Session;

declare module 'hono' {
  interface ContextVariableMap {
    session: AuthSession;
  }
}

export const requireAuth: MiddlewareHandler = async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: 'Unauthorized' }, 401);
  c.set('session', session);
  await next();
};

export const getAuthenticatedUser = (c: { get: (key: 'session') => AuthSession }) =>
  c.get('session').user;

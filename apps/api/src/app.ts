import { Hono } from 'hono';
import { envSchema } from '@irl-quest/validation';
import type { HealthResponse } from '@irl-quest/types';
import { authRoutes } from './routes/auth.js';
import { requireAuth, getAuthenticatedUser } from './middleware/auth.js';
import { goalRoutes } from './routes/goals.js';

envSchema.parse(process.env);

export const app = new Hono();

app.get('/health', (c) =>
  c.json<HealthResponse>({ status: 'ok', service: 'api' }),
);
app.route('/api/auth', authRoutes);
app.route('/api/goals', goalRoutes);
app.get('/api/me', requireAuth, (c) =>
  c.json({ user: getAuthenticatedUser(c) }),
);

export default app;

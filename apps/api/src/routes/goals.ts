import { Hono } from 'hono';
import { db } from '@irl-quest/database';
import { goalCreateSchema, goalUpdateSchema } from '@irl-quest/validation';
import { requireAuth, getAuthenticatedUser } from '../middleware/auth.js';

export const goalRoutes = new Hono();
goalRoutes.use('*', requireAuth);

const parseJson = async <T>(request: Request, schema: { parse: (value: unknown) => T }) => {
  try {
    return { value: schema.parse(await request.json()) as T };
  } catch {
    return { error: 'Invalid goal payload.' };
  }
};

goalRoutes.get('/', async (c) => {
  const user = getAuthenticatedUser(c);
  const goals = await db.goal.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } });
  return c.json({ goals });
});

goalRoutes.get('/:id', async (c) => {
  const user = getAuthenticatedUser(c);
  const goal = await db.goal.findFirst({ where: { id: c.req.param('id'), userId: user.id } });
  if (!goal) return c.json({ error: 'Goal not found.' }, 404);
  return c.json({ goal });
});

goalRoutes.post('/', async (c) => {
  const parsed = await parseJson(c.req.raw, goalCreateSchema);
  if ('error' in parsed) return c.json({ error: parsed.error }, 400);
  const user = getAuthenticatedUser(c);
  const goal = await db.goal.create({ data: { ...parsed.value, userId: user.id } });
  return c.json({ goal }, 201);
});

goalRoutes.patch('/:id', async (c) => {
  const parsed = await parseJson(c.req.raw, goalUpdateSchema);
  if ('error' in parsed) return c.json({ error: parsed.error }, 400);
  const user = getAuthenticatedUser(c);
  const existing = await db.goal.findFirst({ where: { id: c.req.param('id'), userId: user.id } });
  if (!existing) return c.json({ error: 'Goal not found.' }, 404);
  const data = parsed.value;
  if (data.progress !== undefined && data.target === undefined && data.progress > existing.target) {
    return c.json({ error: 'Progress cannot exceed target.' }, 400);
  }
  if (data.target !== undefined && data.progress === undefined && existing.progress > data.target) {
    return c.json({ error: 'Target cannot be below progress.' }, 400);
  }
  const goal = await db.goal.update({ where: { id: existing.id }, data });
  return c.json({ goal });
});

goalRoutes.delete('/:id', async (c) => {
  const user = getAuthenticatedUser(c);
  const existing = await db.goal.findFirst({ where: { id: c.req.param('id'), userId: user.id } });
  if (!existing) return c.json({ error: 'Goal not found.' }, 404);
  await db.goal.delete({ where: { id: existing.id } });
  return c.body(null, 204);
});

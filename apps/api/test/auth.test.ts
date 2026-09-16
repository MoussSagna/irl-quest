import { beforeAll, describe, expect, it } from 'vitest';
import app from '../src/app.js';

const integration = Boolean(process.env.DATABASE_URL);
const suite = describe.skipIf(!integration);
let cookie = '';
let goalId = '';

const request = (path: string, init?: RequestInit) =>
  app.fetch(new Request(`http://localhost${path}`, init));

suite('email/password authentication', () => {
  const email = `test-${Date.now()}@example.com`;
  const password = 'correct-horse-battery-staple';

  it('signs up', async () => {
    const response = await request('/api/auth/sign-up/email', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email, password }),
    });
    expect(response.status).toBe(200);
  });

  it('signs in and returns a session cookie', async () => {
    const response = await request('/api/auth/sign-in/email', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    expect(response.status).toBe(200);
    cookie = response.headers.get('set-cookie')?.split(';')[0] ?? '';
    expect(cookie).toContain('better-auth');
  });

  it('rejects an unauthenticated request', async () => {
    expect((await request('/api/me')).status).toBe(401);
  });

  it('returns the authenticated user for a valid session', async () => {
    const response = await request('/api/me', { headers: { cookie } });
    expect(response.status).toBe(200);
    expect((await response.json()).user.email).toBe(email);
  });

  it('allows authenticated resource access', async () => {
    expect((await request('/api/me', { headers: { cookie } })).status).toBe(200);
  });

  it('creates, validates and updates a goal for the session user', async () => {
    const invalid = await request('/api/goals', {
      method: 'POST',
      headers: { cookie, 'content-type': 'application/json' },
      body: JSON.stringify({ title: '', category: 'Fitness', target: 0, unit: 'days' }),
    });
    expect(invalid.status).toBe(400);

    const created = await request('/api/goals', {
      method: 'POST',
      headers: { cookie, 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'Run', description: 'Train consistently', category: 'Fitness', target: 10, unit: 'sessions' }),
    });
    expect(created.status).toBe(201);
    goalId = (await created.json()).goal.id;

    const listed = await request('/api/goals', { headers: { cookie } });
    expect((await listed.json()).goals).toHaveLength(1);

    const updated = await request(`/api/goals/${goalId}`, {
      method: 'PATCH',
      headers: { cookie, 'content-type': 'application/json' },
      body: JSON.stringify({ progress: 3 }),
    });
    expect((await updated.json()).goal.progress).toBe(3);
  });

  it('does not expose a goal to another user', async () => {
    const otherEmail = `other-${Date.now()}@example.com`;
    const signup = await request('/api/auth/sign-up/email', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Other User', email: otherEmail, password }),
    });
    const otherCookie = signup.headers.get('set-cookie')?.split(';')[0] ?? '';
    expect((await request(`/api/goals/${goalId}`, { headers: { cookie: otherCookie } })).status).toBe(404);
    expect((await request(`/api/goals/${goalId}`, { method: 'DELETE', headers: { cookie: otherCookie } })).status).toBe(404);
  });

  it('deletes a goal belonging to the session user', async () => {
    expect((await request(`/api/goals/${goalId}`, { method: 'DELETE', headers: { cookie } })).status).toBe(204);
    expect((await request(`/api/goals/${goalId}`, { headers: { cookie } })).status).toBe(404);
  });

  it('does not allow another user identity to be supplied', async () => {
    const response = await request('/api/me?userId=someone-else', {
      headers: { cookie },
    });
    expect((await response.json()).user.email).toBe(email);
  });

  it('signs out without sending an invalid JSON body', async () => {
    const response = await request('/api/auth/sign-out', {
      method: 'POST',
      headers: { cookie },
    });
    expect(response.status).toBe(200);
    const clearedCookie = response.headers.get('set-cookie')?.split(';')[0] ?? '';
    expect((await request('/api/me', { headers: { cookie: clearedCookie } })).status).toBe(401);
  });
});

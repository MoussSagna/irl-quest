import { beforeAll, describe, expect, it } from 'vitest';
import app from '../src/app.js';

const integration = Boolean(process.env.DATABASE_URL);
const suite = describe.skipIf(!integration);
let cookie = '';

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

  it('does not allow another user identity to be supplied', async () => {
    const response = await request('/api/me?userId=someone-else', {
      headers: { cookie },
    });
    expect((await response.json()).user.email).toBe(email);
  });
});

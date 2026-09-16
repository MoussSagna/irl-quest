import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { envSchema } from '@irl-quest/validation';
import type { HealthResponse } from '@irl-quest/types';

const env = envSchema.parse(process.env);
const app = new Hono();
app.get('/health', (c) => c.json<HealthResponse>({ status: 'ok', service: 'api' }));

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`API listening on http://localhost:${info.port}`);
});
export default app;

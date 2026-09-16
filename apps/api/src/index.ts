import { serve } from '@hono/node-server';
import { envSchema } from '@irl-quest/validation';
import app from './app.js';

const env = envSchema.parse(process.env);

serve({ fetch: app.fetch, hostname: '0.0.0.0', port: env.PORT }, (info) => {
  console.log(`API listening on port ${info.port} on all network interfaces`);
});

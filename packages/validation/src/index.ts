import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(8787),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url().optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

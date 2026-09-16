import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { db } from '@irl-quest/database';
import { envSchema } from '@irl-quest/validation';

const env = envSchema.parse(process.env);

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: 'postgresql' }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: { enabled: true },
});

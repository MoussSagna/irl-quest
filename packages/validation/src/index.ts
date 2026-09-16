import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(8787),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url().optional(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url().default('http://localhost:8787'),
});

export type AppEnv = z.infer<typeof envSchema>;

export const goalCategorySchema = z.string().trim().min(1).max(40);
export const goalStatusSchema = z.enum(['active', 'completed', 'paused']);
const goalFieldsSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).default(''),
  category: goalCategorySchema,
  target: z.number().int().positive(),
  progress: z.number().int().nonnegative().default(0),
  unit: z.string().trim().min(1).max(40),
  status: goalStatusSchema.default('active'),
});

export const goalCreateSchema = goalFieldsSchema.superRefine((value, context) => {
  if (value.progress > value.target) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['progress'], message: 'Progress cannot exceed target.' });
  }
});

export const goalUpdateSchema = goalFieldsSchema.partial().superRefine((value, context) => {
  if (value.progress !== undefined && value.target !== undefined && value.progress > value.target) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['progress'], message: 'Progress cannot exceed target.' });
  }
});

export type GoalCreateInput = z.infer<typeof goalCreateSchema>;
export type GoalUpdateInput = z.infer<typeof goalUpdateSchema>;

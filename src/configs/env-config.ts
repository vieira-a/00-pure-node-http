import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  PORT: z.string().regex(/^\d+$/, 'PORT must be a valid number.'),
  DATABASE_PG_URL: z
    .string()
    .url()
    .refine((val) => val.startsWith('postgres://'), {
      message: 'DATABASE_PG_URL must start with "postgres://"',
    }),
  NODE_ENV: z.enum(['development', 'production']),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Environment variables validation error', parsedEnv.error.format());
  process.exit(1);
}

export const envConfig = {
  PORT: Number(parsedEnv.data.PORT),
  DATABASE_PG_URL: String(parsedEnv.data.DATABASE_PG_URL),
  NODE_ENV: String(parsedEnv.data.NODE_ENV),
};

import { config } from 'dotenv';
config();

import { z } from 'zod';

const appEnvSchema = z.object({
  PORT: z.string().regex(/^\d+$/, 'PORT must be a valid number.'),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  API_PREFIX: z.string(),
});

const dbEnvSchema = z.object({
  DATABASE_PG_URL: z
    .string()
    .url()
    .refine((val) => val.startsWith('postgres://'), {
      message: 'DATABASE_PG_URL must start with "postgres://"',
    }),
});

const parsedAppEnv = appEnvSchema.safeParse(process.env);
const parsedDbEnv = dbEnvSchema.safeParse(process.env);

if (!parsedAppEnv.success) {
  console.error('App env validation error', parsedAppEnv.error.format());
  process.exit(1);
}

if (!parsedDbEnv.success) {
  console.error('DB env validation error', parsedDbEnv.error.format());
  process.exit(1);
}

const appEnv = {
  PORT: Number(parsedAppEnv.data.PORT),
  NODE_ENV: parsedAppEnv.data.NODE_ENV,
  API_PREFIX: parsedAppEnv.data.API_PREFIX,
};

const dbEnv = {
  DATABASE_PG_URL: parsedDbEnv.data.DATABASE_PG_URL,
};

export const envConfig = {
  application: appEnv,
  database: dbEnv,
};

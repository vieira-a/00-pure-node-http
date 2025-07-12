import { config } from 'dotenv';
config();

import { z } from 'zod';

const appEnvSchema = z.object({
  API_SERVER: z.string(),
  PORT: z.string().regex(/^\d+$/, 'PORT must be a valid number.'),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  API_PREFIX: z.string(),
});

const dbEnvSchema = z.object({
  POSTGRES_SERVER: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_PORT: z.string().regex(/^\d+$/, 'PORT must be a valid number.'),
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
  server: parsedAppEnv.data.API_SERVER,
  port: Number(parsedAppEnv.data.PORT),
  env: parsedAppEnv.data.NODE_ENV,
  prefix: parsedAppEnv.data.API_PREFIX,
};

const dbEnv = {
  server: parsedDbEnv.data.POSTGRES_SERVER,
  user: parsedDbEnv.data.POSTGRES_USER,
  password: parsedDbEnv.data.POSTGRES_PASSWORD,
  name: parsedDbEnv.data.POSTGRES_DB,
  port: parsedDbEnv.data.POSTGRES_PORT,
};

export const envConfig = {
  application: appEnv,
  database: dbEnv,
};

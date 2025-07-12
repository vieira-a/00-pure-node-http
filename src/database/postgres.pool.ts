import { Pool } from 'pg';
import { envConfig } from '../configs/env-config';

export const postgresPool = new Pool({
  connectionString: envConfig.database.DATABASE_PG_URL,
});

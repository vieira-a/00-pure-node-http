import { Pool } from 'pg';
import { envConfig } from '../configs/env-config';

const dbServer = envConfig.database.server;
const dbPort = envConfig.database.port;
const dbUser = envConfig.database.user;
const dbPassword = envConfig.database.password;
const dbName = envConfig.database.name;

const postgresConnectionString = `postgres://${dbUser}:${dbPassword}@${dbServer}:${dbPort}/${dbName}`;
export const postgresPool = new Pool({
  connectionString: postgresConnectionString,
});

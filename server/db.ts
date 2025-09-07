import SQLite from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import { DB } from './db-schema.js';
import path from 'path';

const dbPath = path.join(process.env.DATA_DIRECTORY || './data', 'database.sqlite');

const dialect = new SqliteDialect({
  database: new SQLite(dbPath),
});

export const db = new Kysely<DB>({
  dialect,
  log: ['query', 'error'],
});

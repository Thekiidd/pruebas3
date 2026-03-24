import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { join } from 'node:path';
import * as schema from './schema.js';

const dbPath = process.env['DATABASE_URL']?.replace('file:', '')
  ?? join(process.cwd(), 'dev.db');

const sqlite = createClient({ url: `file:${dbPath}` });

export const db = drizzle(sqlite, { schema });
export type DB = typeof db;

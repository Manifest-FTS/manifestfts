import 'server-only';
import path from 'node:path';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

export type Database = PostgresJsDatabase<typeof schema>;

const MIGRATIONS = path.join(process.cwd(), 'drizzle');

declare global {
  // Reuse one connection across hot reloads in development.
  var __signalDb: Promise<Database> | undefined;
}

async function connect(): Promise<Database> {
  const url = process.env.DATABASE_URL;
  if (url) {
    const { default: postgres } = await import('postgres');
    const { drizzle } = await import('drizzle-orm/postgres-js');
    const { migrate } = await import('drizzle-orm/postgres-js/migrator');
    const client = postgres(url, { max: Number(process.env.DATABASE_POOL_SIZE ?? 10), prepare: false });
    const db = drizzle(client, { schema });
    await migrate(db, { migrationsFolder: MIGRATIONS });
    return db;
  }

  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_EMBEDDED_DB) {
    throw new Error('DATABASE_URL is required in production. Set ALLOW_EMBEDDED_DB=1 only for single-instance previews.');
  }

  // Embedded Postgres (WASM) so the app runs locally without a database server.
  const { PGlite } = await import('@electric-sql/pglite');
  const { drizzle } = await import('drizzle-orm/pglite');
  const { migrate } = await import('drizzle-orm/pglite/migrator');
  const client = new PGlite(path.join(process.cwd(), '.data', 'pglite'));
  const db = drizzle(client, { schema });
  await migrate(db, { migrationsFolder: MIGRATIONS });
  return db as unknown as Database;
}

export function getDb(): Promise<Database> {
  globalThis.__signalDb ??= connect().catch((error) => {
    globalThis.__signalDb = undefined;
    throw error;
  });
  return globalThis.__signalDb;
}

export { schema };

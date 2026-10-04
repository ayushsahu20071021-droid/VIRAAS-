import { Pool } from 'pg';

let injectedPool = null;
let sharedPool = null;

export class DatabaseUnavailableError extends Error {
  constructor(message = 'Persistent database is unavailable.') {
    super(message);
    this.name = 'DatabaseUnavailableError';
    this.code = 'DATABASE_UNAVAILABLE';
  }
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool() {
  if (injectedPool) return injectedPool;
  if (!isDatabaseConfigured()) throw new DatabaseUnavailableError('DATABASE_URL is not configured.');
  if (!sharedPool) {
    sharedPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: process.env.VERCEL ? 1 : 5,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5_000,
      keepAlive: true,
    });
    sharedPool.on('error', (error) => {
      // Do not log connection strings or provider error payloads.
      console.error('[viraas-db] idle connection error:', error?.code || 'unknown');
    });
  }
  return sharedPool;
}

export async function query(text, values = []) {
  return getPool().query(text, values);
}

export async function withTransaction(work) {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    try { await client.query('ROLLBACK'); } catch { /* connection may already be gone */ }
    throw error;
  } finally {
    client.release();
  }
}

const REQUIRED_TABLES = [
  'viraas_users', 'credit_ledger', 'tryon_jobs', 'credit_reservations',
  'payment_orders', 'payment_events', 'connect_pairs', 'conversations',
  'messages', 'blocks', 'reports', 'saved_items', 'schema_migrations',
];

export async function databaseStatus() {
  if (!isDatabaseConfigured()) {
    return { configured: false, ready: false, missing: ['DATABASE_URL'] };
  }
  try {
    const result = await query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'");
    const present = new Set(result.rows.map((row) => row.table_name));
    const missing = REQUIRED_TABLES.filter((name) => !present.has(name));
    return { configured: true, ready: missing.length === 0, missing };
  } catch {
    return { configured: true, ready: false, missing: ['database_connection_or_permissions'] };
  }
}

// Only available to isolated automated tests. A test pool can never be injected in production.
export function setPoolForTests(pool) {
  if (process.env.NODE_ENV !== 'test') throw new Error('Test pool injection is disabled outside NODE_ENV=test.');
  injectedPool = pool;
}

export async function closePool() {
  if (injectedPool) {
    await injectedPool.end?.();
    injectedPool = null;
  }
  if (sharedPool) {
    await sharedPool.end();
    sharedPool = null;
  }
}

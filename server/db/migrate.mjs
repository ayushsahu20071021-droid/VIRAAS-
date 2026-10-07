import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { query, withTransaction } from './pool.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDirectory = path.join(__dirname, 'migrations');

async function migrationFiles() {
  return (await fs.readdir(migrationsDirectory))
    .filter((file) => /^\d+_[a-z0-9_-]+\.sql$/i.test(file))
    .sort((a, b) => a.localeCompare(b, 'en'));
}

async function ensureMigrationTable() {
  try {
    await query('SELECT 1 FROM schema_migrations LIMIT 1');
    return;
  } catch (error) {
    if (error?.code !== '42P01' && !/does not exist|not exist/i.test(error?.message || '')) throw error;
  }
  try {
    // Run outside a transaction so a missing-table error cannot leave a PostgreSQL transaction aborted.
    await query('CREATE TABLE schema_migrations (version VARCHAR(80) PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL)');
  } catch (error) {
    // A second operator may have created it between the SELECT and CREATE.
    if (error?.code !== '42P07' && !/already exists/i.test(error?.message || '')) throw error;
  }
}

async function applyMigration(file) {
  const version = file.replace(/\.sql$/i, '');
  const sql = await fs.readFile(path.join(migrationsDirectory, file), 'utf8');
  return withTransaction(async (client) => {
    const existing = await client.query('SELECT 1 FROM schema_migrations WHERE version = $1', [version]);
    if (existing.rowCount) return false;
    for (const statement of sql.split(';').map((part) => part.trim()).filter(Boolean)) await client.query(statement);
    await client.query('INSERT INTO schema_migrations (version, applied_at) VALUES ($1, now())', [version]);
    return true;
  });
}

export async function migrate({ through } = {}) {
  await ensureMigrationTable();
  const applied = [];
  for (const file of await migrationFiles()) {
    const version = file.replace(/\.sql$/i, '');
    if (through && version.localeCompare(through, 'en') > 0) break;
    if (await applyMigration(file)) applied.push(version);
  }
  return { applied };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  migrate()
    .then(({ applied }) => {
      console.log(applied.length ? `Applied VIRAAS database migration${applied.length === 1 ? '' : 's'}: ${applied.join(', ')}.` : 'VIRAAS database schema is up to date.');
      process.exit(0);
    })
    .catch((error) => { console.error(`Database migration failed: ${error.message}`); process.exit(1); });
}

// Test-only pg-mem bootstrap. Migration 002 contains ALTER COLUMN forms pg-mem cannot parse; the
// equivalent nullable/profile_complete schema is already present in 001_core.sql. Apply 003 and 004
// so tests exercise authenticated and anonymous credit constraints from production PostgreSQL.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export async function migrateTestDatabase({ pool, memoryDb }) {
  memoryDb.public.registerFunction({
    name: 'length', args: ['text'], returns: 'integer', implementation: (value) => String(value).length,
  });
  const { migrate } = await import('../server/db/migrate.mjs');
  await migrate({ through: '001_core' });
  await pool.query("INSERT INTO schema_migrations (version,applied_at) VALUES ('002_incomplete_accounts',now()) ON CONFLICT (version) DO NOTHING");
  for (const version of ['003_tryon_credits_payu', '004_anonymous_tryon_credits']) {
    const migration = await fs.readFile(path.join(root, `server/db/migrations/${version}.sql`), 'utf8');
    for (const statement of migration.split(';').map((part) => part.trim()).filter(Boolean)) await pool.query(statement);
    await pool.query(`INSERT INTO schema_migrations (version,applied_at) VALUES ('${version}',now()) ON CONFLICT (version) DO NOTHING`);
  }
}

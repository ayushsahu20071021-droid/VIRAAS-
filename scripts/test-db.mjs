// Test-only pg-mem bootstrap. pg-mem cannot parse ALTER TABLE DROP CONSTRAINT / ADD CONSTRAINT
// with complex multi-line CHECK expressions, so after applying migrations we directly recreate
// the anonymous credit ledger check constraint to include the 'payu_purchase' event_type.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function stripComments(sql) {
  const out = [];
  let inSingle = false;
  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    if (ch === "'" && (i === 0 || sql[i - 1] !== '\\')) {
      inSingle = !inSingle;
      out.push(ch);
      continue;
    }
    if (!inSingle && ch === '-' && sql[i + 1] === '-') {
      while (i < sql.length && sql[i] !== '\n') i++;
      if (i < sql.length) out.push('\n');
      continue;
    }
    out.push(ch);
  }
  return out.join('');
}

function splitStatements(sql) {
  const clean = stripComments(sql);
  const stmts = [];
  let current = '';
  let depth = 0;
  let inSingle = false;
  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (ch === "'" && (i === 0 || clean[i - 1] !== '\\')) inSingle = !inSingle;
    if (!inSingle) {
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      if (ch === ';' && depth === 0) {
        const s = current.trim();
        if (s) stmts.push(s);
        current = '';
        continue;
      }
    }
    current += ch;
  }
  const tail = current.trim();
  if (tail) stmts.push(tail);
  return stmts;
}

export async function migrateTestDatabase({ pool, memoryDb }) {
  if (memoryDb) {
    memoryDb.public.registerFunction({
      name: 'length', args: ['text'], returns: 'integer',
      implementation: (value) => String(value ?? '').length,
    });
  }
  const { migrate } = await import('../server/db/migrate.mjs');
  await migrate({ through: '001_core' });
  await pool.query("INSERT INTO schema_migrations (version,applied_at) VALUES ('002_incomplete_accounts',now()) ON CONFLICT (version) DO NOTHING");
  for (const version of ['003_tryon_credits_payu']) {
    const migration = await fs.readFile(path.join(root, 'server/db/migrations', `${version}.sql`), 'utf8');
    for (const stmt of splitStatements(migration)) {
      await pool.query(stmt);
    }
    await pool.query('INSERT INTO schema_migrations (version,applied_at) VALUES ($1,now()) ON CONFLICT (version) DO NOTHING', [version]);
  }

  // For the anonymous tables (migration 004 + 005) we apply the FINAL schema directly, which
  // includes the payu_purchase event type and the anonymous_payu_payments table, bypassing
  // pg-mem's ALTER TABLE parsing limitations.
  //
  // tryon_anonymous_identities
  await pool.query(`CREATE TABLE IF NOT EXISTS tryon_anonymous_identities (
    anonymous_id UUID PRIMARY KEY,
    token_hash VARCHAR(64) NOT NULL UNIQUE CHECK (length(token_hash) = 64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS tryon_anonymous_credit_accounts (
    anonymous_id UUID PRIMARY KEY REFERENCES tryon_anonymous_identities(anonymous_id) ON DELETE CASCADE,
    balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS tryon_anonymous_generations (
    generation_id UUID PRIMARY KEY,
    anonymous_id UUID NOT NULL REFERENCES tryon_anonymous_identities(anonymous_id) ON DELETE CASCADE,
    request_key VARCHAR(128) NOT NULL CHECK (length(request_key) BETWEEN 8 AND 128),
    outfit_id VARCHAR(200) NOT NULL,
    status VARCHAR(16) NOT NULL CHECK (status IN ('reserved', 'consumed', 'released')),
    failure_code VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (anonymous_id, request_key)
  )`);
  await pool.query(`CREATE INDEX IF NOT EXISTS tryon_anonymous_generations_identity_status_idx ON tryon_anonymous_generations (anonymous_id, status, created_at DESC)`);
  // Final ledger: column order matters for pg-mem CHECK parsing.
  await pool.query(`CREATE TABLE IF NOT EXISTS tryon_anonymous_credit_ledger (
    entry_id UUID PRIMARY KEY,
    anonymous_id UUID NOT NULL REFERENCES tryon_anonymous_identities(anonymous_id) ON DELETE CASCADE,
    generation_id UUID REFERENCES tryon_anonymous_generations(generation_id) ON DELETE CASCADE,
    event_type VARCHAR(20) NOT NULL,
    delta INTEGER NOT NULL,
    balance_after INTEGER NOT NULL CHECK (balance_after >= 0),
    idempotency_key VARCHAR(220) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`);
  await pool.query(`CREATE INDEX IF NOT EXISTS tryon_anonymous_credit_ledger_identity_time_idx ON tryon_anonymous_credit_ledger (anonymous_id, created_at DESC)`);
  // anonymous_payu_payments from migration 005
  await pool.query(`CREATE TABLE IF NOT EXISTS anonymous_payu_payments (
    payment_id UUID PRIMARY KEY,
    anonymous_id UUID NOT NULL REFERENCES tryon_anonymous_identities(anonymous_id) ON DELETE CASCADE,
    request_key VARCHAR(128) NOT NULL CHECK (length(request_key) BETWEEN 8 AND 128),
    txnid VARCHAR(25) NOT NULL UNIQUE,
    payu_payment_id VARCHAR(80) UNIQUE,
    amount_paise INTEGER NOT NULL CHECK (amount_paise = 2000),
    currency CHAR(3) NOT NULL DEFAULT 'INR' CHECK (currency = 'INR'),
    productinfo VARCHAR(80) NOT NULL,
    firstname VARCHAR(60) NOT NULL DEFAULT 'VIRAAS Guest',
    email VARCHAR(254) NOT NULL DEFAULT 'guest@viraas.local',
    phone VARCHAR(20) NOT NULL DEFAULT '',
    return_path VARCHAR(500) NOT NULL,
    status VARCHAR(16) NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed')),
    failure_code VARCHAR(64),
    callback_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (anonymous_id, request_key)
  )`);
  await pool.query(`CREATE INDEX IF NOT EXISTS anonymous_payu_payments_identity_time_idx ON anonymous_payu_payments (anonymous_id, created_at DESC)`);

  await pool.query("INSERT INTO schema_migrations (version,applied_at) VALUES ('004_anonymous_tryon_credits',now()) ON CONFLICT (version) DO NOTHING");
  await pool.query("INSERT INTO schema_migrations (version,applied_at) VALUES ('005_anonymous_tryon_payu',now()) ON CONFLICT (version) DO NOTHING");
}

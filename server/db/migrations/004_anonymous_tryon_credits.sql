-- Separate anonymous Try-On principals and credit ledger. Keep authenticated user credit tables from
-- 003_tryon_credits_payu remain unchanged and no photo data is stored in these tables.
CREATE TABLE IF NOT EXISTS tryon_anonymous_identities (
  anonymous_id UUID PRIMARY KEY,
  token_hash VARCHAR(64) NOT NULL UNIQUE CHECK (length(token_hash) = 64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS tryon_anonymous_credit_accounts (
  anonymous_id UUID PRIMARY KEY REFERENCES tryon_anonymous_identities(anonymous_id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tryon_anonymous_generations (
  generation_id UUID PRIMARY KEY,
  anonymous_id UUID NOT NULL REFERENCES tryon_anonymous_identities(anonymous_id) ON DELETE CASCADE,
  request_key VARCHAR(128) NOT NULL CHECK (length(request_key) BETWEEN 8 AND 128),
  outfit_id VARCHAR(200) NOT NULL,
  status VARCHAR(16) NOT NULL CHECK (status IN ('reserved', 'consumed', 'released')),
  failure_code VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (anonymous_id, request_key)
);
CREATE INDEX IF NOT EXISTS tryon_anonymous_generations_identity_status_idx
  ON tryon_anonymous_generations (anonymous_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS tryon_anonymous_credit_ledger (
  entry_id UUID PRIMARY KEY,
  anonymous_id UUID NOT NULL REFERENCES tryon_anonymous_identities(anonymous_id) ON DELETE CASCADE,
  generation_id UUID REFERENCES tryon_anonymous_generations(generation_id) ON DELETE CASCADE,
  event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('initial_grant', 'reserve', 'consume', 'release')),
  delta INTEGER NOT NULL,
  balance_after INTEGER NOT NULL CHECK (balance_after >= 0),
  idempotency_key VARCHAR(220) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (
    (event_type = 'initial_grant' AND delta = 2 AND generation_id IS NULL)
    OR (event_type = 'reserve' AND delta = -1 AND generation_id IS NOT NULL)
    OR (event_type = 'consume' AND delta = 0 AND generation_id IS NOT NULL)
    OR (event_type = 'release' AND delta = 1 AND generation_id IS NOT NULL)
  )
);
CREATE INDEX IF NOT EXISTS tryon_anonymous_credit_ledger_identity_time_idx
  ON tryon_anonymous_credit_ledger (anonymous_id, created_at DESC);

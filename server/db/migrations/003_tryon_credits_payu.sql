-- Persistent Try-On balances, generation reservations, and verified PayU +1 credit purchases.
CREATE TABLE IF NOT EXISTS tryon_credit_accounts (
  user_id UUID PRIMARY KEY REFERENCES viraas_users(user_id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tryon_generations (
  generation_id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES viraas_users(user_id) ON DELETE CASCADE,
  request_key VARCHAR(128) NOT NULL CHECK (length(request_key) BETWEEN 8 AND 128),
  outfit_id VARCHAR(200) NOT NULL,
  status VARCHAR(16) NOT NULL CHECK (status IN ('reserved', 'consumed', 'released')),
  failure_code VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, request_key)
);
CREATE INDEX IF NOT EXISTS tryon_generations_user_status_idx ON tryon_generations (user_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS tryon_credit_ledger (
  entry_id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES viraas_users(user_id) ON DELETE CASCADE,
  generation_id UUID REFERENCES tryon_generations(generation_id) ON DELETE CASCADE,
  event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('signup_grant', 'reserve', 'consume', 'release', 'payu_purchase')),
  delta INTEGER NOT NULL,
  balance_after INTEGER NOT NULL CHECK (balance_after >= 0),
  idempotency_key VARCHAR(200) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (
    (event_type = 'signup_grant' AND delta = 2 AND generation_id IS NULL)
    OR (event_type = 'reserve' AND delta = -1 AND generation_id IS NOT NULL)
    OR (event_type = 'consume' AND delta = 0 AND generation_id IS NOT NULL)
    OR (event_type = 'release' AND delta = 1 AND generation_id IS NOT NULL)
    OR (event_type = 'payu_purchase' AND delta = 1 AND generation_id IS NULL)
  )
);
CREATE INDEX IF NOT EXISTS tryon_credit_ledger_user_time_idx ON tryon_credit_ledger (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS payu_credit_payments (
  payment_id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES viraas_users(user_id) ON DELETE CASCADE,
  request_key VARCHAR(128) NOT NULL CHECK (length(request_key) BETWEEN 8 AND 128),
  txnid VARCHAR(25) NOT NULL UNIQUE,
  payu_payment_id VARCHAR(80) UNIQUE,
  amount_paise INTEGER NOT NULL CHECK (amount_paise = 2000),
  currency CHAR(3) NOT NULL DEFAULT 'INR' CHECK (currency = 'INR'),
  productinfo VARCHAR(80) NOT NULL,
  firstname VARCHAR(60) NOT NULL,
  email VARCHAR(254) NOT NULL,
  return_path VARCHAR(500) NOT NULL,
  status VARCHAR(16) NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed')),
  failure_code VARCHAR(64),
  callback_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, request_key)
);
CREATE INDEX IF NOT EXISTS payu_credit_payments_user_time_idx ON payu_credit_payments (user_id, created_at DESC);

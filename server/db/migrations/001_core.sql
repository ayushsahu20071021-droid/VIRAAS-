CREATE TABLE IF NOT EXISTS viraas_users (
  user_id UUID PRIMARY KEY,
  auth_subject TEXT NOT NULL UNIQUE,
  viraas_id VARCHAR(40) UNIQUE,
  display_name VARCHAR(60),
  age SMALLINT CHECK (age IS NULL OR age <= 120),
  gender VARCHAR(16) CHECK (gender IS NULL OR gender IN ('male', 'female', 'nonbinary', 'other')),
  state VARCHAR(80),
  city VARCHAR(80),
  locality VARCHAR(100),
  bio VARCHAR(500) NOT NULL DEFAULT '',
  profile_photo TEXT,
  visibility VARCHAR(16) NOT NULL DEFAULT 'hidden' CHECK (visibility IN ('public', 'connections', 'hidden')),
  profile_complete BOOLEAN NOT NULL DEFAULT false,
  credits INTEGER NOT NULL DEFAULT 0 CHECK (credits >= 0),
  reserved_credits INTEGER NOT NULL DEFAULT 0 CHECK (reserved_credits >= 0 AND reserved_credits <= credits),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (profile_photo IS NULL OR profile_photo LIKE 'https://%'),
  CHECK (NOT profile_complete OR (viraas_id IS NOT NULL AND display_name IS NOT NULL AND age IS NOT NULL AND age >= 18 AND gender IS NOT NULL AND state IS NOT NULL AND city IS NOT NULL AND locality IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS viraas_users_discovery_idx ON viraas_users (visibility, gender, state, city, locality);

CREATE TABLE IF NOT EXISTS credit_ledger (
  ledger_id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES viraas_users(user_id) ON DELETE CASCADE,
  event_type VARCHAR(24) NOT NULL CHECK (event_type IN ('CREDIT_GRANT', 'CREDIT_CONSUMPTION', 'CREDIT_PURCHASE', 'CREDIT_RELEASE')),
  delta INTEGER NOT NULL CHECK (delta <> 0),
  idempotency_key VARCHAR(180) NOT NULL UNIQUE,
  reference_type VARCHAR(32),
  reference_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS credit_ledger_user_time_idx ON credit_ledger (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tryon_jobs (
  job_id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES viraas_users(user_id) ON DELETE CASCADE,
  idempotency_key VARCHAR(120) NOT NULL,
  outfit_id VARCHAR(180) NOT NULL,
  status VARCHAR(16) NOT NULL CHECK (status IN ('PROCESSING', 'SUCCEEDED', 'FAILED')),
  result_storage_path TEXT,
  failure_code VARCHAR(80),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, idempotency_key)
);
CREATE INDEX IF NOT EXISTS tryon_jobs_user_time_idx ON tryon_jobs (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS credit_reservations (
  reservation_id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES viraas_users(user_id) ON DELETE CASCADE,
  job_id UUID NOT NULL UNIQUE REFERENCES tryon_jobs(job_id) ON DELETE CASCADE,
  state VARCHAR(16) NOT NULL CHECK (state IN ('RESERVED', 'CONSUMED', 'RELEASED')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payment_orders (
  payment_id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES viraas_users(user_id) ON DELETE CASCADE,
  idempotency_key VARCHAR(120) NOT NULL,
  provider VARCHAR(24) NOT NULL CHECK (provider = 'razorpay'),
  gateway_order_id VARCHAR(100) UNIQUE,
  gateway_payment_id VARCHAR(100) UNIQUE,
  amount_paise INTEGER NOT NULL CHECK (amount_paise = 2000),
  currency CHAR(3) NOT NULL CHECK (currency = 'INR'),
  credits INTEGER NOT NULL DEFAULT 1 CHECK (credits = 1),
  status VARCHAR(16) NOT NULL CHECK (status IN ('CREATING', 'PENDING', 'VERIFIED', 'FAILED', 'CANCELLED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  verified_at TIMESTAMPTZ,
  UNIQUE (user_id, idempotency_key)
);
CREATE INDEX IF NOT EXISTS payment_orders_user_time_idx ON payment_orders (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS payment_events (
  event_key VARCHAR(180) PRIMARY KEY,
  payment_id UUID NOT NULL REFERENCES payment_orders(payment_id) ON DELETE CASCADE,
  event_type VARCHAR(80) NOT NULL,
  payload_sha256 CHAR(64) NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS connect_pairs (
  connection_id UUID NOT NULL UNIQUE,
  request_id UUID NOT NULL UNIQUE,
  user_low UUID NOT NULL REFERENCES viraas_users(user_id) ON DELETE CASCADE,
  user_high UUID NOT NULL REFERENCES viraas_users(user_id) ON DELETE CASCADE,
  initiated_by UUID NOT NULL REFERENCES viraas_users(user_id) ON DELETE CASCADE,
  status VARCHAR(16) NOT NULL CHECK (status IN ('PENDING', 'CONNECTED', 'DECLINED', 'BLOCKED')),
  declined_by UUID REFERENCES viraas_users(user_id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (user_low < user_high),
  CHECK (initiated_by = user_low OR initiated_by = user_high),
  UNIQUE (user_low, user_high)
);
CREATE INDEX IF NOT EXISTS connect_pairs_initiator_idx ON connect_pairs (initiated_by, status);

CREATE TABLE IF NOT EXISTS conversations (
  conversation_id UUID PRIMARY KEY,
  user_low UUID NOT NULL REFERENCES viraas_users(user_id) ON DELETE CASCADE,
  user_high UUID NOT NULL REFERENCES viraas_users(user_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_message_at TIMESTAMPTZ,
  CHECK (user_low < user_high),
  UNIQUE (user_low, user_high)
);

CREATE TABLE IF NOT EXISTS messages (
  message_id UUID PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(conversation_id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES viraas_users(user_id) ON DELETE CASCADE,
  body VARCHAR(2000) NOT NULL CHECK (body <> ''),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS messages_conversation_time_idx ON messages (conversation_id, created_at, message_id);

CREATE TABLE IF NOT EXISTS blocks (
  blocker_id UUID NOT NULL REFERENCES viraas_users(user_id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES viraas_users(user_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (blocker_id, blocked_id),
  CHECK (blocker_id <> blocked_id)
);

CREATE TABLE IF NOT EXISTS reports (
  report_id UUID PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES viraas_users(user_id) ON DELETE CASCADE,
  reported_id UUID NOT NULL REFERENCES viraas_users(user_id) ON DELETE CASCADE,
  reason VARCHAR(40) NOT NULL,
  details VARCHAR(1000) NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (reporter_id <> reported_id)
);
CREATE INDEX IF NOT EXISTS reports_reported_time_idx ON reports (reported_id, created_at DESC);

CREATE TABLE IF NOT EXISTS saved_items (
  user_id UUID NOT NULL REFERENCES viraas_users(user_id) ON DELETE CASCADE,
  item_kind VARCHAR(16) NOT NULL CHECK (item_kind IN ('product', 'couple', 'tryon')),
  item_id VARCHAR(180) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, item_kind, item_id)
);

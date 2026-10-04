CREATE TABLE IF NOT EXISTS viraas_users (
  user_id UUID PRIMARY KEY,
  auth_subject TEXT NOT NULL UNIQUE,
  viraas_id VARCHAR(40) UNIQUE,
  display_name VARCHAR(60),
  age SMALLINT CHECK (age IS NULL OR age BETWEEN 0 AND 120),
  gender VARCHAR(16) CHECK (gender IS NULL OR gender IN ('male', 'female', 'nonbinary', 'other')),
  state VARCHAR(80),
  city VARCHAR(80),
  locality VARCHAR(100),
  bio VARCHAR(500) NOT NULL DEFAULT '',
  profile_photo TEXT,
  visibility VARCHAR(16) NOT NULL DEFAULT 'hidden' CHECK (visibility IN ('public', 'connections', 'hidden')),
  profile_complete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (profile_photo IS NULL OR profile_photo LIKE 'https://%'),
  CHECK (NOT profile_complete OR (viraas_id IS NOT NULL AND display_name IS NOT NULL AND age IS NOT NULL AND age >= 18 AND gender IS NOT NULL AND state IS NOT NULL AND city IS NOT NULL AND locality IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS viraas_users_discovery_idx ON viraas_users (visibility, gender, state, city, locality);

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

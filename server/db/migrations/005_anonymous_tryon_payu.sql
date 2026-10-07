-- Anonymous PayU payments for ₹20 Try-On credits.
-- Migrations 002, 003 and 004 remain UNCHANGED. This migration safely extends the anonymous
-- Try-On system so that every Try-On costs exactly ₹20 INR via PayU hosted checkout,
-- with no free credits, server-side callback verification, and idempotent +1 credit grants.

-- Anonymous PayU payment/order records linked to an opaque anonymous_id (no photo bytes stored).
CREATE TABLE IF NOT EXISTS anonymous_payu_payments (
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
);
CREATE INDEX IF NOT EXISTS anonymous_payu_payments_identity_time_idx
  ON anonymous_payu_payments (anonymous_id, created_at DESC);

-- Extend the anonymous credit ledger to accept payu_purchase events that grant +1 credit.
-- Existing event types ('initial_grant', 'reserve', 'consume', 'release') remain valid
-- for backwards compatibility; the new payu_purchase event adds exactly one credit.
ALTER TABLE tryon_anonymous_credit_ledger DROP CONSTRAINT IF EXISTS tryon_anonymous_credit_ledger_event_type_check;
ALTER TABLE tryon_anonymous_credit_ledger ADD CONSTRAINT tryon_anonymous_credit_ledger_event_type_check
  CHECK (
    (event_type = 'initial_grant' AND delta = 2 AND generation_id IS NULL)
    OR (event_type = 'reserve' AND delta = -1 AND generation_id IS NOT NULL)
    OR (event_type = 'consume' AND delta = 0 AND generation_id IS NOT NULL)
    OR (event_type = 'release' AND delta = 1 AND generation_id IS NOT NULL)
    OR (event_type = 'payu_purchase' AND delta = 1 AND generation_id IS NULL)
  );

-- Retire the removed free-credit model for pre-existing anonymous identities.
-- A balance that was only ever funded by the retired free grant is reset to zero so every
-- Try-On from here on costs ₹20. Identities that already recorded a verified PayU purchase
-- keep their balance untouched, so this migration can never take away a paid credit.
-- Idempotent: once zeroed, the balance stays zero and the statement is a no-op.
UPDATE tryon_anonymous_credit_accounts a
SET balance = 0, updated_at = now()
WHERE a.balance > 0
  AND EXISTS (SELECT 1 FROM tryon_anonymous_credit_ledger g WHERE g.anonymous_id = a.anonymous_id AND g.event_type = 'initial_grant')
  AND NOT EXISTS (SELECT 1 FROM tryon_anonymous_credit_ledger p WHERE p.anonymous_id = a.anonymous_id AND p.event_type = 'payu_purchase');

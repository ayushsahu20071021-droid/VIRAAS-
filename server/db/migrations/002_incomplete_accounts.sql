-- Existing accounts can be created by real email sign-up before adult Connect onboarding.
-- Apply after 001_core; existing complete adult profiles are preserved as complete.
ALTER TABLE viraas_users ALTER COLUMN viraas_id DROP NOT NULL;
ALTER TABLE viraas_users ALTER COLUMN display_name DROP NOT NULL;
ALTER TABLE viraas_users ALTER COLUMN age DROP NOT NULL;
ALTER TABLE viraas_users ALTER COLUMN gender DROP NOT NULL;
ALTER TABLE viraas_users ALTER COLUMN state DROP NOT NULL;
ALTER TABLE viraas_users ALTER COLUMN city DROP NOT NULL;
ALTER TABLE viraas_users ALTER COLUMN locality DROP NOT NULL;
ALTER TABLE viraas_users ADD COLUMN IF NOT EXISTS profile_complete BOOLEAN NOT NULL DEFAULT false;
UPDATE viraas_users
SET profile_complete = true
WHERE viraas_id IS NOT NULL
  AND display_name IS NOT NULL
  AND age >= 18
  AND gender IS NOT NULL
  AND state IS NOT NULL
  AND city IS NOT NULL
  AND locality IS NOT NULL;
ALTER TABLE viraas_users DROP CONSTRAINT IF EXISTS viraas_users_profile_complete_check;
ALTER TABLE viraas_users
  ADD CONSTRAINT viraas_users_profile_complete_check
  CHECK (NOT profile_complete OR (viraas_id IS NOT NULL AND display_name IS NOT NULL AND age IS NOT NULL AND age >= 18 AND gender IS NOT NULL AND state IS NOT NULL AND city IS NOT NULL AND locality IS NOT NULL));

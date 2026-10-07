-- VIRAAS Connect profile photos: dedicated public Supabase Storage bucket with per-user folders.
-- Photos are uploaded only by the authenticated server endpoint (server/social/profilePhoto.mjs)
-- using the signed-in user's own access token, and browsers never receive storage credentials.
-- Row-level security keeps every object inside the owner's own folder.
-- Requires the Supabase storage schema of the existing VIRAAS database.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('connect-profile-photos', 'connect-profile-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Connect profile photos are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'connect-profile-photos');

CREATE POLICY "Connect users upload their own profile photo"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'connect-profile-photos' AND (storage.foldername(name))[1] = (auth.uid())::text);

CREATE POLICY "Connect users update their own profile photo"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'connect-profile-photos' AND (storage.foldername(name))[1] = (auth.uid())::text)
  WITH CHECK (bucket_id = 'connect-profile-photos' AND (storage.foldername(name))[1] = (auth.uid())::text);

CREATE POLICY "Connect users delete their own profile photo"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'connect-profile-photos' AND (storage.foldername(name))[1] = (auth.uid())::text);

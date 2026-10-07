const messages = [
  [/^DATABASE_URL$/, 'Persistent VIRAAS account storage is not connected.'],
  [/^database_connection_or_permissions$/, 'The account database is unreachable or has not been migrated.'],
  [/^(?:tryon_|payu_|migration:003_tryon_credits_payu)/, 'Persistent Try-On credits and PayU payment storage have not been migrated.'],
  [/^migration:/, 'The persistent VIRAAS database schema has not been fully migrated.'],
  [/^SUPABASE_URL$/, 'Secure email sign-in is not configured.'],
  [/^SUPABASE_ANON_KEY$/, 'Secure email sign-in is not configured.'],
  [/^VIRAAS_SESSION_SECRET/, 'Secure account sessions are not configured.'],
];

export function publicRequirement(value) {
  const input = String(value || '');
  for (const [pattern, message] of messages) if (pattern.test(input)) return message;
  return 'A required secure VIRAAS service is not configured.';
}

export function publicRequirements(values = []) {
  return [...new Set(values.map(publicRequirement))];
}

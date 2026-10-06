const MISSING_VERCEL_ORIGIN = 'A valid HTTPS VIRAAS asset origin is required on Vercel (set PUBLIC_BASE_URL or provide VERCEL_URL)';

/** Resolve a server-side public origin without trusting request Host headers. */
export function resolvePublicAssetBase(env = process.env) {
  const onVercel = Boolean(env.VERCEL);
  const explicit = typeof env.PUBLIC_BASE_URL === 'string' ? env.PUBLIC_BASE_URL.trim() : '';
  const productionHost = env.VERCEL_ENV === 'production' && typeof env.VERCEL_PROJECT_PRODUCTION_URL === 'string'
    ? env.VERCEL_PROJECT_PRODUCTION_URL.trim()
    : '';
  const deploymentHost = productionHost || (typeof env.VERCEL_URL === 'string' ? env.VERCEL_URL.trim() : '');
  const raw = explicit || (deploymentHost ? (/^https?:\/\//i.test(deploymentHost) ? deploymentHost : `https://${deploymentHost}`) : '');
  if (!raw) return { base: '', requirement: onVercel ? MISSING_VERCEL_ORIGIN : null };
  try {
    const url = new URL(raw);
    const originOnly = url.pathname === '/' && !url.search && !url.hash && !url.username && !url.password;
    if (!originOnly || (onVercel && url.protocol !== 'https:')) throw new Error('invalid origin');
    return { base: url.origin, requirement: null };
  } catch {
    return { base: '', requirement: onVercel ? MISSING_VERCEL_ORIGIN : 'PUBLIC_BASE_URL must be a valid URL origin' };
  }
}

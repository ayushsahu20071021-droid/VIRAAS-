// VIRAAS Vercel Serverless Function entrypoint.
//
// Vercel bundles the ENTIRE Express app into a single Function. This file only re-exports the shared
// app from ../server/app.mjs — it adds NO routes and duplicates NO backend logic, and it never calls
// app.listen(). Secrets (e.g. RUNWARE_API_KEY) are read server-side inside the providers via
// process.env and are never referenced here or shipped to the client bundle.
//
// vercel.json rewrites every "/api/*" request to this function. Some Vercel routing configurations
// preserve the original "/api" prefix while others strip it; since ONLY "/api/*" requests are routed
// here, we defensively normalize req.url to always carry the "/api" prefix so the Express router
// (whose routes are all declared as "/api/...") matches in either case. This is a routing-only shim
// — it changes no application behaviour, no privacy handling, and no provider logic.
import app from '../server/app.mjs';

export default function handler(req, res) {
  if (typeof req.url === 'string' && !req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? '' : '/') + req.url;
  }
  return app(req, res);
}

// No-spend Runware adapter probe. Runs ONE generateTryOn() against the REAL adapter under a scenario
// chosen by env, and prints a JSON verdict + elapsed ms. It NEVER calls the real Runware endpoint:
// scenarios either stop before any network (missing key / ZDR gate) or point RUNWARE_API_URL at an
// unreachable local address so we can prove the request is built + dispatched server-side without
// spending a single credit. No real user photo is used (synthetic 1x1 pixel).
import { runwareFluxVtoProvider, runwareConfigured } from '../server/providers/runwareFluxVto.mjs';

const TEST_PHOTO =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
const GARMENT = TEST_PHOTO; // synthetic stand-in; real flow inlines the approved VIRAAS reference

const started = Date.now();
const out = await runwareFluxVtoProvider.generateTryOn({
  outfitId: 'women-look-001',
  gender: 'women',
  photo: TEST_PHOTO,
  garmentImageUrl: GARMENT,
  garmentDescription: 'Chaniya choli with dupatta',
});
console.log(JSON.stringify({ configured: runwareConfigured, elapsedMs: Date.now() - started, out }));

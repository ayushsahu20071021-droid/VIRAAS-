// VIRAAS local / traditional-host entrypoint.
//
// Starts a long-running HTTP listener for the Express app defined in ./app.mjs. Used by `npm start`,
// local development and the live preview, and any non-serverless Node host. The SAME app is reused
// on Vercel via api/index.mjs (which does NOT call app.listen()), so there is a single set of routes.
import { app } from './app.mjs';
import { tryOnMode, tryOnConfigured, tryOnRequirements } from './tryOnProvider.mjs';
import * as payments from './payments/service.mjs';

const port = Number(process.env.PORT || 8787);
app.listen(port, '0.0.0.0', () =>
  console.log(
    `VIRAAS server on :${port} (try-on mode: ${tryOnMode}, configured: ${tryOnConfigured}` +
      `${tryOnRequirements.length ? `; requires: ${tryOnRequirements.join('; ')}` : ''}; ` +
      `payment: provider=${payments.paymentConfig.provider} required=${payments.paymentRequired} configured=${payments.paymentConfig.configured})`,
  ),
);

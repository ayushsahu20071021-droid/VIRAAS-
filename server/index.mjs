// VIRAAS production server: serves the built SPA from dist/ and the /api/try-on endpoint.
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { tryOnProvider, tryOnMode } from './tryOnProvider.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/catalog.json'), 'utf8'));
const byId = new Map(catalog.map((p) => [p.id, p]));

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '12mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/api/try-on/status', (_req, res) => res.json({ mode: tryOnMode }));
app.post('/api/try-on', async (req, res) => {
  const { productId, photo, ageConfirmed } = req.body || {};
  if (ageConfirmed !== true) return res.status(403).json({ ok: false, message: 'AI Try-On with a personal photo requires age 18+.' });
  const product = byId.get(productId);
  if (!product) return res.status(404).json({ ok: false, message: 'Unknown product.' });
  if (!product.tryOnEnabled) return res.status(400).json({ ok: false, message: 'This product is not eligible for Try-On.' });
  if (typeof photo !== 'string' || !/^data:image\/(jpeg|png|webp);base64,/.test(photo)) return res.status(400).json({ ok: false, message: 'Please upload a JPG, PNG or WebP photo.' });
  if (photo.length > 11 * 1024 * 1024) return res.status(413).json({ ok: false, message: 'Photo too large.' });
  try {
    const out = await tryOnProvider.generateTryOn({ productId, photo, garmentImageUrl: product.imageUrl });
    res.status(out.ok ? 200 : 502).json(out);
  } catch (e) {
    res.status(500).json({ ok: false, message: 'Try-on failed.' });
  }
});

const dist = path.join(ROOT, 'dist');
app.use(express.static(dist, { maxAge: '1h', index: false }));
app.get(/^(?!\/api\/).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));

const port = Number(process.env.PORT || 8787);
app.listen(port, '0.0.0.0', () => console.log(`VIRAAS server on :${port} (try-on mode: ${tryOnMode})`));

import fs from 'node:fs'; import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const P = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/catalog.json'), 'utf8'));
const C = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/couples.json'), 'utf8'));
const W = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/worlds.json'), 'utf8'));
const slug = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const cats = [...new Set(P.map((p) => `/${p.gender}/${slug(p.category)}`))];
// The Women/Men mega menus list garment categories derived from the look records themselves
// (garmentType), so the smoke list derives the same slugs instead of hardcoding category names.
const LOOK_CATALOGS = {
  women: JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/women-look-catalog.client.json'), 'utf8')),
  men: JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/men-look-catalog.client.json'), 'utf8')),
};
const lookCategories = [...new Set(Object.entries(LOOK_CATALOGS).flatMap(([gender, looks]) => looks.map((look) => look.garmentType && `/${gender}/${slug(look.garmentType)}`)))].sort();
const occasionQueries = [...new Set(Object.entries(LOOK_CATALOGS).flatMap(([gender, looks]) => looks.map((look) => look.occasion && `/${gender}?occasion=${look.occasion}`)))].sort();
export const ROUTES = ['/', '/women', '/women/garba', '/women/college-fest', '/women/diwali', '/women-look/women-look-001', '/women-look/women-look-014', '/women-look/women-look-075', '/men', '/occasions', ...W.map((w) => `/occasions/${w.slug}`), '/couple-edit', '/couple-edit?world=garba', `/couple-edit/${C[0].id}`, `/couple-edit/${C[99].id}`,
  '/trending', '/trending?budget=under-999', '/accessories', '/search?q=garba%20men', '/search?q=couple%20garba', '/saved', '/try-on', `/try-on?product=${P.find((p) => p.tryOnEnabled).id}`, '/connect', '/connect/u/test-viraas-id', '/chat', '/chat/test-conversation',
  `/product/${P[0].id}`, `/product/${P[P.length - 1].id}`, '/journal', '/journal/garba-night-outfit-formula', '/about', '/contact', '/faq', '/privacy', '/terms', '/affiliate-disclosure', '/ai-try-on-privacy', ...occasionQueries, ...lookCategories, ...cats];

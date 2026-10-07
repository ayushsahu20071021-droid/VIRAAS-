// Runs the real client search module against intent queries.
import { tsImport } from 'tsx/esm/api';
import { report } from './lib/common.mjs';
const { searchProducts, searchCouples } = await tsImport('../src/lib/search.ts', import.meta.url);
const cases = [
  ['garba women', (r) => r.length > 0 && r.every((p) => p.gender === 'women' && p.occasion.includes('garba'))],
  ['garba men', (r) => r.length > 0 && r.every((p) => p.gender === 'men' && p.occasion.includes('garba'))],
  ['navratri women', (r) => r.length > 0 && r.every((p) => p.gender === 'women' && p.occasion.includes('garba'))],
  ['navratri men', (r) => r.length > 0 && r.every((p) => p.gender === 'men')],
  ['college fest women', (r) => r.length > 0 && r.every((p) => p.gender === 'women' && p.occasion.includes('college-fest'))],
  ['college fest men', (r) => r.length > 0 && r.every((p) => p.gender === 'men' && p.occasion.includes('college-fest'))],
  ['diwali women', (r) => r.length > 0 && r.every((p) => p.gender === 'women' && p.occasion.includes('diwali'))],
  ['diwali men', (r) => r.length > 0 && r.every((p) => p.gender === 'men' && p.occasion.includes('diwali'))],
  // Color intent may appear in the product title (for example, a black blouse or pink dupatta)
  // even when the catalog's primary-colour field records the dominant shade of the full set.
  ['black festive outfit', (r) => r.length > 0 && r.every((p) => /\bblack\b/i.test([p.title, p.colour, ...p.secondaryColours].join(' ')))],
  ['pink lehenga', (r) => r.length > 0 && r.every((p) => p.category === 'Lehenga' && /\b(?:pink|magenta|fuchsia|rani)\b/i.test([p.title, p.colour, ...p.secondaryColours].join(' ')))],
  ['chaniya choli', (r) => r.length > 0 && r.every((p) => p.category === 'Chaniya Choli')],
  ['pre draped saree', (r) => r.length > 0 && r.every((p) => p.category === 'Pre-Draped Saree')],
  ['sharara', (r) => r.length > 0 && r.every((p) => p.category === 'Sharara')],
  ['gharara', (r) => r.length > 0 && r.every((p) => p.category === 'Gharara')],
  ['ethnic shirt', (r) => r.length > 0 && r.every((p) => p.gender === 'men' && /Shirt/.test(p.category))],
  ['modern kurta', (r) => r.length > 0 && r[0].category === 'Modern Kurta' && r.every((p) => p.gender === 'men' || /kurta/i.test(p.title))],
  ['men', (r) => r.length > 0 && r.every((p) => p.gender === 'men')],
  ['women', (r) => r.length > 0 && r.every((p) => p.gender === 'women')],
];
const checks = cases.map(([q, f]) => { const r = searchProducts(q); return [f(r), `“${q}” → ${r.length} results${r[0] ? ` (top: ${r[0].title})` : ''}`]; });
const cg = searchCouples('couple garba');
checks.push([cg.length === 20 && cg.every((c) => c.world === 'garba'), `“couple garba” → ${cg.length} garba couple looks`]);
checks.push([searchProducts('men').every((p) => p.gender !== 'women'), 'gender token bug absent: “men” never matches women']);
report('audit-search', checks);

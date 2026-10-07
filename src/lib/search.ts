// Token-aware intent search. "men" never matches inside "women": we tokenise on word boundaries
// and treat gender words as explicit filters, not substrings.
import { PRODUCTS, COUPLES, type Product, type Couple, worldName } from './data';

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9₹\s-]/g, ' ').replace(/-/g, ' ');
export const tokenize = (s: string) => norm(s).split(/\s+/).filter(Boolean);

const GENDER: Record<string, 'women' | 'men'> = {
  women: 'women', woman: 'women', womens: 'women', female: 'women', her: 'women', girls: 'women', girl: 'women', ladies: 'women',
  men: 'men', man: 'men', mens: 'men', male: 'men', him: 'men', boys: 'men', boy: 'men', guys: 'men',
};
const OCCASION: Record<string, string> = {
  garba: 'garba', navratri: 'garba', dandiya: 'garba', navaratri: 'garba',
  college: 'college-fest', fest: 'college-fest', campus: 'college-fest',
  diwali: 'diwali', deepavali: 'diwali',
  party: 'festive-party', festive: '', // "festive" alone is generic
  traditional: 'traditional', temple: 'traditional', puja: 'traditional', pooja: 'traditional',
};
const SYN: Record<string, string[]> = {
  saree: ['saree', 'sari', 'sarees', 'saris'], lehenga: ['lehenga', 'lehengas', 'lengha', 'lehnga'],
  chaniya: ['chaniya', 'chaniyacholi', 'ghagra'], kurta: ['kurta', 'kurtas', 'kurti'],
  shirt: ['shirt', 'shirts'], jacket: ['jacket', 'jackets', 'nehru', 'bandi'], sharara: ['sharara', 'shararas'], gharara: ['gharara', 'ghararas'],
  anarkali: ['anarkali', 'anarkalis'], predraped: ['predraped', 'pre', 'draped', 'readymade', 'ready'],
  pink: ['pink', 'rani', 'magenta', 'fuchsia'], white: ['white', 'ivory', 'cream', 'offwhite'], black: ['black'], red: ['red'],
  blue: ['blue', 'navy', 'indigo', 'royal'], green: ['green', 'emerald', 'olive', 'sage', 'mint', 'teal'], yellow: ['yellow', 'mustard', 'gold'],
  maroon: ['maroon', 'wine'], stole: ['stole', 'dupatta', 'shawl', 'scarf'], jewellery: ['jewellery', 'jewelry', 'jhumka', 'jhumkas', 'earrings', 'necklace', 'bangles'],
  footwear: ['footwear', 'shoes', 'juttis', 'jutti', 'mojari', 'mojaris', 'heels', 'sandals', 'kolhapuri'], bag: ['bag', 'bags', 'potli', 'clutch'],
  couple: ['couple', 'couples', 'twinning', 'matching', 'pair'],
};
const canon = new Map<string, string>();
Object.entries(SYN).forEach(([k, vs]) => vs.forEach((v) => canon.set(v, k)));
const STOP = new Set(['for', 'the', 'a', 'an', 'and', 'with', 'outfit', 'outfits', 'look', 'looks', 'wear', 'dress', 'dresses', 'in', 'of', 'set', 'sets', 'ideas', 'style']);

function productTokens(p: Product): Set<string> {
  const txt = [p.title, p.category, p.subcategory, p.colour, ...p.secondaryColours, p.fabric, p.pattern, p.embroidery, p.silhouette, ...p.styleTags, ...p.occasion.map(worldName), ...p.occasion].join(' ');
  const s = new Set<string>();
  tokenize(txt).forEach((t) => { s.add(t); const c = canon.get(t); if (c) s.add(c); });
  if (p.category === 'Pre-Draped Saree') s.add('predraped');
  if (p.category === 'Chaniya Choli') s.add('chaniya');
  return s;
}
const INDEX = new Map(PRODUCTS.map((p) => [p.id, productTokens(p)]));

export interface ParsedQuery { gender?: 'women' | 'men'; occasion?: string; terms: string[]; couple: boolean }
export function parseQuery(q: string): ParsedQuery {
  const out: ParsedQuery = { terms: [], couple: false };
  const toks = tokenize(q);
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (GENDER[t]) { out.gender = GENDER[t]; continue; }
    if (t === 'college' && toks[i + 1] === 'fest') { out.occasion = 'college-fest'; i++; continue; }
    if (t in OCCASION) { if (OCCASION[t]) out.occasion = OCCASION[t]; continue; }
    if (t === 'choli') continue; // 'choli' alone is ambiguous (chaniya choli vs lehenga choli)
    if (STOP.has(t)) continue;
    const c = canon.get(t) ?? t;
    if (c === 'couple') { out.couple = true; continue; }
    if (!out.terms.includes(c)) out.terms.push(c);
  }
  // "pre draped" → single intent
  if (out.terms.includes('predraped')) out.terms = out.terms.filter((t) => t !== 'saree' || true);
  return out;
}

export function searchProducts(q: string): Product[] {
  const pq = parseQuery(q);
  if (!pq.gender && !pq.occasion && pq.terms.length === 0) return [];
  const scored: Array<[Product, number]> = [];
  for (const p of PRODUCTS) {
    if (pq.gender && p.gender !== pq.gender) continue;
    if (pq.occasion && !p.occasion.includes(pq.occasion)) continue;
    const toks = INDEX.get(p.id)!;
    let score = 0; let ok = true;
    for (const t of pq.terms) {
      if (toks.has(t)) score += 3;
      else if ([...toks].some((x) => x.length > 3 && t.length > 3 && x.startsWith(t))) score += 1;
      else { ok = false; break; }
    }
    if (!ok) continue;
    if (pq.occasion && !p.accessory) score += 2;
    if (p.coupleIds.length) score += 0.5;
    if (p.imageUrl) score += 0.25;
    scored.push([p, score]);
  }
  return scored.sort((a, b) => b[1] - a[1]).map((x) => x[0]);
}

export function searchCouples(q: string): Couple[] {
  const pq = parseQuery(q);
  if (!pq.couple && !pq.occasion) return [];
  if (!pq.couple && pq.gender) return [];
  return COUPLES.filter((c) => {
    if (pq.occasion && c.world !== pq.occasion) return false;
    const txt = new Set(tokenize([c.title, c.colourStory, c.her.desc, c.him.desc, c.layer?.desc ?? ''].join(' ')).flatMap((t) => [t, canon.get(t) ?? t]));
    return pq.terms.every((t) => txt.has(t));
  });
}

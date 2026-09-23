# VIRAAS — REFERENCE MAP

> Status of supplied reference material (honest record):
> The brief specifies 10 uploaded files (8 individual Pinterest/reference screenshots + 2 VIRAAS
> consolidated reference sheets with 10 panels each = 28 total visual reference panels).
> **Those 10 binary files did not arrive in this workspace** (the full filesystem was searched).
> Per the REFERENCE-FIRST RULE and the instruction not to ask for restatement, this map is built
> from the brief's own exhaustive reference language — which specifies outfits, silhouettes, colour
> stories, styling, poses, framing, environments, lighting and the youthful aesthetic in full detail —
> and from 2026 marketplace naming research. All VIRAAS imagery is ORIGINAL generation from this map.
> When the 10 files are re-attached, every prompt in `src/data/image-manifest.json` can be re-QA'd
> panel-by-panel against them without losing any progress.

## 1. WOMEN'S FASHION FAMILIES

| Family | Silhouettes | Construction language | Colour stories |
|---|---|---|---|
| Chaniya Choli (PRIORITY) | 8-metre flared, panelled, A-line, kalidar, layered, tiered | fitted festive cholis, colourful odhanis, visually rich borders, mirror-work, bandhani-inspired detail, Kutchi patch, gamthi work | black + silver, ivory + pink, rani pink, red + black, multicolour, navy, emerald, royal blue, mustard, hot pink, white/ivory |
| Lehenga | flared, A-line, kalidar, mermaid, layered, ruffled | light festive to statement; movement-friendly | per world (garba richest) |
| Sharara / Gharara | waist-flare sharara; knee-flare gharara | short kurta pairing, Lucknowi line | youthful pastels + festive solids |
| Saree / Pre-Draped | six-yard drape, pre-stitched, belted drape | contemporary saree, ready-to-wear | diwali/festive-party/traditional |
| Anarkali | floor-length, kalidar, short, jacket-layered | statement festive | diwali/traditional |
| Kurta Sets / Festive Sets | straight/A-line/slit kurta sets | practical festive, college-friendly | all worlds |
| Jewellery / Bags / Footwear / Beauty | jhumkas, potlis, juttis, kolhapuris, kajal/minis | oxidised silver, gota, meenakari | accent pieces |

EXCLUDED from primary taxonomy: co-ords, fusion, indo-western.

## 2. MEN'S FASHION FAMILIES (modern 18–25 — NOT formal/rental catalogue)

| Family | Language |
|---|---|
| Modern Ethnic Shirts | black ethnic shirt + white trousers, longline, mandarin collar, boxy festive |
| Printed Ethnic | bandhani, ajrakh, motif, paisley prints |
| Embroidered Ethnic | chest motif, tonal embroidery, mirror detail, selective embroidery only |
| Modern Kurtas | relaxed kurta, short kurta, side-slit kurta |
| Festive Sets | kurta/trouser and shirt/trouser sets |
| Festive Layers | light overshirts, sleeveless gilets |
| Festive Separates | tapered/pleated/drawstring festive trousers |
| Contemporary Garba | black-on-black, garba night shirts, navy/wine/maroon |
| Accessories | mojari, stoles, brooches, chains |

EXCLUDED: achkan, sherwani, bandhgala, groomwear, ceremonial wedding menswear, royal prince styling, heavy gold/brocade formal, kediyu/kafni/chorno/dhoti costume taxonomy. (Enforced by validator.)

## 3. GARBA / NAVRATRI REFERENCES (priority #1 — deepest treatment)

- Outfits: chaniya choli with mirror-work, bandhani-inspired detail, colourful embroidered borders, Kutchi-inspired visual language; lehengas for movement; colourful odhanis; fitted festive blouses.
- Men: black ethnic shirt + white trousers, dark embroidered shirt, navy festive shirt, wine/maroon shirt, relaxed kurta, printed ethnic shirt, black-on-black, ivory shirt + colourful accent, modern scarf/stole, selective mirror detail.
- Scenes: garba ground, fairy lights, decorated pandal, dandiya area, colourful canopy, festival lane, Navratri event, outdoor lights.
- The card must visually say GARBA / NAVRATRI before the title is read.

## 4. COLLEGE FEST REFERENCES

- Lightweight lehengas, chaniya-style festive looks, simple festive blouses, colourful skirts, practical festive outfits, youthful styling, college-friendly accessories.
- Men: printed/embroidered ethnic shirts, black/navy/wine/olive/ivory, relaxed modern kurta, contemporary trousers, light festive layer.
- Scenes: campus, stairs, lawns, fest stage, corridors, outdoor lights.

## 5. DIWALI REFERENCES

- Women: lehenga, saree, pre-draped, anarkali, festive kurta set, statement looks.
- Men: dark festive ethnic shirts, embroidered shirts, printed shirts, modern kurta + trousers, light festive layer.
- Mood: warm lights, diyas, balcony, terrace, courtyard, tasteful Indian interior.

## 6. FESTIVE PARTY REFERENCES

- Elegant lehenga, contemporary saree, festive set, statement ethnic styling, rich colours, evening-ready styling.
- Men: black / wine / emerald / ivory / navy / charcoal; contemporary ethnic shirts, modern festive layers, sleek silhouettes. Not western clubwear. Not groomwear.

## 7. TRADITIONAL REFERENCES

- Saree, lehenga, chaniya, anarkali, kurta set; embroidery and traditional textures; classic but youthful. Traditional ≠ ceremonial costume.
- Scenes: heritage architecture, courtyard, jharokha, natural light, Indian interiors.

## 8. COUPLE OUTFIT COMBINATIONS (matched but not matching)

Encoded 20 per world in `scripts/lib/vocab.mjs` (WORLD_META.couplePairs). Examples:
- her hot pink + ivory / him ivory + hot pink accent
- her black + silver / him black + white
- her navy + silver / him navy + cream
- her rani pink + gold / him ivory + pink
- her red + black / him black + red accent
- her multicolour bandhani / him neutral + one matching accent
- … full 100-pair table in vocab (garba rani/black/white/multicolour emphasis; diwali gold-light colours; party darks; traditional reds/emerald/ivory + gold).

## 9. POSE LIBRARY (26 directions — max repetition ≤ 2 per world)

walking hand-in-hand · looking at each other · laughing together · outfit adjustment · dupatta adjustment · arm around shoulder · arm around waist · side-by-side walking · back-view walking · candid conversation · playful interaction · dance lead · garba twirl · one partner twirling · mirror selfie · phone selfie · close standing · forehead-near · seated casual · wall lean · looking away · walking looking back · playful festival moment · dandiya mid-step · quiet candid · squat-and-lean.

## 10. COLOUR STORIES (per world)

- **Garba**: black + silver · ivory + pink · rani pink · red + black · multicolour · navy · emerald · royal blue · mustard · hot pink · white/ivory
- **College Fest**: yellow/white · pink/ivory · sky/white · lime/white · peach/ivory · lilac/silver · coral/white (youthful, light)
- **Diwali**: rani + gold · royal blue + silver · emerald + gold · wine + gold · mustard + red · ivory + gold · red + gold · black + gold
- **Festive Party**: black + silver · wine + gold · emerald + black · ivory + black · navy + cream · charcoal + crystal
- **Traditional**: red + gold · emerald + gold · navy + gold · ivory + red · maroon + gold · mehendi green + gold

## 11. ENVIRONMENT LIBRARY

- Garba: open garba ground w/ fairy-light canopies · Navratri pandal w/ colourful drapes · dandiya area w/ lantern strings · festival lane w/ torans · colourful canopy · open-air event w/ crowd bokeh
- College: campus lawns · college stairs · fest stage · campus corridor · fest grounds · courtyard at dusk
- Diwali: terrace diyas · balcony fairy lights · home courtyard · festive lane · warm living room · rooftop dusk
- Party: evening venue · banquet lounge · terrace deck · lantern-wall event space · outdoor party bokeh · uplit courtyard
- Traditional: haveli courtyard · jharokha balcony · sandstone corridor · Indian interior · temple courtyard steps · verandah

## 12. PHOTOGRAPHIC LANGUAGE

- Couples: real-human, realistic photography, 18–25, Indian, natural skin/hair, candid, Pinterest/Instagram aesthetic, slightly imperfect, believable; 35mm reportage / 50mm portrait / 85mm compression; eye-level, low-angle, three-quarter, environmental wide, knee-up, over-shoulder.
- Products: premium identity-neutral fashion mannequin / realistic fashion figure; full-body, complete garment visible; luxury studio / refined Indian interior / heritage architecture / warm festive interior; cinematic soft lighting; no logo/watermark.
- QA loop per image: GENERATE → INSPECT → COMPARE → REJECT → REGENERATE → PASS (hash-duplicate + visual duplicate checks).

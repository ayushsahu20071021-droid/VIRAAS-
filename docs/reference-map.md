# VIRAAS — REFERENCE MAP

> Status of supplied reference material (honest record):
> **5 attachment files arrived with the 2026-09-23 brief and WERE STUDIED in full:**
> `viraas_pinterest_references_01-10.jpg` + `viraas_pinterest_references_11-20.jpg`
> (2 sheets × 10 panels = 20 couple reference panels) and 3 individual Pinterest pins —
> `Screenshot (1914).png` ("myyy" rani-pink bandhani mirror-selfie), `Screenshot (1967).png`
> ("Garba Nights, Matching Hearts" ivory + jeans seated steps), `Screenshot (1917).png`
> ("outfit check, navratri #twinning" navy bandhani + the "smile says everything" dupatta moment).
> The binaries did not materialise in the sandbox filesystem (no /home/user/uploads), so §13 below
> IS the preserved study: every dimension (OUTFIT → COLOUR → STYLING → POSE → HANDS → BODY →
> CAMERA → FRAMING → INTERACTION → ENVIRONMENT → LIGHTING) is written out per source and encoded
> in `scripts/enrich-couple-prompts.mjs` for all remaining couple generations. Bucket 1 (CL-G-01…20,
> generated earlier from the brief's reference language) matches the study's rani/ivory bandhani
> night-garba families and was QA-passed; it is retained (no completed work destroyed).
> §1–§12 = taxonomy/vocab map (from brief language + 2026 marketplace naming research).
> §13 = the attached-reference study — PRIMARY SOURCE OF TRUTH for couple imagery.

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

## 13. ATTACHED REFERENCE STUDY (2026-09-23) — PRIMARY SOURCE OF TRUTH

Studied per source in the order OUTFIT → COLOUR → STYLING → POSE → HAND POSITION → BODY POSITION → CAMERA ANGLE → FRAMING → INTERACTION → ENVIRONMENT → LIGHTING.

### PIN A — "myyy ❤️🧿" (Jasneet) · Screenshot (1914)
- **OUTFIT** her rani-pink bandhani lehenga, gold gota + mirror-work border, white embroidered choli under a mirror-work koti with tasselled dupatta; him crisp white kurta + multicolour bandhani dupatta over one shoulder
- **COLOUR** rani pink + ivory + multicolour bandhani accents (his dupatta echoes her border — the "matched but not matching" mechanism)
- **STYLING** heavy silver oxidised jewellery: mathapatti/maang tikka, choker, bangle stack, rings; open hair; him sleeves rolled, zero jewellery
- **POSE** standing hip-close mirror selfie
- **HANDS** her hand raising a phone at face height (faces hidden behind the phone — signature candid trick); his arm around her back
- **BODY** weight on one leg, hips touching, slight lean-in
- **CAMERA** frontal into mirror at eye level (phone-in-mirror)
- **FRAMING** thigh-up 3/4 vertical; garment detail fully readable
- **INTERACTION** playful hidden-face selfie energy, young and giggly
- **ENVIRONMENT** indoor garment market / retail floor, racks of clothes behind (real shopping context)
- **LIGHTING** soft flat retail interior light

### PIN B — "Garba Nights, Matching Hearts 💜✨ | Navratri Couple Aesthetic" (Vani Creation, labelled AI modified) · Screenshot (1967)
- **OUTFIT** her ivory mirror-work lehenga-choli + sheer dupatta; him ivory kurta + BLUE JEANS (the key youthful cue: ethnic top + casual bottom)
- **COLOUR** ivory/cream + gold mirror glints + warm amber night
- **STYLING** minimal jewellery, soft waves; him totally casual — NOT groomwear
- **POSE** seated side-close on old stone steps
- **HANDS** relaxed on knees, hands near each other
- **BODY** shoulder-to-shoulder lean, heads inclined inward
- **CAMERA** slightly low, intimate eye level
- **FRAMING** full seated body, medium-wide, environment visible
- **INTERACTION** quiet closeness, near-forehead touch, soft smiles (young dating energy, NOT married/bridal)
- **ENVIRONMENT** haveli stone steps + arch, candles/diyas scattered on the steps
- **LIGHTING** golden-hour warmth + candle points at night

### PIN C — "outfit check, navratri #navratri #outfit #twinning" (mahie) + related pin "smile says everything" · Screenshot (1917)
- **OUTFIT** her navy/black bandhani chaniya, wide gold-silver border, white cropped top, mirror-border dupatta, kamarband; related couple: her green choli + red bandhani odhani, him white kurta + red bandhani dupatta
- **COLOUR** navy + white + gold/silver; related pin red + green + white
- **STYLING** silver mathapatti, oversized nath, bangle stack
- **POSE** reclined diagonal mirror "outfit check" with skirt edge lifted; related: she fixes his dupatta while he laughs
- **HANDS** one hand lifting the skirt flare toward camera; related: both her hands raised at his shoulder adjusting fabric
- **BODY** diagonal recline spreading the skirt; related: close facing, weight leaning toward each other
- **CAMERA** high-angle phone mirror shot; related: eye-level night street
- **FRAMING** full-body diagonal; related: knee-up two-shot
- **INTERACTION** solo outfit-display confidence ("twinning" = couple context); related: styling each other + shared laughter
- **ENVIRONMENT** casual bedroom; related: night street with shop glow
- **LIGHTING** soft daylight indoor; related: warm street lights at night

### PANEL DIGEST — sheets 01–10 + 11–20 (20 panels)
Recurring scene families (panel refs):
- **NIGHT-GARBA DANCE** with dandiya sticks under string lights (P8, P9, P15, P17, P19) — motion, flare, crowd bokeh
- **MIRROR/PHONE SELFIE** phone over faces (P2, P10, P14, P16, P20)
- **LAUGH CANDID** heads tipped together (P3, P7, P18)
- **TWIRL** chaniya flare mid-spin (P19)
- **DAY COURTYARD / FORT / STREET** walk-and-talk (P3, P4, P6, P11)
- **GOLDEN HOUR** outdoors (P4)
- **OUTFIT LAYDOWN / detail** flat-lays and fabric close-ups (P16)
- **CASUAL INDOOR** earphones, bed-talk, room candids (P2, P14)
- **WALKING AWAY** over-shoulder glances (P6, P11)
- **SEATED CLOSE** steps/curbs (P7)
Colour matrix across panels: rani/hot pink · red/crimson · ivory/white · navy · mustard/yellow · pastel peach-lilac · black + silver.
His styling matrix: white/ivory kurta-or-shirt + bandhani dupatta is THE signature; dark printed shirts; jeans/white pants allowed with ethnic top. Nowhere a sherwani/achkan — P5's heavy red lehenga set is bridal-adjacent and is explicitly excluded from VIRAAS styling.
Age read: unmistakably 18–25 — phone-native, playful, imperfect.

### COMPOSITION RULES ENFORCED IN EVERY REMAINING COUPLE PROMPT
- DO: hidden-face phone selfie as ONE pose family among many; imperfect candid motion; paired fabric echo (his dupta echoes her border); casual-bottom mixes (jeans with kurta per Pin B); props as lived-in (phone, earphones, dandiya sticks, dupatta, diyas)
- DON'T: mannequins or plastic/featureless faces; bridal makeup, garlands, heavy bridal jewellery; mature-married body language; stiff studio posing; achkan/sherwani/bandhgala/groomwear; wedding-album framing; one image recoloured repeatedly (each look cycles distinct pose + camera + framing + environment + lighting via `enrich-couple-prompts.mjs`)
- Product visuals stay on premium identity-neutral mannequins (§12) — couple visuals stay on realistic humans. The two systems never mix.

### 13b. PANEL → FAMILY MAP + 15-POINT RECREATION SPEC

The panels are read as **20 reference families**; inside every occasion world the 20 looks map 1:1 to
the 20 families (different order per world), so each world covers the full panel library and no two
looks in a world share a composition. Encoded in `scripts/enrich-couple-prompts.mjs`.

| # | Family | # | Family |
|---|---|---|---|
| F1 | Dance on the garba ground | F11 | Sharing earphones |
| F2 | Mirror selfie | F12 | Wall lean |
| F3 | Phone selfie | F13 | Dandiya mid-step |
| F4 | Laughing together | F14 | Squat and lean |
| F5 | Twirl | F15 | Dance lead |
| F6 | Courtyard walk | F16 | Look-back stroll |
| F7 | Golden hour | F17 | Outfit check |
| F8 | Walking away | F18 | Close and quiet |
| F9 | Seated on steps | F19 | Watching together |
| F10 | Styling each other | F20 | Festive mischief |

**15-point spec enforced in every remaining couple prompt** (dimension = field carried in the prompt):
1 EXACT OUTFIT TYPE · 2 her+him combination · 3 colour relationship (from the look's real
`colourStory`) · 4 silhouette · 5 dupatta/scarf/stole treatment · 6 embroidery/print/mirror-work
language · 7 pose/body position · 8 hand placement · 9 distance between the two · 10 camera angle ·
11 framing/crop · 12 interaction/body language · 13 location type · 14 lighting · 15 overall aesthetic.
Points 1–6 are built from the look's **real linked product IDs** (colour, silhouette, fabric, pattern,
embroidery of the actual purchasable pieces), so the photograph and the catalog agree.
`couples.json` `poseDirection` / tag / description are realigned to the assigned family so card text
matches the generated photograph. QA per image: GENERATE → INSPECT → COMPARE vs family → REJECT if
materially off → REGENERATE → PASS. Marked PASS only when outfit, colour story, pose, framing,
composition, age read and body language all survive comparison.

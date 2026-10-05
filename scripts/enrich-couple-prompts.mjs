#!/usr/bin/env node
// VIRAAS couple-prompt enrichment v2 — REFERENCE-RECREATION spec.
//
// Source of truth: the 5 attached reference files (3 pins + 2 sheets × panels), studied
// panel-by-panel per the 15-point spec and preserved in docs/reference-map.md §13/§13b.
//
// For every PENDING couple look (buckets 2-5):
//   - keeps the identity + data-true outfit block (built from the look's real linked products)
//   - replaces the composition tail with a 15-dimension recreation spec assigned from the
//     look's reference FAMILY (20 families = the 20 panels), world-specific order
//   - realigns couples.json poseDirection / tags / description to the assigned family so the
//     card text matches the generated photograph
//   - never touches generated entries (bucket 1 CL-G-01..20 stays QA-passed as-is)
// Idempotent: re-running rebuilds the tail from the SPLIT marker.

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(ROOT, "src/data/image-manifest.json"), "utf8"));
const couples = JSON.parse(readFileSync(join(ROOT, "src/data/couples.json"), "utf8"));
const products = JSON.parse(readFileSync(join(ROOT, "src/data/products.json"), "utf8"));
const byId = new Map(couples.map((c) => [c.id, c]));
const prodById = new Map(products.map((p) => [p.id, p]));

const SPLIT = "Matched but not matching — intentional colour harmony, no uniform dressing.";

const HER_MAIN = ["Chaniya Choli","Lehenga","Anarkali","Sharara","Gharara","Sarees","Pre-Draped Sarees","Kurta Sets","Festive Sets"];
const HIS_MAIN = ["Modern Kurtas","Modern Ethnic Shirts","Printed Ethnic","Embroidered Ethnic","Festive Sets","Festive Layers","Festive Separates","Contemporary Garba"];

function mainOf(ids, order) {
  const list = ids.map((id) => prodById.get(id)).filter(Boolean);
  for (const cat of order) {
    const hit = list.find((p) => p.category === cat);
    if (hit) return hit;
  }
  return list[0] || null;
}
function accOf(ids, main) {
  const list = ids.map((id) => prodById.get(id)).filter(Boolean);
  return list.find((p) => p !== main) || null;
}
function silhu(p) {
  if (!p) return "festive ethnic silhouette";
  const PLACEHOLDER = /^(minimal festive piece|brooch pin|mojari pair|embellished flat pair)$/i;
  const sil = (p.silhouette || "").toLowerCase();
  const cat = p.category.toLowerCase();
  const redundant = sil && cat.split(" ").some((w) => w.length > 3 && sil.includes(w));
  const core = sil && !PLACEHOLDER.test(sil) ? (redundant ? p.silhouette : `${p.silhouette} ${cat}`) : cat;
  return `${core} in ${(p.fabric || "flowing fabric").toLowerCase()}`;
}
function printOf(p) {
  if (!p) return "";
  const bits = [];
  if (p.pattern && !/print only/i.test(p.pattern)) bits.push(p.pattern.toLowerCase());
  if (p.embroidery && !/print only/i.test(p.embroidery) && p.embroidery.toLowerCase() !== (p.pattern || "").toLowerCase()) bits.push(p.embroidery.toLowerCase());
  return bits.join(" + ");
}

// 20 reference families = the 20 panels. Fields: name, body, dist, hands, inter, cue, cams[2], frames[2].
const F = {
  F1: { name: "Dance on the garba ground",
    body: "mid-dance on the garba ground, knees soft, weight shifting through a step",
    dist: "half-arm apart with joined hands stretched between them",
    hands: "her free hand raised at shoulder height, his hand steadying at her waist",
    inter: "dancing at each other rather than for the camera — spontaneous, joyful",
    cue: "the reference night-garba dance panels with string lights and crowd bokeh",
    cams: ["dynamic low 35mm reportage angle, slight motion blur in the skirt", "eye-level 50mm with the frame caught mid-step"],
    frames: ["full-length environmental framing", "knee-up dynamic two-shot"] },
  F2: { name: "Mirror selfie",
    body: "leaning hip-close into a big garlanded mirror, one leg popped",
    dist: "hips nearly touching, faces a palm-width apart",
    hands: "her hand raising the phone toward the mirror, his arm around her back",
    inter: "mirror-selfie playfulness, faces turned down toward the phone or toward each other, real skin and hair visible",
    cue: "the reference mirror-selfie pins ('outfit check, navratri' and 'myyy')",
    cams: ["frontal into the mirror at eye level, phone-in-mirror framing", "slightly off-axis into the mirror, 35mm phone look"],
    frames: ["thigh-up 3/4 vertical mirror frame", "full-length mirror frame with the venue reflected"] },
  F3: { name: "Phone selfie",
    body: "standing hip-close, free arms relaxed, slight lean-in",
    dist: "shoulders overlapping, almost no gap",
    hands: "her hand holding the phone up at face height toward them, his arm around her waist",
    inter: "couple selfie mid-giggle, faces partly behind the phone the way real selfies hide them",
    cue: "the reference phone-selfie pins",
    cams: ["arm's-length phone-lens perspective with slight wide distortion", "eye-level 35mm look with the arm visibly holding the phone"],
    frames: ["tight waist-up two-shot", "head-to-knee selfie crop"] },
  F4: { name: "Laughing together",
    body: "leaning in, heads tipped toward each other, weight on the inside legs",
    dist: "shoulders almost touching, heads a few inches apart",
    hands: "her hand at his chest mid-laugh, his arm around her shoulder",
    inter: "shared candid laugh with imperfect expressions, eyes crinkled",
    cue: "the reference laugh candids with tipped-together heads",
    cams: ["eye-level 50mm with shallow depth of field", "slightly high 35mm candid angle"],
    frames: ["waist-up two-shot", "knee-up natural crop"] },
  F5: { name: "Twirl",
    body: "her mid-twirl with the skirt flaring wide, him stepping back a pace",
    dist: "an arm's length with joined hands bridging the gap",
    hands: "his hand catching hers at shoulder height, her other hand skimming the fabric",
    inter: "he watches her spin with a wide grin — delight, not performance",
    cue: "the reference twirl frames with the flare caught mid-motion",
    cams: ["low dynamic angle catching the skirt flare", "eye-level 50mm with motion living in the hem"],
    frames: ["full-length flared-skirt framing", "wide environmental framing with the crowd blurred"] },
  F6: { name: "Courtyard walk",
    body: "walking side by side mid-conversation, strides matched",
    dist: "shoulder-width apart, hands loosely joined",
    hands: "his hand at the small of her back, her free hand gesturing mid-sentence",
    inter: "caught mid-sentence on an unposed walk",
    cue: "the reference day-courtyard walk-and-talk panels",
    cams: ["eye-level 35mm reportage walk-along", "slightly behind their shoulders, 50mm"],
    frames: ["full-length environment-visible framing", "knee-up walking crop"] },
  F7: { name: "Golden hour",
    body: "standing close, weight settled, one hand adjusting the other's sleeve",
    dist: "close with a natural respectful gap",
    hands: "fingers loosely laced at waist height",
    inter: "quiet golden-hour closeness, small private smiles",
    cue: "the reference golden-hour outdoor pins",
    cams: ["85mm compression with a warm backlight halo", "50mm at eye level with the sun behind them"],
    frames: ["half-body portrait crop", "full-length with long shadows"] },
  F8: { name: "Walking away",
    body: "walking away from the camera, their backs to us, garments swaying with the stride",
    dist: "shoulders brushing, moving in step",
    hands: "hands loosely joined between them, free arms swinging",
    inter: "a glance back over the shoulder at the camera, caught-off-guard smiles",
    cue: "the reference walking-away frames with the over-shoulder look",
    cams: ["behind-and-slightly-high 35mm follow view", "low behind view catching the drape of the fabric"],
    frames: ["full-length back view with the environment", "wide framing with the couple small in the scene"] },
  F9: { name: "Seated on steps",
    body: "seated hip-close on old stone steps, knees drawn up or legs stretched",
    dist: "shoulders touching, heads tipping together",
    hands: "hands resting near each other on a knee, fingers almost touching",
    inter: "forehead-near quiet moment, soft eyes — deeply close but unmistakably young and unmarried",
    cue: "the reference 'Garba Nights, Matching Hearts' seated-steps pin with candle light",
    cams: ["slightly low intimate eye level", "straight-on 50mm at their seated height"],
    frames: ["full seated-body framing with the steps visible", "knee-up seated crop"] },
  F10: { name: "Styling each other",
    body: "close facing, weight leaning toward each other",
    dist: "a hand-span apart with the dressy fabrics overlapping",
    hands: "one of them adjusting the other's dupatta/stole at the shoulder while the other laughs (she adjusts his stole on even looks, he pins her dupatta pleats on odd ones)",
    inter: "affection shown through styling each other — the 'smile says everything' moment",
    cue: "the reference dupatta-adjustment pins where one styles the other",
    cams: ["eye-level 50mm with the hands in focus", "slight over-the-shoulder 35mm"],
    frames: ["waist-up two-shot focused on the gesture", "knee-up framing with fabric detail"] },
  F11: { name: "Sharing earphones",
    body: "sitting close sharing space on a ledge, shoulders touching",
    dist: "near-zero gap with one earphone wire stretching between them",
    hands: "sharing one earphone, phones resting on their knees",
    inter: "quiet shared-music intimacy, private smiles",
    cue: "the reference casual earphone/indoor candids",
    cams: ["soft eye-level 50mm with shallow focus", "slightly high intimate angle"],
    frames: ["waist-up intimate crop", "knee-up framing from the side"] },
  F12: { name: "Wall lean",
    body: "leaning against a corridor wall or pillar, one shoulder touching the surface",
    dist: "shoulder-to-shoulder, relaxed",
    hands: "her hands behind her back, his hand flat on the wall beside her (not looming)",
    inter: "close talk, heads tilted together, easy confidence",
    cue: "the reference wall-lean frames",
    cams: ["eye-level 50mm along the wall line", "three-quarter 35mm with corridor depth"],
    frames: ["knee-up two-shot with the corridor receding", "full-length vertical framing"] },
  F13: { name: "Dandiya mid-step",
    body: "mid-step with dandiya sticks raised, knees bouncing, one heel lifted",
    dist: "an arm's length across the sticks, eye contact through the gap",
    hands: "both hands occupied with dandiya sticks, wrists loose",
    inter: "playful stick-tap mid-dance, huge grins, real motion energy",
    cue: "the reference dandiya mid-step panels with motion blur",
    cams: ["dynamic eye-level 35mm with slight motion blur", "low angle catching the raised sticks"],
    frames: ["full-length motion framing", "knee-up energetic crop"] },
  F14: { name: "Squat and lean",
    body: "squatting side by side on a kerb or courtyard edge, elbows resting on knees",
    dist: "shoulders brushing, heads at the same height",
    hands: "hands hanging loose between the knees, her hand resting over his",
    inter: "street candid — both grinning at something just off-frame",
    cue: "the reference kerb-squat street candids",
    cams: ["slightly high 35mm looking down the street", "eye-level at their squat height, 50mm"],
    frames: ["full-length kerb framing with street depth", "wide two-shot with the lane behind"] },
  F15: { name: "Dance lead",
    body: "mid dance frame with his hand guiding at her waist and her hand on his shoulder",
    dist: "dance-frame distance with elbows softly bent",
    hands: "classic light dance hold, fingers soft, never gripping",
    inter: "leading a casual step, eye contact mid-turn, easy laughter",
    cue: "the reference dance-floor couple panels",
    cams: ["eye-level 50mm dance-floor angle", "low 35mm catching the skirts in motion"],
    frames: ["full-length dance framing", "waist-up crop on the faces"] },
  F16: { name: "Look-back stroll",
    body: "walking ahead a half-step, half-turned toward the lens",
    dist: "half-arm apart with her trailing hand holding his",
    hands: "one joined hand, the other lifting the skirt hem for the stride",
    inter: "a caught look back over the shoulder, hair mid-swing",
    cue: "the reference look-back stroll frames",
    cams: ["eye-level 50mm walk-along", "slightly behind and to the side, 35mm"],
    frames: ["full-length vertical framing", "knee-up framing with the street behind"] },
  F17: { name: "Outfit check",
    body: "confident full-length stance, weight on one leg, hand lifting the skirt hem to show the flare",
    dist: "hip-close with him relaxed beside her",
    hands: "her hand lifting the skirt edge outward, his hands in his pockets",
    inter: "showing the outfit to the camera while he watches her proudly",
    cue: "the reference full-length outfit-check pins",
    cams: ["front-on full-length 50mm", "slight low angle to flatter the silhouette"],
    frames: ["full-length vertical framing with the garment readable", "full-length environmental framing"] },
  F18: { name: "Close and quiet",
    body: "standing quietly close, shoulders overlapping, weight settled",
    dist: "almost no gap, calm",
    hands: "hands loosely joined at waist height",
    inter: "calm togetherness, small unforced smiles, eyes on each other or on the lights",
    cue: "the reference close-stance quiet portraits",
    cams: ["eye-level 85mm compression", "50mm at chest height with a soft background"],
    frames: ["waist-up two-shot portrait", "half-body crop with bokeh"] },
  F19: { name: "Watching together",
    body: "standing side by side, both turned slightly off-frame toward the scene",
    dist: "shoulders touching in comfortable silence",
    hands: "loosely joined hands low between them",
    inter: "both watching the fest lights / stage / view together, caught in profile",
    cue: "the reference off-camera gaze panels",
    cams: ["over-the-shoulder 35mm from behind the scene", "eye-level 50mm side profile"],
    frames: ["knee-up framing with the scene beyond", "wide environmental framing"] },
  F20: { name: "Festive mischief",
    body: "mid-gesture on the fest ground, one foot kicking up a little dust",
    dist: "an arm's length, leaning apart mid-mischief",
    hands: "his hand dodging playfully with a dandiya stick, her hand mid-throw of sparkle",
    inter: "festival mischief — big laughs, motion blur welcome",
    cue: "the reference festive-mischief pins",
    cams: ["35mm reportage at eye level with slight motion blur", "low 50mm catching the action"],
    frames: ["full-length energetic framing", "wide framing with the crowd behind"] },
};

// Each world's 20 looks map 1:1 to the 20 families (different order per world) —
// full panel coverage within every world, no two looks in a world sharing a composition.
const WORLD_FAMILY_ORDER = {
  "garba": ["F13","F5","F9","F2","F10","F7","F1","F3","F19","F11","F18","F15","F16","F4","F17","F12","F20","F6","F8","F14"],
  "college-fest": ["F3","F6","F4","F12","F16","F14","F2","F9","F10","F11","F7","F17","F8","F19","F18","F1","F5","F20","F15","F13"],
  "diwali": ["F18","F9","F10","F7","F4","F2","F19","F6","F5","F3","F17","F12","F11","F16","F15","F14","F1","F20","F8","F13"],
  "festive-party": ["F12","F4","F18","F15","F10","F19","F2","F17","F16","F3","F1","F6","F9","F20","F5","F11","F14","F8","F7","F13"],
  "traditional": ["F6","F18","F9","F8","F10","F7","F4","F19","F17","F16","F2","F12","F3","F15","F11","F5","F20","F1","F14","F13"],
};
const WORLD_OFFSET = { "garba": 0, "college-fest": 1, "diwali": 2, "festive-party": 3, "traditional": 4 };

const G = {
  "garba": {
    loc: ["open garba ground — festoon and fairy-light canopies overhead with dandiya crowd bokeh behind",
      "Navratri pandal — colourful drapes, lantern strings and marigold garlands on decorated pillars",
      "festival lane outside the venue — torans, string lights and glowing stalls",
      "mirror corner of the decorated venue with garlanded frames and festive drapes around"],
    light: ["night fest lights — warm string-light points with soft ambient spill",
      "golden-lit pandal glow with lantern bokeh", "warm dusk turning night with the fest bulbs just switched on"],
    herDup: ["her odhani pinned over one shoulder with the fall sweeping across the front, mirror-border edge catching the lights",
      "her dupatta draped Gujarati-style over one shoulder with pleats fanned wide behind her for movement",
      "her dupatta thrown loosely over both shoulders with one end trailing as she moves"],
    hisStole: ["his bandhani stole draped Gujarati-style over one shoulder with a knot at the chest",
      "his stole folded narrow across both shoulders with the ends hanging front",
      "his festive scarf knotted at the neck with the ends tucked for dancing"],
    print: ["mirror-work (abhla) borders, bandhani/leheriya print, mirrored gota trim and tassel drops",
      "colour-blocked panels, gamthi mirror embroidery, contrast gota-patti borders and thread tassels"],
  },
  "college-fest": {
    loc: ["campus lawns at the annual fest — fest stage and string-light canopy behind",
      "wide concrete college staircase with marigold strings on the railings",
      "campus corridor near the canteen — fest posters, bicycles and a notice board softly blurred",
      "open college courtyard at dusk with fest bulbs strung overhead"],
    light: ["bright shaded afternoon daylight in open shade", "golden-hour side light turning to dusk fest bulbs",
      "early-evening fest string lights under a warm dusk sky"],
    herDup: ["dupatta pinned neatly across one shoulder for a movement-friendly fest look",
      "dupatta worn light like a scarf with pleats falling along the skirt",
      "dupatta looped over one arm, freeing her hands for the fest"],
    hisStole: ["his bandhani stole over one shoulder with a printed shirt",
      "his stole worn as an open scarf over a fest shirt", "his stole folded narrow with the ends swinging as he walks"],
    print: ["light block prints, fine thread embroidery at the yoke and a subtle sequin scatter",
      "Kutchi embroidery accents, mirror-dot detailing and contrast piped borders"],
  },
  "diwali": {
    loc: ["home courtyard with rangoli and rows of diyas along the steps",
      "terrace strung with fairy lights and marigold torans with the city bokeh beyond",
      "festive lane outside the house — lanterns and a lit doorway glowing in the soft background",
      "balcony at dusk with diyas along the railing and fairy lights overhead"],
    light: ["warm diya-lit evening with amber pools of candle light", "golden dusk with fairy-light bokeh",
      "soft indoor lamp light spilling through the doorway across the courtyard"],
    herDup: ["her dupatta pleated neat over one shoulder with the pallu glinting in the diya light",
      "her dupatta draped softly over both shoulders with the ends falling behind",
      "her dupatta pinned close with the embroidered pallu brought forward"],
    hisStole: ["his slim festive stole folded across the collar", "his stole draped over one shoulder catching the diya glow",
      "his stole worn open over a dark festive shirt"],
    print: ["zari thread embroidery, a sequin scatter and fine gota edging catching the warm light",
      "block-print motifs with mirror-dot centres and pearl-tipped tassels"],
  },
  "festive-party": {
    loc: ["uplit banquet lounge with a lantern-wall backdrop",
      "terrace deck party — festoon lights, city bokeh and music-speaker silhouettes",
      "courtyard party with colour-gel uplighting washing the stone walls",
      "lantern-lined walkway of an evening venue with tables and glass bokeh behind"],
    light: ["moody warm party light with gentle colour-gel accents", "low-key ambient light with lantern and glass bokeh",
      "evening ambient glow with faces softly lit and no harsh flash"],
    herDup: ["her dupatta worn as an open drape over the arms like a shawl",
      "her dupatta draped single-shoulder, sleek and evening-ready",
      "her dupatta falling from one shoulder with the pallu swept back"],
    hisStole: ["his stole worn long and narrow over the shoulders", "his stole draped with one end thrown back",
      "his stole folded at the collar with a fine pin"],
    print: ["tonal sequin work, metallic thread borders and crystal-scatter highlights",
      "dense zari jaal embroidery with satin-stitch borders"],
  },
  "traditional": {
    loc: ["haveli courtyard with carved sandstone jharokhas",
      "old-city street with heritage doorways and hanging torans",
      "temple courtyard steps in soft morning calm",
      "verandah with carved pillars and a low stone parapet"],
    light: ["soft golden morning daylight", "gentle overcast courtyard light",
      "warm late-afternoon sun raking across the sandstone"],
    herDup: ["her pallu draped traditionally over the left shoulder with the pleats fanned",
      "her dupatta brought forward across the chest with the pallu falling past the waist",
      "her odhani draped over both shoulders with the ends skimming the ground"],
    hisStole: ["his stole draped Gujarati-style over one shoulder", "his stole folded across the chest with the ends tucked loosely",
      "his stole worn over a straight kurta with one end thrown back"],
    print: ["classic zari jaal, temple-border motifs and heavy thread embroidery with mirror accents",
      "block-print repeat with fine woven zari stripes and embroidered borders"],
  },
};

const CLOSE =
  " Absolutely no mannequins, no faceless or plastic faces, no stiff posing, no mature married vibe, " +
  "no wedding album, no bridal styling, no groom styling, no achkan/sherwani/bandhgala/groomwear. " +
  "Original VIRAAS photograph recreating the reference — never a copy of any source photograph. No text, no logo, no watermark.";

let enriched = 0, aligned = 0, skipped = 0;
for (const item of manifest) {
  if (item.kind !== "couple" || item.bucket < 2 || item.hash) { skipped++; continue; }
  const look = byId.get(item.refId);
  if (!look) throw new Error(`couple record missing for ${item.refId}`);
  const splitIdx = item.prompt.indexOf(SPLIT);
  if (splitIdx < 0) throw new Error(`prompt split marker missing for ${item.key}`);
  const head = item.prompt.slice(0, splitIdx + SPLIT.length);

  const order = WORLD_FAMILY_ORDER[look.world];
  if (!order || order.length !== 20) throw new Error(`no family order for world ${look.world}`);
  const seq = item.seq || 1;
  const famKey = order[(seq - 1) % 20];
  const f = F[famKey];
  const g = G[look.world];
  const off = WORLD_OFFSET[look.world];
  const cam = f.cams[(seq - 1 + off) % 2];
  const frame = f.frames[(seq - 1 + off) % 2];
  const loc = g.loc[(seq - 1) % g.loc.length];
  const light = g.light[(seq - 1 + off) % g.light.length];
  const herDup = g.herDup[seq % g.herDup.length];
  const hisStole = g.hisStole[(seq + 1) % g.hisStole.length];
  const printL = g.print[(seq - 1 + off) % g.print.length];

  const herMain = mainOf(look.herProductIds, HER_MAIN);
  const hisMain = mainOf(look.hisProductIds, HIS_MAIN);
  const herAcc = accOf(look.herProductIds, herMain);

  item.prompt =
    head +
    ` Reference recreation — panel family ${famKey} "${f.name}" from the attached VIRAAS reference sheets (studied outfit-by-outfit).` +
    ` HER silhouette: ${silhu(herMain)}${printOf(herMain) ? ` with ${printOf(herMain)}` : ""}${herAcc ? `, accented with her linked accessory (${herAcc.title.toLowerCase()})` : ""}.` +
    ` HER dupatta treatment: ${herDup}.` +
    ` HIS silhouette: ${silhu(hisMain)}${printOf(hisMain) ? ` with ${printOf(hisMain)}` : ""}.` +
    ` HIS stole/upper-drape treatment: ${hisStole}.` +
    ` Colour relationship: ${look.colourStory} — matched but not matching, his one accent echoing her lead colour, never uniform dressing.` +
    ` Print / embroidery / mirror-work language: ${printL}.` +
    ` Pose & body position: ${f.body}; distance between the two: ${f.dist}.` +
    ` Hand placement: ${f.hands}.` +
    ` Interaction & body language: ${f.inter}.` +
    ` Camera angle: ${cam}.` +
    ` Framing / crop: ${frame}.` +
    ` Location type: ${loc}.` +
    ` Lighting: ${light}.` +
    ` Aesthetic: ${f.cue}.` +
    ` Editorial candid photography of a realistic young Indian couple — natural youthful faces and skin texture, visual age 18-25, real hands, believable spontaneity, attractive young-adult appearance, never childish.` +
    CLOSE;

  const negAdd = ["achkan","bandhgala","groomwear","wedding couple","wedding album","garlands","recoloured duplicate","repeated pose"];
  for (const term of negAdd) if (!item.negative.toLowerCase().includes(term)) item.negative += `, ${term}`;

  // Align couple metadata so the card text matches the generated photograph.
  if (look.poseDirection !== f.name) {
    const oldPose = look.poseDirection;
    look.poseDirection = f.name;
    look.tags = look.tags.map((t) => (t === oldPose ? f.name : t));
    if (look.description.includes(oldPose)) look.description = look.description.replace(oldPose, f.name.toLowerCase());
    if (look.description.includes(oldPose.toLowerCase())) look.description = look.description.replace(oldPose.toLowerCase(), f.name.toLowerCase());
    aligned++;
  }
  enriched++;
}

writeFileSync(join(ROOT, "src/data/image-manifest.json"), JSON.stringify(manifest, null, 2));
writeFileSync(join(ROOT, "src/data/couples.json"), JSON.stringify(couples, null, 2));
console.log(`enriched: ${enriched} pending couple prompts (buckets 2-5) · metadata realigned: ${aligned}`);
console.log(`skipped (non-couple / bucket 1 / already generated): ${skipped}`);
const s1 = manifest.find((m) => m.key === "couple:CL-C-01");
const s2 = manifest.find((m) => m.key === "couple:CL-D-11");
console.log("--- sample CL-C-01 (prompt chars " + s1.prompt.length + "):");
console.log(s1.prompt);
console.log("--- sample CL-D-11 tail:");
console.log(s2.prompt.slice(s2.prompt.indexOf("Reference recreation —")));

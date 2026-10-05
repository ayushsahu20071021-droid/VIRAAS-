#!/usr/bin/env node
// Applies the corrected reference-faithful prompts for the 6 Garba frames that
// FAILED the outfit-fidelity audit (docs/garba-fidelity-audit.md). Only the
// `prompt` and `negative` fields of these entries are changed; id/path/status/
// bucket/seq are untouched, and nothing is marked generated here (the sync
// script records hashes only for files that actually exist on disk).
// Idempotent. Run, then generate with: prompt + ' Avoid: ' + negative + '.'

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const path = join(ROOT, "src/data/image-manifest.json");
const manifest = JSON.parse(readFileSync(path, "utf8"));

const REALISM =
  "Editorial candid photograph — realistic young Indian couple, 18-25 visual age, natural skin and hair, real hands, attractive young-adult appearance, slight candid imperfection, Pinterest-style documentary fashion photography.";

const FIX = {
  "couple:CL-G-01": {
    prompt:
      "VIRAAS Couple Edit — Garba/Navratri look CL-G-01, young Indian couple dancing at a night garba ground. HER: floor-length HOT PINK rani bandhani-print chaniya with gold gota and mirror-work border, ivory embroidered blouse with mirror detail, hot pink odhani with mirror-work edge; oxidised silver jhumkas, choker and bangle stack; open hair. HER OUTFIT IS PREDOMINANTLY HOT PINK AND IVORY. HIS: ivory-cream kurta with subtle self-print, white churidar and a HOT PINK bandhani stole draped over one shoulder; no jewellery. Matched but not matching — intentional colour harmony, no uniform dressing. POSE: close facing, both her hands raised adjusting his bandhani stole at his shoulder, he laughs looking down at her, young and giggly. Camera: eye-level 50mm portrait look. Framing: knee-up two-shot. Environment: open garba ground with festoon and fairy-light canopies. Lighting: warm night string lights with crowd bokeh. " +
      REALISM +
      " No mannequins, no stiff posing, no mature married vibe, no wedding album vibe, no bridal or groom styling.",
    negative:
      "black clothing as the main outfit, navy clothing, dark colour story, mannequins, mannequin faces, plastic skin, featureless faces, mature adults, married couple, wedding couple, bride, groom, bridal styling, garlands, formal studio portrait, stiff catalogue pose, text, logo, watermark, recoloured duplicate",
  },
  "couple:CL-G-02": {
    prompt:
      "VIRAAS Couple Edit — Garba/Navratri look CL-G-02, young Indian couple at Dandiya hours. HER: BLACK mirror-work chaniya choli — black chaniya with dense silver mirror embroidery and silver gota border, black blouse with mirror detail, black odhani with silver edge; oxidised silver jewellery and bangles. HER OUTFIT IS PREDOMINANTLY BLACK AND SILVER. HIS: matte BLACK kurta with minimal silver thread detail, WHITE churidar, silver kada; no stole. HE IS BLACK WITH WHITE LOWER. Matched but not matching — intentional colour harmony. POSE: playful interaction — she tugs the end of his kurta playfully, he half-turns dodging with a grin, both mid-laugh. Camera: slightly high phone-style 35mm. Framing: thigh-up two-shot. Environment: garba ground at night, dandiya dancers and crowd bokeh. Lighting: warm fest string lights. " +
      REALISM +
      " No mannequins, no stiff posing, no mature married vibe, no wedding album vibe.",
    negative:
      "navy clothing, blue clothing, pink clothing, coloured kurta, mannequins, mannequin faces, plastic skin, featureless faces, mature adults, married couple, wedding couple, bride, groom, bridal styling, garlands, formal studio portrait, stiff catalogue pose, text, logo, watermark, recoloured duplicate",
  },
  "couple:CL-G-03": {
    prompt:
      "VIRAAS Couple Edit — Garba/Navratri look CL-G-03, young Indian couple in a soft private moment at Navratri. HER: NAVY BLUE bandhani-print chaniya choli — navy chaniya with silver mirror-work and silver gota border, navy blouse, navy-and-silver odhani, oxidised silver kolhapuri footwear; oxidised silver jewellery. HER OUTFIT IS PREDOMINANTLY NAVY BLUE AND SILVER. HIS: NAVY blue embroidered ethnic kurta with subtle silver embroidery, CREAM churidar and a NAVY stole with tonal embroidery over one shoulder. NAVY AND CREAM, coordinated not identical. POSE: forehead near — standing very close, foreheads almost touching, eyes soft and half-closed, her hand resting on his chest, quiet young intimacy. Camera: low three-quarter 85mm. Framing: waist-up two-shot. Environment: Navratri pandal with lantern strings and decorated pillars, crowd bokeh. Lighting: warm lantern glow at night. " +
      REALISM +
      " No mannequins, no stiff posing, no mature married vibe, no wedding album vibe.",
    negative:
      "hot pink clothing, pink lehenga, black clothing, white clothing as the main outfit, mannequins, mannequin faces, plastic skin, featureless faces, mature adults, married couple, wedding couple, bride, groom, bridal styling, garlands, formal studio portrait, stiff catalogue pose, text, logo, watermark, recoloured duplicate",
  },
  "couple:CL-G-07": {
    prompt:
      "VIRAAS Couple Edit — Garba/Navratri look CL-G-07, young Indian couple at the edge of a night garba courtyard. HER: WHITE chaniya choli with dense multicolour mirror-work and a multicolour embroidered border, white blouse, white odhani with mirror-work edge; silver oxidised jhumkas and bangle stack. SHE IS ALL WHITE WITH COLOURFUL MIRROR-WORK. HIS: BLACK kurta with white-silver embroidery along the placket, WHITE churidar trousers, no stole. HE IS BLACK WITH WHITE LOWER — not coloured. Matched but not matching. POSE: wall lean — she leans back against a carved stone pillar holding a dandiya stick down at her side, he leans one hand flat on the pillar beside her, heads tilted close mid-conversation. Camera: eye-level 50mm. Framing: full-length environmental. Environment: heritage stone courtyard beside the garba ground, fairy lights overhead, dancers bokeh. Lighting: warm night fest lights. " +
      REALISM +
      " No mannequins, no stiff posing, no mature married vibe, no wedding album vibe.",
    negative:
      "green kurta, coloured kurta for him, coloured churidar, mannequins, mannequin faces, plastic skin, featureless faces, mature adults, married couple, wedding couple, bride, groom, bridal styling, garlands, formal studio portrait, stiff catalogue pose, text, logo, watermark, recoloured duplicate",
  },
  "couple:CL-G-14": {
    prompt:
      "VIRAAS Couple Edit — Garba/Navratri look CL-G-14, young Indian couple watching the dancers at a lit garba ground. HER: hot pink bandhani-print chaniya choli with mirror-work and silver gota border, hot pink MULTICOLOUR bandhani odhani with multicolour dots and mirror edge; oxidised silver jewellery, soft waves. HIS: NAVY blue bandhani-print modern ethnic shirt with tonal embroidery, IVORY churidar and an IVORY festive stole with zari work draped over one shoulder. NAVY AND IVORY, hers hot pink and multicolour — matched but not matching. POSE: candid close standing — his arm around her waist, both looking OFF-FRAME at the dancers, she is mid-laugh at what he said, unposed and unaware of the camera. Camera: three-quarter 35mm reportage. Framing: thigh-up two-shot. Environment: garba ground with multi-colour drapes and fairy lights. Lighting: warm night fest lights, crowd bokeh. " +
      REALISM +
      " Not a posed portrait, neither partner looks into the lens, no mannequins, no stiff posing, no mature married vibe, no wedding album vibe.",
    negative:
      "looking at camera, posed formal two-shot, ivory odhani for her, mannequins, mannequin faces, plastic skin, featureless faces, mature adults, married couple, wedding couple, bride, groom, bridal styling, garlands, formal studio portrait, stiff catalogue pose, text, logo, watermark, recoloured duplicate",
  },
  "couple:CL-G-19": {
    prompt:
      "VIRAAS Couple Edit — Garba/Navratri look CL-G-19, young Indian couple resting at the edge of the dance ground. HER: multicolour Kutchi-style chaniya choli with patchwork mirror-work and embroidered borders in red, blue, gold and green, shell and mirror trim, multicolour odhani, gold-tone embellished flats; oxidised silver and shell jewellery. SHE IS MULTICOLOUR KUTCHI PATCHWORK. HIS: IVORY Kutchi-motif embroidered kurta with a multicolour mirror-work stole draped over one shoulder, white churidar, brown mojari footwear. HE IS IVORY WITH THE MULTICOLOUR STOLE. Matched but not matching. POSE: squat-and-lean — both squatting side by side at the edge of the ground, elbows on knees, shoulders leaning together, her skirt pooling around them, sharing a quiet laugh mid-chat. Camera: low eye-level 50mm. Framing: full-length two-shot. Environment: packed garba ground with the crowd dancing behind, fairy lights and lantern strings. Lighting: warm night fest lights with crowd bokeh. " +
      REALISM +
      " No mannequins, no stiff posing, no mature married vibe, no wedding album vibe.",
    negative:
      "green kurta for him, coloured kurta for him, one partner standing, mannequins, mannequin faces, plastic skin, featureless faces, mature adults, married couple, wedding couple, bride, groom, bridal styling, garlands, formal studio portrait, stiff catalogue pose, text, logo, watermark, recoloured duplicate",
  },
};

let updated = 0;
for (const item of manifest) {
  const fix = FIX[item.key];
  if (!fix) continue;
  item.prompt = fix.prompt;
  item.negative = fix.negative;
  updated++;
}
if (updated !== Object.keys(FIX).length) {
  throw new Error(`expected ${Object.keys(FIX).length} entries, matched ${updated}`);
}
writeFileSync(path, JSON.stringify(manifest, null, 2));
console.log(`corrected prompts written: ${updated}`);

// Print the linked catalogue products so the render can be checked against them.
const couples = JSON.parse(readFileSync(join(ROOT, "src/data/couples.json"), "utf8"));
const products = JSON.parse(readFileSync(join(ROOT, "src/data/products.json"), "utf8"));
const byId = new Map(products.map((p) => [p.id, p]));
for (const key of Object.keys(FIX)) {
  const id = key.split(":")[1];
  const look = couples.find((c) => c.id === id);
  console.log(`\n=== ${id} — ${look.title} | ${look.colourStory}`);
  for (const pid of [...look.herProductIds, ...look.hisProductIds]) {
    const p = byId.get(pid);
    console.log(`  ${pid} — ${p ? `${p.title} | ${p.colour} | ${p.category}` : "MISSING"}`);
  }
}

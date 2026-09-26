// VIRAAS MEN — build the permanent 210-look reference outfit catalog.
//
// Source of truth: the "MEN 210 NEW REFERENCE OUTFIT PROMPT PACK — FINAL LOCK"
// supplied by the user (10 reference sheets x 21 panels = 210 looks).
// The old Men 336 product catalog is completely ignored and NOT used here.
//
// This script emits:
//   - data-src/men-look-catalog.mjs         (permanent, reviewable source)
//   - src/data/men-look-catalog.client.json (what the app imports)
//
// Structured fields (garmentType, colors, pattern, bottomwear, footwear,
// layering, accessories) are derived ONLY from the visible outfit definition
// text. Anything not stated stays null — nothing is invented.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

// --- The 210 verbatim outfit definitions, in LOOK order 001..210 ---------
const DEFS = [
  // GARBA / NAVRATRI — Sheet 1 (001-021)
  "An off-white/ivory long kurta with dense small white embroidered motifs and a softly open neckline, paired with a long navy-blue stole/scarf scattered with tiny light dot motifs; the stole hangs evenly down both sides of the chest. A silver-toned chain is visible at the open neckline.",
  "A black straight kurta with a subtle dark textured/embroidered surface, styled with a long red-and-black patterned stole featuring repeating traditional geometric/ornamental motifs and a contrasting border; the stole is draped around the neck and falls down the front.",
  "A black kurta with a clean straight silhouette, paired with loose white pajama trousers and a long red printed traditional stole with dense geometric/paisley-like motifs and border work; brown casual sandals are visible.",
  "A plain white long kurta-pajama look viewed partly from the back, with a prominent multicolour embroidered/printed geometric patch running across the upper back/shoulder area; the kurta has a simple straight silhouette and the styling is minimal.",
  "A white long kurta with a band/stand collar and button placket, paired with a long multicolour traditional printed stole containing red, green, black and cream ornamental panels; the stole hangs symmetrically down the front.",
  "A black long kurta with white pajama trousers, layered with a long multicolour patterned stole featuring dense folk/ethnic motifs in red, green, orange and cream; the stole falls over both sides of the torso.",
  "A black kurta with subtle tonal detailing and loose white pajama trousers, finished with a long multicolour folk-print stole containing colourful rectangular motifs; the styling is youthful and festive.",
  "A black long kurta and black trousers styled with a long ornate black-and-gold printed/embroidered stole or sleeveless layer; the decorative piece has repeated gold floral and traditional motifs and creates a rich monochrome festive look.",
  "A black kurta with white pajama trousers, layered with a long black-and-gold patterned stole featuring dense ornamental motifs and a decorative border; black footwear completes the traditional look.",
  "A charcoal/black long kurta with a subtle textured surface, paired with white pajama trousers and a cream-and-black patterned stole with a broad decorative border; the stole is worn around the neck and hangs vertically.",
  "A deep maroon long kurta with a simple straight cut, paired with loose cream/off-white dhoti-style pajama trousers; a long metallic/gold-toned necklace is visible at the neckline and brown sandals complete the look.",
  "An off-white/cream kurta-pajama set with bold red embroidery concentrated around the collar, chest placket, sleeve cuffs and lower details; the kurta has a straight traditional silhouette and the trousers are matching off-white.",
  "A dark navy/black kurta with a long colourful floral/folk-print stole featuring red, green, orange and cream motifs; the stole is draped loosely around the neck and contrasts strongly with the dark base.",
  "A black kurta with a long red-and-black traditional printed stole, paired with white pajama trousers; the stole carries dense red ornamental motifs and borders and is worn loosely down the front.",
  "A black long kurta/ethnic coat ensemble with dense cream and gold floral embroidery across the front and sleeves, paired with black trousers; the outer layer has a long flowing silhouette and rich ornamental detailing.",
  "A deep royal-blue/navy long kurta with an ornate matching embroidered long jacket/stole layer in blue and metallic detailing, paired with wide white pajama trousers and brown traditional sandals.",
  "A black long kurta with a subtle embroidered/textured surface, paired with very loose white pajama trousers and a dark patterned scarf/stole draped around the upper body; the styling is relaxed and traditional.",
  "A cream/beige embroidered long kurta with a softly textured surface, paired with white trousers and a light cream/off-white long stole; the look is monochrome, refined and festive with simple sandals.",
  "A dusty rose/pink long kurta with dense traditional embroidery and small mirror/sequin-like embellishments, featuring a stand collar and decorative chest panels; white trousers are visible beneath.",
  "A deep navy-blue long kurta with ornate gold embroidery concentrated around the lower front and neckline, paired with loose white pajama trousers and dark footwear; the overall silhouette is long and traditional.",
  "A deep navy/black long kurta with ornate gold embroidery concentrated around the neckline and lower front, paired with loose white pajama trousers and black traditional footwear; the overall look is rich but youthful.",
  // GARBA / NAVRATRI — Sheet 2 (022-042)
  "A black kurta with a long olive/black textured stole and loose white pajama trousers; the stole is decorated with subtle woven motifs and is worn over both shoulders, with dark footwear.",
  "A deep wine/maroon kurta with a soft straight fit and a long cream/off-white textured stole draped around the neck; loose light trousers complete the relaxed festive look.",
  "A white kurta-pajama outfit with a long mustard-gold and brown patterned stole, featuring dense paisley/folk motifs and a dark border; the stole hangs down both sides.",
  "A vivid red short-sleeve printed shirt with dense multicolour folk embroidery/patchwork motifs, decorative vertical panels and contrasting dark sleeves; it is paired with blue denim jeans.",
  "A cream/white textured kurta with a relaxed collar and loose white trousers, styled with a long grey/cream striped or patterned stole; the model is seated and the silhouette is relaxed.",
  "A beige/olive textured kurta with a cream scarf/stole and light neutral trousers, creating a layered traditional look with muted earthy tones.",
  "A cream/white long kurta-pajama set with a long green-and-gold patterned stole featuring intricate traditional motifs and borders; the stole is worn over the shoulders.",
  "A light blue/white kurta with a long blue-and-gold printed stole, paired with white trousers; the stole features repeated traditional motifs and a contrasting border.",
  "A mint/seafoam green printed kurta with small embroidered floral motifs, paired with a richly multicolour patterned lower wrap/stole visible at the waist; the garment has a relaxed open neckline.",
  "A black long kurta with a long brown/gold patterned stole and loose dark trousers; the stole carries dense traditional motifs and gives the otherwise dark outfit a festive accent.",
  "A cream/pink embroidered long kurta with white pajama trousers and a long dusty-pink patterned stole; the stole has small ornamental motifs and a light border.",
  "A light pink long kurta with subtle all-over texture/embroidery, paired with loose white trousers; the outfit is styled simply without a heavy outer layer.",
  "A cream/white kurta-pajama set with a long blue-and-cream patterned stole draped around the neck; the stole has dense traditional motifs and a decorative border.",
  "A black kurta with a long maroon/red printed stole, paired with loose black trousers; the stole is richly patterned and creates a dark festive layered look.",
  "A light pink kurta with a long pale pink textured/printed stole and white trousers; the styling is soft, youthful and festive with the stole falling vertically.",
  "A cream/off-white kurta with a long multicolour traditional stole, paired with dark/black trousers; the stole features dense red, blue and gold motifs and is worn over the shoulders.",
  "An off-white/cream long kurta with a subtle embroidered surface and white pajama trousers, styled with a long black scarf/stole carrying light ornamental detailing.",
  "A white kurta-pajama look with a long black-and-cream patterned stole, paired with brown traditional footwear; the stole is narrow and hangs down the front.",
  "A maroon/red kurta with a black sleeveless/outer layer and light blue relaxed trousers; the maroon kurta has a simple neckline and the outer layer adds a contemporary festive contrast.",
  "A white/cream long kurta with a deep red traditional printed stole, paired with loose blue jeans and white casual sneakers; the look mixes ethnic layering with youthful casual styling.",
  "A white kurta with a maroon-red patterned stole and relaxed blue denim, finished with light casual footwear; the stole is long and densely printed with traditional motifs.",
  // COLLEGE FEST — Sheet 1 (043-063)
  "A white/off-white embroidered kurta with a long light grey-blue patterned stole, paired with loose white trousers and brown loafers; the kurta has a straight traditional silhouette.",
  "A light cream kurta with a dramatic blue-to-teal gradient/printed lower half and white pajama trousers; the long top features tonal ornamental patterning through the gradient.",
  "A black long kurta with subtle embroidery and black relaxed trousers, styled with a small dark printed scarf/neck detail; the look is minimal and contemporary.",
  "A charcoal-black kurta with a deep open neckline, layered with a broad black-and-gold patterned stole and loose white trousers; the stole carries dense traditional motifs.",
  "A pale cream kurta with a light textured/embroidered surface and white pajama trousers, styled with a simple open neckline and minimal accessories.",
  "A light beige/taupe coordinated kurta and trousers set with a narrow decorative neckline and tailored straight silhouette; brown footwear is visible.",
  "A white/cream long-sleeve shirt-style kurta with a heavily embroidered floral hem in muted red, green and grey, paired with dark trousers.",
  "A white kurta with a long multicolour floral/folk-print stole, paired with relaxed blue jeans and white sneakers; the stole adds a strong festive accent.",
  "A pale beige/cream embroidered kurta with white trousers and a long deep maroon printed stole, worn casually over one shoulder.",
  "A soft white kurta with a delicate embroidered/printed surface and white pajama trousers, styled with brown traditional footwear and a clean minimal silhouette.",
  "A cream/white long kurta with an ornate light grey/white embroidered front, paired with white pajama trousers; the look is monochrome and refined.",
  "A cream long kurta with a light embroidered texture and white trousers, paired with a subtle long stole/scarf; the styling is minimal and elegant.",
  "A white/cream kurta with dense floral embroidery around the hem and lower sleeves, paired with dark charcoal trousers; the neckline is simple and open.",
  "A white/cream kurta with small delicate motifs and a floral embroidered hem, paired with olive/grey trousers; the outfit is relaxed and contemporary.",
  "A white kurta with tiny floral motifs and heavily patterned cuffs/hem in muted beige and grey, paired with olive-grey trousers; the neckline has a simple V/placket.",
  "A cream/yellow-toned long kurta with a textured embroidered surface and white pajama trousers, featuring a subtle decorative border around the hem.",
  "A blue/grey textured long kurta with a small repeating geometric pattern and white pajama trousers, styled with dark casual shoes.",
  "A soft pink long kurta with delicate white patterning and white trousers, photographed in warm festive light; the silhouette is straight and youthful.",
  "A maroon/burgundy long kurta with subtle tonal embroidery and loose white trousers, styled with dark traditional shoes.",
  "A cream/off-white long kurta with a richly embroidered lower border and white pajama trousers, giving a refined festive look.",
  "A warm beige/gold long kurta with subtle all-over woven texture and matching neutral trousers, styled as a monochrome traditional set.",
  // COLLEGE FEST — Sheet 2 (064-084)
  "A white/off-white embroidered kurta with a delicate repeating motif, paired with loose white trousers and brown traditional loafers; the look is clean and understated.",
  "A deep red/maroon printed kurta with dense white floral/folk motifs, paired with white pajama trousers; the neckline is open with a short placket.",
  "A navy-blue long kurta with an all-over diamond/check pattern, paired with white trousers; the fit is relaxed and the neckline is simple.",
  "A white kurta layered with a long multicolour floral stole, paired with white trousers; the stole contains dense red, pink, blue and green motifs and hangs to knee level.",
  "A dark navy/black kurta with a white ornamental front panel and matching dark trousers, styled with a narrow light patterned scarf.",
  "A multicolour paisley/folk-print kurta in muted green, pink, cream and brown, paired with white loose trousers; the print covers the entire upper garment.",
  "A pale pink kurta with a long light textured stole, paired with white trousers; the stole is softly draped and the look is relaxed festive.",
  "A black short kurta with gold/cream embroidered neckline and small scattered motifs, paired with black trousers; the look is sleek and youthful.",
  "A black kurta with small gold/cream scattered motifs and a decorative embroidered neckline, paired with loose black trousers.",
  "A grey/charcoal patterned kurta with white pajama trousers and a simple crossed-arm styling; the kurta has a fine all-over micro-pattern.",
  "A cream/pink printed ethnic shirt with wide blue jeans and casual sandals; the shirt has a loose fit and a small all-over traditional print.",
  "A cream/white embroidered long kurta with subtle vertical texture and relaxed white trousers; the styling is minimal and clean.",
  "A coral/pink kurta with a long straight silhouette and subtle texture, paired with white loose trousers and casual sandals.",
  "A warm rust/orange long kurta with a simple open neckline and white/grey relaxed trousers, paired with casual footwear.",
  "A white embroidered long kurta with a maroon-red patterned stole, paired with relaxed blue jeans and white sneakers; the stole provides the main festive contrast.",
  "A black kurta with a subtle printed/embroidered surface, paired with white trousers and a long multicolour patterned stole; the stole hangs over both shoulders.",
  "A mustard-yellow long kurta with white trousers, featuring a narrow decorative neckline and simple embroidered texture.",
  "A white long kurta with a long mustard-yellow stole, paired with a light printed inner/upper layer and white trousers; the stole hangs vertically for a bright festive accent.",
  "An off-white embroidered kurta with an ornate silver/cream neckline and dark black trousers; the chest features a decorative pendant-like embroidered placket.",
  "A cream embroidered kurta with white pajama trousers, featuring a richly detailed neckline and delicate border embroidery.",
  "A light cream long kurta with subtle embroidery and white trousers, finished with a long neutral stole; the overall look is soft and traditional.",
  // DIWALI — Sheet 1 (085-105)
  "A white kurta with small scattered metallic/grey motifs, paired with white trousers and brown loafers; the kurta has a simple mandarin collar and straight fit.",
  "A champagne/beige heavily textured and sequined kurta with matching wide trousers, creating a shimmering festive monochrome look.",
  "A peach/coral long kurta with a subtle woven texture, paired with white trousers and brown traditional sandals.",
  "A champagne-beige long kurta with dense all-over dotted embroidery and a softly open neckline, paired with matching light trousers.",
  "A white kurta with a heavily decorated floral/ornamental hem and lower sleeves, paired with white pajama trousers.",
  "A peach-beige long kurta with fine woven embroidery, paired with white trousers and a soft festive silhouette.",
  "A maroon/red long kurta with an embroidered lower border, paired with beige/cream trousers and dark footwear.",
  "A black long kurta with dense gold floral/ornamental embroidery across the front, paired with black trousers; the look is rich and formal but youthful.",
  "A cream/white kurta with delicate embroidery, paired with loose white trousers and a long light stole; the silhouette is classic and clean.",
  "A white embroidered kurta with a long cream-and-gold patterned stole, paired with white trousers and brown traditional footwear.",
  "A pale blue/grey long kurta with white embroidered patterning and white trousers, styled simply.",
  "A deep maroon kurta with a black patterned outer layer/stole and white pajama trousers; the outer layer is richly printed.",
  "A brown/maroon kurta with a large cream embroidered neckline and white trousers; the neckline is the primary decorative feature.",
  "A black kurta with ornate gold embroidery concentrated around the neckline and chest, paired with black trousers.",
  "A cream/gold long kurta with a subtle all-over texture and loose cream trousers, photographed as a refined monochrome festive look.",
  "A light cream embroidered kurta with white trousers and a delicate open neckline, styled minimally.",
  "A white kurta with a broad floral embroidered hem in muted pink, brown and green, paired with white trousers.",
  "A white kurta with a delicate floral print/embroidery around the lower hem and cuffs, paired with light neutral trousers.",
  "A pale cream long kurta with a subtle zigzag/chevron-like border and white trousers; the lower hem has decorative geometric work.",
  "A deep teal/blue long kurta with a subtle woven pattern and black/dark trousers, creating a contemporary festive silhouette.",
  "A maroon-brown kurta with a large cream embroidered chest panel and white trousers, finished with a clean traditional collar.",
  // DIWALI — Sheet 2 (106-126)
  "A cream/off-white embroidered kurta with a long light patterned stole and loose white trousers, worn with brown traditional footwear.",
  "A maroon kurta with a cream/white long stole and relaxed white trousers; the stole is draped around the neck and gives the look a layered festive finish.",
  "A cream kurta-pajama set with a long black-and-gold patterned stole featuring dense folk motifs and a decorative border.",
  "A red printed ethnic shirt with multicolour mirror/embroidered motifs, decorative vertical panels and dark sleeves, paired with blue jeans.",
  "A cream/grey long kurta with a subtle geometric print and white trousers, styled with a relaxed drape and brown footwear.",
  "A muted olive/khaki kurta with a long cream patterned stole and light trousers; the stole is densely woven/printed with traditional motifs.",
  "A cream kurta with a long green-and-gold patterned stole and white trousers, styled for a festive event.",
  "A soft pink kurta with a long pale textured stole and white trousers, worn in a relaxed youthful style.",
  "A pale blue/grey kurta with a long blue patterned stole and white trousers; the stole has repeated traditional motifs.",
  "A mint-green kurta with delicate small motifs, paired with a richly patterned multicolour lower wrap/stole detail.",
  "A dark black/brown kurta with a long patterned stole and black trousers, creating a layered contemporary ethnic look.",
  "A dusty rose/pink long kurta with subtle embroidery and a light stole, paired with white trousers.",
  "A black kurta with a decorative gold/cream neckline and scattered small motifs, paired with black trousers.",
  "A cream/white long kurta with a long red patterned stole, paired with relaxed blue denim and white sneakers.",
  "A burgundy long kurta with white trousers and a patterned maroon/cream stole, worn casually with dark footwear.",
  "A charcoal grey micro-patterned kurta with white trousers and simple brown footwear.",
  "A pale pink ethnic shirt/kurta with light trousers, featuring a fine all-over print and relaxed collar.",
  "A cream kurta with subtle embroidery and white trousers, styled with a long patterned stole in muted blue/grey tones.",
  "A rust-red textured kurta with relaxed grey trousers and casual footwear.",
  "A red/maroon long kurta with a black patterned outer layer and relaxed denim, giving the look a contemporary festive feel.",
  "A white/cream embroidered kurta with a maroon traditional stole, paired with blue denim and white sneakers.",
  // FESTIVE PARTY — Sheet 1 (127-147)
  "A white embroidered kurta with an ornate golden chest panel and white pajama trousers, styled with a clean mandarin collar and brown loafers.",
  "A cream/gold embroidered long kurta with a black-and-gold patterned stole, paired with light trousers; the stole is heavily ornamental.",
  "A lavender/purple long kurta with dense tonal embroidery and a long straight silhouette, paired with cream trousers.",
  "A cream embroidered long kurta with a subtle textured surface and cream trousers, styled with minimal accessories.",
  "A burnt-orange/red textured blazer or embroidered jacket layered over a black shirt and black wide trousers; the outer layer is the dominant festive piece.",
  "A white long kurta with a long flowing cream/gold stole, paired with white trousers and sunglasses; the styling is elegant and airy.",
  "A black long kurta with a teal/black long scarf, paired with black trousers; the look is understated and layered.",
  "A light blue/grey tailored ethnic jacket over a matching kurta and white trousers, with subtle gold motifs on the jacket.",
  "A cream/white monochrome kurta-pajama set with a long subtle embroidered stole and clean traditional footwear.",
  "A deep maroon embroidered jacket/kurta with black wide trousers, creating a contemporary evening festive silhouette.",
  "A black long kurta with subtle gold/cream embroidery and black trousers, styled with a small ornamental neckline detail.",
  "A pale cream embroidered kurta with a long maroon patterned stole and white trousers, worn in a relaxed pose.",
  "A black/dark charcoal long kurta with a broad gold embroidered front panel and white trousers, styled with black footwear.",
  "A cream embroidered kurta with a long light stole and matching trousers, photographed against a warm festive setting.",
  "A white/cream heavily embroidered kurta with matching white trousers and subtle metallic details.",
  "A light cream long kurta with a blue-grey patterned stole and white trousers, creating a soft traditional layered look.",
  "A dark charcoal/black embroidered kurta with black trousers and a subtle patterned stole, suitable for a refined festive evening.",
  "A cream/gold long kurta with dense embroidery and white trousers, styled with brown traditional footwear.",
  "A black velvet-like/textured ethnic jacket over a black kurta and trousers, with subtle metallic embroidery and a polished evening silhouette.",
  "A pale blue-grey kurta with fine all-over embroidery and white trousers, styled with minimal accessories.",
  "A black tailored festive suit-like ethnic ensemble with a richly patterned black-and-gold jacket, black trousers and polished black shoes.",
  // FESTIVE PARTY — Sheet 2 (148-168)
  "A white kurta with small black/dark scattered motifs, paired with white trousers and dark loafers; the look is minimalist and traditional.",
  "A black long kurta with a broad ornate gold-and-black embroidered/printed front panel, paired with black trousers.",
  "A mint/seafoam kurta with a richly patterned lower border in multicolour motifs, paired with white wide trousers.",
  "A pale cream/gold long kurta with matching trousers, featuring a subtle all-over textured weave and clean straight fit.",
  "A burgundy/maroon sleeveless long vest layered over a white shirt/kurta, paired with loose white trousers; the vest is the main contemporary layer.",
  "A deep olive-green kurta with a matching dark patterned scarf/stole and white trousers; the neckline and lower hem have subtle embroidery.",
  "A black kurta with a black-and-gold ornamental stole or embroidered front layer, paired with loose black trousers.",
  "A navy/black long kurta with gold embroidered neckline and matching dark trousers, styled with a long decorative stole.",
  "A white kurta-pajama with a delicate multicolour floral embroidered hem and cuffs, paired with brown traditional sandals.",
  "A white embroidered kurta with a long cream/light stole and loose white trousers, styled simply.",
  "A mustard-yellow embroidered kurta with white trousers and a subtle open neckline.",
  "A cream/off-white kurta with a richly patterned floral lower hem and white trousers.",
  "A terracotta/rust kurta with a simple straight silhouette and white trousers, finished with brown sandals.",
  "A taupe/brown kurta-pajama set with a decorative vertical neckline and brown leather loafers.",
  "A white embroidered kurta with a subtle light-grey pattern and white trousers, styled with brown traditional footwear.",
  "A pale pink embroidered kurta with white trousers, featuring a delicate geometric weave.",
  "A white kurta with a long cream/gold patterned stole and white trousers, creating a soft monochrome traditional look.",
  "A cream/off-white kurta with delicate all-over embroidery and white trousers, worn with brown sandals.",
  "A white kurta with subtle embroidered motifs and a clean straight fit, paired with white trousers and dark traditional footwear.",
  "A pale cream embroidered kurta with a long neutral stole and white trousers, styled minimally.",
  "A white/cream kurta with a small ornamental neckline and white trousers, photographed in a clean neutral setting.",
  // TRADITIONAL — Sheet 1 (169-189)
  "A white long kurta with tiny repeating dark motifs and white trousers, styled with brown loafers; the fit is relaxed and youthful.",
  "A red/maroon printed ethnic shirt with dense white floral/folk motifs, an open short placket and white trousers; the shirt is the dominant visual element.",
  "A blue long kurta with a fine white diamond/check pattern, paired with white trousers and dark casual shoes.",
  "A white kurta with a long multicolour floral stole, paired with white trousers; the stole has pink, red, green and blue folk motifs.",
  "A multicolour paisley-print ethnic shirt in teal, brown, pink and cream, paired with white trousers; dark sunglasses complete the look.",
  "A light pink kurta with a long pale textured stole and white trousers, creating a soft festive silhouette.",
  "A black kurta with a long cream/gold patterned stole and white trousers, styled as a layered ethnic look.",
  "A black/dark kurta with a long maroon-and-gold patterned stole, paired with black trousers.",
  "A pale pink long kurta with a subtle woven texture and white trousers, photographed in evening light.",
  "A black kurta with gold/cream embroidered neckline and small scattered motifs, paired with black trousers.",
  "A black embroidered kurta with a gold-toned decorative neckline and white trousers, creating a refined contrast.",
  "A grey micro-patterned kurta with white trousers and brown sandals, styled simply.",
  "A cream/pink printed ethnic shirt with light blue relaxed jeans and brown sandals; the shirt has a loose fit and all-over traditional print.",
  "A white embroidered kurta with a long maroon printed stole, paired with blue denim and white sneakers.",
  "A cream/white long kurta with a light embroidered surface and wide white trousers, styled with brown footwear.",
  "A light cream embroidered kurta with white trousers and a minimal neckline, photographed indoors.",
  "A maroon/burgundy long kurta with white trousers and a subtle printed stole, creating a rich festive colour combination.",
  "A cream/white kurta with a subtle all-over pattern and white trousers, styled with brown traditional footwear.",
  "A black long kurta with a subtle gold patterned surface, paired with white trousers and dark footwear.",
  "A white kurta with a long patterned stole and loose white trousers, creating a classic festive look.",
  "A cream/gold long kurta with delicate embroidery and white trousers, styled in a clean traditional silhouette.",
  // TRADITIONAL — Sheet 2 (190-210)
  "A black kurta with a broad printed/embroidered lower border in warm gold, brown and red, paired with loose white trousers and black formal footwear.",
  "A cream/beige long kurta layered with a dramatic navy-and-cream patterned sleeveless jacket/stole, featuring dense floral and geometric motifs; the base trousers are cream.",
  "A peach-beige long kurta with a subtle textured weave and matching light peach trousers, finished with brown traditional footwear.",
  "A white embroidered kurta with a softly open neckline and white trousers, featuring delicate vertical texture and subtle floral work.",
  "A white kurta-pajama set with a clean mandarin collar and simple straight silhouette, paired with brown sandals.",
  "A black long kurta with a wide brown/gold patterned lower panel and black trousers, styled with black footwear.",
  "A pale pink/cream long embroidered jacket or kurta layered over white trousers, with delicate floral embroidery and a refined straight silhouette.",
  "A cream/white long kurta with subtle embroidery and white trousers, styled with a long light patterned stole and neutral footwear.",
  "A cream/white long kurta with a narrow decorative neckline and matching trousers, paired with brown traditional footwear.",
  "A cream kurta with a delicate embroidered front and white trousers, styled with a long light stole/scarf.",
  "A warm brown/terracotta printed kurta with dense geometric motifs, paired with white trousers and brown sandals.",
  "A beige/cream draped kurta-pajama set with a loose flowing silhouette and a light textured stole, paired with neutral footwear.",
  "A black short kurta with a broad cream embroidered neckline and matching black trousers, creating a clean graphic ethnic look.",
  "An olive-green textured kurta with matching olive trousers, featuring subtle woven patterning and a relaxed tailored fit.",
  "A black long kurta with a subtle black embroidered jacket/outer layer and black trousers, styled with polished black shoes.",
  "A deep navy/black long kurta with a long embroidered front panel and matching dark wide trousers; the embroidery is concentrated around the chest and vertical edges.",
  "A black long kurta with a subtle patterned surface and black trousers, worn as a minimalist monochrome traditional look.",
  "A black tailored ethnic jacket with silver/grey embroidered sleeves and front details, paired with black trousers and polished black shoes.",
  "A navy/black long kurta with a long ornate embroidered stole/front panel and wide dark trousers, creating a formal traditional silhouette.",
  "A brown/taupe ethnic jacket with rich cream embroidery over a matching brown kurta and wide brown trousers; the jacket has a strong structured silhouette.",
  "A cream/off-white embroidered long jacket over a light kurta with wide white trousers, finished with brown traditional shoes.",
];

// --- Occasion / sheet layout (5 occasions x 42, each split into 2 x 21) ---
const OCCASIONS = [
  { slug: 'garba', label: 'Garba / Navratri', sheets: ['garba_navratri_42_sheet_1_21', 'garba_navratri_42_sheet_2_21'] },
  { slug: 'college-fest', label: 'College Fest', sheets: ['college_fest_42_sheet_1_21', 'college_fest_42_sheet_2_21'] },
  { slug: 'diwali', label: 'Diwali', sheets: ['diwali_42_sheet_1_21', 'diwali_42_sheet_2_21'] },
  { slug: 'festive-party', label: 'Festive Party', sheets: ['festive_party_42_sheet_1_21', 'festive_party_42_sheet_2_21'] },
  { slug: 'traditional', label: 'Traditional', sheets: ['traditional_outfits_sheet_1_21', 'traditional_outfits_sheet_2_21'] },
];

// --- Fixed generation-prompt wrapper (identical for all 210 looks) --------
const RECREATE = "Recreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18\u201322 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.";
const buildPrompt = (def) => `Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\n${def}\n\n${RECREATE}`;

// --- Conservative derivation helpers (text-only; never invent) ------------
const COLOURS = [
  'off-white', 'royal-blue', 'seafoam', 'champagne', 'charcoal', 'burgundy', 'terracotta',
  'lavender', 'mustard', 'maroon', 'ivory', 'cream', 'beige', 'taupe', 'white', 'black',
  'navy', 'blue', 'teal', 'mint', 'olive', 'khaki', 'green', 'wine', 'red', 'rust',
  'orange', 'brown', 'pink', 'rose', 'coral', 'peach', 'purple', 'yellow', 'gold', 'grey', 'gray', 'silver',
];
const titleColour = (c) => c.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('-');

// first colour token in the whole string = the garment's primary colour
function primaryColour(d) {
  let best = null, bestIdx = Infinity;
  for (const c of COLOURS) {
    const i = d.indexOf(c);
    if (i !== -1 && i < bestIdx) { bestIdx = i; best = c; }
  }
  return best ? titleColour(best === 'gray' ? 'grey' : best) : null;
}
// last colour token appearing before the first occurrence of a keyword
function colourBefore(d, keyword) {
  const cut = d.indexOf(keyword);
  if (cut === -1) return null;
  const seg = d.slice(0, cut);
  let best = null, bestIdx = -1;
  for (const c of COLOURS) {
    const i = seg.lastIndexOf(c);
    if (i > bestIdx) { bestIdx = i; best = c; }
  }
  return best ? titleColour(best === 'gray' ? 'grey' : best) : null;
}

function garmentType(d) {
  if (/kurta-pajama|kurta-pyjama|kurta pajama|kurta pyjama/.test(d)) return 'Kurta-Pajama Set';
  if (/\b(jacket|blazer)\b|ethnic coat/.test(d)) return 'Ethnic Jacket / Layered Set';
  if (/\bvest\b/.test(d)) return 'Waistcoat / Layered Set';
  if (/suit-like|festive suit/.test(d)) return 'Ethnic Suit';
  if (/ethnic shirt|printed shirt|short-sleeve printed shirt|shirt\/kurta/.test(d)) return 'Ethnic Shirt';
  if (/\bkurta\b/.test(d)) return 'Kurta';
  if (/\bshirt\b/.test(d)) return 'Ethnic Shirt';
  return 'Ethnic Set';
}

function patternField(d) {
  let pattern = 'Solid';
  if (/sequin/.test(d)) pattern = 'Sequinned';
  else if (/\bprint(ed|s)?\b/.test(d)) pattern = 'Printed';
  else if (/check|diamond/.test(d)) pattern = 'Checked';
  else if (/paisley/.test(d)) pattern = 'Paisley';
  else if (/geometric/.test(d)) pattern = 'Geometric';
  else if (/floral/.test(d)) pattern = 'Floral';
  else if (/chevron|zigzag/.test(d)) pattern = 'Chevron';
  else if (/micro-pattern|repeating|woven|weave|textured|texture/.test(d)) pattern = 'Textured / woven';
  let embroidery = 'None';
  if (/embroider/.test(d)) embroidery = 'Embroidered';
  else if (/mirror/.test(d)) embroidery = 'Mirror-work';
  else if (/sequin/.test(d)) embroidery = 'Sequin work';
  return { pattern, embroidery };
}

function layering(d) {
  const parts = [];
  if (/\b(jacket|blazer)\b|ethnic coat|outer layer/.test(d)) parts.push('Jacket / outer layer');
  if (/\bvest\b/.test(d)) parts.push('Sleeveless vest');
  if (/\bstole\b|\bscarf\b|\bshawl\b/.test(d)) parts.push('Stole / scarf');
  return parts.length ? parts.join(' + ') : null;
}

function bottomwear(d) {
  if (/jeans|denim/.test(d)) return 'Blue denim / jeans';
  if (/dhoti/.test(d)) { const c = colourBefore(d, 'dhoti'); return `${c ? c + ' ' : ''}dhoti-style pyjama`; }
  if (/pajama|pyjama/.test(d)) { const c = colourBefore(d, 'pajama') || colourBefore(d, 'pyjama'); return `${c ? c + ' ' : ''}pyjama trousers`; }
  if (/trousers/.test(d)) { const c = colourBefore(d, 'trousers'); return c ? `${c} trousers` : 'Trousers'; }
  return null;
}

function footwear(d) {
  const m = d.match(/\b(white|brown|black|dark|neutral|light|casual|polished black)\b(?:[a-z /-]*?)\b(loafers|sneakers|sandals|shoes|footwear)\b/);
  if (m) {
    const col = m[1] === 'polished black' ? 'Polished black' : m[1].charAt(0).toUpperCase() + m[1].slice(1);
    return `${col} ${m[2]}`;
  }
  if (/loafers|sneakers|sandals|\bshoes\b|footwear/.test(d)) return 'Footwear visible';
  return null;
}

function accessories(d) {
  const parts = [];
  if (/sunglasses/.test(d)) parts.push('Sunglasses');
  if (/necklace/.test(d)) parts.push('Necklace');
  if (/\bchain\b/.test(d)) parts.push('Chain');
  if (/pendant/.test(d)) parts.push('Pendant detail');
  return parts.length ? parts.join(', ') : null;
}

// --- Build the 210 records -------------------------------------------------
if (DEFS.length !== 210) throw new Error(`Expected 210 definitions, got ${DEFS.length}`);

const records = DEFS.map((rawDef, i) => {
  const n = i + 1;
  const occ = OCCASIONS[Math.floor(i / 42)];
  const withinOcc = i % 42;            // 0..41
  const sheet = occ.sheets[Math.floor(withinOcc / 21)];
  const panel = (withinOcc % 21) + 1;  // 1..21
  const id = `men-look-${String(n).padStart(3, '0')}`;
  const ref = `#${String(n).padStart(3, '0')}`;
  const d = rawDef.toLowerCase();
  const pat = patternField(d);
  const secondary = colourBefore(rawDef.toLowerCase(), 'stole');
  // outfitDescription: verbatim definition without the trailing period (UI re-adds one)
  const outfitDescription = rawDef.replace(/\.\s*$/, '');
  return {
    id,
    referenceId: ref,
    occasion: occ.slug,
    occasionLabel: occ.label,
    sheet,
    panel,
    sheetPanelLabel: `${sheet.toUpperCase()} \u2014 IMAGE ${String(panel).padStart(2, '0')}`,
    outfitDescription,
    garmentType: garmentType(d),
    colors: { primary: primaryColour(d), secondary: [] },
    patternOrEmbroidery: pat,
    layering: layering(d),
    bottomwear: bottomwear(d),
    footwear: footwear(d),
    accessories: accessories(d),
    pose: null,
    framing: null,
    environment: null,
    lighting: null,
    generationPrompt: buildPrompt(rawDef),
    sourceReference: `Supplied MEN 210 reference outfit prompt pack \u00b7 ${sheet} \u00b7 panel ${panel}`,
    sourceNote: 'Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used.',
  };
});

// --- Emit files ------------------------------------------------------------
const header = `// VIRAAS MEN \u2014 permanent 210-look reference outfit catalog (FINAL LOCK).
//
// Source of truth: the user-supplied "MEN 210 NEW REFERENCE OUTFIT PROMPT PACK".
// 10 reference sheets \u00d7 21 panels = 210 looks, read left\u2192right, top\u2192bottom.
// Occasion allocation (fixed): 001\u2013042 Garba/Navratri, 043\u2013084 College Fest,
// 085\u2013126 Diwali, 127\u2013168 Festive Party, 169\u2013210 Traditional.
//
// The old Men 336 product catalog is completely ignored. Regenerate with:
//   node scripts/build-men-look-catalog.mjs
// Do not hand-edit; edit scripts/build-men-look-catalog.mjs instead.

export const MEN_LOOK_CATALOG = ${JSON.stringify(records, null, 2)};
`;

fs.writeFileSync(path.join(ROOT, 'data-src/men-look-catalog.mjs'), header);
fs.writeFileSync(path.join(ROOT, 'src/data/men-look-catalog.client.json'), JSON.stringify(records, null, 2) + '\n');

console.log(`Wrote ${records.length} men looks.`);

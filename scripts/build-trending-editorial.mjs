// Builds src/data/trending-editorial.client.json — the 54 TRENDING-ONLY editorial looks that bring
// the Trending feed to its 500-look target (236 Women + 210 Men + 54 editorial).
//
// HARD RULES ENCODED HERE:
//  • These are NEW editorial records. They never duplicate a catalog product, a Women look or a Men
//    look, and they never overwrite or delete an existing source record or workbook mapping.
//  • None of them has a supplied image yet. Each carries a stable, ready-to-fill `assetPath` and
//    `imageStatus: "pending-upload"`; the runtime resolver returns `undefined` until the asset is
//    actually uploaded, so no broken <img> URL is ever shipped.
//  • No price, merchant, retailer or affiliate URL is invented for them.
//
// Run: node scripts/build-trending-editorial.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'src/data/trending-editorial.client.json');

export const TRENDING_ID_START = 447;
export const TRENDING_ID_END = 500;
export const editorialId = (index) => `TREND-${TRENDING_ID_START + index}`;

const OCCASION_LABEL = {
  garba: 'Garba / Navratri',
  'college-fest': 'College Fest',
  diwali: 'Diwali',
  'festive-party': 'Festive Party',
  traditional: 'Traditional',
};

// [occasion, category, colour, title, fabric, work, styling, tags]
const WOMEN_LOOKS = [
  ['garba', 'Chaniya Choli', 'Rani Pink', 'Rani pink mirror-work chaniya with oxidised silver', 'Georgette', 'abhla bharat mirror panels across the skirt', 'oxidised silver jhumkas and a stacked bangle set', ['Mirror Work', 'Flared Skirt']],
  ['garba', 'Lehenga', 'Red', 'Red bandhani lehenga with a mirror-work choli', 'Silk blend', 'bandhani tie-dye and a mirror border', 'a heavy odhni and traditional mojari', ['Bandhani', 'Mirror Work']],
  ['garba', 'Chaniya Choli', 'Turquoise', 'Turquoise chaniya with abhla bharat mirror panels', 'Cotton silk', 'dense abhla bharat mirror work', 'silver chudla and a waist chain', ['Mirror Work', 'Dandiya']],
  ['garba', 'Crop Top & Skirt', 'Multicolour', 'Multicolour bandhani skirt with a black choli', 'Cotton', 'bandhani tie-dye in five colours', 'a black corset choli and silver anklets', ['Bandhani', 'Garba']],
  ['garba', 'Lehenga', 'Fuchsia', 'Fuchsia georgette lehenga with mirror and dori work', 'Georgette', 'mirror and dori embroidery on the panels', 'a contrasting net dupatta and jhumkas', ['Mirror Work', 'Dori Work']],
  ['garba', 'Sharara Set', 'Neon Pink', 'Neon pink chaniya-style sharara with a mirror choli', 'Net', 'mirror detailing on the sharara flare', 'oxidised silver hoops and a kamarbandh', ['Sharara', 'Mirror Work']],
  ['college-fest', 'Indo-Western', 'Emerald', 'Emerald satin co-ord with a cropped jacket', 'Satin', 'a clean tonal finish with a satin sheen', 'minimal gold studs and a block heel', ['Co-ord', 'Indo-Western']],
  ['college-fest', 'Palazzo Suit', 'Sky Blue', 'Sky blue palazzo suit with a printed dupatta', 'Mul cotton', 'small all-over block print', 'a thin belt and flat juttis', ['Palazzo', 'Block Print']],
  ['college-fest', 'Crop Top & Skirt', 'Mustard', 'Mustard crop top with a pleated skirt and belt', 'Linen blend', 'knife pleats with a tonal stitch hem', 'a wide belt and hoop earrings', ['Pleated', 'Fest Separates']],
  ['college-fest', 'Kurta Set', 'Powder Pink', 'Powder pink short kurta with white palazzos', 'Cotton', 'thread-work placket detailing', 'a long pendant and white kolhapuri', ['Short Kurta', 'Palazzo']],
  ['college-fest', 'Indo-Western', 'Olive', 'Olive utility shirt with a printed maxi skirt', 'Poplin', 'utility pockets and a contrast stitch', 'layered necklaces and sneakers', ['Utility', 'Maxi Skirt']],
  ['college-fest', 'Midi Dress', 'Lavender', 'Lavender slip midi dress with a lace panel', 'Viscose', 'a scalloped lace panel at the hem', 'delicate chains and a low heel', ['Slip Dress', 'Lace']],
  ['diwali', 'Anarkali', 'Gold', 'Champagne gold Anarkali with tonal thread work', 'Tissue silk', 'tonal resham thread work on the yoke', 'pearl drops and a low bun', ['Anarkali', 'Thread Work']],
  ['diwali', 'Sharara Set', 'Wine', 'Wine velvet sharara set with gold zari', 'Velvet', 'gold zari border along the sharara', 'kundan studs and a velvet potli', ['Velvet', 'Zari']],
  ['diwali', 'Lehenga', 'Rose Gold', 'Rose gold tissue lehenga with a scalloped dupatta', 'Tissue', 'a scalloped cut-out dupatta edge', 'rose gold jewellery and a sleek braid', ['Tissue', 'Scalloped']],
  ['diwali', 'Chaniya Choli', 'Royal Blue', 'Royal blue chaniya with gold kutchi embroidery', 'Silk', 'kutchi embroidery with mirrors', 'a silver choker and a braid crown', ['Kutchi', 'Mirror Work']],
  ['diwali', 'Kurta Set', 'Cream', 'Cream silk kurta set with gold tissue dupatta', 'Silk', 'a fine gold tissue dupatta', 'gold jhumkas and a soft wave', ['Silk', 'Diwali']],
  ['festive-party', 'Crop Top & Skirt', 'Black', 'Black sequin crop top with a tulle midi skirt', 'Tulle', 'hand-set sequins on the crop top', 'a statement cuff and a high ponytail', ['Sequin', 'Tulle']],
  ['festive-party', 'Midi Dress', 'Burgundy', 'Burgundy velvet midi dress with a sheer sleeve', 'Velvet', 'a sheer sleeve with a covered cuff', 'drop earrings and a satin clutch', ['Velvet', 'Sheer Sleeve']],
  ['festive-party', 'Indo-Western', 'Silver', 'Silver metallic co-ord with a draped panel', 'Metallic knit', 'a draped side panel', 'silver hoops and a slicked bun', ['Metallic', 'Co-ord']],
  ['festive-party', 'Sharara Set', 'Charcoal', 'Charcoal sequin sharara set with a sheer cape', 'Net', 'all-over sequin placement', 'a sheer cape and smokey eye', ['Sequin', 'Cape']],
  ['festive-party', 'Anarkali', 'Plum', 'Plum net Anarkali with sequin ombre hem', 'Net', 'sequin ombre from waist to hem', 'chandelier earrings and a side part', ['Ombre', 'Anarkali']],
  ['traditional', 'Kurta Set', 'Ivory', 'Ivory cotton kurta set with chikankari', 'Cotton', 'hand chikankari on the placket and cuffs', 'silver jhumkas and a low knot', ['Chikankari', 'Kurta Set']],
  ['traditional', 'Sharara Set', 'Off-White', 'Off-white georgette sharara with silver gota', 'Georgette', 'silver gota patti lines', 'pearl strings and a middle part', ['Gota', 'Sharara']],
  ['traditional', 'Anarkali', 'Sage', 'Sage green Anarkali with resham floral embroidery', 'Chanderi', 'resham floral embroidery', 'minimal gold and a soft curl', ['Resham', 'Anarkali']],
  ['traditional', 'Lehenga', 'Marigold', 'Marigold silk lehenga with a temple border', 'Silk', 'a woven temple border', 'temple jewellery and jasmine in the hair', ['Temple Border', 'Silk']],
  ['traditional', 'Palazzo Suit', 'Terracotta', 'Terracotta block-print palazzo suit', 'Handloom cotton', 'hand block print in a tonal repeat', 'wooden bangles and juttis', ['Block Print', 'Handloom']],
];

const MEN_LOOKS = [
  ['garba', 'Kurta', 'Ivory', 'Ivory short kurta with a bandhani stole', 'Cotton', 'a bandhani-print stole draped over one shoulder', 'a silver kada and mojari', ['Kediyu', 'Bandhani']],
  ['garba', 'Kurta', 'Red', 'Red kediyu-style kurta with mirror detailing', 'Cotton silk', 'mirror detailing on the placket', 'a white dhoti drape and a kamarbandh', ['Kediyu', 'Mirror Work']],
  ['garba', 'Kurta', 'Turquoise', 'Turquoise kediyu kurta with a dhoti drape', 'Cotton', 'a gathered kediyu hem', 'a bandhani safa and silver chains', ['Kediyu', 'Dhoti']],
  ['garba', 'Kurta', 'Multicolour', 'Multicolour block-print kediyu with a white dhoti', 'Cotton', 'multi-colour block print', 'a plain safa and leather mojari', ['Block Print', 'Kediyu']],
  ['garba', 'Kurta', 'Yellow', 'Yellow kediyu kurta with gota trim', 'Cotton silk', 'gota trim on the cuffs and neckline', 'a contrast stole and silver bangles', ['Gota', 'Kediyu']],
  ['garba', 'Ethnic Shirt', 'Pink', 'Pink bandhani-print ethnic shirt with a kediyu fit', 'Cotton', 'bandhani print in a tight repeat', 'a white dhoti and oxidised studs', ['Bandhani', 'Ethnic Shirt']],
  ['college-fest', 'Ethnic Shirt', 'Navy', 'Navy printed ethnic shirt with a white stole', 'Cotton', 'an all-over tonal print', 'a white stole and clean white sneakers', ['Ethnic Shirt', 'Stole']],
  ['college-fest', 'Kurta', 'Olive', 'Olive cotton kurta with rolled sleeves and denim', 'Cotton', 'a rolled sleeve with a tab', 'dark denim and a leather strap watch', ['Short Kurta', 'Casual']],
  ['college-fest', 'Ethnic Shirt', 'White', 'White mandarin-collar ethnic shirt with tone-on-tone print', 'Cotton satin', 'tone-on-tone self print', 'a slim trouser and loafers', ['Mandarin Collar', 'Self Print']],
  ['college-fest', 'Kurta', 'Slate Grey', 'Slate grey short kurta worn open over a tee', 'Linen blend', 'an open placket with a raw edge', 'a white tee underneath and chinos', ['Layered', 'Short Kurta']],
  ['college-fest', 'Ethnic Jacket / Layered Set', 'Sand', 'Sand linen jacket over a white ethnic shirt', 'Linen', 'an unstructured linen shoulder', 'a cotton shirt and suede loafers', ['Linen', 'Layered']],
  ['college-fest', 'Kurta', 'White', 'White textured kurta with a contrast stole', 'Dobby cotton', 'a woven dobby texture', 'a contrast stole and kolhapuri', ['Textured', 'Stole']],
  ['diwali', 'Kurta-Pajama Set', 'Gold', 'Champagne gold silk kurta-pajama set', 'Silk', 'a fine tonal sheen with a straight hem', 'a brocade stole and mojari', ['Silk', 'Diwali']],
  ['diwali', 'Waistcoat / Layered Set', 'Maroon', 'Maroon velvet waistcoat over an ivory kurta', 'Velvet', 'a velvet waistcoat with covered buttons', 'an ivory kurta and gold studs', ['Velvet', 'Waistcoat']],
  ['diwali', 'Kurta', 'Emerald', 'Emerald jacquard kurta with gold piping', 'Jacquard', 'a woven jacquard motif', 'gold piping and a silk stole', ['Jacquard', 'Piping']],
  ['diwali', 'Kurta', 'Wine', 'Wine self-design kurta with a gold inner', 'Silk blend', 'a self-design weave', 'a gold inner layer at the hem', ['Self Design', 'Layered']],
  ['diwali', 'Kurta-Pajama Set', 'Copper', 'Copper tissue kurta-pajama with a brocade stole', 'Tissue', 'a metallic tissue weave', 'a brocade stole and leather jutti', ['Tissue', 'Brocade']],
  ['festive-party', 'Ethnic Jacket / Layered Set', 'Black', 'Black bandhgala jacket with a textured shirt', 'Wool blend', 'a closed bandhgala neckline', 'a textured shirt and a pocket square', ['Bandhgala', 'Layered']],
  ['festive-party', 'Kurta-Pajama Set', 'Charcoal', 'Charcoal raw-silk kurta-pajama with a pocket square', 'Raw silk', 'a slub raw-silk finish', 'a pocket square and derby shoes', ['Raw Silk', 'Party']],
  ['festive-party', 'Ethnic Jacket / Layered Set', 'Midnight Blue', 'Midnight blue layered set with a brocade jacket', 'Brocade', 'a woven brocade jacket', 'a plain inner and a silk scarf', ['Brocade', 'Layered']],
  ['festive-party', 'Ethnic Shirt', 'Black', 'Black satin ethnic shirt with a tonal jacquard', 'Satin', 'a tonal jacquard repeat', 'a slim trouser and a chain bracelet', ['Satin', 'Jacquard']],
  ['festive-party', 'Kurta', 'Silver Grey', 'Silver grey raw-silk kurta with a mandarin collar', 'Raw silk', 'a mandarin collar with a hidden placket', 'a silver watch and a sharp taper', ['Raw Silk', 'Mandarin Collar']],
  ['traditional', 'Kurta', 'Off-White', 'Off-white khadi kurta with a chikankari placket', 'Khadi', 'hand chikankari on the placket', 'a white pyjama and a shawl', ['Khadi', 'Chikankari']],
  ['traditional', 'Kurta', 'Mustard', 'Mustard silk kurta with a tonal jaal weave', 'Silk', 'a tonal jaal weave', 'a cotton pyjama and a pocket watch chain', ['Jaal', 'Silk']],
  ['traditional', 'Kurta-Pajama Set', 'Beige', 'Beige handloom kurta-pajama with a shawl', 'Handloom cotton', 'a handloom slub texture', 'a wool shawl and leather sandals', ['Handloom', 'Shawl']],
  ['traditional', 'Kurta', 'Indigo', 'Indigo bagru-print kurta with a cotton pyjama', 'Cotton', 'hand bagru block print', 'a cotton pyjama and mojari', ['Bagru', 'Block Print']],
  ['traditional', 'Kurta', 'Green', 'Green silk kurta with a shawl and mojari pairing', 'Silk', 'a plain silk body with a tonal border', 'a shawl and hand-stitched mojari', ['Silk', 'Traditional']],
];

const build = (rows, gender, startIndex) => rows.map((row, i) => {
  const [occasion, category, colour, title, fabric, work, styling, styleTags] = row;
  const id = editorialId(startIndex + i);
  return {
    id,
    source: 'viraas-editorial',
    recordType: 'trending-only-editorial-look',
    gender,
    occasion: [occasion],
    occasionLabel: OCCASION_LABEL[occasion],
    category,
    colour,
    title,
    description: `${title}. ${fabric} finished with ${work}. Styled with ${styling}. Picked as a VIRAAS editorial direction for ${OCCASION_LABEL[occasion]}.`,
    styleTags,
    // Image is NOT supplied yet. assetPath is the agreed upload target for later; the runtime
    // resolver only returns it once imageStatus is flipped to "uploaded".
    assetPath: `/images/trending-editorial/${id}.jpg`,
    imageStatus: 'pending-upload',
    imageSupplied: false,
    price: null,
    priceType: null,
    merchant: null,
    affiliateUrl: null,
    tryOnEnabled: false,
    status: 'editorial-pending-image',
  };
});

const editorial = [...build(WOMEN_LOOKS, 'women', 0), ...build(MEN_LOOKS, 'men', WOMEN_LOOKS.length)];

if (editorial.length !== 54) throw new Error(`expected 54 editorial looks, got ${editorial.length}`);
const ids = editorial.map((l) => l.id);
if (new Set(ids).size !== ids.length) throw new Error('duplicate editorial id');
if (ids[0] !== 'TREND-447' || ids[ids.length - 1] !== 'TREND-500') throw new Error(`unexpected id range ${ids[0]}..${ids[ids.length - 1]}`);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, `${JSON.stringify(editorial, null, 2)}\n`);

const byGender = editorial.reduce((a, l) => ({ ...a, [l.gender]: (a[l.gender] ?? 0) + 1 }), {});
const byOccasion = editorial.reduce((a, l) => ({ ...a, [l.occasion[0]]: (a[l.occasion[0]] ?? 0) + 1 }), {});
console.log(JSON.stringify({ wrote: path.relative(ROOT, OUT), total: editorial.length, first: ids[0], last: ids[ids.length - 1], byGender, byOccasion, imagesSupplied: 0 }, null, 2));

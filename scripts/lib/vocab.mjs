// VIRAAS vocabulary library — derived from the reference language
// (outfits, silhouettes, colour stories, styling, poses, framing, environments,
// lighting, youthful aesthetic) + 2026 marketplace naming research.
// Forbidden terms are enforced by validators: achkan, sherwani, bandhgala,
// groomwear, kediyu, kafni, chorno, dhoti, amazon.

export const TODAY = "2026-09-23";
export const AGE = "18-25";

export const WORLDS = [
  { slug: "garba", label: "Garba / Navratri", priority: 1, alt: ["navratri", "garba", "dandiya", "raas"] },
  { slug: "college-fest", label: "College Fest", priority: 2, alt: ["college", "campus", "fest"] },
  { slug: "diwali", label: "Diwali", priority: 3, alt: ["diwali", "deepavali", "diya"] },
  { slug: "festive-party", label: "Festive Party", priority: 4, alt: ["party", "evening"] },
  { slug: "traditional", label: "Traditional", priority: 5, alt: ["traditional", "classic", "ethnic"] }
];

export const WORLD_META = {
  garba: {
    mood: "Navratri night energy — garba ground, dandiya circles, colour and movement",
    light: "festival string lights, warm halogen glow, slight night haze",
    environments: [
      "open garba ground with fairy-light canopies",
      "decorated Navratri pandal with colourful drapes",
      "dandiya area with hanging lantern strings",
      "festive festival lane with paper torans",
      "colourful canopy under night lights",
      "open-air Navratri event with warm crowd bokeh behind"
    ],
    womenColours: ["Black", "Rani Pink", "Hot Pink", "Ivory", "White", "Red", "Navy", "Emerald", "Royal Blue", "Mustard", "Multicolour", "Maroon", "Magenta", "Mehendi Green"],
    menColours: ["Black", "Ivory", "White", "Navy", "Wine", "Maroon", "Emerald", "Charcoal", "Royal Blue", "Mustard", "Indigo", "Grey", "Beige"],
    couplePairs: [
      ["Her hot pink + ivory", "Him ivory + hot pink accent"],
      ["Her black + silver", "Him black + white"],
      ["Her navy + silver", "Him navy + cream"],
      ["Her rani pink + gold", "Him ivory + pink"],
      ["Her red + black", "Him black + red accent"],
      ["Her multicolour bandhani", "Him neutral + one matching accent"],
      ["Her white + multicolour mirrors", "Him black + white"],
      ["Her emerald + gold", "Him ivory + emerald accent"],
      ["Her royal blue + silver", "Him black + navy accent"],
      ["Her mustard + pink", "Him ivory + mustard accent"],
      ["Her ivory + pink", "Him white + pink accent"],
      ["Her black + rainbow mirror", "Him black-on-black festive"],
      ["Her red + gold", "Him black + red"],
      ["Her hot pink + multicolour odhani", "Him navy + ivory"],
      ["Her emerald + multicolour", "Him charcoal + emerald accent"],
      ["Her white + silver", "Him black + white"],
      ["Her maroon + gold", "Him wine + ivory"],
      ["Her rani pink + black", "Him black + rani accent"],
      ["Her multicolour kutchi", "Him ivory + multicolour stole"],
      ["Her royal blue + hot pink", "Him navy + cream"]
    ]
  },
  "college-fest": {
    mood: "college fest playfulness — campus energy, lightweight festive, affordable cool",
    light: "bright afternoon daylight, shaded lawns, fest string lights at dusk",
    environments: [
      "college campus lawns",
      "iconic college stairs",
      "fest stage backdrop with student crowd bokeh",
      "long campus corridor with arches",
      "outdoor fest grounds with bunting and stalls",
      "college courtyard with fairy lights at dusk"
    ],
    womenColours: ["Ivory", "Yellow", "Hot Pink", "Sky Blue", "White", "Mustard", "Black", "Lime", "Peach", "Rani Pink", "Coral", "Lilac"],
    menColours: ["White", "Black", "Navy", "Olive", "Ivory", "Mustard", "Sky Blue", "Grey", "Beige", "Wine", "Teal"],
    couplePairs: [
      ["Her yellow + white", "Him white + yellow accent"],
      ["Her pink + ivory", "Him sky blue + pink accent"],
      ["Her white + multicolour", "Him black + white"],
      ["Her sky blue + white", "Him navy + sky accent"],
      ["Her black + silver", "Him black + ivory"],
      ["Her mustard + white", "Him ivory + mustard accent"],
      ["Her peach + ivory", "Him white + peach accent"],
      ["Her lime + white", "Him olive + white"],
      ["Her lilac + silver", "Him charcoal + lilac accent"],
      ["Her coral + white", "Him beige + coral accent"],
      ["Her rani pink + white", "Him white + rani accent"],
      ["Her ivory + rainbow trim", "Him white + multicolour stole"],
      ["Her hot pink + black", "Him black + hot pink accent"],
      ["Her mint + white", "Him teal + ivory"],
      ["Her yellow + pink", "Him olive + ivory"],
      ["Her white + mirror work", "Him black + white"],
      ["Her blue + white", "Him navy + cream"],
      ["Her orange + pink", "Him rust + ivory"],
      ["Her black + neon detail", "Him black-on-black"],
      ["Her pink + orange odhani", "Him white + pink accent"]
    ]
  },
  diwali: {
    mood: "warm Diwali glow — diyas, terrace lights, intimate family courtyard",
    light: "golden diya light, warm fairy lights, dusk sky with lantern glow",
    environments: [
      "terrace with rows of diyas",
      "balcony with fairy lights and lanterns",
      "warm Indian home courtyard with diya rows",
      "festive lane with glowing diyas",
      "tasteful Indian living room with warm lamps",
      "rooftop with string lights and city dusk behind"
    ],
    womenColours: ["Rani Pink", "Royal Blue", "Emerald", "Wine", "Maroon", "Mustard", "Ivory", "Red", "Black", "Gold", "Magenta", "Wine"],
    menColours: ["Black", "Wine", "Maroon", "Ivory", "Navy", "Emerald", "Charcoal", "Mustard", "Beige", "Indigo", "Bottle Green"],
    couplePairs: [
      ["Her rani pink + gold", "Him ivory + pink"],
      ["Her royal blue + silver", "Him navy + cream"],
      ["Her emerald + gold", "Him black + emerald accent"],
      ["Her wine + gold", "Him wine + ivory"],
      ["Her mustard + red", "Him ivory + mustard accent"],
      ["Her ivory + gold", "Him ivory + gold accent"],
      ["Her red + gold", "Him black + red accent"],
      ["Her black + gold", "Him black-on-black + gold accent"],
      ["Her maroon + ivory", "Him maroon + cream"],
      ["Her magenta + silver", "Him charcoal + magenta accent"],
      ["Her emerald + pink", "Him bottle green + ivory"],
      ["Her blue + gold", "Him indigo + cream"],
      ["Her peach + gold", "Him beige + peach accent"],
      ["Her green + red", "Him bottle green + maroon accent"],
      ["Her pink + silver", "Him black + pink accent"],
      ["Her gold + ivory", "Him ivory + gold"],
      ["Her wine + blush", "Him wine + white"],
      ["Her royal blue + gold", "Him navy + gold accent"],
      ["Her red + black", "Him black + red"],
      ["Her rani + multicolour", "Him ivory + rani accent"]
    ]
  },
  "festive-party": {
    mood: "evening festive party — sleek, premium but youthful, decorative lights",
    light: "evening venue uplight, decorative lamp glow, soft nightlife bokeh",
    environments: [
      "evening event venue with decorative lights",
      "premium contemporary Indian banquet lounge",
      "string-lit terrace party deck",
      "modern Indian event space with lantern wall",
      "outdoor festive party with warm bokeh lights",
      "chic courtyard venue with uplit columns"
    ],
    womenColours: ["Black", "Wine", "Emerald", "Ivory", "Navy", "Charcoal", "Silver", "Rani Pink", "Royal Blue", "Magenta", "Wine"],
    menColours: ["Black", "Wine", "Emerald", "Ivory", "Navy", "Charcoal", "Wine", "Grey", "Bottle Green"],
    couplePairs: [
      ["Her black + silver", "Him black + white"],
      ["Her wine + gold", "Him wine + ivory"],
      ["Her emerald + silver", "Him emerald + black"],
      ["Her ivory + black", "Him black + ivory"],
      ["Her navy + silver", "Him navy + cream"],
      ["Her charcoal + crystal", "Him charcoal + white"],
      ["Her rani pink + black", "Him black + rani accent"],
      ["Her royal blue + silver", "Him black + blue accent"],
      ["Her black + gold", "Him black-on-black"],
      ["Her magenta + silver", "Him charcoal + magenta accent"],
      ["Her green + black", "Him bottle green + black"],
      ["Her silver + ivory", "Him grey + ivory"],
      ["Her wine + blush", "Him wine + cream"],
      ["Her blue + black", "Him navy + black"],
      ["Her black + emerald", "Him emerald + ivory"],
      ["Her ivory + gold", "Him ivory + black"],
      ["Her black + wine", "Him wine + black"],
      ["Her green + gold", "Him bottle green + gold accent"],
      ["Her navy + gold", "Him navy + ivory"],
      ["Her pink + black", "Him black + pink accent"]
    ]
  },
  traditional: {
    mood: "tasteful tradition — heritage architecture, courtyard light, classic craft",
    light: "soft natural daylight, warm jharokha light, gentle courtyard shade",
    environments: [
      "heritage haveli courtyard",
      "Indian heritage architecture jharokha balcony",
      "sandstone corridor with carved arches",
      "tasteful Indian interior with brass and wood",
      "temple courtyard stone steps in soft shade",
      "courtyard verandah with chik blinds and daylight"
    ],
    womenColours: ["Red", "Maroon", "Emerald", "Navy", "Ivory", "Mustard", "Rani Pink", "Royal Blue", "Mehendi Green", "Gold", "Wine", "Beige"],
    menColours: ["Ivory", "Beige", "White", "Emerald", "Navy", "Maroon", "Mustard", "Bottle Green", "Indigo", "Wine"],
    couplePairs: [
      ["Her red + gold", "Him ivory + red accent"],
      ["Her emerald + gold", "Him bottle green + ivory"],
      ["Her navy + gold", "Him navy + cream"],
      ["Her ivory + red", "Him ivory + maroon accent"],
      ["Her maroon + gold", "Him maroon + cream"],
      ["Her mustard + red", "Him ivory + mustard accent"],
      ["Her mehendi green + gold", "Him bottle green + ivory"],
      ["Her rani pink + gold", "Him ivory + pink"],
      ["Her royal blue + silver", "Him indigo + cream"],
      ["Her red + green", "Him bottle green + maroon accent"],
      ["Her gold + ivory", "Him ivory + gold"],
      ["Her wine + gold", "Him wine + ivory"],
      ["Her green + mustard", "Him mehendi green + ivory"],
      ["Her pink + gold", "Him beige + pink accent"],
      ["Her red + black", "Him black + red accent"],
      ["Her ivory + gold zari", "Him white + gold accent"],
      ["Her blue + red", "Him indigo + maroon accent"],
      ["Her maroon + green", "Him bottle green + maroon"],
      ["Her mustard + pink", "Him beige + mustard"],
      ["Her green + red bandhani", "Him ivory + green accent"]
    ]
  }
};

export const POSES = [
  ["walking hand-in-hand", "walking hand in hand toward the camera, relaxed stride, mid-laugh"],
  ["looking at each other", "standing close and looking at each other with soft smiles, ignoring the camera"],
  ["laughing together", "caught mid-laugh together, heads tilted toward each other, spontaneous"],
  ["outfit adjustment", "she is adjusting his collar / sleeve while he smiles down at her"],
  ["dupatta adjustment", "he is gently fixing the edge of her dupatta or odhani, both smiling"],
  ["arm around shoulder", "his arm around her shoulder, both facing camera with easy grins"],
  ["arm around waist", "his arm around her waist, her hand on his chest, close and natural"],
  ["side-by-side walking", "walking side by side away from lights, candid stride"],
  ["back-view walking", "back view walking together hand in hand, looking ahead at the venue"],
  ["candid conversation", "mid-conversation candid, gesturing, not looking at the camera"],
  ["playful interaction", "playful teasing moment, she is pushing him away laughing"],
  ["dance lead", "mid dance step, dance lead pose, fabric caught in motion"],
  ["garba twirl", "mid garba twirl with dandiya sticks low in frame, skirt flaring"],
  ["one partner twirling", "he twirls her, she spins with skirt flaring, caught in motion"],
  ["mirror selfie", "mirror selfie in a venue mirror, phone visible, casual flash look"],
  ["phone selfie", "phone selfie arm extended, both leaning heads together, festival lights behind"],
  ["close standing", "close standing, shoulders touching, quiet confident smiles at camera"],
  ["forehead near", "forehead-near soft eye contact, almost a whisper, gentle hands"],
  ["seated casual", "seated casually on venue steps, knees up, arms resting, relaxed"],
  ["wall lean", "leaning against a heritage wall side by side, ankles crossed, calm"],
  ["looking away", "both looking away from camera at the festival scene, profiles lit"],
  ["walking looking back", "walking away but she looks back at camera over her shoulder, he smiles at her"],
  ["playful festival moment", "playful festival moment — tossing flower petals / colour powder, motion energy"],
  ["dandiya mid-step", "dandiya sticks mid-strike between them, joyful dance energy"],
  ["sharing earphones / quiet moment", "quiet candid — sharing a moment on venue steps, phones away, soft smiles"],
  ["squat-and-lean", "she stands while he squats-and-leans near her knee, street-fashion pose, both smiling"]
];

export const CAMERAS = [
  "eye-level full-length framing",
  "slight low angle full-length framing",
  "three-quarter framing from the side",
  "environmental wide framing, couple small in scene",
  "knee-up editorial framing",
  "over-the-shoulder framing from behind one partner"
];
export const LENSES = ["35mm reportage feel, natural grain", "50mm portrait look, gentle depth of field", "85mm compression, creamy background light"];

// ---------------------------------------------------------------
// WOMEN CATEGORIES
// ---------------------------------------------------------------
export const WOMEN_CATS = {
  "chaniya-choli": {
    label: "Chaniya Choli",
    subcats: ["Garba Chaniya Sets", "Mirror Work Choli Sets", "Bandhani Chaniya Sets", "Kutchi Patch Sets", "Festive Chaniya Sets"],
    silhouettes: ["8-metre flared chaniya", "panelled flared chaniya", "A-line chaniya", "kalidar chaniya", "layered chaniya", "tiered chaniya"],
    fabrics: ["Cotton Silk", "Muslin Cotton", "Rayon", "Georgette", "Art Silk", "Bandhani Cotton", "Crepe"],
    top: "chaniya choli",
    price: [899, 3999],
    tryOn: true
  },
  lehenga: {
    label: "Lehenga",
    subcats: ["Flared Lehengas", "Embellished Lehengas", "Printed Lehengas", "Lightweight Festive Lehengas", "Party Lehengas"],
    silhouettes: ["flared lehenga", "A-line lehenga", "kalidar lehenga", "mermaid lehenga", "layered lehenga", "ruffled lehenga"],
    fabrics: ["Georgette", "Chanderi Silk", "Velvet", "Organza", "Art Silk", "Net", "Crepe", "Satin"],
    top: "lehenga set",
    price: [1199, 4999],
    tryOn: true
  },
  sharara: {
    label: "Sharara",
    subcats: ["Sharara Sets", "Short Kurta Shararas", "Embroidered Shararas", "Printed Shararas"],
    silhouettes: ["waist-flare sharara", "flared palazzo-style sharara", "short kurta sharara set", "panelled sharara"],
    fabrics: ["Georgette", "Rayon", "Crepe", "Art Silk", "Chanderi Silk", "Cotton Blend"],
    top: "sharara set",
    price: [699, 3299],
    tryOn: true
  },
  gharara: {
    label: "Gharara",
    subcats: ["Gharara Sets", "Knee-Flare Ghararas", "Embroidered Ghararas", "Lucknowi Ghararas"],
    silhouettes: ["knee-flare gharara", "two-piece gharara set", "long kurta gharara set", "gathered-knee gharara"],
    fabrics: ["Georgette", "Crepe", "Art Silk", "Cotton Blend", "Velvet"],
    top: "gharara set",
    price: [799, 3499],
    tryOn: true
  },
  sarees: {
    label: "Sarees",
    subcats: ["Festive Sarees", "Printed Sarees", "Embroidered Sarees", "Lightweight Sarees"],
    silhouettes: ["classic six-yard drape", "pre-pleated festive drape", "flowing georgette drape", "structured silk drape"],
    fabrics: ["Georgette", "Chiffon", "Chanderi Silk", "Art Silk", "Organza", "Satin", "Cotton Silk"],
    top: "saree",
    price: [599, 3999],
    tryOn: true
  },
  "pre-draped-sarees": {
    label: "Pre-Draped Sarees",
    subcats: ["Ready-to-Wear Sarees", "Pre-Stitched Sarees", "Belted Drapes", "Contemporary Drapes"],
    silhouettes: ["pre-draped stitched saree", "belted ready-to-wear drape", "lehenga-saree hybrid drape", "contemporary pre-draped saree"],
    fabrics: ["Georgette", "Satin", "Crepe", "Organza", "Chiffon"],
    top: "pre-draped saree",
    price: [999, 4999],
    tryOn: true
  },
  anarkali: {
    label: "Anarkali",
    subcats: ["Anarkali Suits", "Floor-Length Anarkalis", "Short Anarkalis", "Jacket Anarkalis"],
    silhouettes: ["floor-length anarkali", "kalidar anarkali", "short flared anarkali", "jacket-layered anarkali"],
    fabrics: ["Georgette", "Chanderi Silk", "Velvet", "Art Silk", "Crepe", "Organza"],
    top: "anarkali suit",
    price: [899, 4499],
    tryOn: true
  },
  "kurta-sets": {
    label: "Kurta Sets",
    subcats: ["Kurta Palazzo Sets", "Kurta Pant Sets", "Kurta Dupatta Sets", "Short Kurta Sets"],
    silhouettes: ["straight kurta set", "flared kurta set", "A-line kurta set", "short kurta set", "slit kurta set"],
    fabrics: ["Cotton Blend", "Rayon", "Chanderi Silk", "Georgette", "Cotton Silk", "Linen Blend"],
    top: "kurta set",
    price: [699, 3499],
    tryOn: true
  },
  "festive-sets": {
    label: "Festive Sets",
    subcats: ["Statement Festive Sets", "Coordinated Festive Sets", "Occasion Sets", "Light Festive Sets"],
    silhouettes: ["coordinated festive set", "tonal festive set", "mixed-print festive set", "festive kurta-skirt set"],
    fabrics: ["Georgette", "Art Silk", "Rayon", "Chanderi Silk", "Crepe", "Cotton Silk"],
    top: "festive set",
    price: [799, 3999],
    tryOn: true
  },
  jewellery: {
    label: "Jewellery",
    subcats: ["Earrings", "Necklace Sets", "Maang Tikka", "Bangles & Bracelets", "Rings"],
    silhouettes: ["statement piece", "lightweight everyday-festive piece", "traditional craft piece", "minimal festive piece"],
    fabrics: ["Oxidised Metal", "Gold-Tone Alloy", "Silver-Tone Alloy", "Pearl Finish", "Kundan Finish", "Meenakari Finish"],
    top: "jewellery",
    price: [149, 999],
    tryOn: false
  },
  bags: {
    label: "Bags",
    subcats: ["Potlis", "Clutches", "Sling Bags", "Mini Bags"],
    silhouettes: ["potli bag", "foldover clutch", "chain sling bag", "structured mini bag"],
    fabrics: ["Velvet", "Brodé Silk", "Jute Blend", "Satin", "Metal Mesh", "Embroidered Canvas"],
    top: "bag",
    price: [249, 1499],
    tryOn: false
  },
  footwear: {
    label: "Footwear",
    subcats: ["Juttis", "Kolhapuris", "Block Heels", "Embellished Flats"],
    silhouettes: ["jutti pair", "kolhapuri pair", "block-heel pair", "embellished flat pair"],
    fabrics: ["Leatherette", "Velvet", "Brodé Fabric", "Jute Blend", "Satin"],
    top: "footwear",
    price: [399, 1999],
    tryOn: false
  },
  beauty: {
    label: "Beauty",
    subcats: ["Kajal & Kohl", "Lip Colour", "Mini Beauty Kits", "Festive Minis"],
    silhouettes: ["mini beauty essential", "festive glam kit", "everyday kajal stick", "lip colour bullet"],
    fabrics: ["Matte Finish", "Satin Finish", "Long-Wear Formula", "Kohl Formula"],
    top: "beauty pick",
    price: [149, 899],
    tryOn: false
  }
};

// ---------------------------------------------------------------
// MEN CATEGORIES — modern youthful ethnic only (no ceremonial formalwear)
// ---------------------------------------------------------------
export const MEN_CATS = {
  "modern-ethnic-shirts": {
    label: "Modern Ethnic Shirts",
    subcats: ["Solid Ethnic Shirts", "Mandarin Collar Shirts", "Longline Ethnic Shirts", "Festive Shirts"],
    silhouettes: ["relaxed ethnic shirt", "regular-fit ethnic shirt", "longline ethnic shirt", "boxy festive shirt"],
    fabrics: ["Cotton Blend", "Rayon", "Linen Blend", "Cotton Slub", "Art Silk", "Crepe"],
    top: "modern ethnic shirt",
    price: [499, 2499],
    tryOn: true
  },
  "printed-ethnic": {
    label: "Printed Ethnic",
    subcats: ["Bandhani Print Shirts", "Ajrakh Print Shirts", "Motif Print Shirts", "Printed Kurtas"],
    silhouettes: ["relaxed printed ethnic shirt", "regular-fit printed shirt", "relaxed printed kurta", "straight printed kurta"],
    fabrics: ["Cotton Blend", "Pure Cotton", "Rayon", "Cotton Slub", "Linen Blend"],
    top: "printed ethnic",
    price: [449, 2499],
    tryOn: true
  },
  "embroidered-ethnic": {
    label: "Embroidered Ethnic",
    subcats: ["Chest Motif Shirts", "Mirror Detail Shirts", "Tonal Embroidered Shirts", "Embroidered Kurtas"],
    silhouettes: ["relaxed embroidered ethnic shirt", "regular-fit embroidered shirt", "straight embroidered kurta", "longline embroidered shirt"],
    fabrics: ["Cotton Blend", "Rayon", "Art Silk", "Georgette", "Cotton Slub", "Crepe"],
    top: "embroidered ethnic",
    price: [599, 2799],
    tryOn: true
  },
  "modern-kurtas": {
    label: "Modern Kurtas",
    subcats: ["Short Kurtas", "Long Kurtas", "Slit Kurtas", "Solid Kurtas"],
    silhouettes: ["relaxed modern kurta", "short kurta", "straight modern kurta", "side-slit modern kurta"],
    fabrics: ["Cotton Blend", "Pure Cotton", "Rayon", "Linen Blend", "Art Silk", "Silk Blend"],
    top: "modern kurta",
    price: [599, 2999],
    tryOn: true
  },
  "festive-sets": {
    label: "Festive Sets",
    subcats: ["Kurta Trouser Sets", "Shirt Trouser Sets", "Kurta Pant Sets", "Festive Two-Piece Sets"],
    silhouettes: ["kurta trouser set", "shirt trouser set", "kurta pant set", "tonal festive two-piece set"],
    fabrics: ["Cotton Blend", "Rayon", "Art Silk", "Linen Blend", "Crepe"],
    top: "festive set",
    price: [899, 3999],
    tryOn: true
  },
  "festive-layers": {
    label: "Festive Layers",
    subcats: ["Nehru-Collar Layers", "Quilted Festive Jackets", "Light Overshirts", "Sleeveless Festive Layers"],
    silhouettes: ["light festive layer", "sleeveless festive gilet", "overshirt festive layer", "quilted festive layer"],
    fabrics: ["Cotton Blend", "Art Silk", "Velvet", "Jacquard", "Rayon"],
    top: "festive layer",
    price: [699, 2999],
    tryOn: true
  },
  "festive-separates": {
    label: "Festive Separates",
    subcats: ["Festive Trousers", "Textured Pants", "Pyjama Trousers", "Draped Trousers"],
    silhouettes: ["tapered festive trouser", "straight festive trouser", "relaxed pleated trouser", "drawstring festive trouser"],
    fabrics: ["Cotton Blend", "Rayon", "Linen Blend", "Art Silk", "Crepe"],
    top: "festive separate",
    price: [499, 2299],
    tryOn: true
  },
  "contemporary-garba": {
    label: "Contemporary Garba",
    subcats: ["Garba Night Shirts", "Festive Garba Sets", "Mirror Detail Garba Looks", "Black Garba Looks"],
    silhouettes: ["contemporary garba look", "garba night shirt set", "relaxed festive garba kurta", "black-on-black garba set"],
    fabrics: ["Cotton Blend", "Rayon", "Art Silk", "Georgette", "Cotton Slub"],
    top: "contemporary garba look",
    price: [699, 3499],
    tryOn: true
  },
  accessories: {
    label: "Accessories",
    subcats: ["Mojari & Footwear", "Stoles & Scarves", "Brooches", "Chains & Bracelets"],
    silhouettes: ["mojari pair", "festive stole", "scarf wrap", "brooch pin", "chain or bracelet set"],
    fabrics: ["Leatherette", "Brodé Fabric", "Cotton Blend", "Metal Finish", "Velvet"],
    top: "accessory",
    price: [149, 1499],
    tryOn: false
  }
};

export const PATTERN_POOL_W = [
  "Bandhani Print", "Bandhej Print", "Leheriya Print", "Ajrakh Print", "Kalamkari Print", "Patola Print",
  "Floral Print", "Geometric Print", "Polka Dot", "Solid Self", "Zari Weave", "Brocade Weave",
  "Panelled Multicolour", "Block Print", "Digital Print", "Tie-Dye", "Mirror Grid", "Stripe Panel"
];
export const EMBROIDERY_POOL_W = [
  "Mirror Work", "Gota Patti", "Gamthi Work", "Kutchi Embroidery", "Thread Work", "Zari Work",
  "Sequin Work", "Cutdana Work", "Chikankari", "Tassel Detail", "Shell Detail", "Patch Work",
  "Resham Work", "Kasab Work", "Print Only"
];
export const PATTERN_POOL_M = [
  "Solid Self", "Bandhani Print", "Ajrakh Print", "Ethnic Motif Print", "Geometric Print", "Paisley Print",
  "Floral Print", "Micro Print", "Abstract Print", "Block Print", "Pintuck Self", "Zari Weave",
  "Leheriya Print", "Digital Print", "Ethnic Stripe"
];
export const EMBROIDERY_POOL_M = [
  "Mirror Detail", "Thread Embroidery", "Tonal Embroidery", "Zari Work", "Sequin Detail",
  "Kutchi Motif Embroidery", "Chest Motif Embroidery", "Kantha Stitch", "Aari Work", "Print Only"
];

export const W_DETAIL_POOL = [
  "contrast odhani", "mirror-trim border", "tassel tie-up", "shell hem", "contrast piping",
  "layered dupatta", "belt detail", "sequin border", "gotra-trim hem", "kutchi patch pocket",
  "cowrie shell trim", "pom-pom trim", "contrast blouse buttons"
];
export const M_DETAIL_POOL = [
  "contrast placket", "tonal buttons", "side-slit hem", "contrast collar trim", "slip pocket",
  "drawstring waist", "metal button detail", "contrast cuff", "minimal chest pocket", "roll-tab sleeve"
];

export const STYLES_W = ["Garba-Ready", "Campus Festive", "Diwali Statement", "Evening Festive", "Classic Craft", "Mirror Moment", "Bandhani Love", "Light & Airy", "Statement Sleeve", "Odani Draped"];
export const STYLES_M = ["Garba Night", "Campus Cool", "Diwali Ready", "Party Ethnic", "Clean Classic", "Black Festive", "Printed Mood", "Mirror Accent", "Layered Look", "Relaxed Fit"];

export const MERCHANTS = ["MYNTRA", "AJIO", "FLIPKART", "SHOPSY", "MEESHO", "NYKAA"];
export const MERCHANT_WEIGHTS = {
  women: { MYNTRA: 24, AJIO: 18, FLIPKART: 12, SHOPSY: 10, MEESHO: 24, NYKAA: 12 },
  men: { MYNTRA: 20, AJIO: 16, FLIPKART: 18, SHOPSY: 22, MEESHO: 18, NYKAA: 6 }
};

// Verified marketplace URLs (research-verified 2026-09-23). Everything else → 'CHECK'
export const VERIFIED_URLS = {
  MYNTRA: {
    lehenga: "https://www.myntra.com/lehengas",
    "chaniya-choli": "https://www.myntra.com/lehengas"
  },
  MEESHO: {
    sharara: "https://www.meesho.com/ethnic-sharara/pl/5ox"
  },
  AJIO: {
    "kurta-sets": "https://www.ajio.com/s/festive-kurta-sets-4826-77561",
    "festive-sets": "https://www.ajio.com/s/festive-kurta-sets-4826-77561"
  },
  FLIPKART: {
    "festive-sets": "https://www.flipkart.com/clothing-and-accessories/kurtas-ethnic-sets-and-bottoms/ethnic-sets/festive-kurtas~theme/pr?sid=clo%2Ccfv%2Citg",
    "modern-kurtas": "https://www.flipkart.com/mens-ethnic-sets/festive-kurtas-under-999~theme/pr?sid=clo%2Ccfv%2Citg%2Cpme",
    "kurta-sets": "https://www.flipkart.com/clothing-and-accessories/kurtas-ethnic-sets-and-bottoms/ethnic-sets/festive-kurtas~theme/pr?sid=clo%2Ccfv%2Citg"
  },
  SHOPSY: {
    "modern-kurtas": "https://www.shopsy.in/kurtas-for-men-online",
    "festive-sets": "https://www.shopsy.in/kurtas-for-men-online",
    "contemporary-garba": "https://www.shopsy.in/kurtas-for-men-online"
  },
  NYKAA: {
    beauty: "https://www.nykaa.com/dp/lipstick-kajal"
  }
};

export const PRODUCT_NEGATIVE =
  "text, logo, watermark, distorted hands, extra fingers, extra limbs, duplicate body parts, floating clothes, broken anatomy, distorted garment, plastic texture, cropped feet, missing garment details, random accessories, bridal styling, groom styling, wedding costume, cheap catalogue appearance";

export const COUPLE_NEGATIVE =
  "mannequins, faceless couple, mannequin heads, plastic faces, stiff studio posing, mature married couple, wedding album styling, bridal makeup, wedding garlands, groom sherwani, heavy bridal jewellery, text, logo, watermark, distorted hands, extra fingers, extra limbs, duplicate body parts, oversaturated HDR, heavy airbrushing";

export function productPrompt({ garment, colour, fabric, pattern, embroidery, silhouette, detail, world, environment, camera, lens, mannequin }) {
  const figure = mannequin
    ? "premium realistic identity-neutral fashion mannequin with refined matte finish, calm abstract head with no facial features"
    : "identity-neutral realistic fashion figure";
  return [
    "Premium contemporary Indian fashion editorial, full-body",
    figure,
    `wearing the exact specified garment: ${garment}, in ${colour}, ${fabric} fabric appearance, ${pattern}, ${embroidery}, ${silhouette} silhouette with ${detail}.`,
    "Youthful Indian fashion direction, realistic textile texture, natural garment drape, refined proportions, detailed stitching and construction, complete garment visible including full hem and feet.",
    `World: ${WORLD_META[world].mood}. Tasteful Indian environment: ${environment}.`,
    `${WORLD_META[world].light}, premium editorial photography, cinematic soft lighting, ${camera}, ${lens}, original composition, single outfit on one figure.`,
    "No text, no logo, no watermark."
  ].join(" ");
}

export function couplePrompt({ world, herOutfit, hisOutfit, pose, environment, camera, lens, index }) {
  return [
    "Original realistic photograph of a youthful Indian couple (18-25 visual age, college-age young adults, one young woman and one young man), natural skin texture, natural hair, attractive and believable, candid Pinterest-like Instagram-like aesthetic, slightly imperfect spontaneous mood, real human hands.",
    `Her outfit: ${herOutfit}. His outfit: ${hisOutfit}. Matched but not matching — intentional colour harmony, no uniform dressing.`,
    `Pose direction: ${pose}.`,
    `Setting: ${environment} — ${WORLD_META[world].mood}. Lighting: ${WORLD_META[world].light}.`,
    `${camera}, ${lens}, editorial reportage photography, shot ${String(index).padStart(2, "0")}.`,
    "Absolutely no mannequins, no stiff posing, no mature married vibe, no wedding album vibe, no bridal or groom styling.",
    "No text, no logo, no watermark."
  ].join(" ");
}

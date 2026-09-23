// Product taxonomy for VIRAAS. Derived from the attached Men/Women reference screenshots
// (REF-M1..M3, REF-W1..W2) and validated against common marketplace category availability
// on Myntra / AJIO / Flipkart / Shopsy / Meesho / Nykaa (category names, fabrics, typical price bands).
//
// Each entry: variants are combined with colours to create distinct, meaningful products.
// `band` = typical marketplace price band [min, max] in INR for this style (research-guided estimate).

export const WOMEN = {
  'Chaniya Choli': {
    sub: 'Garba Wear', silhouette: 'Flared Chaniya', occasions: ['garba', 'college-fest', 'traditional'], band: [799, 3499], tryOn: true,
    colours: ['Black', 'Red', 'Rani Pink', 'Hot Pink', 'Ivory', 'White', 'Navy', 'Royal Blue', 'Emerald', 'Mustard', 'Wine', 'Maroon', 'Multicolour', 'Yellow', 'Rust'],
    variants: [
      { detail: 'mirror work', fabric: 'Cotton', pattern: 'Embroidered', title: 'Mirror-Work Cotton Chaniya Choli', ref: 'REF-W1' },
      { detail: 'kutchi embroidered crop blouse', fabric: 'Rayon', pattern: 'Embroidered', title: 'Chaniya Choli with Kutchi Crop Blouse', ref: 'REF-W2' },
      { detail: 'bandhani print', fabric: 'Cotton', pattern: 'Bandhani', title: 'Bandhani-Print Chaniya Choli', ref: 'REF-S1' },
      { detail: 'patchwork with mirror work', fabric: 'Cotton', pattern: 'Patchwork', title: 'Boho Patchwork Flare Chaniya Choli', ref: 'REF-W1' },
      { detail: 'gamthi print with mirror', fabric: 'Cotton', pattern: 'Printed', title: 'Gamthi-Print Chaniya with Mirror Blouse', ref: 'REF-W1' },
      { detail: 'gold lampi border with patola dupatta', fabric: 'Rayon', pattern: 'Solid with Border', title: 'Lampi-Border Chaniya with Patola Dupatta', ref: 'REF-W2' },
      { detail: 'kutchi mirror halter', fabric: 'Cotton', pattern: 'Embroidered', title: 'Chaniya with Kutchi Mirror Halter Blouse', ref: 'REF-W1' },
    ],
  },
  'Lehenga': {
    sub: 'Lehenga Choli', silhouette: 'A-line Flared', occasions: ['garba', 'diwali', 'festive-party', 'traditional'], band: [1199, 4999], tryOn: true,
    colours: ['Black', 'Ivory', 'Rani Pink', 'Red', 'Wine', 'Emerald', 'Maroon', 'Lilac', 'Teal', 'Powder Blue', 'Mustard', 'Silver', 'Gold', 'Royal Blue', 'Coral'],
    variants: [
      { detail: 'mirror work embellishment', fabric: 'Georgette', pattern: 'Embellished', title: 'Mirror-Embellished Georgette Lehenga', ref: 'REF-C3' },
      { detail: 'brocade', fabric: 'Brocade', pattern: 'Woven', title: 'Brocade Lehenga with Long-Sleeve Crop Top', ref: 'REF-C2' },
      { detail: 'gota border dupatta', fabric: 'Silk Blend', pattern: 'Solid', title: 'Silk Lehenga with Gota-Border Dupatta', ref: 'REF-C1' },
      { detail: 'kutch balloon-sleeve blouse', fabric: 'Cotton Silk', pattern: 'Embroidered', title: 'Lehenga with Kutch Balloon-Sleeve Blouse', ref: 'REF-W2' },
      { detail: 'sequin', fabric: 'Georgette', pattern: 'Sequinned', title: 'Lightweight Sequin Lehenga', ref: 'REF-W1' },
      { detail: 'printed flared', fabric: 'Cotton', pattern: 'Printed', title: 'Printed Flared Cotton Lehenga', ref: 'REF-W1' },
      { detail: 'zari', fabric: 'Silk', pattern: 'Zari Woven', title: 'Zari-Woven Silk Lehenga', ref: 'REF-W2' },
      { detail: 'bandhani', fabric: 'Silk', pattern: 'Bandhani', title: 'Bandhani Silk Lehenga', ref: 'REF-S2' },
    ],
  },
  'Sharara': {
    sub: 'Sharara Set', silhouette: 'Wide-Leg Sharara', occasions: ['college-fest', 'diwali', 'festive-party'], band: [899, 3499], tryOn: true,
    colours: ['Mint', 'Rani Pink', 'Ivory', 'Red', 'Wine', 'Black', 'Emerald', 'Peach', 'Mustard', 'Lilac', 'Powder Blue', 'Maroon'],
    variants: [
      { detail: 'gota trim', fabric: 'Cotton', pattern: 'Solid', title: 'Gota-Trim Cotton Sharara Set' },
      { detail: 'mirror work', fabric: 'Rayon', pattern: 'Embroidered', title: 'Mirror-Work Sharara Set' },
      { detail: 'chikankari', fabric: 'Cotton', pattern: 'Chikankari', title: 'Chikankari Sharara Set' },
      { detail: 'sequin', fabric: 'Georgette', pattern: 'Sequinned', title: 'Sequin Georgette Sharara Set' },
      { detail: 'block print', fabric: 'Cotton', pattern: 'Block Print', title: 'Block-Print Sharara Set' },
    ],
  },
  'Gharara': {
    sub: 'Gharara Set', silhouette: 'Gathered Gharara', occasions: ['college-fest', 'diwali', 'festive-party'], band: [1199, 3999], tryOn: true,
    colours: ['Peach', 'Emerald', 'Wine', 'Black', 'Ivory', 'Mustard', 'Rani Pink', 'Teal', 'Maroon', 'Lilac'],
    variants: [
      { detail: 'gota patti', fabric: 'Georgette', pattern: 'Embroidered', title: 'Gota-Patti Gharara Set' },
      { detail: 'zari', fabric: 'Silk Blend', pattern: 'Zari Woven', title: 'Zari Silk-Blend Gharara Set' },
      { detail: 'gold', fabric: 'Georgette', pattern: 'Embroidered', title: 'Gold-Embroidered Gharara Set' },
      { detail: 'mirror work', fabric: 'Rayon', pattern: 'Embroidered', title: 'Mirror-Work Gharara Set' },
    ],
  },
  'Saree': {
    sub: 'Saree', silhouette: 'Classic Drape', occasions: ['college-fest', 'diwali', 'festive-party', 'traditional'], band: [599, 4499], tryOn: true,
    colours: ['Black', 'Wine', 'Royal Blue', 'Rani Pink', 'Mustard', 'Emerald', 'Red', 'Ivory', 'Gold', 'Maroon', 'Green', 'Peach', 'Lilac', 'Navy'],
    variants: [
      { detail: 'sequin border', fabric: 'Georgette', pattern: 'Sequinned', title: 'Sequin-Border Georgette Saree' },
      { detail: 'zari border', fabric: 'Silk Blend', pattern: 'Zari Woven', title: 'Zari-Border Silk-Blend Saree' },
      { detail: 'temple border', fabric: 'Silk', pattern: 'Woven', title: 'Temple-Border Silk Saree' },
      { detail: 'contrast border', fabric: 'Cotton', pattern: 'Woven', title: 'Contrast-Border Cotton Saree' },
      { detail: 'solid', fabric: 'Satin', pattern: 'Solid', title: 'Satin Party Saree' },
      { detail: 'bandhani', fabric: 'Georgette', pattern: 'Bandhani', title: 'Bandhani Georgette Saree' },
      { detail: 'gold border', fabric: 'Cotton', pattern: 'Woven', title: 'Gold-Border Handloom Saree' },
    ],
  },
  'Pre-Draped Saree': {
    sub: 'Ready-to-Wear Saree', silhouette: 'Pre-Draped', occasions: ['college-fest', 'diwali', 'festive-party'], band: [999, 3999], tryOn: true,
    colours: ['Black', 'Sage Green', 'Mustard', 'Peach', 'Silver', 'Wine', 'Emerald', 'Ivory', 'Rani Pink', 'Lilac', 'Navy'],
    variants: [
      { detail: 'solid with embroidered blouse', fabric: 'Crepe', pattern: 'Solid', title: 'Pre-Draped Crepe Saree with Embroidered Blouse' },
      { detail: 'sequin', fabric: 'Georgette', pattern: 'Sequinned', title: 'Sequin Pre-Draped Saree' },
      { detail: 'zari', fabric: 'Silk Blend', pattern: 'Zari Woven', title: 'Zari Pre-Draped Saree' },
      { detail: 'solid', fabric: 'Satin', pattern: 'Solid', title: 'Satin Pre-Draped Saree' },
    ],
  },
  'Anarkali': {
    sub: 'Anarkali Set', silhouette: 'Flared Anarkali', occasions: ['college-fest', 'diwali', 'festive-party', 'traditional'], band: [899, 3999], tryOn: true,
    colours: ['Mustard', 'Maroon', 'Rani Pink', 'Ivory', 'Emerald', 'Red', 'Black', 'Navy', 'Teal', 'Wine', 'Lilac', 'Peach'],
    variants: [
      { detail: 'block print', fabric: 'Cotton', pattern: 'Block Print', title: 'Block-Print Cotton Anarkali Set' },
      { detail: 'gota', fabric: 'Georgette', pattern: 'Embroidered', title: 'Gota-Trim Georgette Anarkali Set' },
      { detail: 'mirror yoke', fabric: 'Georgette', pattern: 'Embroidered', title: 'Mirror-Yoke Anarkali Set' },
      { detail: 'gold sequin', fabric: 'Georgette', pattern: 'Sequinned', title: 'Gold-Sequin Anarkali Set' },
      { detail: 'zari', fabric: 'Georgette', pattern: 'Zari', title: 'Zari Georgette Anarkali Set' },
    ],
  },
  'Kurta Sets': {
    sub: 'Festive Kurta Set', silhouette: 'Straight Kurta Set', occasions: ['college-fest', 'diwali', 'traditional'], band: [599, 2999], tryOn: true,
    colours: ['Powder Blue', 'Yellow', 'Rani Pink', 'Mustard', 'Wine', 'Emerald', 'Maroon', 'Indigo', 'Ivory', 'Sage Green', 'Peach', 'Teal', 'Black', 'Purple'],
    variants: [
      { detail: 'chikankari', fabric: 'Cotton', pattern: 'Chikankari', title: 'Chikankari Kurta Set with Dupatta' },
      { detail: 'block print', fabric: 'Cotton', pattern: 'Block Print', title: 'Block-Print Kurta Palazzo Set' },
      { detail: 'gota', fabric: 'Silk Blend', pattern: 'Embroidered', title: 'Gota Silk-Blend Kurta Set' },
      { detail: 'zari', fabric: 'Silk Blend', pattern: 'Zari', title: 'Zari Festive Kurta Set' },
      { detail: 'sequin', fabric: 'Silk Blend', pattern: 'Sequinned', title: 'Sequin Yoke Kurta Set' },
    ],
  },
  'Jewellery': {
    sub: 'Jewellery', silhouette: 'Accessory', occasions: ['garba', 'college-fest', 'diwali', 'festive-party', 'traditional'], band: [199, 1499], tryOn: false, accessory: true,
    colours: ['Oxidised Silver', 'Gold', 'Silver'],
    variants: [
      { detail: 'jhumka earrings', fabric: 'Alloy', pattern: 'Handcrafted', title: 'Jhumka Earrings' },
      { detail: 'choker necklace', fabric: 'Alloy', pattern: 'Handcrafted', title: 'Choker Necklace' },
      { detail: 'bangle stack', fabric: 'Alloy', pattern: 'Handcrafted', title: 'Bangle Stack (Set of 12)' },
      { detail: 'kamarbandh waist belt', fabric: 'Alloy', pattern: 'Mirror', title: 'Mirror Kamarbandh Waist Belt' },
      { detail: 'nose pin', fabric: 'Alloy', pattern: 'Handcrafted', title: 'Clip-On Nose Pin' },
      { detail: 'anklets', fabric: 'Alloy', pattern: 'Ghungroo', title: 'Ghungroo Anklets (Pair)' },
      { detail: 'maang tikka', fabric: 'Alloy', pattern: 'Handcrafted', title: 'Maang Tikka' },
      { detail: 'hathphool', fabric: 'Alloy', pattern: 'Handcrafted', title: 'Hathphool Hand Harness' },
      { detail: 'statement rings', fabric: 'Alloy', pattern: 'Handcrafted', title: 'Statement Ring Set' },
      { detail: 'hair accessory', fabric: 'Alloy', pattern: 'Handcrafted', title: 'Juda Pin Hair Accessory' },
    ],
  },
  'Bags': {
    sub: 'Bags', silhouette: 'Accessory', occasions: ['garba', 'college-fest', 'diwali', 'festive-party', 'traditional'], band: [299, 1499], tryOn: false, accessory: true,
    colours: ['Black', 'Gold', 'Multicolour', 'Ivory', 'Red', 'Silver'],
    variants: [
      { detail: 'mirror potli', fabric: 'Cotton', pattern: 'Mirror Work', title: 'Mirror-Work Potli Bag' },
      { detail: 'embroidered clutch', fabric: 'Silk Blend', pattern: 'Embroidered', title: 'Embroidered Festive Clutch' },
      { detail: 'kutchi sling', fabric: 'Cotton', pattern: 'Embroidered', title: 'Kutchi Embroidered Sling Bag' },
      { detail: 'box clutch', fabric: 'Brocade', pattern: 'Woven', title: 'Brocade Box Clutch' },
    ],
  },
  'Footwear': {
    sub: 'Footwear', silhouette: 'Accessory', occasions: ['garba', 'college-fest', 'diwali', 'festive-party', 'traditional'], band: [349, 1799], tryOn: false, accessory: true,
    colours: ['Gold', 'Silver', 'Black', 'Tan', 'Multicolour', 'Ivory'],
    variants: [
      { detail: 'embroidered juttis', fabric: 'Faux Leather', pattern: 'Embroidered', title: 'Embroidered Juttis' },
      { detail: 'kolhapuri flats', fabric: 'Faux Leather', pattern: 'Braided', title: 'Kolhapuri Flats' },
      { detail: 'block heels', fabric: 'Faux Leather', pattern: 'Embellished', title: 'Embellished Block Heels' },
      { detail: 'mirror mojaris', fabric: 'Faux Leather', pattern: 'Mirror', title: 'Mirror-Work Mojaris' },
    ],
  },
  'Beauty': {
    sub: 'Beauty', silhouette: 'Accessory', occasions: ['garba', 'college-fest', 'diwali', 'festive-party', 'traditional'], band: [199, 1299], tryOn: false, accessory: true,
    colours: ['Red', 'Nude', 'Berry', 'Gold', 'Black', 'Coral'],
    variants: [
      { detail: 'matte liquid lipstick', fabric: 'Cosmetic', pattern: 'Matte', title: 'Long-Wear Matte Liquid Lipstick' },
      { detail: 'kajal', fabric: 'Cosmetic', pattern: 'Smudge-proof', title: 'Smudge-Proof Kajal' },
      { detail: 'glitter bindi pack', fabric: 'Cosmetic', pattern: 'Glitter', title: 'Garba Glitter Bindi Pack' },
      { detail: 'setting spray', fabric: 'Cosmetic', pattern: 'Long-wear', title: 'All-Night Makeup Setting Spray' },
    ],
  },
};

export const MEN = {
  'Modern Kurta': {
    sub: 'Kurta', silhouette: 'Contemporary Straight / Short Kurta', occasions: ['garba', 'college-fest', 'diwali', 'festive-party', 'traditional'], band: [599, 2999], tryOn: true,
    colours: ['Black', 'White', 'Ivory', 'Cream', 'Navy', 'Olive', 'Maroon', 'Mustard', 'Beige', 'Mint', 'Wine', 'Indigo', 'Green', 'Purple', 'Brown', 'Peach', 'Powder Blue'],
    variants: [
      { detail: 'chikankari', fabric: 'Cotton', pattern: 'Chikankari', title: 'Chikankari Cotton Kurta', ref: 'REF-M1' },
      { detail: 'embroidered placket', fabric: 'Cotton', pattern: 'Embroidered', title: 'Short Kurta with Embroidered Placket', ref: 'REF-M2' },
      { detail: 'mirror sequin', fabric: 'Georgette', pattern: 'Sequinned', title: 'Mirror-Sequin Kurta', ref: 'REF-M1' },
      { detail: 'copper thread placket embroidery', fabric: 'Cotton Silk', pattern: 'Embroidered', title: 'Kurta with Thread-Embroidered Placket', ref: 'REF-C2' },
      { detail: 'mirror work', fabric: 'Cotton', pattern: 'Mirror Work', title: 'Selective Mirror-Work Kurta', ref: 'REF-M3' },
      { detail: 'embroidered yoke', fabric: 'Cotton', pattern: 'Embroidered', title: 'Embroidered-Yoke Kurta', ref: 'REF-M3' },
      { detail: 'pintuck', fabric: 'Cotton', pattern: 'Pintuck', title: 'Pintuck Cotton Kurta' },
      { detail: 'solid', fabric: 'Linen', pattern: 'Solid', title: 'Linen-Blend Mandarin Kurta' },
      { detail: 'sequin stripe', fabric: 'Cotton Silk', pattern: 'Sequinned', title: 'Sequin-Stripe Long Kurta', ref: 'REF-M2' },
      { detail: 'block print', fabric: 'Cotton', pattern: 'Block Print', title: 'Block-Print Cotton Kurta' },
    ],
  },
  'Festive Kurta Set': {
    sub: 'Kurta Set', silhouette: 'Kurta with Pyjama / Trouser', occasions: ['garba', 'diwali', 'festive-party', 'traditional'], band: [799, 3499], tryOn: true,
    colours: ['White', 'Ivory', 'Black', 'Cream', 'Maroon', 'Navy', 'Beige', 'Purple', 'Olive', 'Wine'],
    variants: [
      { detail: 'solid', fabric: 'Cotton', pattern: 'Solid', title: 'Cotton Kurta Pyjama Set' },
      { detail: 'tonal embroidery', fabric: 'Cotton Silk', pattern: 'Embroidered', title: 'Tonal-Embroidered Kurta Set' },
      { detail: 'self stripe', fabric: 'Cotton', pattern: 'Self Stripe', title: 'Self-Stripe Kurta Pyjama Set' },
      { detail: '3D floral embroidery', fabric: 'Cotton Silk', pattern: 'Embroidered', title: 'Kurta Set with 3D Floral Embroidery', ref: 'REF-M2' },
      { detail: 'embroidered kurta with white pyjama', fabric: 'Silk Blend', pattern: 'Embroidered', title: 'Embroidered Kurta with White Pyjama', ref: 'REF-M3' },
    ],
  },
  'Ethnic Shirt': {
    sub: 'Ethnic Shirt', silhouette: 'Relaxed Mandarin Shirt', occasions: ['garba', 'college-fest', 'diwali', 'festive-party'], band: [599, 2499], tryOn: true,
    colours: ['White', 'Ivory', 'Navy', 'Cream', 'Sage Green', 'Black', 'Beige', 'Olive', 'Teal', 'Maroon', 'Pink'],
    variants: [
      { detail: 'tonal embroidery', fabric: 'Cotton', pattern: 'Embroidered', title: 'Mandarin Ethnic Shirt with Tonal Embroidery' },
      { detail: 'small embroidered motifs', fabric: 'Cotton', pattern: 'Embroidered', title: 'Motif-Embroidered Short Kurta-Shirt', ref: 'REF-M3' },
      { detail: 'solid mandarin', fabric: 'Linen', pattern: 'Solid', title: 'Linen Mandarin Ethnic Shirt' },
      { detail: 'solid', fabric: 'Cotton', pattern: 'Solid', title: 'Relaxed Cotton Ethnic Shirt' },
    ],
  },
  'Printed Ethnic Shirt': {
    sub: 'Printed Shirt', silhouette: 'Relaxed Printed Shirt', occasions: ['garba', 'college-fest', 'diwali', 'festive-party'], band: [499, 1999], tryOn: true,
    colours: ['Navy', 'Olive', 'Teal', 'Black', 'White', 'Maroon', 'Mustard', 'Wine', 'Indigo', 'Rust'],
    variants: [
      { detail: 'floral print', fabric: 'Rayon', pattern: 'Floral Print', title: 'Floral Printed Ethnic Shirt' },
      { detail: 'paisley print', fabric: 'Rayon', pattern: 'Paisley Print', title: 'Paisley Printed Ethnic Shirt', ref: 'REF-M2' },
      { detail: 'block print', fabric: 'Rayon', pattern: 'Block Print', title: 'Block-Print Ethnic Shirt' },
      { detail: 'indigo block print', fabric: 'Cotton', pattern: 'Block Print', title: 'Indigo Block-Print Shirt' },
      { detail: 'botanical print', fabric: 'Rayon', pattern: 'Botanical Print', title: 'Botanical Printed Festive Shirt' },
      { detail: 'small motif', fabric: 'Rayon', pattern: 'Motif Print', title: 'Small-Motif Printed Shirt' },
      { detail: 'paisley', fabric: 'Rayon', pattern: 'Paisley Print', title: 'Paisley Statement Shirt' },
      { detail: 'bandhani print', fabric: 'Rayon', pattern: 'Bandhani Print', title: 'Bandhani-Print Festive Shirt' },
    ],
  },
  'Embroidered Ethnic Shirt': {
    sub: 'Embroidered Shirt', silhouette: 'Relaxed Embroidered Shirt', occasions: ['garba', 'diwali', 'festive-party', 'college-fest'], band: [799, 2999], tryOn: true,
    colours: ['Ivory', 'Black', 'White', 'Navy', 'Cream', 'Maroon', 'Olive', 'Beige'],
    variants: [
      { detail: 'tonal floral', fabric: 'Silk Blend', pattern: 'Embroidered', title: 'Silk-Blend Shirt with Tonal Floral Embroidery', ref: 'REF-M3' },
      { detail: 'rust hem embroidery', fabric: 'Cotton', pattern: 'Embroidered', title: 'Shirt with Embroidered Hem', ref: 'REF-M2' },
      { detail: 'sequin dots', fabric: 'Cotton', pattern: 'Sequinned', title: 'Sequin-Dot Festive Shirt', ref: 'REF-M3' },
      { detail: 'tonal', fabric: 'Silk Blend', pattern: 'Embroidered', title: 'Tonal-Embroidered Festive Shirt' },
      { detail: 'heart motif embroidery', fabric: 'Cotton', pattern: 'Embroidered', title: 'Small-Motif Embroidered Shirt', ref: 'REF-M3' },
    ],
  },
  'Festive Jacket': {
    sub: 'Jacket', silhouette: 'Nehru / Open Jacket', occasions: ['diwali', 'festive-party', 'traditional', 'college-fest'], band: [999, 3999], tryOn: true,
    colours: ['Beige', 'Navy', 'Black', 'Cream', 'Ivory', 'Maroon', 'Red', 'Olive', 'Wine'],
    variants: [
      { detail: 'solid nehru', fabric: 'Cotton Silk', pattern: 'Solid', title: 'Nehru Jacket', ref: 'REF-M1' },
      { detail: 'brocade', fabric: 'Brocade', pattern: 'Woven', title: 'Brocade Open Jacket', ref: 'REF-M1' },
      { detail: 'subtle embroidery', fabric: 'Silk Blend', pattern: 'Embroidered', title: 'Subtle-Embroidery Festive Jacket', ref: 'REF-M2' },
      { detail: 'solid', fabric: 'Velvet', pattern: 'Solid', title: 'Velvet Festive Jacket' },
    ],
  },
  'Traditional Layer': {
    sub: 'Stole / Dupatta / Shawl', silhouette: 'Draped Layer', occasions: ['garba', 'diwali', 'festive-party', 'traditional'], band: [399, 1999], tryOn: false,
    colours: ['Red', 'Ivory', 'Navy', 'Black', 'Pink', 'Wine', 'Maroon', 'Mustard'],
    variants: [
      { detail: 'phulkari embroidery', fabric: 'Cotton', pattern: 'Phulkari', title: 'Phulkari Embroidered Dupatta', ref: 'REF-C1' },
      { detail: 'paisley block print', fabric: 'Cotton', pattern: 'Block Print', title: 'Paisley Block-Print Stole', ref: 'REF-C2' },
      { detail: 'bandhani print', fabric: 'Cotton', pattern: 'Bandhani', title: 'Bandhani Dupatta', ref: 'REF-S2' },
      { detail: 'sequin scatter', fabric: 'Georgette', pattern: 'Sequinned', title: 'Sequin-Scatter Stole', ref: 'REF-M1' },
      { detail: 'gold paisley', fabric: 'Cotton', pattern: 'Embroidered', title: 'Gold Paisley Embroidered Shawl', ref: 'REF-M1' },
      { detail: 'solid', fabric: 'Cotton', pattern: 'Solid', title: 'Solid Cotton Dupatta' },
    ],
  },
  'Festive Separates': {
    sub: 'Bottomwear', silhouette: 'Relaxed Trouser', occasions: ['garba', 'college-fest', 'diwali', 'festive-party', 'traditional'], band: [499, 1799], tryOn: false,
    colours: ['Black', 'Ivory', 'White', 'Cream', 'Olive', 'Beige', 'Navy'],
    variants: [
      { detail: 'flared pleated trouser', fabric: 'Viscose', pattern: 'Solid', title: 'Pleated Relaxed Trousers', ref: 'REF-M1' },
      { detail: 'straight pyjama', fabric: 'Cotton', pattern: 'Solid', title: 'Straight Cotton Pyjama' },
      { detail: 'linen trouser', fabric: 'Linen', pattern: 'Solid', title: 'Linen-Blend Festive Trousers' },
    ],
  },
  'Footwear': {
    sub: 'Men Footwear', silhouette: 'Accessory', occasions: ['garba', 'college-fest', 'diwali', 'festive-party', 'traditional'], band: [399, 1999], tryOn: false, accessory: true,
    colours: ['Tan', 'Black', 'Ivory', 'Gold', 'Brown'],
    variants: [
      { detail: 'embroidered mojaris', fabric: 'Faux Leather', pattern: 'Embroidered', title: 'Embroidered Mojaris' },
      { detail: 'kolhapuri sandals', fabric: 'Faux Leather', pattern: 'Braided', title: 'Kolhapuri Sandals' },
      { detail: 'loafers', fabric: 'Faux Leather', pattern: 'Solid', title: 'Ethnic Loafers' },
    ],
  },
};

export const MERCHANTS = ['MYNTRA', 'AJIO', 'FLIPKART', 'SHOPSY', 'MEESHO', 'NYKAA'];

// VIRAAS MEN — permanent 210-look reference outfit catalog (FINAL LOCK).
//
// Source of truth: the user-supplied "MEN 210 NEW REFERENCE OUTFIT PROMPT PACK".
// 10 reference sheets × 21 panels = 210 looks, read left→right, top→bottom.
// Occasion allocation (fixed): 001–042 Garba/Navratri, 043–084 College Fest,
// 085–126 Diwali, 127–168 Festive Party, 169–210 Traditional.
//
// The old Men 336 product catalog is completely ignored. Regenerate with:
//   node scripts/build-men-look-catalog.mjs
// Do not hand-edit; edit scripts/build-men-look-catalog.mjs instead.

export const MEN_LOOK_CATALOG = [
  {
    "id": "men-look-001",
    "referenceId": "#001",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_1_21",
    "panel": 1,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_1_21 — IMAGE 01",
    "outfitDescription": "An off-white/ivory long kurta with dense small white embroidered motifs and a softly open neckline, paired with a long navy-blue stole/scarf scattered with tiny light dot motifs; the stole hangs evenly down both sides of the chest. A silver-toned chain is visible at the open neckline",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Off-White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": null,
    "footwear": null,
    "accessories": "Chain",
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nAn off-white/ivory long kurta with dense small white embroidered motifs and a softly open neckline, paired with a long navy-blue stole/scarf scattered with tiny light dot motifs; the stole hangs evenly down both sides of the chest. A silver-toned chain is visible at the open neckline.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_1_21 · panel 1",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-002",
    "referenceId": "#002",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_1_21",
    "panel": 2,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_1_21 — IMAGE 02",
    "outfitDescription": "A black straight kurta with a subtle dark textured/embroidered surface, styled with a long red-and-black patterned stole featuring repeating traditional geometric/ornamental motifs and a contrasting border; the stole is draped around the neck and falls down the front",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Geometric",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": null,
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black straight kurta with a subtle dark textured/embroidered surface, styled with a long red-and-black patterned stole featuring repeating traditional geometric/ornamental motifs and a contrasting border; the stole is draped around the neck and falls down the front.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_1_21 · panel 2",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-003",
    "referenceId": "#003",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_1_21",
    "panel": 3,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_1_21 — IMAGE 03",
    "outfitDescription": "A black kurta with a clean straight silhouette, paired with loose white pajama trousers and a long red printed traditional stole with dense geometric/paisley-like motifs and border work; brown casual sandals are visible",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White pyjama trousers",
    "footwear": "Brown sandals",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black kurta with a clean straight silhouette, paired with loose white pajama trousers and a long red printed traditional stole with dense geometric/paisley-like motifs and border work; brown casual sandals are visible.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_1_21 · panel 3",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-004",
    "referenceId": "#004",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_1_21",
    "panel": 4,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_1_21 — IMAGE 04",
    "outfitDescription": "A plain white long kurta-pajama look viewed partly from the back, with a prominent multicolour embroidered/printed geometric patch running across the upper back/shoulder area; the kurta has a simple straight silhouette and the styling is minimal",
    "garmentType": "Kurta-Pajama Set",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White pyjama trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA plain white long kurta-pajama look viewed partly from the back, with a prominent multicolour embroidered/printed geometric patch running across the upper back/shoulder area; the kurta has a simple straight silhouette and the styling is minimal.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_1_21 · panel 4",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-005",
    "referenceId": "#005",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_1_21",
    "panel": 5,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_1_21 — IMAGE 05",
    "outfitDescription": "A white long kurta with a band/stand collar and button placket, paired with a long multicolour traditional printed stole containing red, green, black and cream ornamental panels; the stole hangs symmetrically down the front",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": null,
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white long kurta with a band/stand collar and button placket, paired with a long multicolour traditional printed stole containing red, green, black and cream ornamental panels; the stole hangs symmetrically down the front.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_1_21 · panel 5",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-006",
    "referenceId": "#006",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_1_21",
    "panel": 6,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_1_21 — IMAGE 06",
    "outfitDescription": "A black long kurta with white pajama trousers, layered with a long multicolour patterned stole featuring dense folk/ethnic motifs in red, green, orange and cream; the stole falls over both sides of the torso",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White pyjama trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black long kurta with white pajama trousers, layered with a long multicolour patterned stole featuring dense folk/ethnic motifs in red, green, orange and cream; the stole falls over both sides of the torso.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_1_21 · panel 6",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-007",
    "referenceId": "#007",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_1_21",
    "panel": 7,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_1_21 — IMAGE 07",
    "outfitDescription": "A black kurta with subtle tonal detailing and loose white pajama trousers, finished with a long multicolour folk-print stole containing colourful rectangular motifs; the styling is youthful and festive",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White pyjama trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black kurta with subtle tonal detailing and loose white pajama trousers, finished with a long multicolour folk-print stole containing colourful rectangular motifs; the styling is youthful and festive.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_1_21 · panel 7",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-008",
    "referenceId": "#008",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_1_21",
    "panel": 8,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_1_21 — IMAGE 08",
    "outfitDescription": "A black long kurta and black trousers styled with a long ornate black-and-gold printed/embroidered stole or sleeveless layer; the decorative piece has repeated gold floral and traditional motifs and creates a rich monochrome festive look",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "Black trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black long kurta and black trousers styled with a long ornate black-and-gold printed/embroidered stole or sleeveless layer; the decorative piece has repeated gold floral and traditional motifs and creates a rich monochrome festive look.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_1_21 · panel 8",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-009",
    "referenceId": "#009",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_1_21",
    "panel": 9,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_1_21 — IMAGE 09",
    "outfitDescription": "A black kurta with white pajama trousers, layered with a long black-and-gold patterned stole featuring dense ornamental motifs and a decorative border; black footwear completes the traditional look",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White pyjama trousers",
    "footwear": "Black footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black kurta with white pajama trousers, layered with a long black-and-gold patterned stole featuring dense ornamental motifs and a decorative border; black footwear completes the traditional look.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_1_21 · panel 9",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-010",
    "referenceId": "#010",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_1_21",
    "panel": 10,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_1_21 — IMAGE 10",
    "outfitDescription": "A charcoal/black long kurta with a subtle textured surface, paired with white pajama trousers and a cream-and-black patterned stole with a broad decorative border; the stole is worn around the neck and hangs vertically",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Charcoal",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White pyjama trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA charcoal/black long kurta with a subtle textured surface, paired with white pajama trousers and a cream-and-black patterned stole with a broad decorative border; the stole is worn around the neck and hangs vertically.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_1_21 · panel 10",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-011",
    "referenceId": "#011",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_1_21",
    "panel": 11,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_1_21 — IMAGE 11",
    "outfitDescription": "A deep maroon long kurta with a simple straight cut, paired with loose cream/off-white dhoti-style pajama trousers; a long metallic/gold-toned necklace is visible at the neckline and brown sandals complete the look",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Maroon",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White dhoti-style pyjama",
    "footwear": "Brown sandals",
    "accessories": "Necklace",
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA deep maroon long kurta with a simple straight cut, paired with loose cream/off-white dhoti-style pajama trousers; a long metallic/gold-toned necklace is visible at the neckline and brown sandals complete the look.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_1_21 · panel 11",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-012",
    "referenceId": "#012",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_1_21",
    "panel": 12,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_1_21 — IMAGE 12",
    "outfitDescription": "An off-white/cream kurta-pajama set with bold red embroidery concentrated around the collar, chest placket, sleeve cuffs and lower details; the kurta has a straight traditional silhouette and the trousers are matching off-white",
    "garmentType": "Kurta-Pajama Set",
    "colors": {
      "primary": "Off-White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "Cream pyjama trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nAn off-white/cream kurta-pajama set with bold red embroidery concentrated around the collar, chest placket, sleeve cuffs and lower details; the kurta has a straight traditional silhouette and the trousers are matching off-white.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_1_21 · panel 12",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-013",
    "referenceId": "#013",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_1_21",
    "panel": 13,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_1_21 — IMAGE 13",
    "outfitDescription": "A dark navy/black kurta with a long colourful floral/folk-print stole featuring red, green, orange and cream motifs; the stole is draped loosely around the neck and contrasts strongly with the dark base",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Navy",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": null,
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA dark navy/black kurta with a long colourful floral/folk-print stole featuring red, green, orange and cream motifs; the stole is draped loosely around the neck and contrasts strongly with the dark base.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_1_21 · panel 13",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-014",
    "referenceId": "#014",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_1_21",
    "panel": 14,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_1_21 — IMAGE 14",
    "outfitDescription": "A black kurta with a long red-and-black traditional printed stole, paired with white pajama trousers; the stole carries dense red ornamental motifs and borders and is worn loosely down the front",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White pyjama trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black kurta with a long red-and-black traditional printed stole, paired with white pajama trousers; the stole carries dense red ornamental motifs and borders and is worn loosely down the front.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_1_21 · panel 14",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-015",
    "referenceId": "#015",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_1_21",
    "panel": 15,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_1_21 — IMAGE 15",
    "outfitDescription": "A black long kurta/ethnic coat ensemble with dense cream and gold floral embroidery across the front and sleeves, paired with black trousers; the outer layer has a long flowing silhouette and rich ornamental detailing",
    "garmentType": "Ethnic Jacket / Layered Set",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Floral",
      "embroidery": "Embroidered"
    },
    "layering": "Jacket / outer layer",
    "bottomwear": "Black trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black long kurta/ethnic coat ensemble with dense cream and gold floral embroidery across the front and sleeves, paired with black trousers; the outer layer has a long flowing silhouette and rich ornamental detailing.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_1_21 · panel 15",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-016",
    "referenceId": "#016",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_1_21",
    "panel": 16,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_1_21 — IMAGE 16",
    "outfitDescription": "A deep royal-blue/navy long kurta with an ornate matching embroidered long jacket/stole layer in blue and metallic detailing, paired with wide white pajama trousers and brown traditional sandals",
    "garmentType": "Ethnic Jacket / Layered Set",
    "colors": {
      "primary": "Royal-Blue",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Jacket / outer layer + Stole / scarf",
    "bottomwear": "White pyjama trousers",
    "footwear": "White sandals",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA deep royal-blue/navy long kurta with an ornate matching embroidered long jacket/stole layer in blue and metallic detailing, paired with wide white pajama trousers and brown traditional sandals.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_1_21 · panel 16",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-017",
    "referenceId": "#017",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_1_21",
    "panel": 17,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_1_21 — IMAGE 17",
    "outfitDescription": "A black long kurta with a subtle embroidered/textured surface, paired with very loose white pajama trousers and a dark patterned scarf/stole draped around the upper body; the styling is relaxed and traditional",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White pyjama trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black long kurta with a subtle embroidered/textured surface, paired with very loose white pajama trousers and a dark patterned scarf/stole draped around the upper body; the styling is relaxed and traditional.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_1_21 · panel 17",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-018",
    "referenceId": "#018",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_1_21",
    "panel": 18,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_1_21 — IMAGE 18",
    "outfitDescription": "A cream/beige embroidered long kurta with a softly textured surface, paired with white trousers and a light cream/off-white long stole; the look is monochrome, refined and festive with simple sandals",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": "Footwear visible",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/beige embroidered long kurta with a softly textured surface, paired with white trousers and a light cream/off-white long stole; the look is monochrome, refined and festive with simple sandals.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_1_21 · panel 18",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-019",
    "referenceId": "#019",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_1_21",
    "panel": 19,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_1_21 — IMAGE 19",
    "outfitDescription": "A dusty rose/pink long kurta with dense traditional embroidery and small mirror/sequin-like embellishments, featuring a stand collar and decorative chest panels; white trousers are visible beneath",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Rose",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Sequinned",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA dusty rose/pink long kurta with dense traditional embroidery and small mirror/sequin-like embellishments, featuring a stand collar and decorative chest panels; white trousers are visible beneath.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_1_21 · panel 19",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-020",
    "referenceId": "#020",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_1_21",
    "panel": 20,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_1_21 — IMAGE 20",
    "outfitDescription": "A deep navy-blue long kurta with ornate gold embroidery concentrated around the lower front and neckline, paired with loose white pajama trousers and dark footwear; the overall silhouette is long and traditional",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Navy",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White pyjama trousers",
    "footwear": "White footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA deep navy-blue long kurta with ornate gold embroidery concentrated around the lower front and neckline, paired with loose white pajama trousers and dark footwear; the overall silhouette is long and traditional.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_1_21 · panel 20",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-021",
    "referenceId": "#021",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_1_21",
    "panel": 21,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_1_21 — IMAGE 21",
    "outfitDescription": "A deep navy/black long kurta with ornate gold embroidery concentrated around the neckline and lower front, paired with loose white pajama trousers and black traditional footwear; the overall look is rich but youthful",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Navy",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White pyjama trousers",
    "footwear": "White footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA deep navy/black long kurta with ornate gold embroidery concentrated around the neckline and lower front, paired with loose white pajama trousers and black traditional footwear; the overall look is rich but youthful.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_1_21 · panel 21",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-022",
    "referenceId": "#022",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_2_21",
    "panel": 1,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_2_21 — IMAGE 01",
    "outfitDescription": "A black kurta with a long olive/black textured stole and loose white pajama trousers; the stole is decorated with subtle woven motifs and is worn over both shoulders, with dark footwear",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White pyjama trousers",
    "footwear": "Dark footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black kurta with a long olive/black textured stole and loose white pajama trousers; the stole is decorated with subtle woven motifs and is worn over both shoulders, with dark footwear.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_2_21 · panel 1",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-023",
    "referenceId": "#023",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_2_21",
    "panel": 2,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_2_21 — IMAGE 02",
    "outfitDescription": "A deep wine/maroon kurta with a soft straight fit and a long cream/off-white textured stole draped around the neck; loose light trousers complete the relaxed festive look",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Wine",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "Red trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA deep wine/maroon kurta with a soft straight fit and a long cream/off-white textured stole draped around the neck; loose light trousers complete the relaxed festive look.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_2_21 · panel 2",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-024",
    "referenceId": "#024",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_2_21",
    "panel": 3,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_2_21 — IMAGE 03",
    "outfitDescription": "A white kurta-pajama outfit with a long mustard-gold and brown patterned stole, featuring dense paisley/folk motifs and a dark border; the stole hangs down both sides",
    "garmentType": "Kurta-Pajama Set",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Paisley",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White pyjama trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white kurta-pajama outfit with a long mustard-gold and brown patterned stole, featuring dense paisley/folk motifs and a dark border; the stole hangs down both sides.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_2_21 · panel 3",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-025",
    "referenceId": "#025",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_2_21",
    "panel": 4,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_2_21 — IMAGE 04",
    "outfitDescription": "A vivid red short-sleeve printed shirt with dense multicolour folk embroidery/patchwork motifs, decorative vertical panels and contrasting dark sleeves; it is paired with blue denim jeans",
    "garmentType": "Ethnic Shirt",
    "colors": {
      "primary": "Red",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "Blue denim / jeans",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA vivid red short-sleeve printed shirt with dense multicolour folk embroidery/patchwork motifs, decorative vertical panels and contrasting dark sleeves; it is paired with blue denim jeans.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_2_21 · panel 4",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-026",
    "referenceId": "#026",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_2_21",
    "panel": 5,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_2_21 — IMAGE 05",
    "outfitDescription": "A cream/white textured kurta with a relaxed collar and loose white trousers, styled with a long grey/cream striped or patterned stole; the model is seated and the silhouette is relaxed",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/white textured kurta with a relaxed collar and loose white trousers, styled with a long grey/cream striped or patterned stole; the model is seated and the silhouette is relaxed.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_2_21 · panel 5",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-027",
    "referenceId": "#027",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_2_21",
    "panel": 6,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_2_21 — IMAGE 06",
    "outfitDescription": "A beige/olive textured kurta with a cream scarf/stole and light neutral trousers, creating a layered traditional look with muted earthy tones",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Beige",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "Cream trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA beige/olive textured kurta with a cream scarf/stole and light neutral trousers, creating a layered traditional look with muted earthy tones.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_2_21 · panel 6",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-028",
    "referenceId": "#028",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_2_21",
    "panel": 7,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_2_21 — IMAGE 07",
    "outfitDescription": "A cream/white long kurta-pajama set with a long green-and-gold patterned stole featuring intricate traditional motifs and borders; the stole is worn over the shoulders",
    "garmentType": "Kurta-Pajama Set",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White pyjama trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/white long kurta-pajama set with a long green-and-gold patterned stole featuring intricate traditional motifs and borders; the stole is worn over the shoulders.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_2_21 · panel 7",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-029",
    "referenceId": "#029",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_2_21",
    "panel": 8,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_2_21 — IMAGE 08",
    "outfitDescription": "A light blue/white kurta with a long blue-and-gold printed stole, paired with white trousers; the stole features repeated traditional motifs and a contrasting border",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Blue",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA light blue/white kurta with a long blue-and-gold printed stole, paired with white trousers; the stole features repeated traditional motifs and a contrasting border.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_2_21 · panel 8",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-030",
    "referenceId": "#030",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_2_21",
    "panel": 9,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_2_21 — IMAGE 09",
    "outfitDescription": "A mint/seafoam green printed kurta with small embroidered floral motifs, paired with a richly multicolour patterned lower wrap/stole visible at the waist; the garment has a relaxed open neckline",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Mint",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": null,
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA mint/seafoam green printed kurta with small embroidered floral motifs, paired with a richly multicolour patterned lower wrap/stole visible at the waist; the garment has a relaxed open neckline.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_2_21 · panel 9",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-031",
    "referenceId": "#031",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_2_21",
    "panel": 10,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_2_21 — IMAGE 10",
    "outfitDescription": "A black long kurta with a long brown/gold patterned stole and loose dark trousers; the stole carries dense traditional motifs and gives the otherwise dark outfit a festive accent",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "Gold trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black long kurta with a long brown/gold patterned stole and loose dark trousers; the stole carries dense traditional motifs and gives the otherwise dark outfit a festive accent.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_2_21 · panel 10",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-032",
    "referenceId": "#032",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_2_21",
    "panel": 11,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_2_21 — IMAGE 11",
    "outfitDescription": "A cream/pink embroidered long kurta with white pajama trousers and a long dusty-pink patterned stole; the stole has small ornamental motifs and a light border",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White pyjama trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/pink embroidered long kurta with white pajama trousers and a long dusty-pink patterned stole; the stole has small ornamental motifs and a light border.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_2_21 · panel 11",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-033",
    "referenceId": "#033",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_2_21",
    "panel": 12,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_2_21 — IMAGE 12",
    "outfitDescription": "A light pink long kurta with subtle all-over texture/embroidery, paired with loose white trousers; the outfit is styled simply without a heavy outer layer",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Pink",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "Embroidered"
    },
    "layering": "Jacket / outer layer",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA light pink long kurta with subtle all-over texture/embroidery, paired with loose white trousers; the outfit is styled simply without a heavy outer layer.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_2_21 · panel 12",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-034",
    "referenceId": "#034",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_2_21",
    "panel": 13,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_2_21 — IMAGE 13",
    "outfitDescription": "A cream/white kurta-pajama set with a long blue-and-cream patterned stole draped around the neck; the stole has dense traditional motifs and a decorative border",
    "garmentType": "Kurta-Pajama Set",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White pyjama trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/white kurta-pajama set with a long blue-and-cream patterned stole draped around the neck; the stole has dense traditional motifs and a decorative border.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_2_21 · panel 13",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-035",
    "referenceId": "#035",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_2_21",
    "panel": 14,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_2_21 — IMAGE 14",
    "outfitDescription": "A black kurta with a long maroon/red printed stole, paired with loose black trousers; the stole is richly patterned and creates a dark festive layered look",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "Black trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black kurta with a long maroon/red printed stole, paired with loose black trousers; the stole is richly patterned and creates a dark festive layered look.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_2_21 · panel 14",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-036",
    "referenceId": "#036",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_2_21",
    "panel": 15,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_2_21 — IMAGE 15",
    "outfitDescription": "A light pink kurta with a long pale pink textured/printed stole and white trousers; the styling is soft, youthful and festive with the stole falling vertically",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Pink",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA light pink kurta with a long pale pink textured/printed stole and white trousers; the styling is soft, youthful and festive with the stole falling vertically.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_2_21 · panel 15",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-037",
    "referenceId": "#037",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_2_21",
    "panel": 16,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_2_21 — IMAGE 16",
    "outfitDescription": "A cream/off-white kurta with a long multicolour traditional stole, paired with dark/black trousers; the stole features dense red, blue and gold motifs and is worn over the shoulders",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "Black trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/off-white kurta with a long multicolour traditional stole, paired with dark/black trousers; the stole features dense red, blue and gold motifs and is worn over the shoulders.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_2_21 · panel 16",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-038",
    "referenceId": "#038",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_2_21",
    "panel": 17,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_2_21 — IMAGE 17",
    "outfitDescription": "An off-white/cream long kurta with a subtle embroidered surface and white pajama trousers, styled with a long black scarf/stole carrying light ornamental detailing",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Off-White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White pyjama trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nAn off-white/cream long kurta with a subtle embroidered surface and white pajama trousers, styled with a long black scarf/stole carrying light ornamental detailing.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_2_21 · panel 17",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-039",
    "referenceId": "#039",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_2_21",
    "panel": 18,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_2_21 — IMAGE 18",
    "outfitDescription": "A white kurta-pajama look with a long black-and-cream patterned stole, paired with brown traditional footwear; the stole is narrow and hangs down the front",
    "garmentType": "Kurta-Pajama Set",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White pyjama trousers",
    "footwear": "Brown footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white kurta-pajama look with a long black-and-cream patterned stole, paired with brown traditional footwear; the stole is narrow and hangs down the front.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_2_21 · panel 18",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-040",
    "referenceId": "#040",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_2_21",
    "panel": 19,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_2_21 — IMAGE 19",
    "outfitDescription": "A maroon/red kurta with a black sleeveless/outer layer and light blue relaxed trousers; the maroon kurta has a simple neckline and the outer layer adds a contemporary festive contrast",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Maroon",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Jacket / outer layer",
    "bottomwear": "Blue trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA maroon/red kurta with a black sleeveless/outer layer and light blue relaxed trousers; the maroon kurta has a simple neckline and the outer layer adds a contemporary festive contrast.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_2_21 · panel 19",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-041",
    "referenceId": "#041",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_2_21",
    "panel": 20,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_2_21 — IMAGE 20",
    "outfitDescription": "A white/cream long kurta with a deep red traditional printed stole, paired with loose blue jeans and white casual sneakers; the look mixes ethnic layering with youthful casual styling",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "Blue denim / jeans",
    "footwear": "White sneakers",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white/cream long kurta with a deep red traditional printed stole, paired with loose blue jeans and white casual sneakers; the look mixes ethnic layering with youthful casual styling.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_2_21 · panel 20",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-042",
    "referenceId": "#042",
    "occasion": "garba",
    "occasionLabel": "Garba / Navratri",
    "sheet": "garba_navratri_42_sheet_2_21",
    "panel": 21,
    "sheetPanelLabel": "GARBA_NAVRATRI_42_SHEET_2_21 — IMAGE 21",
    "outfitDescription": "A white kurta with a maroon-red patterned stole and relaxed blue denim, finished with light casual footwear; the stole is long and densely printed with traditional motifs",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "Blue denim / jeans",
    "footwear": "Light footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white kurta with a maroon-red patterned stole and relaxed blue denim, finished with light casual footwear; the stole is long and densely printed with traditional motifs.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · garba_navratri_42_sheet_2_21 · panel 21",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-043",
    "referenceId": "#043",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_1_21",
    "panel": 1,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_1_21 — IMAGE 01",
    "outfitDescription": "A white/off-white embroidered kurta with a long light grey-blue patterned stole, paired with loose white trousers and brown loafers; the kurta has a straight traditional silhouette",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": "White loafers",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white/off-white embroidered kurta with a long light grey-blue patterned stole, paired with loose white trousers and brown loafers; the kurta has a straight traditional silhouette.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_1_21 · panel 1",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-044",
    "referenceId": "#044",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_1_21",
    "panel": 2,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_1_21 — IMAGE 02",
    "outfitDescription": "A light cream kurta with a dramatic blue-to-teal gradient/printed lower half and white pajama trousers; the long top features tonal ornamental patterning through the gradient",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White pyjama trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA light cream kurta with a dramatic blue-to-teal gradient/printed lower half and white pajama trousers; the long top features tonal ornamental patterning through the gradient.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_1_21 · panel 2",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-045",
    "referenceId": "#045",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_1_21",
    "panel": 3,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_1_21 — IMAGE 03",
    "outfitDescription": "A black long kurta with subtle embroidery and black relaxed trousers, styled with a small dark printed scarf/neck detail; the look is minimal and contemporary",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "Black trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black long kurta with subtle embroidery and black relaxed trousers, styled with a small dark printed scarf/neck detail; the look is minimal and contemporary.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_1_21 · panel 3",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-046",
    "referenceId": "#046",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_1_21",
    "panel": 4,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_1_21 — IMAGE 04",
    "outfitDescription": "A charcoal-black kurta with a deep open neckline, layered with a broad black-and-gold patterned stole and loose white trousers; the stole carries dense traditional motifs",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Charcoal",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA charcoal-black kurta with a deep open neckline, layered with a broad black-and-gold patterned stole and loose white trousers; the stole carries dense traditional motifs.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_1_21 · panel 4",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-047",
    "referenceId": "#047",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_1_21",
    "panel": 5,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_1_21 — IMAGE 05",
    "outfitDescription": "A pale cream kurta with a light textured/embroidered surface and white pajama trousers, styled with a simple open neckline and minimal accessories",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White pyjama trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA pale cream kurta with a light textured/embroidered surface and white pajama trousers, styled with a simple open neckline and minimal accessories.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_1_21 · panel 5",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-048",
    "referenceId": "#048",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_1_21",
    "panel": 6,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_1_21 — IMAGE 06",
    "outfitDescription": "A light beige/taupe coordinated kurta and trousers set with a narrow decorative neckline and tailored straight silhouette; brown footwear is visible",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Beige",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "Taupe trousers",
    "footwear": "Brown footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA light beige/taupe coordinated kurta and trousers set with a narrow decorative neckline and tailored straight silhouette; brown footwear is visible.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_1_21 · panel 6",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-049",
    "referenceId": "#049",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_1_21",
    "panel": 7,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_1_21 — IMAGE 07",
    "outfitDescription": "A white/cream long-sleeve shirt-style kurta with a heavily embroidered floral hem in muted red, green and grey, paired with dark trousers",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Floral",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "Red trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white/cream long-sleeve shirt-style kurta with a heavily embroidered floral hem in muted red, green and grey, paired with dark trousers.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_1_21 · panel 7",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-050",
    "referenceId": "#050",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_1_21",
    "panel": 8,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_1_21 — IMAGE 08",
    "outfitDescription": "A white kurta with a long multicolour floral/folk-print stole, paired with relaxed blue jeans and white sneakers; the stole adds a strong festive accent",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "Blue denim / jeans",
    "footwear": "White sneakers",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white kurta with a long multicolour floral/folk-print stole, paired with relaxed blue jeans and white sneakers; the stole adds a strong festive accent.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_1_21 · panel 8",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-051",
    "referenceId": "#051",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_1_21",
    "panel": 9,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_1_21 — IMAGE 09",
    "outfitDescription": "A pale beige/cream embroidered kurta with white trousers and a long deep maroon printed stole, worn casually over one shoulder",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Beige",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA pale beige/cream embroidered kurta with white trousers and a long deep maroon printed stole, worn casually over one shoulder.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_1_21 · panel 9",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-052",
    "referenceId": "#052",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_1_21",
    "panel": 10,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_1_21 — IMAGE 10",
    "outfitDescription": "A soft white kurta with a delicate embroidered/printed surface and white pajama trousers, styled with brown traditional footwear and a clean minimal silhouette",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White pyjama trousers",
    "footwear": "Brown footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA soft white kurta with a delicate embroidered/printed surface and white pajama trousers, styled with brown traditional footwear and a clean minimal silhouette.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_1_21 · panel 10",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-053",
    "referenceId": "#053",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_1_21",
    "panel": 11,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_1_21 — IMAGE 11",
    "outfitDescription": "A cream/white long kurta with an ornate light grey/white embroidered front, paired with white pajama trousers; the look is monochrome and refined",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White pyjama trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/white long kurta with an ornate light grey/white embroidered front, paired with white pajama trousers; the look is monochrome and refined.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_1_21 · panel 11",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-054",
    "referenceId": "#054",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_1_21",
    "panel": 12,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_1_21 — IMAGE 12",
    "outfitDescription": "A cream long kurta with a light embroidered texture and white trousers, paired with a subtle long stole/scarf; the styling is minimal and elegant",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream long kurta with a light embroidered texture and white trousers, paired with a subtle long stole/scarf; the styling is minimal and elegant.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_1_21 · panel 12",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-055",
    "referenceId": "#055",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_1_21",
    "panel": 13,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_1_21 — IMAGE 13",
    "outfitDescription": "A white/cream kurta with dense floral embroidery around the hem and lower sleeves, paired with dark charcoal trousers; the neckline is simple and open",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Floral",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "Charcoal trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white/cream kurta with dense floral embroidery around the hem and lower sleeves, paired with dark charcoal trousers; the neckline is simple and open.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_1_21 · panel 13",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-056",
    "referenceId": "#056",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_1_21",
    "panel": 14,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_1_21 — IMAGE 14",
    "outfitDescription": "A white/cream kurta with small delicate motifs and a floral embroidered hem, paired with olive/grey trousers; the outfit is relaxed and contemporary",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Floral",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "Grey trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white/cream kurta with small delicate motifs and a floral embroidered hem, paired with olive/grey trousers; the outfit is relaxed and contemporary.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_1_21 · panel 14",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-057",
    "referenceId": "#057",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_1_21",
    "panel": 15,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_1_21 — IMAGE 15",
    "outfitDescription": "A white kurta with tiny floral motifs and heavily patterned cuffs/hem in muted beige and grey, paired with olive-grey trousers; the neckline has a simple V/placket",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Floral",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "Grey trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white kurta with tiny floral motifs and heavily patterned cuffs/hem in muted beige and grey, paired with olive-grey trousers; the neckline has a simple V/placket.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_1_21 · panel 15",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-058",
    "referenceId": "#058",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_1_21",
    "panel": 16,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_1_21 — IMAGE 16",
    "outfitDescription": "A cream/yellow-toned long kurta with a textured embroidered surface and white pajama trousers, featuring a subtle decorative border around the hem",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White pyjama trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/yellow-toned long kurta with a textured embroidered surface and white pajama trousers, featuring a subtle decorative border around the hem.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_1_21 · panel 16",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-059",
    "referenceId": "#059",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_1_21",
    "panel": 17,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_1_21 — IMAGE 17",
    "outfitDescription": "A blue/grey textured long kurta with a small repeating geometric pattern and white pajama trousers, styled with dark casual shoes",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Blue",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Geometric",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White pyjama trousers",
    "footwear": "Dark shoes",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA blue/grey textured long kurta with a small repeating geometric pattern and white pajama trousers, styled with dark casual shoes.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_1_21 · panel 17",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-060",
    "referenceId": "#060",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_1_21",
    "panel": 18,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_1_21 — IMAGE 18",
    "outfitDescription": "A soft pink long kurta with delicate white patterning and white trousers, photographed in warm festive light; the silhouette is straight and youthful",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Pink",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA soft pink long kurta with delicate white patterning and white trousers, photographed in warm festive light; the silhouette is straight and youthful.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_1_21 · panel 18",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-061",
    "referenceId": "#061",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_1_21",
    "panel": 19,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_1_21 — IMAGE 19",
    "outfitDescription": "A maroon/burgundy long kurta with subtle tonal embroidery and loose white trousers, styled with dark traditional shoes",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Maroon",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": "Dark shoes",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA maroon/burgundy long kurta with subtle tonal embroidery and loose white trousers, styled with dark traditional shoes.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_1_21 · panel 19",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-062",
    "referenceId": "#062",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_1_21",
    "panel": 20,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_1_21 — IMAGE 20",
    "outfitDescription": "A cream/off-white long kurta with a richly embroidered lower border and white pajama trousers, giving a refined festive look",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White pyjama trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/off-white long kurta with a richly embroidered lower border and white pajama trousers, giving a refined festive look.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_1_21 · panel 20",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-063",
    "referenceId": "#063",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_1_21",
    "panel": 21,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_1_21 — IMAGE 21",
    "outfitDescription": "A warm beige/gold long kurta with subtle all-over woven texture and matching neutral trousers, styled as a monochrome traditional set",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Beige",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "Gold trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA warm beige/gold long kurta with subtle all-over woven texture and matching neutral trousers, styled as a monochrome traditional set.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_1_21 · panel 21",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-064",
    "referenceId": "#064",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_2_21",
    "panel": 1,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_2_21 — IMAGE 01",
    "outfitDescription": "A white/off-white embroidered kurta with a delicate repeating motif, paired with loose white trousers and brown traditional loafers; the look is clean and understated",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": "White loafers",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white/off-white embroidered kurta with a delicate repeating motif, paired with loose white trousers and brown traditional loafers; the look is clean and understated.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_2_21 · panel 1",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-065",
    "referenceId": "#065",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_2_21",
    "panel": 2,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_2_21 — IMAGE 02",
    "outfitDescription": "A deep red/maroon printed kurta with dense white floral/folk motifs, paired with white pajama trousers; the neckline is open with a short placket",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Red",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White pyjama trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA deep red/maroon printed kurta with dense white floral/folk motifs, paired with white pajama trousers; the neckline is open with a short placket.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_2_21 · panel 2",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-066",
    "referenceId": "#066",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_2_21",
    "panel": 3,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_2_21 — IMAGE 03",
    "outfitDescription": "A navy-blue long kurta with an all-over diamond/check pattern, paired with white trousers; the fit is relaxed and the neckline is simple",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Navy",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Checked",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA navy-blue long kurta with an all-over diamond/check pattern, paired with white trousers; the fit is relaxed and the neckline is simple.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_2_21 · panel 3",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-067",
    "referenceId": "#067",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_2_21",
    "panel": 4,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_2_21 — IMAGE 04",
    "outfitDescription": "A white kurta layered with a long multicolour floral stole, paired with white trousers; the stole contains dense red, pink, blue and green motifs and hangs to knee level",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Floral",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white kurta layered with a long multicolour floral stole, paired with white trousers; the stole contains dense red, pink, blue and green motifs and hangs to knee level.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_2_21 · panel 4",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-068",
    "referenceId": "#068",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_2_21",
    "panel": 5,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_2_21 — IMAGE 05",
    "outfitDescription": "A dark navy/black kurta with a white ornamental front panel and matching dark trousers, styled with a narrow light patterned scarf",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Navy",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA dark navy/black kurta with a white ornamental front panel and matching dark trousers, styled with a narrow light patterned scarf.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_2_21 · panel 5",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-069",
    "referenceId": "#069",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_2_21",
    "panel": 6,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_2_21 — IMAGE 06",
    "outfitDescription": "A multicolour paisley/folk-print kurta in muted green, pink, cream and brown, paired with white loose trousers; the print covers the entire upper garment",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Green",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA multicolour paisley/folk-print kurta in muted green, pink, cream and brown, paired with white loose trousers; the print covers the entire upper garment.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_2_21 · panel 6",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-070",
    "referenceId": "#070",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_2_21",
    "panel": 7,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_2_21 — IMAGE 07",
    "outfitDescription": "A pale pink kurta with a long light textured stole, paired with white trousers; the stole is softly draped and the look is relaxed festive",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Pink",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA pale pink kurta with a long light textured stole, paired with white trousers; the stole is softly draped and the look is relaxed festive.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_2_21 · panel 7",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-071",
    "referenceId": "#071",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_2_21",
    "panel": 8,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_2_21 — IMAGE 08",
    "outfitDescription": "A black short kurta with gold/cream embroidered neckline and small scattered motifs, paired with black trousers; the look is sleek and youthful",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "Black trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black short kurta with gold/cream embroidered neckline and small scattered motifs, paired with black trousers; the look is sleek and youthful.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_2_21 · panel 8",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-072",
    "referenceId": "#072",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_2_21",
    "panel": 9,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_2_21 — IMAGE 09",
    "outfitDescription": "A black kurta with small gold/cream scattered motifs and a decorative embroidered neckline, paired with loose black trousers",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "Black trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black kurta with small gold/cream scattered motifs and a decorative embroidered neckline, paired with loose black trousers.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_2_21 · panel 9",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-073",
    "referenceId": "#073",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_2_21",
    "panel": 10,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_2_21 — IMAGE 10",
    "outfitDescription": "A grey/charcoal patterned kurta with white pajama trousers and a simple crossed-arm styling; the kurta has a fine all-over micro-pattern",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Grey",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White pyjama trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA grey/charcoal patterned kurta with white pajama trousers and a simple crossed-arm styling; the kurta has a fine all-over micro-pattern.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_2_21 · panel 10",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-074",
    "referenceId": "#074",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_2_21",
    "panel": 11,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_2_21 — IMAGE 11",
    "outfitDescription": "A cream/pink printed ethnic shirt with wide blue jeans and casual sandals; the shirt has a loose fit and a small all-over traditional print",
    "garmentType": "Ethnic Shirt",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "Blue denim / jeans",
    "footwear": "Casual sandals",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/pink printed ethnic shirt with wide blue jeans and casual sandals; the shirt has a loose fit and a small all-over traditional print.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_2_21 · panel 11",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-075",
    "referenceId": "#075",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_2_21",
    "panel": 12,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_2_21 — IMAGE 12",
    "outfitDescription": "A cream/white embroidered long kurta with subtle vertical texture and relaxed white trousers; the styling is minimal and clean",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/white embroidered long kurta with subtle vertical texture and relaxed white trousers; the styling is minimal and clean.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_2_21 · panel 12",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-076",
    "referenceId": "#076",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_2_21",
    "panel": 13,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_2_21 — IMAGE 13",
    "outfitDescription": "A coral/pink kurta with a long straight silhouette and subtle texture, paired with white loose trousers and casual sandals",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Coral",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": "White sandals",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA coral/pink kurta with a long straight silhouette and subtle texture, paired with white loose trousers and casual sandals.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_2_21 · panel 13",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-077",
    "referenceId": "#077",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_2_21",
    "panel": 14,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_2_21 — IMAGE 14",
    "outfitDescription": "A warm rust/orange long kurta with a simple open neckline and white/grey relaxed trousers, paired with casual footwear",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Rust",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "Grey trousers",
    "footwear": "Casual footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA warm rust/orange long kurta with a simple open neckline and white/grey relaxed trousers, paired with casual footwear.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_2_21 · panel 14",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-078",
    "referenceId": "#078",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_2_21",
    "panel": 15,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_2_21 — IMAGE 15",
    "outfitDescription": "A white embroidered long kurta with a maroon-red patterned stole, paired with relaxed blue jeans and white sneakers; the stole provides the main festive contrast",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "Blue denim / jeans",
    "footwear": "White sneakers",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white embroidered long kurta with a maroon-red patterned stole, paired with relaxed blue jeans and white sneakers; the stole provides the main festive contrast.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_2_21 · panel 15",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-079",
    "referenceId": "#079",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_2_21",
    "panel": 16,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_2_21 — IMAGE 16",
    "outfitDescription": "A black kurta with a subtle printed/embroidered surface, paired with white trousers and a long multicolour patterned stole; the stole hangs over both shoulders",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black kurta with a subtle printed/embroidered surface, paired with white trousers and a long multicolour patterned stole; the stole hangs over both shoulders.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_2_21 · panel 16",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-080",
    "referenceId": "#080",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_2_21",
    "panel": 17,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_2_21 — IMAGE 17",
    "outfitDescription": "A mustard-yellow long kurta with white trousers, featuring a narrow decorative neckline and simple embroidered texture",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Mustard",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA mustard-yellow long kurta with white trousers, featuring a narrow decorative neckline and simple embroidered texture.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_2_21 · panel 17",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-081",
    "referenceId": "#081",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_2_21",
    "panel": 18,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_2_21 — IMAGE 18",
    "outfitDescription": "A white long kurta with a long mustard-yellow stole, paired with a light printed inner/upper layer and white trousers; the stole hangs vertically for a bright festive accent",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white long kurta with a long mustard-yellow stole, paired with a light printed inner/upper layer and white trousers; the stole hangs vertically for a bright festive accent.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_2_21 · panel 18",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-082",
    "referenceId": "#082",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_2_21",
    "panel": 19,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_2_21 — IMAGE 19",
    "outfitDescription": "An off-white embroidered kurta with an ornate silver/cream neckline and dark black trousers; the chest features a decorative pendant-like embroidered placket",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Off-White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "Black trousers",
    "footwear": null,
    "accessories": "Pendant detail",
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nAn off-white embroidered kurta with an ornate silver/cream neckline and dark black trousers; the chest features a decorative pendant-like embroidered placket.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_2_21 · panel 19",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-083",
    "referenceId": "#083",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_2_21",
    "panel": 20,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_2_21 — IMAGE 20",
    "outfitDescription": "A cream embroidered kurta with white pajama trousers, featuring a richly detailed neckline and delicate border embroidery",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White pyjama trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream embroidered kurta with white pajama trousers, featuring a richly detailed neckline and delicate border embroidery.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_2_21 · panel 20",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-084",
    "referenceId": "#084",
    "occasion": "college-fest",
    "occasionLabel": "College Fest",
    "sheet": "college_fest_42_sheet_2_21",
    "panel": 21,
    "sheetPanelLabel": "COLLEGE_FEST_42_SHEET_2_21 — IMAGE 21",
    "outfitDescription": "A light cream long kurta with subtle embroidery and white trousers, finished with a long neutral stole; the overall look is soft and traditional",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA light cream long kurta with subtle embroidery and white trousers, finished with a long neutral stole; the overall look is soft and traditional.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · college_fest_42_sheet_2_21 · panel 21",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-085",
    "referenceId": "#085",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_1_21",
    "panel": 1,
    "sheetPanelLabel": "DIWALI_42_SHEET_1_21 — IMAGE 01",
    "outfitDescription": "A white kurta with small scattered metallic/grey motifs, paired with white trousers and brown loafers; the kurta has a simple mandarin collar and straight fit",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": "White loafers",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white kurta with small scattered metallic/grey motifs, paired with white trousers and brown loafers; the kurta has a simple mandarin collar and straight fit.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_1_21 · panel 1",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-086",
    "referenceId": "#086",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_1_21",
    "panel": 2,
    "sheetPanelLabel": "DIWALI_42_SHEET_1_21 — IMAGE 02",
    "outfitDescription": "A champagne/beige heavily textured and sequined kurta with matching wide trousers, creating a shimmering festive monochrome look",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Champagne",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Sequinned",
      "embroidery": "Sequin work"
    },
    "layering": null,
    "bottomwear": "Red trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA champagne/beige heavily textured and sequined kurta with matching wide trousers, creating a shimmering festive monochrome look.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_1_21 · panel 2",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-087",
    "referenceId": "#087",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_1_21",
    "panel": 3,
    "sheetPanelLabel": "DIWALI_42_SHEET_1_21 — IMAGE 03",
    "outfitDescription": "A peach/coral long kurta with a subtle woven texture, paired with white trousers and brown traditional sandals",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Peach",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": "White sandals",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA peach/coral long kurta with a subtle woven texture, paired with white trousers and brown traditional sandals.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_1_21 · panel 3",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-088",
    "referenceId": "#088",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_1_21",
    "panel": 4,
    "sheetPanelLabel": "DIWALI_42_SHEET_1_21 — IMAGE 04",
    "outfitDescription": "A champagne-beige long kurta with dense all-over dotted embroidery and a softly open neckline, paired with matching light trousers",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Champagne",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "Red trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA champagne-beige long kurta with dense all-over dotted embroidery and a softly open neckline, paired with matching light trousers.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_1_21 · panel 4",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-089",
    "referenceId": "#089",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_1_21",
    "panel": 5,
    "sheetPanelLabel": "DIWALI_42_SHEET_1_21 — IMAGE 05",
    "outfitDescription": "A white kurta with a heavily decorated floral/ornamental hem and lower sleeves, paired with white pajama trousers",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Floral",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White pyjama trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white kurta with a heavily decorated floral/ornamental hem and lower sleeves, paired with white pajama trousers.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_1_21 · panel 5",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-090",
    "referenceId": "#090",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_1_21",
    "panel": 6,
    "sheetPanelLabel": "DIWALI_42_SHEET_1_21 — IMAGE 06",
    "outfitDescription": "A peach-beige long kurta with fine woven embroidery, paired with white trousers and a soft festive silhouette",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Peach",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA peach-beige long kurta with fine woven embroidery, paired with white trousers and a soft festive silhouette.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_1_21 · panel 6",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-091",
    "referenceId": "#091",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_1_21",
    "panel": 7,
    "sheetPanelLabel": "DIWALI_42_SHEET_1_21 — IMAGE 07",
    "outfitDescription": "A maroon/red long kurta with an embroidered lower border, paired with beige/cream trousers and dark footwear",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Maroon",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "Cream trousers",
    "footwear": "Dark footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA maroon/red long kurta with an embroidered lower border, paired with beige/cream trousers and dark footwear.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_1_21 · panel 7",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-092",
    "referenceId": "#092",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_1_21",
    "panel": 8,
    "sheetPanelLabel": "DIWALI_42_SHEET_1_21 — IMAGE 08",
    "outfitDescription": "A black long kurta with dense gold floral/ornamental embroidery across the front, paired with black trousers; the look is rich and formal but youthful",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Floral",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "Black trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black long kurta with dense gold floral/ornamental embroidery across the front, paired with black trousers; the look is rich and formal but youthful.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_1_21 · panel 8",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-093",
    "referenceId": "#093",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_1_21",
    "panel": 9,
    "sheetPanelLabel": "DIWALI_42_SHEET_1_21 — IMAGE 09",
    "outfitDescription": "A cream/white kurta with delicate embroidery, paired with loose white trousers and a long light stole; the silhouette is classic and clean",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/white kurta with delicate embroidery, paired with loose white trousers and a long light stole; the silhouette is classic and clean.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_1_21 · panel 9",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-094",
    "referenceId": "#094",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_1_21",
    "panel": 10,
    "sheetPanelLabel": "DIWALI_42_SHEET_1_21 — IMAGE 10",
    "outfitDescription": "A white embroidered kurta with a long cream-and-gold patterned stole, paired with white trousers and brown traditional footwear",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": "White footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white embroidered kurta with a long cream-and-gold patterned stole, paired with white trousers and brown traditional footwear.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_1_21 · panel 10",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-095",
    "referenceId": "#095",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_1_21",
    "panel": 11,
    "sheetPanelLabel": "DIWALI_42_SHEET_1_21 — IMAGE 11",
    "outfitDescription": "A pale blue/grey long kurta with white embroidered patterning and white trousers, styled simply",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Blue",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA pale blue/grey long kurta with white embroidered patterning and white trousers, styled simply.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_1_21 · panel 11",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-096",
    "referenceId": "#096",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_1_21",
    "panel": 12,
    "sheetPanelLabel": "DIWALI_42_SHEET_1_21 — IMAGE 12",
    "outfitDescription": "A deep maroon kurta with a black patterned outer layer/stole and white pajama trousers; the outer layer is richly printed",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Maroon",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "None"
    },
    "layering": "Jacket / outer layer + Stole / scarf",
    "bottomwear": "White pyjama trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA deep maroon kurta with a black patterned outer layer/stole and white pajama trousers; the outer layer is richly printed.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_1_21 · panel 12",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-097",
    "referenceId": "#097",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_1_21",
    "panel": 13,
    "sheetPanelLabel": "DIWALI_42_SHEET_1_21 — IMAGE 13",
    "outfitDescription": "A brown/maroon kurta with a large cream embroidered neckline and white trousers; the neckline is the primary decorative feature",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Brown",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA brown/maroon kurta with a large cream embroidered neckline and white trousers; the neckline is the primary decorative feature.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_1_21 · panel 13",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-098",
    "referenceId": "#098",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_1_21",
    "panel": 14,
    "sheetPanelLabel": "DIWALI_42_SHEET_1_21 — IMAGE 14",
    "outfitDescription": "A black kurta with ornate gold embroidery concentrated around the neckline and chest, paired with black trousers",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "Black trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black kurta with ornate gold embroidery concentrated around the neckline and chest, paired with black trousers.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_1_21 · panel 14",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-099",
    "referenceId": "#099",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_1_21",
    "panel": 15,
    "sheetPanelLabel": "DIWALI_42_SHEET_1_21 — IMAGE 15",
    "outfitDescription": "A cream/gold long kurta with a subtle all-over texture and loose cream trousers, photographed as a refined monochrome festive look",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "Cream trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/gold long kurta with a subtle all-over texture and loose cream trousers, photographed as a refined monochrome festive look.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_1_21 · panel 15",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-100",
    "referenceId": "#100",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_1_21",
    "panel": 16,
    "sheetPanelLabel": "DIWALI_42_SHEET_1_21 — IMAGE 16",
    "outfitDescription": "A light cream embroidered kurta with white trousers and a delicate open neckline, styled minimally",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA light cream embroidered kurta with white trousers and a delicate open neckline, styled minimally.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_1_21 · panel 16",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-101",
    "referenceId": "#101",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_1_21",
    "panel": 17,
    "sheetPanelLabel": "DIWALI_42_SHEET_1_21 — IMAGE 17",
    "outfitDescription": "A white kurta with a broad floral embroidered hem in muted pink, brown and green, paired with white trousers",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Floral",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white kurta with a broad floral embroidered hem in muted pink, brown and green, paired with white trousers.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_1_21 · panel 17",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-102",
    "referenceId": "#102",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_1_21",
    "panel": 18,
    "sheetPanelLabel": "DIWALI_42_SHEET_1_21 — IMAGE 18",
    "outfitDescription": "A white kurta with a delicate floral print/embroidery around the lower hem and cuffs, paired with light neutral trousers",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "Red trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white kurta with a delicate floral print/embroidery around the lower hem and cuffs, paired with light neutral trousers.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_1_21 · panel 18",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-103",
    "referenceId": "#103",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_1_21",
    "panel": 19,
    "sheetPanelLabel": "DIWALI_42_SHEET_1_21 — IMAGE 19",
    "outfitDescription": "A pale cream long kurta with a subtle zigzag/chevron-like border and white trousers; the lower hem has decorative geometric work",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Geometric",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA pale cream long kurta with a subtle zigzag/chevron-like border and white trousers; the lower hem has decorative geometric work.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_1_21 · panel 19",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-104",
    "referenceId": "#104",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_1_21",
    "panel": 20,
    "sheetPanelLabel": "DIWALI_42_SHEET_1_21 — IMAGE 20",
    "outfitDescription": "A deep teal/blue long kurta with a subtle woven pattern and black/dark trousers, creating a contemporary festive silhouette",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Teal",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "Black trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA deep teal/blue long kurta with a subtle woven pattern and black/dark trousers, creating a contemporary festive silhouette.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_1_21 · panel 20",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-105",
    "referenceId": "#105",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_1_21",
    "panel": 21,
    "sheetPanelLabel": "DIWALI_42_SHEET_1_21 — IMAGE 21",
    "outfitDescription": "A maroon-brown kurta with a large cream embroidered chest panel and white trousers, finished with a clean traditional collar",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Maroon",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA maroon-brown kurta with a large cream embroidered chest panel and white trousers, finished with a clean traditional collar.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_1_21 · panel 21",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-106",
    "referenceId": "#106",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_2_21",
    "panel": 1,
    "sheetPanelLabel": "DIWALI_42_SHEET_2_21 — IMAGE 01",
    "outfitDescription": "A cream/off-white embroidered kurta with a long light patterned stole and loose white trousers, worn with brown traditional footwear",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": "Brown footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/off-white embroidered kurta with a long light patterned stole and loose white trousers, worn with brown traditional footwear.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_2_21 · panel 1",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-107",
    "referenceId": "#107",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_2_21",
    "panel": 2,
    "sheetPanelLabel": "DIWALI_42_SHEET_2_21 — IMAGE 02",
    "outfitDescription": "A maroon kurta with a cream/white long stole and relaxed white trousers; the stole is draped around the neck and gives the look a layered festive finish",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Maroon",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA maroon kurta with a cream/white long stole and relaxed white trousers; the stole is draped around the neck and gives the look a layered festive finish.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_2_21 · panel 2",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-108",
    "referenceId": "#108",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_2_21",
    "panel": 3,
    "sheetPanelLabel": "DIWALI_42_SHEET_2_21 — IMAGE 03",
    "outfitDescription": "A cream kurta-pajama set with a long black-and-gold patterned stole featuring dense folk motifs and a decorative border",
    "garmentType": "Kurta-Pajama Set",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "Cream pyjama trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream kurta-pajama set with a long black-and-gold patterned stole featuring dense folk motifs and a decorative border.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_2_21 · panel 3",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-109",
    "referenceId": "#109",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_2_21",
    "panel": 4,
    "sheetPanelLabel": "DIWALI_42_SHEET_2_21 — IMAGE 04",
    "outfitDescription": "A red printed ethnic shirt with multicolour mirror/embroidered motifs, decorative vertical panels and dark sleeves, paired with blue jeans",
    "garmentType": "Ethnic Shirt",
    "colors": {
      "primary": "Red",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "Blue denim / jeans",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA red printed ethnic shirt with multicolour mirror/embroidered motifs, decorative vertical panels and dark sleeves, paired with blue jeans.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_2_21 · panel 4",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-110",
    "referenceId": "#110",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_2_21",
    "panel": 5,
    "sheetPanelLabel": "DIWALI_42_SHEET_2_21 — IMAGE 05",
    "outfitDescription": "A cream/grey long kurta with a subtle geometric print and white trousers, styled with a relaxed drape and brown footwear",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": "Brown footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/grey long kurta with a subtle geometric print and white trousers, styled with a relaxed drape and brown footwear.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_2_21 · panel 5",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-111",
    "referenceId": "#111",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_2_21",
    "panel": 6,
    "sheetPanelLabel": "DIWALI_42_SHEET_2_21 — IMAGE 06",
    "outfitDescription": "A muted olive/khaki kurta with a long cream patterned stole and light trousers; the stole is densely woven/printed with traditional motifs",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Olive",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "Cream trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA muted olive/khaki kurta with a long cream patterned stole and light trousers; the stole is densely woven/printed with traditional motifs.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_2_21 · panel 6",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-112",
    "referenceId": "#112",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_2_21",
    "panel": 7,
    "sheetPanelLabel": "DIWALI_42_SHEET_2_21 — IMAGE 07",
    "outfitDescription": "A cream kurta with a long green-and-gold patterned stole and white trousers, styled for a festive event",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream kurta with a long green-and-gold patterned stole and white trousers, styled for a festive event.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_2_21 · panel 7",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-113",
    "referenceId": "#113",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_2_21",
    "panel": 8,
    "sheetPanelLabel": "DIWALI_42_SHEET_2_21 — IMAGE 08",
    "outfitDescription": "A soft pink kurta with a long pale textured stole and white trousers, worn in a relaxed youthful style",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Pink",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA soft pink kurta with a long pale textured stole and white trousers, worn in a relaxed youthful style.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_2_21 · panel 8",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-114",
    "referenceId": "#114",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_2_21",
    "panel": 9,
    "sheetPanelLabel": "DIWALI_42_SHEET_2_21 — IMAGE 09",
    "outfitDescription": "A pale blue/grey kurta with a long blue patterned stole and white trousers; the stole has repeated traditional motifs",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Blue",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA pale blue/grey kurta with a long blue patterned stole and white trousers; the stole has repeated traditional motifs.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_2_21 · panel 9",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-115",
    "referenceId": "#115",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_2_21",
    "panel": 10,
    "sheetPanelLabel": "DIWALI_42_SHEET_2_21 — IMAGE 10",
    "outfitDescription": "A mint-green kurta with delicate small motifs, paired with a richly patterned multicolour lower wrap/stole detail",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Mint",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": null,
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA mint-green kurta with delicate small motifs, paired with a richly patterned multicolour lower wrap/stole detail.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_2_21 · panel 10",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-116",
    "referenceId": "#116",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_2_21",
    "panel": 11,
    "sheetPanelLabel": "DIWALI_42_SHEET_2_21 — IMAGE 11",
    "outfitDescription": "A dark black/brown kurta with a long patterned stole and black trousers, creating a layered contemporary ethnic look",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "Black trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA dark black/brown kurta with a long patterned stole and black trousers, creating a layered contemporary ethnic look.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_2_21 · panel 11",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-117",
    "referenceId": "#117",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_2_21",
    "panel": 12,
    "sheetPanelLabel": "DIWALI_42_SHEET_2_21 — IMAGE 12",
    "outfitDescription": "A dusty rose/pink long kurta with subtle embroidery and a light stole, paired with white trousers",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Rose",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA dusty rose/pink long kurta with subtle embroidery and a light stole, paired with white trousers.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_2_21 · panel 12",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-118",
    "referenceId": "#118",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_2_21",
    "panel": 13,
    "sheetPanelLabel": "DIWALI_42_SHEET_2_21 — IMAGE 13",
    "outfitDescription": "A black kurta with a decorative gold/cream neckline and scattered small motifs, paired with black trousers",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "Black trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black kurta with a decorative gold/cream neckline and scattered small motifs, paired with black trousers.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_2_21 · panel 13",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-119",
    "referenceId": "#119",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_2_21",
    "panel": 14,
    "sheetPanelLabel": "DIWALI_42_SHEET_2_21 — IMAGE 14",
    "outfitDescription": "A cream/white long kurta with a long red patterned stole, paired with relaxed blue denim and white sneakers",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "Blue denim / jeans",
    "footwear": "White sneakers",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/white long kurta with a long red patterned stole, paired with relaxed blue denim and white sneakers.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_2_21 · panel 14",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-120",
    "referenceId": "#120",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_2_21",
    "panel": 15,
    "sheetPanelLabel": "DIWALI_42_SHEET_2_21 — IMAGE 15",
    "outfitDescription": "A burgundy long kurta with white trousers and a patterned maroon/cream stole, worn casually with dark footwear",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Burgundy",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": "Dark footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA burgundy long kurta with white trousers and a patterned maroon/cream stole, worn casually with dark footwear.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_2_21 · panel 15",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-121",
    "referenceId": "#121",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_2_21",
    "panel": 16,
    "sheetPanelLabel": "DIWALI_42_SHEET_2_21 — IMAGE 16",
    "outfitDescription": "A charcoal grey micro-patterned kurta with white trousers and simple brown footwear",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Charcoal",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": "White footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA charcoal grey micro-patterned kurta with white trousers and simple brown footwear.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_2_21 · panel 16",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-122",
    "referenceId": "#122",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_2_21",
    "panel": 17,
    "sheetPanelLabel": "DIWALI_42_SHEET_2_21 — IMAGE 17",
    "outfitDescription": "A pale pink ethnic shirt/kurta with light trousers, featuring a fine all-over print and relaxed collar",
    "garmentType": "Ethnic Shirt",
    "colors": {
      "primary": "Pink",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "Pink trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA pale pink ethnic shirt/kurta with light trousers, featuring a fine all-over print and relaxed collar.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_2_21 · panel 17",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-123",
    "referenceId": "#123",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_2_21",
    "panel": 18,
    "sheetPanelLabel": "DIWALI_42_SHEET_2_21 — IMAGE 18",
    "outfitDescription": "A cream kurta with subtle embroidery and white trousers, styled with a long patterned stole in muted blue/grey tones",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream kurta with subtle embroidery and white trousers, styled with a long patterned stole in muted blue/grey tones.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_2_21 · panel 18",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-124",
    "referenceId": "#124",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_2_21",
    "panel": 19,
    "sheetPanelLabel": "DIWALI_42_SHEET_2_21 — IMAGE 19",
    "outfitDescription": "A rust-red textured kurta with relaxed grey trousers and casual footwear",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Rust",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "Grey trousers",
    "footwear": "Casual footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA rust-red textured kurta with relaxed grey trousers and casual footwear.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_2_21 · panel 19",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-125",
    "referenceId": "#125",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_2_21",
    "panel": 20,
    "sheetPanelLabel": "DIWALI_42_SHEET_2_21 — IMAGE 20",
    "outfitDescription": "A red/maroon long kurta with a black patterned outer layer and relaxed denim, giving the look a contemporary festive feel",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Red",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Jacket / outer layer",
    "bottomwear": "Blue denim / jeans",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA red/maroon long kurta with a black patterned outer layer and relaxed denim, giving the look a contemporary festive feel.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_2_21 · panel 20",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-126",
    "referenceId": "#126",
    "occasion": "diwali",
    "occasionLabel": "Diwali",
    "sheet": "diwali_42_sheet_2_21",
    "panel": 21,
    "sheetPanelLabel": "DIWALI_42_SHEET_2_21 — IMAGE 21",
    "outfitDescription": "A white/cream embroidered kurta with a maroon traditional stole, paired with blue denim and white sneakers",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "Blue denim / jeans",
    "footwear": "White sneakers",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white/cream embroidered kurta with a maroon traditional stole, paired with blue denim and white sneakers.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · diwali_42_sheet_2_21 · panel 21",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-127",
    "referenceId": "#127",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_1_21",
    "panel": 1,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_1_21 — IMAGE 01",
    "outfitDescription": "A white embroidered kurta with an ornate golden chest panel and white pajama trousers, styled with a clean mandarin collar and brown loafers",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White pyjama trousers",
    "footwear": "Brown loafers",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white embroidered kurta with an ornate golden chest panel and white pajama trousers, styled with a clean mandarin collar and brown loafers.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_1_21 · panel 1",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-128",
    "referenceId": "#128",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_1_21",
    "panel": 2,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_1_21 — IMAGE 02",
    "outfitDescription": "A cream/gold embroidered long kurta with a black-and-gold patterned stole, paired with light trousers; the stole is heavily ornamental",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "Red trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/gold embroidered long kurta with a black-and-gold patterned stole, paired with light trousers; the stole is heavily ornamental.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_1_21 · panel 2",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-129",
    "referenceId": "#129",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_1_21",
    "panel": 3,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_1_21 — IMAGE 03",
    "outfitDescription": "A lavender/purple long kurta with dense tonal embroidery and a long straight silhouette, paired with cream trousers",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Lavender",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "Cream trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA lavender/purple long kurta with dense tonal embroidery and a long straight silhouette, paired with cream trousers.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_1_21 · panel 3",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-130",
    "referenceId": "#130",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_1_21",
    "panel": 4,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_1_21 — IMAGE 04",
    "outfitDescription": "A cream embroidered long kurta with a subtle textured surface and cream trousers, styled with minimal accessories",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "Cream trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream embroidered long kurta with a subtle textured surface and cream trousers, styled with minimal accessories.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_1_21 · panel 4",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-131",
    "referenceId": "#131",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_1_21",
    "panel": 5,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_1_21 — IMAGE 05",
    "outfitDescription": "A burnt-orange/red textured blazer or embroidered jacket layered over a black shirt and black wide trousers; the outer layer is the dominant festive piece",
    "garmentType": "Ethnic Jacket / Layered Set",
    "colors": {
      "primary": "Orange",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "Embroidered"
    },
    "layering": "Jacket / outer layer",
    "bottomwear": "Black trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA burnt-orange/red textured blazer or embroidered jacket layered over a black shirt and black wide trousers; the outer layer is the dominant festive piece.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_1_21 · panel 5",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-132",
    "referenceId": "#132",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_1_21",
    "panel": 6,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_1_21 — IMAGE 06",
    "outfitDescription": "A white long kurta with a long flowing cream/gold stole, paired with white trousers and sunglasses; the styling is elegant and airy",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": "Sunglasses",
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white long kurta with a long flowing cream/gold stole, paired with white trousers and sunglasses; the styling is elegant and airy.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_1_21 · panel 6",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-133",
    "referenceId": "#133",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_1_21",
    "panel": 7,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_1_21 — IMAGE 07",
    "outfitDescription": "A black long kurta with a teal/black long scarf, paired with black trousers; the look is understated and layered",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "Black trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black long kurta with a teal/black long scarf, paired with black trousers; the look is understated and layered.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_1_21 · panel 7",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-134",
    "referenceId": "#134",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_1_21",
    "panel": 8,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_1_21 — IMAGE 08",
    "outfitDescription": "A light blue/grey tailored ethnic jacket over a matching kurta and white trousers, with subtle gold motifs on the jacket",
    "garmentType": "Ethnic Jacket / Layered Set",
    "colors": {
      "primary": "Blue",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Jacket / outer layer",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA light blue/grey tailored ethnic jacket over a matching kurta and white trousers, with subtle gold motifs on the jacket.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_1_21 · panel 8",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-135",
    "referenceId": "#135",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_1_21",
    "panel": 9,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_1_21 — IMAGE 09",
    "outfitDescription": "A cream/white monochrome kurta-pajama set with a long subtle embroidered stole and clean traditional footwear",
    "garmentType": "Kurta-Pajama Set",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White pyjama trousers",
    "footwear": "White footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/white monochrome kurta-pajama set with a long subtle embroidered stole and clean traditional footwear.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_1_21 · panel 9",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-136",
    "referenceId": "#136",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_1_21",
    "panel": 10,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_1_21 — IMAGE 10",
    "outfitDescription": "A deep maroon embroidered jacket/kurta with black wide trousers, creating a contemporary evening festive silhouette",
    "garmentType": "Ethnic Jacket / Layered Set",
    "colors": {
      "primary": "Maroon",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Jacket / outer layer",
    "bottomwear": "Black trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA deep maroon embroidered jacket/kurta with black wide trousers, creating a contemporary evening festive silhouette.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_1_21 · panel 10",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-137",
    "referenceId": "#137",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_1_21",
    "panel": 11,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_1_21 — IMAGE 11",
    "outfitDescription": "A black long kurta with subtle gold/cream embroidery and black trousers, styled with a small ornamental neckline detail",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "Black trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black long kurta with subtle gold/cream embroidery and black trousers, styled with a small ornamental neckline detail.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_1_21 · panel 11",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-138",
    "referenceId": "#138",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_1_21",
    "panel": 12,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_1_21 — IMAGE 12",
    "outfitDescription": "A pale cream embroidered kurta with a long maroon patterned stole and white trousers, worn in a relaxed pose",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA pale cream embroidered kurta with a long maroon patterned stole and white trousers, worn in a relaxed pose.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_1_21 · panel 12",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-139",
    "referenceId": "#139",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_1_21",
    "panel": 13,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_1_21 — IMAGE 13",
    "outfitDescription": "A black/dark charcoal long kurta with a broad gold embroidered front panel and white trousers, styled with black footwear",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": "Black footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black/dark charcoal long kurta with a broad gold embroidered front panel and white trousers, styled with black footwear.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_1_21 · panel 13",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-140",
    "referenceId": "#140",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_1_21",
    "panel": 14,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_1_21 — IMAGE 14",
    "outfitDescription": "A cream embroidered kurta with a long light stole and matching trousers, photographed against a warm festive setting",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "Red trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream embroidered kurta with a long light stole and matching trousers, photographed against a warm festive setting.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_1_21 · panel 14",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-141",
    "referenceId": "#141",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_1_21",
    "panel": 15,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_1_21 — IMAGE 15",
    "outfitDescription": "A white/cream heavily embroidered kurta with matching white trousers and subtle metallic details",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white/cream heavily embroidered kurta with matching white trousers and subtle metallic details.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_1_21 · panel 15",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-142",
    "referenceId": "#142",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_1_21",
    "panel": 16,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_1_21 — IMAGE 16",
    "outfitDescription": "A light cream long kurta with a blue-grey patterned stole and white trousers, creating a soft traditional layered look",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA light cream long kurta with a blue-grey patterned stole and white trousers, creating a soft traditional layered look.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_1_21 · panel 16",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-143",
    "referenceId": "#143",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_1_21",
    "panel": 17,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_1_21 — IMAGE 17",
    "outfitDescription": "A dark charcoal/black embroidered kurta with black trousers and a subtle patterned stole, suitable for a refined festive evening",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Charcoal",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "Black trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA dark charcoal/black embroidered kurta with black trousers and a subtle patterned stole, suitable for a refined festive evening.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_1_21 · panel 17",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-144",
    "referenceId": "#144",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_1_21",
    "panel": 18,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_1_21 — IMAGE 18",
    "outfitDescription": "A cream/gold long kurta with dense embroidery and white trousers, styled with brown traditional footwear",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": "Brown footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/gold long kurta with dense embroidery and white trousers, styled with brown traditional footwear.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_1_21 · panel 18",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-145",
    "referenceId": "#145",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_1_21",
    "panel": 19,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_1_21 — IMAGE 19",
    "outfitDescription": "A black velvet-like/textured ethnic jacket over a black kurta and trousers, with subtle metallic embroidery and a polished evening silhouette",
    "garmentType": "Ethnic Jacket / Layered Set",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "Embroidered"
    },
    "layering": "Jacket / outer layer",
    "bottomwear": "Black trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black velvet-like/textured ethnic jacket over a black kurta and trousers, with subtle metallic embroidery and a polished evening silhouette.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_1_21 · panel 19",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-146",
    "referenceId": "#146",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_1_21",
    "panel": 20,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_1_21 — IMAGE 20",
    "outfitDescription": "A pale blue-grey kurta with fine all-over embroidery and white trousers, styled with minimal accessories",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Blue",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA pale blue-grey kurta with fine all-over embroidery and white trousers, styled with minimal accessories.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_1_21 · panel 20",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-147",
    "referenceId": "#147",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_1_21",
    "panel": 21,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_1_21 — IMAGE 21",
    "outfitDescription": "A black tailored festive suit-like ethnic ensemble with a richly patterned black-and-gold jacket, black trousers and polished black shoes",
    "garmentType": "Ethnic Jacket / Layered Set",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Jacket / outer layer",
    "bottomwear": "Black trousers",
    "footwear": "Black shoes",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black tailored festive suit-like ethnic ensemble with a richly patterned black-and-gold jacket, black trousers and polished black shoes.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_1_21 · panel 21",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-148",
    "referenceId": "#148",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_2_21",
    "panel": 1,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_2_21 — IMAGE 01",
    "outfitDescription": "A white kurta with small black/dark scattered motifs, paired with white trousers and dark loafers; the look is minimalist and traditional",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": "White loafers",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white kurta with small black/dark scattered motifs, paired with white trousers and dark loafers; the look is minimalist and traditional.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_2_21 · panel 1",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-149",
    "referenceId": "#149",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_2_21",
    "panel": 2,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_2_21 — IMAGE 02",
    "outfitDescription": "A black long kurta with a broad ornate gold-and-black embroidered/printed front panel, paired with black trousers",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "Black trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black long kurta with a broad ornate gold-and-black embroidered/printed front panel, paired with black trousers.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_2_21 · panel 2",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-150",
    "referenceId": "#150",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_2_21",
    "panel": 3,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_2_21 — IMAGE 03",
    "outfitDescription": "A mint/seafoam kurta with a richly patterned lower border in multicolour motifs, paired with white wide trousers",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Mint",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA mint/seafoam kurta with a richly patterned lower border in multicolour motifs, paired with white wide trousers.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_2_21 · panel 3",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-151",
    "referenceId": "#151",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_2_21",
    "panel": 4,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_2_21 — IMAGE 04",
    "outfitDescription": "A pale cream/gold long kurta with matching trousers, featuring a subtle all-over textured weave and clean straight fit",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "Gold trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA pale cream/gold long kurta with matching trousers, featuring a subtle all-over textured weave and clean straight fit.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_2_21 · panel 4",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-152",
    "referenceId": "#152",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_2_21",
    "panel": 5,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_2_21 — IMAGE 05",
    "outfitDescription": "A burgundy/maroon sleeveless long vest layered over a white shirt/kurta, paired with loose white trousers; the vest is the main contemporary layer",
    "garmentType": "Waistcoat / Layered Set",
    "colors": {
      "primary": "Burgundy",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Sleeveless vest",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA burgundy/maroon sleeveless long vest layered over a white shirt/kurta, paired with loose white trousers; the vest is the main contemporary layer.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_2_21 · panel 5",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-153",
    "referenceId": "#153",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_2_21",
    "panel": 6,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_2_21 — IMAGE 06",
    "outfitDescription": "A deep olive-green kurta with a matching dark patterned scarf/stole and white trousers; the neckline and lower hem have subtle embroidery",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Olive",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA deep olive-green kurta with a matching dark patterned scarf/stole and white trousers; the neckline and lower hem have subtle embroidery.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_2_21 · panel 6",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-154",
    "referenceId": "#154",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_2_21",
    "panel": 7,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_2_21 — IMAGE 07",
    "outfitDescription": "A black kurta with a black-and-gold ornamental stole or embroidered front layer, paired with loose black trousers",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "Black trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black kurta with a black-and-gold ornamental stole or embroidered front layer, paired with loose black trousers.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_2_21 · panel 7",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-155",
    "referenceId": "#155",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_2_21",
    "panel": 8,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_2_21 — IMAGE 08",
    "outfitDescription": "A navy/black long kurta with gold embroidered neckline and matching dark trousers, styled with a long decorative stole",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Navy",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "Red trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA navy/black long kurta with gold embroidered neckline and matching dark trousers, styled with a long decorative stole.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_2_21 · panel 8",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-156",
    "referenceId": "#156",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_2_21",
    "panel": 9,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_2_21 — IMAGE 09",
    "outfitDescription": "A white kurta-pajama with a delicate multicolour floral embroidered hem and cuffs, paired with brown traditional sandals",
    "garmentType": "Kurta-Pajama Set",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Floral",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White pyjama trousers",
    "footwear": "Brown sandals",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white kurta-pajama with a delicate multicolour floral embroidered hem and cuffs, paired with brown traditional sandals.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_2_21 · panel 9",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-157",
    "referenceId": "#157",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_2_21",
    "panel": 10,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_2_21 — IMAGE 10",
    "outfitDescription": "A white embroidered kurta with a long cream/light stole and loose white trousers, styled simply",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white embroidered kurta with a long cream/light stole and loose white trousers, styled simply.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_2_21 · panel 10",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-158",
    "referenceId": "#158",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_2_21",
    "panel": 11,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_2_21 — IMAGE 11",
    "outfitDescription": "A mustard-yellow embroidered kurta with white trousers and a subtle open neckline",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Mustard",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA mustard-yellow embroidered kurta with white trousers and a subtle open neckline.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_2_21 · panel 11",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-159",
    "referenceId": "#159",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_2_21",
    "panel": 12,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_2_21 — IMAGE 12",
    "outfitDescription": "A cream/off-white kurta with a richly patterned floral lower hem and white trousers",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Floral",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/off-white kurta with a richly patterned floral lower hem and white trousers.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_2_21 · panel 12",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-160",
    "referenceId": "#160",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_2_21",
    "panel": 13,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_2_21 — IMAGE 13",
    "outfitDescription": "A terracotta/rust kurta with a simple straight silhouette and white trousers, finished with brown sandals",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Terracotta",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": "Brown sandals",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA terracotta/rust kurta with a simple straight silhouette and white trousers, finished with brown sandals.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_2_21 · panel 13",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-161",
    "referenceId": "#161",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_2_21",
    "panel": 14,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_2_21 — IMAGE 14",
    "outfitDescription": "A taupe/brown kurta-pajama set with a decorative vertical neckline and brown leather loafers",
    "garmentType": "Kurta-Pajama Set",
    "colors": {
      "primary": "Taupe",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "Brown pyjama trousers",
    "footwear": "Brown loafers",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA taupe/brown kurta-pajama set with a decorative vertical neckline and brown leather loafers.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_2_21 · panel 14",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-162",
    "referenceId": "#162",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_2_21",
    "panel": 15,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_2_21 — IMAGE 15",
    "outfitDescription": "A white embroidered kurta with a subtle light-grey pattern and white trousers, styled with brown traditional footwear",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": "Brown footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white embroidered kurta with a subtle light-grey pattern and white trousers, styled with brown traditional footwear.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_2_21 · panel 15",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-163",
    "referenceId": "#163",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_2_21",
    "panel": 16,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_2_21 — IMAGE 16",
    "outfitDescription": "A pale pink embroidered kurta with white trousers, featuring a delicate geometric weave",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Pink",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Geometric",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA pale pink embroidered kurta with white trousers, featuring a delicate geometric weave.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_2_21 · panel 16",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-164",
    "referenceId": "#164",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_2_21",
    "panel": 17,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_2_21 — IMAGE 17",
    "outfitDescription": "A white kurta with a long cream/gold patterned stole and white trousers, creating a soft monochrome traditional look",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white kurta with a long cream/gold patterned stole and white trousers, creating a soft monochrome traditional look.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_2_21 · panel 17",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-165",
    "referenceId": "#165",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_2_21",
    "panel": 18,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_2_21 — IMAGE 18",
    "outfitDescription": "A cream/off-white kurta with delicate all-over embroidery and white trousers, worn with brown sandals",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": "Brown sandals",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/off-white kurta with delicate all-over embroidery and white trousers, worn with brown sandals.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_2_21 · panel 18",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-166",
    "referenceId": "#166",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_2_21",
    "panel": 19,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_2_21 — IMAGE 19",
    "outfitDescription": "A white kurta with subtle embroidered motifs and a clean straight fit, paired with white trousers and dark traditional footwear",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": "White footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white kurta with subtle embroidered motifs and a clean straight fit, paired with white trousers and dark traditional footwear.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_2_21 · panel 19",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-167",
    "referenceId": "#167",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_2_21",
    "panel": 20,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_2_21 — IMAGE 20",
    "outfitDescription": "A pale cream embroidered kurta with a long neutral stole and white trousers, styled minimally",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA pale cream embroidered kurta with a long neutral stole and white trousers, styled minimally.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_2_21 · panel 20",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-168",
    "referenceId": "#168",
    "occasion": "festive-party",
    "occasionLabel": "Festive Party",
    "sheet": "festive_party_42_sheet_2_21",
    "panel": 21,
    "sheetPanelLabel": "FESTIVE_PARTY_42_SHEET_2_21 — IMAGE 21",
    "outfitDescription": "A white/cream kurta with a small ornamental neckline and white trousers, photographed in a clean neutral setting",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white/cream kurta with a small ornamental neckline and white trousers, photographed in a clean neutral setting.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · festive_party_42_sheet_2_21 · panel 21",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-169",
    "referenceId": "#169",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_1_21",
    "panel": 1,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_1_21 — IMAGE 01",
    "outfitDescription": "A white long kurta with tiny repeating dark motifs and white trousers, styled with brown loafers; the fit is relaxed and youthful",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": "Brown loafers",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white long kurta with tiny repeating dark motifs and white trousers, styled with brown loafers; the fit is relaxed and youthful.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_1_21 · panel 1",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-170",
    "referenceId": "#170",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_1_21",
    "panel": 2,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_1_21 — IMAGE 02",
    "outfitDescription": "A red/maroon printed ethnic shirt with dense white floral/folk motifs, an open short placket and white trousers; the shirt is the dominant visual element",
    "garmentType": "Ethnic Shirt",
    "colors": {
      "primary": "Red",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA red/maroon printed ethnic shirt with dense white floral/folk motifs, an open short placket and white trousers; the shirt is the dominant visual element.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_1_21 · panel 2",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-171",
    "referenceId": "#171",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_1_21",
    "panel": 3,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_1_21 — IMAGE 03",
    "outfitDescription": "A blue long kurta with a fine white diamond/check pattern, paired with white trousers and dark casual shoes",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Blue",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Checked",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": "White shoes",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA blue long kurta with a fine white diamond/check pattern, paired with white trousers and dark casual shoes.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_1_21 · panel 3",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-172",
    "referenceId": "#172",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_1_21",
    "panel": 4,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_1_21 — IMAGE 04",
    "outfitDescription": "A white kurta with a long multicolour floral stole, paired with white trousers; the stole has pink, red, green and blue folk motifs",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Floral",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white kurta with a long multicolour floral stole, paired with white trousers; the stole has pink, red, green and blue folk motifs.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_1_21 · panel 4",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-173",
    "referenceId": "#173",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_1_21",
    "panel": 5,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_1_21 — IMAGE 05",
    "outfitDescription": "A multicolour paisley-print ethnic shirt in teal, brown, pink and cream, paired with white trousers; dark sunglasses complete the look",
    "garmentType": "Ethnic Shirt",
    "colors": {
      "primary": "Teal",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": "Sunglasses",
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA multicolour paisley-print ethnic shirt in teal, brown, pink and cream, paired with white trousers; dark sunglasses complete the look.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_1_21 · panel 5",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-174",
    "referenceId": "#174",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_1_21",
    "panel": 6,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_1_21 — IMAGE 06",
    "outfitDescription": "A light pink kurta with a long pale textured stole and white trousers, creating a soft festive silhouette",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Pink",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA light pink kurta with a long pale textured stole and white trousers, creating a soft festive silhouette.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_1_21 · panel 6",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-175",
    "referenceId": "#175",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_1_21",
    "panel": 7,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_1_21 — IMAGE 07",
    "outfitDescription": "A black kurta with a long cream/gold patterned stole and white trousers, styled as a layered ethnic look",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black kurta with a long cream/gold patterned stole and white trousers, styled as a layered ethnic look.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_1_21 · panel 7",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-176",
    "referenceId": "#176",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_1_21",
    "panel": 8,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_1_21 — IMAGE 08",
    "outfitDescription": "A black/dark kurta with a long maroon-and-gold patterned stole, paired with black trousers",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "Black trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black/dark kurta with a long maroon-and-gold patterned stole, paired with black trousers.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_1_21 · panel 8",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-177",
    "referenceId": "#177",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_1_21",
    "panel": 9,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_1_21 — IMAGE 09",
    "outfitDescription": "A pale pink long kurta with a subtle woven texture and white trousers, photographed in evening light",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Pink",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA pale pink long kurta with a subtle woven texture and white trousers, photographed in evening light.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_1_21 · panel 9",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-178",
    "referenceId": "#178",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_1_21",
    "panel": 10,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_1_21 — IMAGE 10",
    "outfitDescription": "A black kurta with gold/cream embroidered neckline and small scattered motifs, paired with black trousers",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "Black trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black kurta with gold/cream embroidered neckline and small scattered motifs, paired with black trousers.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_1_21 · panel 10",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-179",
    "referenceId": "#179",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_1_21",
    "panel": 11,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_1_21 — IMAGE 11",
    "outfitDescription": "A black embroidered kurta with a gold-toned decorative neckline and white trousers, creating a refined contrast",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black embroidered kurta with a gold-toned decorative neckline and white trousers, creating a refined contrast.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_1_21 · panel 11",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-180",
    "referenceId": "#180",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_1_21",
    "panel": 12,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_1_21 — IMAGE 12",
    "outfitDescription": "A grey micro-patterned kurta with white trousers and brown sandals, styled simply",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Grey",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": "White sandals",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA grey micro-patterned kurta with white trousers and brown sandals, styled simply.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_1_21 · panel 12",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-181",
    "referenceId": "#181",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_1_21",
    "panel": 13,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_1_21 — IMAGE 13",
    "outfitDescription": "A cream/pink printed ethnic shirt with light blue relaxed jeans and brown sandals; the shirt has a loose fit and all-over traditional print",
    "garmentType": "Ethnic Shirt",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "Blue denim / jeans",
    "footwear": "Light sandals",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/pink printed ethnic shirt with light blue relaxed jeans and brown sandals; the shirt has a loose fit and all-over traditional print.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_1_21 · panel 13",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-182",
    "referenceId": "#182",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_1_21",
    "panel": 14,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_1_21 — IMAGE 14",
    "outfitDescription": "A white embroidered kurta with a long maroon printed stole, paired with blue denim and white sneakers",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "Blue denim / jeans",
    "footwear": "White sneakers",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white embroidered kurta with a long maroon printed stole, paired with blue denim and white sneakers.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_1_21 · panel 14",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-183",
    "referenceId": "#183",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_1_21",
    "panel": 15,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_1_21 — IMAGE 15",
    "outfitDescription": "A cream/white long kurta with a light embroidered surface and wide white trousers, styled with brown footwear",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": "Brown footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/white long kurta with a light embroidered surface and wide white trousers, styled with brown footwear.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_1_21 · panel 15",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-184",
    "referenceId": "#184",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_1_21",
    "panel": 16,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_1_21 — IMAGE 16",
    "outfitDescription": "A light cream embroidered kurta with white trousers and a minimal neckline, photographed indoors",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA light cream embroidered kurta with white trousers and a minimal neckline, photographed indoors.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_1_21 · panel 16",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-185",
    "referenceId": "#185",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_1_21",
    "panel": 17,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_1_21 — IMAGE 17",
    "outfitDescription": "A maroon/burgundy long kurta with white trousers and a subtle printed stole, creating a rich festive colour combination",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Maroon",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA maroon/burgundy long kurta with white trousers and a subtle printed stole, creating a rich festive colour combination.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_1_21 · panel 17",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-186",
    "referenceId": "#186",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_1_21",
    "panel": 18,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_1_21 — IMAGE 18",
    "outfitDescription": "A cream/white kurta with a subtle all-over pattern and white trousers, styled with brown traditional footwear",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": "Brown footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/white kurta with a subtle all-over pattern and white trousers, styled with brown traditional footwear.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_1_21 · panel 18",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-187",
    "referenceId": "#187",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_1_21",
    "panel": 19,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_1_21 — IMAGE 19",
    "outfitDescription": "A black long kurta with a subtle gold patterned surface, paired with white trousers and dark footwear",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": "White footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black long kurta with a subtle gold patterned surface, paired with white trousers and dark footwear.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_1_21 · panel 19",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-188",
    "referenceId": "#188",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_1_21",
    "panel": 20,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_1_21 — IMAGE 20",
    "outfitDescription": "A white kurta with a long patterned stole and loose white trousers, creating a classic festive look",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white kurta with a long patterned stole and loose white trousers, creating a classic festive look.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_1_21 · panel 20",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-189",
    "referenceId": "#189",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_1_21",
    "panel": 21,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_1_21 — IMAGE 21",
    "outfitDescription": "A cream/gold long kurta with delicate embroidery and white trousers, styled in a clean traditional silhouette",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/gold long kurta with delicate embroidery and white trousers, styled in a clean traditional silhouette.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_1_21 · panel 21",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-190",
    "referenceId": "#190",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_2_21",
    "panel": 1,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_2_21 — IMAGE 01",
    "outfitDescription": "A black kurta with a broad printed/embroidered lower border in warm gold, brown and red, paired with loose white trousers and black formal footwear",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": "White footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black kurta with a broad printed/embroidered lower border in warm gold, brown and red, paired with loose white trousers and black formal footwear.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_2_21 · panel 1",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-191",
    "referenceId": "#191",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_2_21",
    "panel": 2,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_2_21 — IMAGE 02",
    "outfitDescription": "A cream/beige long kurta layered with a dramatic navy-and-cream patterned sleeveless jacket/stole, featuring dense floral and geometric motifs; the base trousers are cream",
    "garmentType": "Ethnic Jacket / Layered Set",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Geometric",
      "embroidery": "None"
    },
    "layering": "Jacket / outer layer + Stole / scarf",
    "bottomwear": "Cream trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/beige long kurta layered with a dramatic navy-and-cream patterned sleeveless jacket/stole, featuring dense floral and geometric motifs; the base trousers are cream.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_2_21 · panel 2",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-192",
    "referenceId": "#192",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_2_21",
    "panel": 3,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_2_21 — IMAGE 03",
    "outfitDescription": "A peach-beige long kurta with a subtle textured weave and matching light peach trousers, finished with brown traditional footwear",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Peach",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "Peach trousers",
    "footwear": "Brown footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA peach-beige long kurta with a subtle textured weave and matching light peach trousers, finished with brown traditional footwear.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_2_21 · panel 3",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-193",
    "referenceId": "#193",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_2_21",
    "panel": 4,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_2_21 — IMAGE 04",
    "outfitDescription": "A white embroidered kurta with a softly open neckline and white trousers, featuring delicate vertical texture and subtle floral work",
    "garmentType": "Kurta",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Floral",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white embroidered kurta with a softly open neckline and white trousers, featuring delicate vertical texture and subtle floral work.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_2_21 · panel 4",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-194",
    "referenceId": "#194",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_2_21",
    "panel": 5,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_2_21 — IMAGE 05",
    "outfitDescription": "A white kurta-pajama set with a clean mandarin collar and simple straight silhouette, paired with brown sandals",
    "garmentType": "Kurta-Pajama Set",
    "colors": {
      "primary": "White",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White pyjama trousers",
    "footwear": "Brown sandals",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA white kurta-pajama set with a clean mandarin collar and simple straight silhouette, paired with brown sandals.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_2_21 · panel 5",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-195",
    "referenceId": "#195",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_2_21",
    "panel": 6,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_2_21 — IMAGE 06",
    "outfitDescription": "A black long kurta with a wide brown/gold patterned lower panel and black trousers, styled with black footwear",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "Black trousers",
    "footwear": "Black footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black long kurta with a wide brown/gold patterned lower panel and black trousers, styled with black footwear.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_2_21 · panel 6",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-196",
    "referenceId": "#196",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_2_21",
    "panel": 7,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_2_21 — IMAGE 07",
    "outfitDescription": "A pale pink/cream long embroidered jacket or kurta layered over white trousers, with delicate floral embroidery and a refined straight silhouette",
    "garmentType": "Ethnic Jacket / Layered Set",
    "colors": {
      "primary": "Pink",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Floral",
      "embroidery": "Embroidered"
    },
    "layering": "Jacket / outer layer",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA pale pink/cream long embroidered jacket or kurta layered over white trousers, with delicate floral embroidery and a refined straight silhouette.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_2_21 · panel 7",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-197",
    "referenceId": "#197",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_2_21",
    "panel": 8,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_2_21 — IMAGE 08",
    "outfitDescription": "A cream/white long kurta with subtle embroidery and white trousers, styled with a long light patterned stole and neutral footwear",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": "Light footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/white long kurta with subtle embroidery and white trousers, styled with a long light patterned stole and neutral footwear.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_2_21 · panel 8",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-198",
    "referenceId": "#198",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_2_21",
    "panel": 9,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_2_21 — IMAGE 09",
    "outfitDescription": "A cream/white long kurta with a narrow decorative neckline and matching trousers, paired with brown traditional footwear",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": "Brown footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/white long kurta with a narrow decorative neckline and matching trousers, paired with brown traditional footwear.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_2_21 · panel 9",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-199",
    "referenceId": "#199",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_2_21",
    "panel": 10,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_2_21 — IMAGE 10",
    "outfitDescription": "A cream kurta with a delicate embroidered front and white trousers, styled with a long light stole/scarf",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "White trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream kurta with a delicate embroidered front and white trousers, styled with a long light stole/scarf.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_2_21 · panel 10",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-200",
    "referenceId": "#200",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_2_21",
    "panel": 11,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_2_21 — IMAGE 11",
    "outfitDescription": "A warm brown/terracotta printed kurta with dense geometric motifs, paired with white trousers and brown sandals",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Brown",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Printed",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "White trousers",
    "footwear": "White sandals",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA warm brown/terracotta printed kurta with dense geometric motifs, paired with white trousers and brown sandals.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_2_21 · panel 11",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-201",
    "referenceId": "#201",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_2_21",
    "panel": 12,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_2_21 — IMAGE 12",
    "outfitDescription": "A beige/cream draped kurta-pajama set with a loose flowing silhouette and a light textured stole, paired with neutral footwear",
    "garmentType": "Kurta-Pajama Set",
    "colors": {
      "primary": "Beige",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "None"
    },
    "layering": "Stole / scarf",
    "bottomwear": "Cream pyjama trousers",
    "footwear": "Neutral footwear",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA beige/cream draped kurta-pajama set with a loose flowing silhouette and a light textured stole, paired with neutral footwear.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_2_21 · panel 12",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-202",
    "referenceId": "#202",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_2_21",
    "panel": 13,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_2_21 — IMAGE 13",
    "outfitDescription": "A black short kurta with a broad cream embroidered neckline and matching black trousers, creating a clean graphic ethnic look",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "Black trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black short kurta with a broad cream embroidered neckline and matching black trousers, creating a clean graphic ethnic look.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_2_21 · panel 13",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-203",
    "referenceId": "#203",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_2_21",
    "panel": 14,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_2_21 — IMAGE 14",
    "outfitDescription": "An olive-green textured kurta with matching olive trousers, featuring subtle woven patterning and a relaxed tailored fit",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Olive",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Textured / woven",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "Olive trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nAn olive-green textured kurta with matching olive trousers, featuring subtle woven patterning and a relaxed tailored fit.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_2_21 · panel 14",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-204",
    "referenceId": "#204",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_2_21",
    "panel": 15,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_2_21 — IMAGE 15",
    "outfitDescription": "A black long kurta with a subtle black embroidered jacket/outer layer and black trousers, styled with polished black shoes",
    "garmentType": "Ethnic Jacket / Layered Set",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Jacket / outer layer",
    "bottomwear": "Black trousers",
    "footwear": "Polished black shoes",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black long kurta with a subtle black embroidered jacket/outer layer and black trousers, styled with polished black shoes.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_2_21 · panel 15",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-205",
    "referenceId": "#205",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_2_21",
    "panel": 16,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_2_21 — IMAGE 16",
    "outfitDescription": "A deep navy/black long kurta with a long embroidered front panel and matching dark wide trousers; the embroidery is concentrated around the chest and vertical edges",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Navy",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": null,
    "bottomwear": "Red trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA deep navy/black long kurta with a long embroidered front panel and matching dark wide trousers; the embroidery is concentrated around the chest and vertical edges.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_2_21 · panel 16",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-206",
    "referenceId": "#206",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_2_21",
    "panel": 17,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_2_21 — IMAGE 17",
    "outfitDescription": "A black long kurta with a subtle patterned surface and black trousers, worn as a minimalist monochrome traditional look",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "None"
    },
    "layering": null,
    "bottomwear": "Black trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black long kurta with a subtle patterned surface and black trousers, worn as a minimalist monochrome traditional look.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_2_21 · panel 17",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-207",
    "referenceId": "#207",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_2_21",
    "panel": 18,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_2_21 — IMAGE 18",
    "outfitDescription": "A black tailored ethnic jacket with silver/grey embroidered sleeves and front details, paired with black trousers and polished black shoes",
    "garmentType": "Ethnic Jacket / Layered Set",
    "colors": {
      "primary": "Black",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Jacket / outer layer",
    "bottomwear": "Black trousers",
    "footwear": "Black shoes",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA black tailored ethnic jacket with silver/grey embroidered sleeves and front details, paired with black trousers and polished black shoes.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_2_21 · panel 18",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-208",
    "referenceId": "#208",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_2_21",
    "panel": 19,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_2_21 — IMAGE 19",
    "outfitDescription": "A navy/black long kurta with a long ornate embroidered stole/front panel and wide dark trousers, creating a formal traditional silhouette",
    "garmentType": "Kurta",
    "colors": {
      "primary": "Navy",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Stole / scarf",
    "bottomwear": "Red trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA navy/black long kurta with a long ornate embroidered stole/front panel and wide dark trousers, creating a formal traditional silhouette.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_2_21 · panel 19",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-209",
    "referenceId": "#209",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_2_21",
    "panel": 20,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_2_21 — IMAGE 20",
    "outfitDescription": "A brown/taupe ethnic jacket with rich cream embroidery over a matching brown kurta and wide brown trousers; the jacket has a strong structured silhouette",
    "garmentType": "Ethnic Jacket / Layered Set",
    "colors": {
      "primary": "Brown",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Jacket / outer layer",
    "bottomwear": "Brown trousers",
    "footwear": null,
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA brown/taupe ethnic jacket with rich cream embroidery over a matching brown kurta and wide brown trousers; the jacket has a strong structured silhouette.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_2_21 · panel 20",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  },
  {
    "id": "men-look-210",
    "referenceId": "#210",
    "occasion": "traditional",
    "occasionLabel": "Traditional",
    "sheet": "traditional_outfits_sheet_2_21",
    "panel": 21,
    "sheetPanelLabel": "TRADITIONAL_OUTFITS_SHEET_2_21 — IMAGE 21",
    "outfitDescription": "A cream/off-white embroidered long jacket over a light kurta with wide white trousers, finished with brown traditional shoes",
    "garmentType": "Ethnic Jacket / Layered Set",
    "colors": {
      "primary": "Cream",
      "secondary": []
    },
    "patternOrEmbroidery": {
      "pattern": "Solid",
      "embroidery": "Embroidered"
    },
    "layering": "Jacket / outer layer",
    "bottomwear": "White trousers",
    "footwear": "Brown shoes",
    "accessories": null,
    "pose": null,
    "framing": null,
    "environment": null,
    "lighting": null,
    "generationPrompt": "Create a VIRAAS fashion image based on the attached reference and the following exact outfit definition:\n\nA cream/off-white embroidered long jacket over a light kurta with wide white trousers, finished with brown traditional shoes.\n\nRecreate this exact outfit faithfully from the supplied reference. Preserve every visible garment layer, construction detail, silhouette, proportion, colour, print, embroidery, embellishment, texture and styling detail. Preserve the same pose, framing, crop, camera angle, background/environment and overall composition. Use a realistic young adult Indian male fashion subject, visually 18–22 years old, with natural adult anatomy and realistic garment draping. Do not add garments, remove garments, recolour garments, simplify the design, redesign the outfit or substitute another garment. Do not invent details that are not visible. The mannequin/subject changes; THE OUTFIT DOES NOT.",
    "sourceReference": "Supplied MEN 210 reference outfit prompt pack · traditional_outfits_sheet_2_21 · panel 21",
    "sourceNote": "Content locked verbatim from the user-supplied MEN 210 reference outfit prompt pack. Structured fields are derived only from the visible outfit definition; null means the definition states no supported fact for that field. Old Men 336 catalog data is not used."
  }
];

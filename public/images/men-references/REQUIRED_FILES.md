# Men reference sheets — required files

These 10 reference sheets are the source of truth for the locked Men 210 look
catalog. Save the ORIGINAL supplied files here byte-for-byte — do NOT edit, crop,
resize, compress, recolour, reorder panels, or regenerate them. Each sheet holds
21 panels (read left→right, top→bottom); 10 × 21 = 210 looks.

| # | Filename | Looks | Occasion |
|---|----------|-------|----------|
| 1 | garba_navratri_men_sheet_1_21.jpg | #001–#021 | Garba / Navratri |
| 2 | garba_navratri_men_sheet_2_21.jpg | #022–#042 | Garba / Navratri |
| 3 | college_fest_men_sheet_1_21.jpg   | #043–#063 | College Fest |
| 4 | college_fest_men_sheet_2_21.jpg   | #064–#084 | College Fest |
| 5 | diwali_men_sheet_1_21.jpg         | #085–#105 | Diwali |
| 6 | diwali_men_sheet_2_21.jpg         | #106–#126 | Diwali |
| 7 | festive_party_men_sheet_1_21.jpg  | #127–#147 | Festive Party |
| 8 | festive_party_men_sheet_2_21.jpg  | #148–#168 | Festive Party |
| 9 | traditional_men_sheet_1_21.jpg    | #169–#189 | Traditional |
| 10| traditional_men_sheet_2_21.jpg    | #190–#210 | Traditional |

Every men-look record in src/data/men-look-catalog.client.json carries a
`referenceImage` (images/men-references/<file>) and `panel` (1–21) wired to the
file above. The panels resolve to real imagery only once these 10 files are saved.

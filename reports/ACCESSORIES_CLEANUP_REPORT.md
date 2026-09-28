# VIRAAS — Accessories Cleanup & Support Report

Source of truth for accessory support = the approved **210 Men** + **236 Women** look catalogs (Couple looks not
required). Machine-readable detail: [`reports/accessories-mapping.json`](./accessories-mapping.json).

## 1. Beauty removed (applied this phase)

All **16 Beauty** accessory products were **removed at source** (the `Beauty` category was deleted from
`data-src/taxonomy.mjs`) and from the committed `src/data/catalog.json` / `catalog.client.json`. Removing the source
block means `build-catalog` will not regenerate any Beauty product on future builds. No Beauty images exist or were
created; no replacements were added.

- Catalog total: **861 → 845** (−16, all Beauty).
- Beauty products remaining: **0** (verified in both catalog files).

## 2. Remaining accessories (78) — support against approved look data

| Category | Count | Supported by approved looks? | Basis |
|---|---:|:--:|---|
| Jewellery | 30 | ✅ Yes | Jhumka / choker / bangle / oxidised / maang-tikka etc. described in **68 women** + **22 men** approved looks |
| Footwear (women) | 18 | ✅ Yes (category) | Juttis/mojaris/kolhapuris described in **51 men** looks; women footwear is not itemised in approved women data, but footwear as a category is supported |
| Men Footwear | 12 | ✅ Yes | Mojaris / kolhapuris / loafers described in **51 men** approved looks |
| **Bags** | **18** | ❌ **No** | **No** approved Men or Women look mentions a bag / potli / clutch / sling (0 / 0) |

**Total remaining accessory:true products: 78.**

### Occasion correction (applied)

All 78 non-Beauty accessories previously carried a synthetic **all-5-occasion** tag
(`garba, college-fest, diwali, festive-party, traditional`). Because their source of truth is the approved
Garba/Navratri look catalogs, their occasion was corrected to **`["garba"]`** (the Garba/Navratri edit) in both
`data-src/taxonomy.mjs` and the committed catalog files. No occasion was invented.

## 3. Recommendation on Bags (needs your decision)

**Bags (18)** are **not supported by any approved look** and, per the "keep only genuinely supported categories"
directive, are candidates for removal. They were **not** removed this phase because only Beauty removal was explicitly
approved. Options: (a) remove the `Bags` block from `data-src/taxonomy.mjs` (same mechanism as Beauty), or
(b) keep them if you consider bags an intentional standalone accessory line. **No action taken yet.**

## 4. Accessory → supporting look → image status

Full per-product mapping is in `reports/accessories-mapping.json`. For every accessory it records: supporting approved
look source (Men-210 or Women-236 catalog), whether look images/references exist as visual context (**yes for all**),
whether the accessory has its **own** product image (**none do**), and `futureImageRequired`.

| Category | Future image required |
|---|---:|
| Jewellery | 30 / 30 |
| Footwear (women) | 18 / 18 |
| Men Footwear | 12 / 12 |
| Bags | 18 / 18 |
| **Total** | **78 / 78** |

**Image rule enforced in the report:** each accessory needs a **dedicated accessory product image** — outfit/look
images must **never** be reused as an accessory product image. No accessory images were generated in this phase.

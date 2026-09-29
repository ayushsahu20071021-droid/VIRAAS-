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

## 1b. Bags removed (applied in the Bags-cleanup follow-up)

All **18 Bags** accessory products were **removed at source** (the `Bags` category was deleted from
`data-src/taxonomy.mjs`) and from the committed `src/data/catalog.json` / `catalog.client.json`. No approved Men (0)
or Women (0) look references any bag / potli / clutch / sling, so Bags is unsupported by the approved catalog source
of truth. Removing the source block means `build-catalog` will not regenerate any Bags product on future builds.

- Catalog total: **845 → 827** (−18, all Bags).
- Bags products remaining: **0** (verified in both catalog files and on a fresh `build-catalog` regen).

## 2. Final accessories (60) — support against approved look data

| Category | Count | Supported by approved looks? | Basis |
|---|---:|:--:|---|
| Jewellery | 30 | ✅ Yes | Jhumka / choker / bangle / oxidised / maang-tikka etc. described in **68 women** + **22 men** approved looks |
| Footwear (women) | 18 | ✅ Yes (category) | Juttis/mojaris/kolhapuris described in **51 men** looks; women footwear is not itemised in approved women data, but footwear as a category is supported |
| Men Footwear | 12 | ✅ Yes | Mojaris / kolhapuris / loafers described in **51 men** approved looks |
| Bags | 0 | — | **Removed** — unsupported by approved data (see §1b) |

**Final accessories total: 60** (Jewellery 30 + Footwear 30 · Beauty 0 · Bags 0). Presentation remains the
**Garba / Navratri Accessories Edit**. Jewellery and Footwear were not touched.

### Traditional Layer excluded from the Accessories view (view fix)

Traditional Layer (32 men Stole/Dupatta/Shawl products) is **apparel** (`accessory: false`), not an accessory. It had
been appearing in the Accessories page via a special-case in `src/pages/Listing.tsx`
(`… || p.category === 'Traditional Layer'`), inflating the page to 92. The Accessories view now filters strictly on
build-catalog's **`accessory` source flag** (`list.filter((p) => p.accessory)`), so it shows exactly **60** and
Traditional Layer can never reappear there — proven by a fresh `build-catalog` regeneration (accessory:true = 60,
Traditional Layer stays `accessory:false`). Traditional Layer products remain apparel in the catalog / Trending
(unchanged), and the women-look linkage (236/236) is untouched.

### Occasion correction (applied)

All 78 non-Beauty accessories previously carried a synthetic **all-5-occasion** tag
(`garba, college-fest, diwali, festive-party, traditional`). Because their source of truth is the approved
Garba/Navratri look catalogs, their occasion was corrected to **`["garba"]`** (the Garba/Navratri edit) in both
`data-src/taxonomy.mjs` and the committed catalog files. No occasion was invented.

## 3. Bags decision — RESOLVED (removed)

Bags were confirmed unsupported (0 Men / 0 Women approved-look references) and have now been **removed at source**
(see §1b). This is applied and persists through production rebuilds.

## 4. Accessory → supporting look → image status

Full per-product mapping is in `reports/accessories-mapping.json`. For every accessory it records: supporting approved
look source (Men-210 or Women-236 catalog), whether look images/references exist as visual context (**yes for all**),
whether the accessory has its **own** product image (**none do**), and `futureImageRequired`.

| Category | Future image required |
|---|---:|
| Jewellery | 30 / 30 |
| Footwear (women) | 18 / 18 |
| Men Footwear | 12 / 12 |
| **Total** | **60 / 60** |

**Image rule enforced in the report:** each accessory needs a **dedicated accessory product image** — outfit/look
images must **never** be reused as an accessory product image. No accessory images were generated in this phase.

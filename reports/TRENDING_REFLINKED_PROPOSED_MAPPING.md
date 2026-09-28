# VIRAAS — Reference-linked Trending: PROPOSED approved-look mapping (REPORT ONLY)

**Scope:** the 427 reference-linked Trending products (**206 Men + 221 Women**) and the approved look each one
*could* inherit its image/content from.

> **Nothing here has been applied.** The catalog images and content are **unchanged**. This is a proposal for owner
> review, per the chosen "produce a proposed mapping table for your approval" option. No images were generated.

Machine-readable source: [`reports/trending-reflinked-proposed-mapping.json`](./trending-reflinked-proposed-mapping.json).

## Key finding — two different kinds of "link"

The audit assumed all 427 were cleanly "reference-linked" to approved looks. In the actual data there are **two very
different situations**, and they must be treated differently:

| Gender | Count | Link quality | Basis |
|---|---|---|---|
| **Women** | **221** | **Data-link (high confidence)** | `women-look-catalog.sourceProductId` declares the exact shop product id for each approved women look. Every one of the 221 women products resolves to a specific `women-look-NNN` with an existing preview image. |
| **Men** | **206** | **Content-heuristic (proposed, needs review)** | `men-look-catalog` has **no** product-id field. There is **no data link** from a men product to a specific approved men look. The proposal is a deterministic best-match on garment type + primary colour only. |

The product `reference` field itself (`REF-M#`, `REF-W#`, `GARBA-REF-#`, `LOOK-#`, `REF-C#`, `REF-S#`) points to
**visual-direction Pinterest/couple references** in `data-src/references.mjs`, **not** to approved look ids — so it
cannot by itself resolve a product to a `men-look-NNN` / `women-look-NNN`.

## Confidence distribution

| Confidence | Count | Meaning |
|---|---|---|
| high | 221 | Women — exact `sourceProductId` data-link |
| medium | 139 | Men — strong garment+colour heuristic match |
| low | 67 | Men — weak heuristic match, review before use |
| Look image available | 427 / 427 | Every proposed look has an existing preview PNG |

## Recommendation

1. **Women (221):** the `sourceProductId` mapping is authoritative and safe to apply when you approve — each product
   would show its exact `women-look-NNN` preview image. Note this depends on the current committed `catalog.json`
   product ids; a fresh `build-catalog` run currently changes ~55 women slugs and would break those links (see the
   pre-existing drift note below).
2. **Men (206):** do **not** auto-apply. Either (a) add a `sourceProductId` field to `men-look-catalog` so men gets a
   real data-link like women, or (b) manually confirm the heuristic pairings (especially the 67 low-confidence ones)
   before any image inheritance.

## ⚠ Pre-existing catalog / source drift (not introduced by this task)

The committed `src/data/catalog.json` was authored against an older `data-src/taxonomy.mjs`. Regenerating with
`scripts/build-catalog.mjs` today produces **448** reference-linked products (212 M / 236 W) and changes ~55 product
slugs, which **breaks 55 of the 236** women `sourceProductId` links. To keep every women data-link intact and to keep
the audit's 206/221/340 figures valid, this task **preserved the committed catalog** (surgically removing only Beauty
and correcting accessory occasions) and did **not** commit a full regeneration. Re-syncing taxonomy ↔ catalog ↔
women-look `sourceProductId` is a separate remediation and should be done deliberately.

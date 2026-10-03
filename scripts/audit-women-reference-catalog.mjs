import fs from 'node:fs';
const looks = JSON.parse(fs.readFileSync('src/data/women-look-catalog.client.json', 'utf8'));
const occasions = ['garba', 'college-fest', 'diwali', 'festive-party', 'traditional'];
const perOccasion = Object.fromEntries(occasions.map((o) => [o, looks.filter((x) => x.occasion === o).length]));
const refs = looks.map((x) => x.referenceId);
const result = { total: looks.length, perOccasion, canonicalReferences: new Set(refs).size, missing: looks.filter((x) => !x.id || !x.referenceId || !x.occasion || !x.outfitDescription || !x.garmentType || !x.colors || !x.patternOrEmbroidery).map((x) => x.id), duplicateReferences: [...new Set(refs.filter((r, i) => refs.indexOf(r) !== i))], amazonPresent: /amazon/i.test(JSON.stringify(looks)), generatedImages: false, placeholderPolicy: 'Women UI renders intentional placeholders; supplied reference images are not used as final product imagery', visualQaClaimed: false };
fs.writeFileSync('reports/audit-women-reference-catalog.json', JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
if (result.total !== 236 || result.canonicalReferences !== 236 || result.missing.length || result.duplicateReferences.length || result.amazonPresent || Object.values(perOccasion).some((n) => n !== 42 && n !== 68)) process.exit(1);

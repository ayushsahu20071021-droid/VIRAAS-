import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => JSON.parse(fs.readFileSync(path.join(ROOT, relative), 'utf8'));
const workbook = read('src/data/workbook-mappings.json');
const previews = read('src/data/women-previews.client.json');
const expected = [
  ['garba-navratri', 68, 0],
  ['college-fest', 42, 68],
  ['diwali-outfits', 3, 110],
];
const problems = [];
const counts = { sections: workbook.sections.length, lookRows: 0, mappedShopLinks: 0, titledComponents: 0, unnamedLinks: 0, restrictedRows: 0, unavailableLooks: 0, blankLooks: 0, accessoryLinks: 0, liveTryOnLooks: 0 };
const allowedDirectHosts = new Set(['ethenika.com', 'bhumikacreation.com', 'samyatisaree.com', 'villagerstrend.com', 'thebeautyqueen.in']);
const seenUrls = new Set();

function check(condition, message) {
  if (!condition) problems.push(message);
}
function isSafeShopUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) return false;
    if (url.hostname === 'wishlink.com' || url.hostname === 'www.wishlink.com') return /^\/share\/[A-Za-z0-9]+$/.test(url.pathname);
    return allowedDirectHosts.has(url.hostname) && url.pathname.length > 1;
  } catch {
    return false;
  }
}

check(workbook.workbook === 'Book1.xlsx', 'source workbook label must remain Book1.xlsx');
check(workbook.worksheet === 'Sheet1', 'source worksheet label must remain Sheet1');
check(JSON.stringify(workbook.sourceSectionLabels) === JSON.stringify(['womes garba/navratri', 'College Fest', 'Diwali outfits']), 'worksheet section order or exact section labels changed');
check(workbook.accessoriesSectionPresent === false, 'workbook Accessories-section presence flag is inconsistent with the inspected sheet');

for (const [id, lookCount, offset] of expected) {
  const section = workbook.sections.find((entry) => entry.id === id);
  check(Boolean(section), `missing section ${id}`);
  if (!section) continue;
  check(section.looks.length === lookCount, `${id} must preserve ${lookCount} numbered looks`);
  check(section.firstLook === 1 && section.lastLook === lookCount, `${id} look-number range changed`);
  check(section.womenLookOffset === offset, `${id} no longer maps to its existing Women look IDs`);
  check(section.looks.every((look, index) => look.number === index + 1), `${id} numbering/order is not contiguous and exact`);
  counts.lookRows += section.looks.length;

  for (const look of section.looks) {
    if (look.status === 'restricted') counts.restrictedRows += 1;
    if (look.status === 'unavailable') counts.unavailableLooks += 1;
    if (look.status === 'empty') counts.blankLooks += 1;
    const absoluteLook = offset + look.number;
    if (absoluteLook <= 110 && previews[`women-look-${String(absoluteLook).padStart(3, '0')}`]?.live) counts.liveTryOnLooks += 1;
    if (look.status === 'mapped') check(look.components.length > 0, `${id} look ${look.number} is marked mapped but has no components`);

    for (const component of look.components) {
      if (component.accessory) counts.accessoryLinks += 1;
      if (component.sourceTitle) counts.titledComponents += 1;
      if (component.shopUrl) {
        counts.mappedShopLinks += 1;
        if (!component.sourceTitle) counts.unnamedLinks += 1;
        check(isSafeShopUrl(component.shopUrl), `invalid or unsupported exact Shop URL on ${id} look ${look.number}`);
        check(!seenUrls.has(component.shopUrl), `duplicate mapped URL on ${id} look ${look.number}`);
        seenUrls.add(component.shopUrl);
      } else if (look.status === 'mapped') {
        check(component.reason || component.sourceTitle, `unlinked component on ${id} look ${look.number} needs a source status`);
      }
    }
  }
}

const garba = workbook.sections.find((entry) => entry.id === 'garba-navratri');
const college = workbook.sections.find((entry) => entry.id === 'college-fest');
const diwali = workbook.sections.find((entry) => entry.id === 'diwali-outfits');
check(Boolean(garba && college && diwali), 'all inspected worksheet sections must be recorded');
const linksIn = (section) => section?.looks.flatMap((look) => look.components).filter((component) => component.shopUrl).length ?? 0;
check(linksIn(garba) === 79, 'Garba/Navratri must retain its 79 exact Shop links');
check(linksIn(college) === 11, 'College Fest must retain its 11 exact Shop links');
check(linksIn(diwali) === 0, 'blank Diwali rows must not gain invented Shop links');
check(counts.titledComponents === 83 && counts.unnamedLinks === 7, 'source titles and the seven untitled exact links changed');
check(counts.unavailableLooks === 7 && counts.blankLooks === 35, 'unavailable and blank source rows changed status');
check(counts.accessoryLinks === 1, 'only the explicitly named waist-chain item should be surfaced as a standalone mapped accessory');
check(counts.mappedShopLinks === 90, 'mapped Shop-link count changed from the inspected workbook');
const allShopUrls = workbook.sections.flatMap((section) => section.looks.flatMap((look) => look.components.map((component) => component.shopUrl).filter(Boolean)));
check(allShopUrls.filter((value) => /(^|\.)wishlink\.com\//.test(new URL(value).host + new URL(value).pathname)).length === 85, 'Wishlink exact-share link count changed');
check(allShopUrls.filter((value) => !/(^|\.)wishlink\.com$/.test(new URL(value).hostname)).length === 5, 'direct merchant product-link count changed');
check(counts.liveTryOnLooks === 110, 'the 110 Garba/Navratri and College Fest whole-look Try-On images are not all live');
check(counts.restrictedRows === 1, 'the single source row withheld by the existing merchant-exclusion requirement changed');

const result = {
  status: problems.length ? 'FAIL' : 'PASS — exact source mapping',
  source: { workbook: workbook.workbook, worksheet: workbook.worksheet, sectionLabels: workbook.sourceSectionLabels },
  counts,
  accessories: {
    workbookSectionPresent: workbook.accessoriesSectionPresent,
    mappedStandaloneAccessories: counts.accessoryLinks,
    tryOnShownOnAccessoryItem: false,
    note: 'No standalone Accessories section is present in Sheet1; the exact College Fest waist-chain item is mapped on the site Accessories page and has no item-specific Try-On image.'
  },
  problems,
};
fs.mkdirSync(path.join(ROOT, 'reports'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'reports/audit-workbook-mapping.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
if (problems.length) process.exitCode = 1;

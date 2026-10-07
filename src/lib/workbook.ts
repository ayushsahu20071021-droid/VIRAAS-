import raw from '../data/workbook-mappings.json';

export interface WorkbookComponent {
  sourceTitle: string | null;
  shopUrl: string | null;
  reason?: string;
  accessory?: boolean;
}
export interface WorkbookLook {
  number: number;
  status: 'mapped' | 'unavailable' | 'restricted' | 'empty';
  components: WorkbookComponent[];
}
export interface WorkbookSection {
  id: string;
  label: string;
  firstLook: number;
  lastLook: number;
  womenLookOffset: number;
  looks: WorkbookLook[];
}
export interface WorkbookDataset {
  workbook: string;
  worksheet: string;
  sourceSectionLabels: string[];
  accessoriesSectionPresent: boolean;
  sections: WorkbookSection[];
}

export const WORKBOOK = raw as WorkbookDataset;
export const WORKBOOK_SECTIONS = WORKBOOK.sections;
const sectionsById = new Map(WORKBOOK_SECTIONS.map((section) => [section.id, section]));
const trustedShopHosts = new Set([
  'wishlink.com', 'www.wishlink.com',
  'ethenika.com', 'bhumikacreation.com', 'samyatisaree.com',
  'villagerstrend.com', 'thebeautyqueen.in',
]);

function validWorkbookShopUrl(value: string | null | undefined): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || !trustedShopHosts.has(url.hostname)) return false;
    if (url.hostname === 'wishlink.com' || url.hostname === 'www.wishlink.com') {
      return /^\/share\/[A-Za-z0-9]+$/.test(url.pathname);
    }
    return url.pathname.length > 1;
  } catch {
    return false;
  }
}

export function workbookSection(sectionId: string): WorkbookSection | undefined {
  return sectionsById.get(sectionId);
}

export function workbookLook(sectionId: string, number: number): WorkbookLook | undefined {
  return sectionsById.get(sectionId)?.looks.find((look) => look.number === number);
}

/** Map existing numbered Women looks to the workbook's section without changing their IDs. */
export function workbookLookForWomenId(id: string): { section: WorkbookSection; look: WorkbookLook } | undefined {
  const match = /^women-look-(\d{3})$/.exec(id);
  if (!match) return undefined;
  const absolute = Number(match[1]);
  for (const section of WORKBOOK_SECTIONS) {
    const lookNumber = absolute - section.womenLookOffset;
    if (lookNumber < section.firstLook || lookNumber > section.lastLook) continue;
    const look = section.looks.find((entry) => entry.number === lookNumber);
    if (look) return { section, look };
  }
  return undefined;
}

export function workbookShopUrl(component: WorkbookComponent): string | undefined {
  return validWorkbookShopUrl(component.shopUrl) ? component.shopUrl : undefined;
}

export function workbookAccessoryComponents(): Array<{ section: WorkbookSection; look: WorkbookLook; component: WorkbookComponent; index: number }> {
  const items: Array<{ section: WorkbookSection; look: WorkbookLook; component: WorkbookComponent; index: number }> = [];
  for (const section of WORKBOOK_SECTIONS) {
    for (const look of section.looks) {
      look.components.forEach((component, index) => {
        if (component.accessory && workbookShopUrl(component)) items.push({ section, look, component, index });
      });
    }
  }
  return items;
}

/** Catalog-safe searchable rows for a future server-side assistant; links are always looked up from this allowlisted dataset. */
export function workbookSearchRows() {
  const rows: Array<{ id: string; section: string; lookNumber: number; title: string; shopUrl: string; accessory: boolean }> = [];
  for (const section of WORKBOOK_SECTIONS) {
    for (const look of section.looks) {
      look.components.forEach((component, index) => {
        const shopUrl = workbookShopUrl(component);
        if (!shopUrl || !component.sourceTitle) return;
        rows.push({
          id: `${section.id}-${look.number}-${index + 1}`,
          section: section.label,
          lookNumber: look.number,
          title: component.sourceTitle,
          shopUrl,
          accessory: Boolean(component.accessory),
        });
      });
    }
  }
  return rows;
}

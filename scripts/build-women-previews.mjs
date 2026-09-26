// Builds src/data/women-previews.client.json — the LIVE image-status map for the 236 Women looks.
// Source of truth: data-src/image-qa.json (never mutated here) + the generated PNGs in
// public/images/women-previews/. A look's image is exposed to the client ONLY when it is
// genuinely QA_PASS + approved + live AND the PNG actually exists on disk. QA_FAIL / pending
// looks get an empty src so the UI keeps its honest "image pending" placeholder.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const rd = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

const QA = rd('data-src/image-qa.json');
const LOOKS = rd('src/data/women-look-catalog.client.json');
const PREVIEW_DIR = 'public/images/women-previews';

const status = {};
let live = 0, pending = 0, missing = 0, fail = 0;

for (const look of LOOKS) {
  const id = look.id;
  const qa = QA[`women:${id}`] || {};
  const file = `${PREVIEW_DIR}/${id}.png`;
  const exists = fs.existsSync(path.join(ROOT, file));
  const passed = qa.qaStatus === 'QA_PASS' && qa.approval === 'APPROVED' && qa.live === true;
  const show = passed && exists;
  if (!exists) missing++;
  if (qa.qaStatus === 'QA_FAIL') fail++;
  if (show) live++; else pending++;
  status[id] = {
    qaStatus: qa.qaStatus || 'PENDING',
    approval: qa.approval || 'PENDING',
    live: show,
    referenceId: look.referenceId,
    src: show ? `/${file.replace(/^public\//, '')}` : '',
  };
}

fs.writeFileSync(
  path.join(ROOT, 'src/data/women-previews.client.json'),
  JSON.stringify(status, null, 2),
);

console.log(`women-previews: ${LOOKS.length} looks · live ${live} · not-live ${pending} · QA_FAIL ${fail} · missing PNG ${missing}`);

import fs from 'node:fs';
import path from 'node:path';
export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
export const readJSON = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
export function report(name, checks) {
  let fail = 0;
  for (const [ok, msg, level] of checks) {
    const tag = ok ? 'PASS' : (level === 'warn' ? 'WARN' : level === 'gate' ? 'GATE-OPEN' : 'FAIL');
    if (!ok && level !== 'warn') fail++;
    console.log(`[${tag}] ${msg}`);
  }
  console.log(`\n${name}: ${fail === 0 ? 'PASS' : `FAIL (${fail})`}`);
  fs.mkdirSync(path.join(ROOT, 'reports'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'reports', `${name}.json`), JSON.stringify({ name, pass: fail === 0, checks: checks.map(([ok, msg, level]) => ({ ok, msg, level: level || 'error' })) }, null, 2));
  process.exitCode = fail ? 1 : 0;
  return fail === 0;
}

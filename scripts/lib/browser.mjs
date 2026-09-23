// Launches a headless Chromium for render audits. Uses @sparticuz/chromium binary (sandbox has no system Chrome).
import { chromium } from 'playwright';
import fs from 'node:fs';
export async function launch() {
  let executablePath;
  let env = process.env;
  try {
    const sp = (await import('@sparticuz/chromium')).default;
    executablePath = await sp.executablePath();
    if (fs.existsSync('/tmp/al2023/lib')) env = { ...env, LD_LIBRARY_PATH: `/tmp/al2023/lib:/tmp:${env.LD_LIBRARY_PATH || ''}` };
    else if (fs.existsSync('/tmp/al/lib')) env = { ...env, LD_LIBRARY_PATH: `/tmp/al/lib:/tmp:${env.LD_LIBRARY_PATH || ''}` };
  } catch { /* fall back to playwright-managed browser */ }
  return chromium.launch({ executablePath, env, args: ['--no-sandbox', '--disable-gpu', '--use-gl=swiftshader', '--single-process', '--no-zygote'] });
}
export const BASE = process.env.VIRAAS_URL || 'http://127.0.0.1:8787';

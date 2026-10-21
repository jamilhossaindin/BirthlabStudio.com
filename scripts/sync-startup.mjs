// Install the canonical navigation snapshot in every initial HTML document.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { publicSurface } from './security-policy.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const navigation = fs.readFileSync(path.join(root, 'scripts/navigation-fallback.html'), 'utf8').trim();
const head = '<!-- birthlab-startup-head --><link rel="stylesheet" href="/assets/runtime-scripts/site-startup.css"><script src="/assets/runtime-scripts/site-startup.js"></script><!-- /birthlab-startup-head -->';

export function installStartupDocument(document) {
  const clean = document
    .replace(/<!-- birthlab-startup-head -->[\s\S]*?<!-- \/birthlab-startup-head -->/g, '')
    .replace(/<!-- birthlab-startup-nav -->[\s\S]*?<!-- \/birthlab-startup-nav -->/g, '');
  const withHead = clean.replace(/<meta\b[^>]*name="viewport"[^>]*>/i, match => match + head);
  // The standalone After Hours experience intentionally has no site navigation.
  if (!/<nav\b[^>]*class="[^"]*(?:framer-kxv43|services-static-nav)/.test(clean)) return withHead;
  return withHead.replace(/<body\b[^>]*>/i, match => match + '<!-- birthlab-startup-nav -->' + navigation + '<!-- /birthlab-startup-nav -->');
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  for (const file of publicSurface(root).pages) {
    const target = path.join(root, file);
    fs.writeFileSync(target, installStartupDocument(fs.readFileSync(target, 'utf8')));
  }
  console.log('Synced responsive startup navigation across all public pages.');
}

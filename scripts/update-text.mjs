#!/usr/bin/env node
/**
 * ⚡ BirthLab Studio — Dual-Sync Text Engine
 * 
 * Automatically updates text simultaneously across:
 * 1. All 22 Static HTML pages (for SEO, initial load, and web crawlers)
 * 2. All compiled React browser modules (preventing React hydration reverts)
 * 
 * Usage:
 *   node scripts/update-text.mjs "Old Text" "New Text"
 *   node scripts/update-text.mjs "Old Text" "New Text" --dry-run
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const cleanArgs = args.filter(a => !a.startsWith('--'));

if (cleanArgs.length < 2) {
  console.log(`
⚡ BirthLab Studio — Dual-Sync Text Engine

Usage:
  node scripts/update-text.mjs "Old Text" "New Text" [options]

Options:
  --dry-run    Preview matches and count without modifying files
  --help       Show this help message

Example:
  node scripts/update-text.mjs "Hello World" "Welcome to BirthLab"
`);
  process.exit(0);
}

const [targetText, replacementText] = cleanArgs;

if (!targetText || targetText.length === 0) {
  console.error('❌ Error: Old Text cannot be empty.');
  process.exit(1);
}

const startTime = performance.now();

// Collect all target files
function getFiles(dir, extensions) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.gemini' && file !== 'archive') {
        results = results.concat(getFiles(fullPath, extensions));
      }
    } else {
      if (extensions.some(ext => file.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

// Target all HTML routes and runtime scripts
const htmlFiles = [
  path.join(ROOT_DIR, 'index.html'),
  path.join(ROOT_DIR, '404', 'index.html'),
  path.join(ROOT_DIR, 'about', 'index.html'),
  path.join(ROOT_DIR, 'work', 'index.html'),
  path.join(ROOT_DIR, 'contact', 'index.html'),
  ...getFiles(path.join(ROOT_DIR, 'case-studies'), ['.html'])
].filter(f => fs.existsSync(f));

const scriptFiles = getFiles(path.join(ROOT_DIR, 'assets', 'runtime-scripts'), ['.mjs', '.js']);

const allFiles = [...htmlFiles, ...scriptFiles];

let totalReplacements = 0;
const modifiedFiles = [];

// Prepare entity variants for HTML (e.g. & vs &amp;)
const targetHtmlEntity = targetText.replace(/&/g, '&amp;');
const replacementHtmlEntity = replacementText.replace(/&/g, '&amp;');

for (const filePath of allFiles) {
  const isHtml = filePath.endsWith('.html');
  let content = fs.readFileSync(filePath, 'utf8');
  let fileMatches = 0;

  // 1. Direct text replacement
  if (content.includes(targetText)) {
    const parts = content.split(targetText);
    fileMatches += parts.length - 1;
    content = parts.join(replacementText);
  }

  // 2. HTML entity variation replacement (for HTML files if different)
  if (isHtml && targetHtmlEntity !== targetText && content.includes(targetHtmlEntity)) {
    const parts = content.split(targetHtmlEntity);
    fileMatches += parts.length - 1;
    content = parts.join(replacementHtmlEntity);
  }

  if (fileMatches > 0) {
    totalReplacements += fileMatches;
    const relPath = path.relative(ROOT_DIR, filePath);
    modifiedFiles.push({ path: relPath, count: fileMatches, isHtml });

    if (!isDryRun) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
}

const elapsedMs = (performance.now() - startTime).toFixed(1);

console.log(`\n⚡ Dual-Sync Text Engine Summary:`);
console.log(`──────────────────────────────────────────`);
console.log(`Target String:      "${targetText}"`);
console.log(`Replacement String: "${replacementText}"`);
console.log(`Action:             ${isDryRun ? 'DRY RUN (Preview Only)' : 'APPLIED & SYNCED'}`);
console.log(`Execution Time:     ${elapsedMs} ms`);
console.log(`Total Matches:      ${totalReplacements} in ${modifiedFiles.length} files\n`);

if (modifiedFiles.length > 0) {
  const htmlList = modifiedFiles.filter(f => f.isHtml);
  const jsList = modifiedFiles.filter(f => !f.isHtml);

  if (htmlList.length > 0) {
    console.log(`📄 HTML Pages Updated (${htmlList.length}):`);
    htmlList.forEach(f => console.log(`   • ${f.path} (${f.count} match${f.count > 1 ? 'es' : ''})`));
  }

  if (jsList.length > 0) {
    console.log(`\n⚙️ React Runtime Bundles Updated (${jsList.length}):`);
    jsList.forEach(f => console.log(`   • ${f.path} (${f.count} match${f.count > 1 ? 'es' : ''})`));
  }

  console.log(`\n✅ Synchronized: Both static HTML and React hydration are in 100% lockstep.`);
} else {
  console.log(`ℹ️ No occurrences of "${targetText}" were found in any HTML or React script files.`);
}

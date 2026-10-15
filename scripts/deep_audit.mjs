import fs from 'fs';
import path from 'path';

const searchTerms = [
  'mikekus',
  'mikejkus',
  'mike',
  'kus',
  'pocket photographer',
  'foliostack',
  'photobook',
  'photo book',
  'contra.com/mike',
  'contra.com',
  'framerusercontent',
  'framer.com'
];

function walk(dir) {
  let files = [];
  for (const f of fs.readdirSync(dir)) {
    if (f === 'node_modules' || f === '.git' || f === 'scripts') continue;
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      files = files.concat(walk(p));
    } else {
      files.push(p);
    }
  }
  return files;
}

const allFiles = walk('.');
console.log('Total files scanned:', allFiles.length);

const results = {};

for (const f of allFiles) {
  if (!/\.(html|mjs|js|json|css|svg|txt|xml|md)$/i.test(f)) continue;
  if (f.startsWith('.gemini') || f.startsWith('scratch') || f.includes('docs/archive')) continue;

  const content = fs.readFileSync(f, 'utf8');
  for (const term of searchTerms) {
    const regex = new RegExp(term, 'gi');
    let m;
    while ((m = regex.exec(content)) !== null) {
      if (!results[term]) results[term] = [];
      const start = Math.max(0, m.index - 50);
      const end = Math.min(content.length, m.index + term.length + 50);
      const snippet = content.substring(start, end).replace(/\s+/g, ' ');
      results[term].push({ file: f, index: m.index, snippet });
      if (results[term].length >= 50) break;
    }
  }
}

for (const [term, hits] of Object.entries(results)) {
  console.log(`\n========================================`);
  console.log(`TERM: "${term}" (${hits.length} occurrences found)`);
  const uniqueFiles = [...new Set(hits.map(h => h.file))];
  console.log(`In ${uniqueFiles.length} files:`, uniqueFiles);
  hits.slice(0, 8).forEach(h => {
    console.log(`  [${h.file}]: ...${h.snippet}...`);
  });
}

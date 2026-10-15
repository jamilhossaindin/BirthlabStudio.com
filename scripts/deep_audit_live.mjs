import fs from 'fs';
import path from 'path';

const liveDirs = [
  'index.html',
  'about',
  'work',
  'contact',
  '404',
  'case-studies',
  'assets/runtime-scripts'
];

function getFiles(target) {
  if (!fs.existsSync(target)) return [];
  const stat = fs.statSync(target);
  if (!stat.isDirectory()) return [target];
  let files = [];
  for (const f of fs.readdirSync(target)) {
    const full = path.join(target, f);
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(getFiles(full));
    } else if (/\.(html|mjs|js|json|css|svg)$/i.test(full)) {
      files.push(full);
    }
  }
  return files;
}

const liveFiles = liveDirs.flatMap(getFiles);
console.log(`Auditing ${liveFiles.length} live files...`);

const searchPatterns = [
  { name: 'contra.com/mike', regex: /contra\.com\/mike[^\s"'<>]+/gi },
  { name: 'mikekus.com', regex: /mikekus\.com/gi },
  { name: 'mikekus (generic)', regex: /mikekus/gi },
  { name: 'mikejkus', regex: /mikejkus/gi },
  { name: 'Mike Kus', regex: /Mike\s+Kus/gi },
  { name: 'kus (standalone word)', regex: /\bkus\b/gi },
  { name: 'Mike (standalone word)', regex: /\bMike\b/gi },
  { name: 'Foliostack', regex: /foliostack/gi },
  { name: 'Pocket Photographer', regex: /pocket\s+photographer/gi },
  { name: 'Photo Book (legacy product)', regex: /photo\s*book/gi },
  { name: 'framer.website', regex: /[a-z0-9-]+\.framer\.website/gi },
  { name: 'framerusercontent', regex: /framerusercontent\.com/gi },
  { name: 'Personal pronouns for BirthLab (his/him/he)', regex: /\b(his|him)\s+(fantastic|design|manner|laidback|work|skills|professional)\b/gi }
];

let totalHits = 0;
const report = [];

for (const file of liveFiles) {
  const content = fs.readFileSync(file, 'utf8');
  for (const pat of searchPatterns) {
    let m;
    while ((m = pat.regex.exec(content)) !== null) {
      totalHits++;
      const start = Math.max(0, m.index - 50);
      const end = Math.min(content.length, m.index + m[0].length + 50);
      const snippet = content.substring(start, end).replace(/\s+/g, ' ');
      report.push({
        file,
        pattern: pat.name,
        match: m[0],
        snippet
      });
    }
  }
}

console.log(`\nTOTAL LIVE TRACES FOUND: ${totalHits}`);

// Group by pattern
const grouped = {};
for (const item of report) {
  if (!grouped[item.pattern]) grouped[item.pattern] = [];
  grouped[item.pattern].push(item);
}

for (const [pattern, items] of Object.entries(grouped)) {
  console.log(`\n========================================`);
  console.log(`PATTERN: ${pattern} (${items.length} occurrences)`);
  const uniqueFiles = [...new Set(items.map(i => i.file))];
  console.log(`Affecting ${uniqueFiles.length} files:`, uniqueFiles);
  items.slice(0, 5).forEach(i => {
    console.log(`  [${i.file}]: ...${i.snippet}...`);
  });
}

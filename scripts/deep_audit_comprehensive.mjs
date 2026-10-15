import fs from 'fs';
import path from 'path';

function walk(dir) {
  let files = [];
  for (const f of fs.readdirSync(dir)) {
    if (f === 'node_modules' || f === '.git' || f === 'scripts') continue;
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      files = files.concat(walk(p));
    } else if (/\.(html|mjs|js|json|css|svg)$/i.test(p)) {
      files.push(p);
    }
  }
  return files;
}

const files = walk('.');

console.log(`Checking ${files.length} files across workspace...`);

// Check 1: All emails
const emailSet = new Set();
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  const matches = c.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
  matches.forEach(e => emailSet.add(`${e} (found in ${f})`));
}
console.log('\n--- ALL DETECTED EMAILS ---');
Array.from(emailSet).forEach(e => console.log(' ', e));

// Check 2: External URLs
const urlSet = new Set();
for (const f of files) {
  if (f.includes('docs/archive')) continue;
  const c = fs.readFileSync(f, 'utf8');
  const matches = c.match(/https?:\/\/[^\s"'<>)]+/g) || [];
  matches.forEach(u => {
    // filter common schema / w3 / fonts / unpkg
    if (u.includes('w3.org') || u.includes('schema.org') || u.includes('googleapis') || u.includes('gstatic')) return;
    urlSet.add(`${u} [in ${f}]`);
  });
}
console.log('\n--- NOTABLE EXTERNAL URLS IN USER-FACING FILES ---');
Array.from(urlSet).filter(u => !u.includes('framerusercontent.com') && !u.includes('framer.com/m/')).slice(0, 30).forEach(u => console.log(' ', u));

// Check 3: Check all case study descriptions and texts for personal references
console.log('\n--- CASE STUDY & NARRATIVE SCAN ---');
for (const f of files) {
  if (!f.endsWith('.html') || f.includes('docs/archive')) continue;
  const c = fs.readFileSync(f, 'utf8');
  
  // Testimonial check
  if (c.includes('understanding of our requirements') || c.includes('his fantastic')) {
    console.log(`[TESTIMONIAL] in ${f}`);
  }
  if (c.includes('Mike Speaking')) {
    console.log(`[MIKE SPEAKING] in ${f}`);
  }
  if (c.includes('contra.com/mikejkus')) {
    console.log(`[CONTRA MIKEJKUS] in ${f}`);
  }
  if (c.includes('mikekus.com')) {
    console.log(`[MIKEKUS.COM] in ${f}`);
  }
  if (c.includes('foliostack')) {
    console.log(`[FOLIOSTACK] in ${f}`);
  }
  if (c.includes('photobook') || c.includes('photo book')) {
    console.log(`[PHOTO BOOK] in ${f}`);
  }
}

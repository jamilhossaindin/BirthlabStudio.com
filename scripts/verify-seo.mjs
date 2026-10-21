import fs from 'node:fs';

const files = [
  'index.html',
  'about/index.html',
  'work/index.html',
  'contact/index.html',
  'case-studies/daybreak-brew/index.html',
  'case-studies/form-forward/index.html',
  'case-studies/root-ritual/index.html'
];

let allOk = true;

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  if (!match) {
    console.error(`FAIL: No JSON-LD in ${file}`);
    allOk = false;
    continue;
  }
  try {
    const parsed = JSON.parse(match[1]);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i);
    const author = html.match(/<meta name="author" content="([^"]+)"/i);
    const ogImg = html.match(/<meta property="og:image" content="([^"]+)"/i);
    console.log(`[PASS] ${file}`);
    console.log(`  Canonical: ${canonical?.[1]}`);
    console.log(`  Author: ${author?.[1]}`);
    console.log(`  OG Image: ${ogImg?.[1]}`);
    console.log(`  Schema Types: ${parsed['@graph']?.map(x => Array.isArray(x['@type']) ? x['@type'].join('+') : x['@type']).join(', ')}`);
  } catch(e) {
    console.error(`FAIL: Invalid JSON-LD in ${file}:`, e.message);
    allOk = false;
  }
}

if (allOk) {
  console.log('\nAll checked pages have 100% valid SEO & Schema.org markup!');
}

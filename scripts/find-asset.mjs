import fs from 'fs';
import path from 'path';

const query = process.argv[2]?.toLowerCase();
if (!query) {
  console.log('Usage: node find-asset.mjs <query>');
  console.log('Example: node find-asset.mjs hero');
  console.log('Example: node find-asset.mjs slashwork');
  console.log('Example: node find-asset.mjs preview');
  process.exit(0);
}

const manifestPath = new URL('../assets/manifest.json', import.meta.url);
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
console.log(`\nSearching for assets matching "${query}"...\n`);
let found = 0;

for (const [category, items] of Object.entries(manifest.categories)) {
  for (const item of items) {
    if (category.toLowerCase().includes(query) || item.cleanName.toLowerCase().includes(query) || item.originalHash.toLowerCase().includes(query)) {
      console.log(`[${category}] ${item.cleanName} (${item.sizeKb} KB)`);
      console.log(`  Organized: ${item.relativePath}`);
      console.log(`  Runtime:   _assets/${item.originalHash}`);
      if (item.usedInPages.length) {
        console.log(`  Used in:   ${item.usedInPages.join(', ')}`);
      }
      console.log('');
      found++;
    }
  }
}
console.log(`Found ${found} matching assets.`);

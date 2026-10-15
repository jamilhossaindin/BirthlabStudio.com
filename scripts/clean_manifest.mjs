import fs from 'fs';

const p = 'assets/manifest.json';
if (fs.existsSync(p)) {
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  let changed = false;
  if (Array.isArray(data)) {
    const filtered = data.filter(item => !JSON.stringify(item).includes('mike-kus'));
    if (filtered.length !== data.length) {
      fs.writeFileSync(p, JSON.stringify(filtered, null, 2));
      console.log('Filtered out mike-kus from assets/manifest.json array');
      changed = true;
    }
  } else if (typeof data === 'object') {
    for (const key of Object.keys(data)) {
      if (key.includes('mike-kus') || JSON.stringify(data[key]).includes('mike-kus')) {
        delete data[key];
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(p, JSON.stringify(data, null, 2));
      console.log('Deleted mike-kus keys from assets/manifest.json');
    }
  }
  if (!changed) console.log('assets/manifest.json is clean.');
}

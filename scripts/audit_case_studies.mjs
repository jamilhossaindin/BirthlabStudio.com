import fs from 'fs';
import path from 'path';

const csDir = 'case-studies';
for (const dir of fs.readdirSync(csDir)) {
  const p = path.join(csDir, dir, 'index.html');
  if (fs.existsSync(p)) {
    const c = fs.readFileSync(p, 'utf8');
    const titleMatch = c.match(/<title>([^<]+)<\/title>/);
    console.log(dir, ':', titleMatch ? titleMatch[1] : 'no title');
    
    // Check occurrences excluding footer (footer was checked)
    const bodyOnly = c.substring(0, c.indexOf('framer-gbxhs'));
    const bodyLower = bodyOnly.toLowerCase();
    
    if (bodyLower.includes('mike') && dir !== 'mikesbeer') {
      console.log('  --> CONTAINS MIKE in body of', dir);
    }
    if (bodyLower.includes('kus')) {
      console.log('  --> CONTAINS KUS in body of', dir);
    }
    if (bodyLower.includes('photo book') || bodyLower.includes('photobook')) {
      console.log('  --> CONTAINS PHOTO BOOK in body of', dir);
    }
  }
}

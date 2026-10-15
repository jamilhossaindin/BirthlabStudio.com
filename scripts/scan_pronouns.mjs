import fs from 'fs';
import path from 'path';

const csDir = 'case-studies';
for (const dir of fs.readdirSync(csDir)) {
  const p = path.join(csDir, dir, 'index.html');
  if (fs.existsSync(p)) {
    const c = fs.readFileSync(p, 'utf8');
    const headerStart = c.indexOf('<header');
    const headerEnd = c.indexOf('</header>');
    if (headerStart !== -1 && headerEnd !== -1) {
      const headerText = c.substring(headerStart, headerEnd);
      
      // Look for "I " or "my " in headerText
      const matches = [...headerText.matchAll(/\b(I|my|me)\b/gi)];
      if (matches.length > 0) {
        console.log(`\n=== CASE STUDY: ${dir} ===`);
        matches.forEach(m => {
          const start = Math.max(0, m.index - 30);
          const end = Math.min(headerText.length, m.index + 50);
          console.log(`  ...${headerText.substring(start, end).replace(/\s+/g, ' ')}...`);
        });
      }
    }
  }
}

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

const allFiles = walk('.');

let contraFixCount = 0;
let pronounFixCount = 0;
let mikeSpeakingFixCount = 0;

for (const file of allFiles) {
  if (file.includes('docs/archive')) continue;
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. Fix contra.com/mikejkus -> contra.com/birthlabstudio
  if (content.includes('contra.com/mikejkus')) {
    content = content.replace(/https:\/\/contra\.com\/mikejkus/g, 'https://contra.com/birthlabstudio');
    contraFixCount++;
    changed = true;
  }

  // 2. Fix personal pronouns in testimonial
  if (content.includes('his fantastic design skills and his laidback')) {
    content = content.replace(
      /his fantastic design skills and his laidback but professional and attentive manner/g,
      'their fantastic design skills and their laidback but professional and attentive manner'
    );
    pronounFixCount++;
    changed = true;
  }

  // 3. Fix "Mike Speaking" component name in About page
  if (content.includes('data-framer-name="Mike Speaking"')) {
    content = content.replace(/data-framer-name="Mike Speaking"/g, 'data-framer-name="Studio Soundscape"');
    mikeSpeakingFixCount++;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}

console.log(`\nSummary of fixes:`);
console.log(`- Contra links updated: ${contraFixCount}`);
console.log(`- Testimonial pronouns updated: ${pronounFixCount}`);
console.log(`- "Mike Speaking" components renamed: ${mikeSpeakingFixCount}`);

// Clean up unused legacy portrait file if it exists
const portraitPath = 'assets/about/mike-kus-portrait.jpg';
if (fs.existsSync(portraitPath)) {
  fs.unlinkSync(portraitPath);
  console.log(`- Deleted unreferenced legacy asset: ${portraitPath}`);
}

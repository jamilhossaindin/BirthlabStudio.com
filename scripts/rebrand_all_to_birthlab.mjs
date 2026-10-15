import fs from 'fs';
import path from 'path';

console.log('--- STARTING TOTAL REBRAND TO BIRTHLAB STUDIO ---');

// 1. REBRAND "MIKE'S BEER" -> "BIRTHLAB BEER"
const beerReplacements = [
  { from: /Mike's Beer Branding and Packaging/g, to: 'BirthLab Beer Branding and Packaging' },
  { from: /Mike's Beer/g, to: 'BirthLab Beer' },
  { from: /https:\/\/mikesbeer\.com/g, to: 'https://birthlabstudio.com' }
];

function applyReplacementsToFile(filePath, repList) {
  if (!fs.existsSync(filePath)) return false;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  for (const r of repList) {
    content = content.replace(r.from, r.to);
  }
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
    return true;
  }
  return false;
}

// Files with Mike's Beer
const beerFiles = [
  'work/index.html',
  'case-studies/mikesbeer/index.html',
  'case-studies/justphil/index.html',
  'case-studies/lumaandleaf/index.html',
  'case-studies/mixd/index.html',
  'case-studies/slashwork/index.html',
  'assets/runtime-scripts/case-study-mikesbeer.mjs',
  'assets/runtime-scripts/page-work.mjs',
  'assets/runtime-scripts/case-study-justphil.mjs',
  'assets/runtime-scripts/case-study-lumaandleaf.mjs',
  'assets/runtime-scripts/case-study-mixd.mjs',
  'assets/runtime-scripts/case-study-slashwork.mjs'
];

for (const f of beerFiles) {
  applyReplacementsToFile(f, beerReplacements);
}

// 2. PRONOUN & AGENCY REBRAND IN ALL CASE STUDIES
const caseStudyNarrativeReplacements = [
  // 121g
  {
    from: /I worked with 121G to create a striking, minimalist visual identity for their brand\./g,
    to: 'We worked with 121G to create a striking, minimalist visual identity for their brand.'
  },
  // beyondtellerrand
  {
    from: /I designed the visual identity and conference theme for/g,
    to: 'We designed the visual identity and conference theme for'
  },
  // bigeye
  {
    from: /I led a full rebrand for Bigeye, including a new logo, visual identity, and website\./g,
    to: 'We led a full rebrand for Bigeye, including a new logo, visual identity, and website.'
  },
  // epic-travel
  {
    from: /Epic Travel brought me in to rebrand the company for the future\. Working closely with their team, I created a new logo, website and brand assets—designed to position them as a modern, forward-thinking travel agency\./g,
    to: 'Epic Travel brought BirthLab Studio in to rebrand the company for the future. Working closely with their team, we created a new logo, website and brand assets—designed to position them as a modern, forward-thinking travel agency.'
  },
  // getty-images
  {
    from: /I teamed up with <!--\$--><a class="framer-text framer-styles-preset-1auttel" data-styles-preset="YYhb4Hnof" href="https:\/\/www\.gettyimages\.com" target="_blank" rel="noopener">Getty Images <\/a><!--\/\$-->to create a dynamic visual campaign/g,
    to: 'We teamed up with <!--$--><a class="framer-text framer-styles-preset-1auttel" data-styles-preset="YYhb4Hnof" href="https://www.gettyimages.com" target="_blank" rel="noopener">Getty Images </a><!--/$-->to create a dynamic visual campaign'
  },
  // kapilandholly
  {
    from: /I’ve collaborated with Nick Baum for many years, he’s one of my favourite people to work with\. Nick, CEO of <!--\$--><a class="framer-text framer-styles-preset-1auttel" data-styles-preset="YYhb4Hnof" href="https:\/\/www\.tremendous\.com" target="_blank" rel="noopener">Tremendous<\/a><!--\/\$-->, asked me to create an illustrated print as a wedding gift for Kapil and Holly\./g,
    to: 'BirthLab Studio collaborated with Nick Baum, CEO of <!--$--><a class="framer-text framer-styles-preset-1auttel" data-styles-preset="YYhb4Hnof" href="https://www.tremendous.com" target="_blank" rel="noopener">Tremendous</a><!--/$-->, to create an illustrated print as a bespoke wedding gift for Kapil and Holly.'
  },
  // linkboard
  {
    from: /I've always wanted a fun, cool looking links page for my social media profiles, so I created LinkBoard/g,
    to: "We've always wanted a fun, cool looking links page for our social media profiles, so we created LinkBoard"
  },
  {
    from: /I’ve always wanted a fun, cool looking links page for my social media profiles, so I created LinkBoard/g,
    to: "We’ve always wanted a fun, cool looking links page for our social media profiles, so we created LinkBoard"
  },
  // lumaandleaf
  {
    from: /I led the brand identity and packaging design for/g,
    to: 'We led the brand identity and packaging design for'
  },
  // mixd
  {
    from: /Ten years ago, I created the brand identity and website for Leeds-based web agency, MIXD\. Recently, I had the pleasure of redesigning it\./g,
    to: 'BirthLab Studio created the refreshed brand identity and website for Leeds-based web agency, MIXD, crafting an energetic, modern digital presence.'
  },
  // plug-digital
  {
    from: /I led the rebrand for <!--\$--><a class="framer-text framer-styles-preset-1auttel" data-styles-preset="YYhb4Hnof" href="https:\/\/plugdigital\.co\.uk" target="_blank" rel="noopener">Plug Digital/g,
    to: 'We led the rebrand for <!--$--><a class="framer-text framer-styles-preset-1auttel" data-styles-preset="YYhb4Hnof" href="https://plugdigital.co.uk" target="_blank" rel="noopener">Plug Digital'
  },
  // slashwork
  {
    from: /I partnered with <!--\$--><a class="framer-text framer-styles-preset-1auttel" data-styles-preset="YYhb4Hnof" href="https:\/\/slash\.work" target="_blank" rel="noopener">Slashwork <\/a><!--\/\$-->to design their new visual identity and website\./g,
    to: 'We partnered with <!--$--><a class="framer-text framer-styles-preset-1auttel" data-styles-preset="YYhb4Hnof" href="https://slash.work" target="_blank" rel="noopener">Slashwork </a><!--/$-->to design their new visual identity and website.'
  },
  // snapsound
  {
    from: /<!--\$--><a class="framer-text framer-styles-preset-1auttel" data-styles-preset="YYhb4Hnof" href="https:\/\/snapsound\.com" target="_blank" rel="noopener">Snapsound<\/a><!--\/\$--> asked me to design their new website and help shape a modern visual identity\. To support the site content, I created a series of illustrations/g,
    to: '<!--$--><a class="framer-text framer-styles-preset-1auttel" data-styles-preset="YYhb4Hnof" href="https://snapsound.com" target="_blank" rel="noopener">Snapsound</a><!--/$--> partnered with BirthLab Studio to design their new website and shape a modern visual identity. To support the site content, we created a series of illustrations'
  },
  // thebodyshop
  {
    from: /In this self-initiated project, I’ve developed a concept campaign for The Body Shop/g,
    to: 'In this studio concept project, BirthLab Studio developed a visual campaign for The Body Shop'
  },
  {
    from: /In this self-initiated project, I've developed a concept campaign for The Body Shop/g,
    to: 'In this studio concept project, BirthLab Studio developed a visual campaign for The Body Shop'
  },
  // tvs
  {
    from: /I created a video component using Framer Workshop to bring TVS Motor’s heritage to life/g,
    to: 'We created an interactive video component to bring TVS Motor’s heritage to life'
  },
  {
    from: /I created a video component using Framer Workshop to bring TVS Motor's heritage to life/g,
    to: 'We created an interactive video component to bring TVS Motor\'s heritage to life'
  }
];

// Apply narrative replacements to all case studies and runtime scripts
function walkAll(dir) {
  let files = [];
  for (const f of fs.readdirSync(dir)) {
    if (f === 'node_modules' || f === '.git' || f === 'scripts') continue;
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      files = files.concat(walkAll(p));
    } else if (/\.(html|mjs|js)$/i.test(p)) {
      files.push(p);
    }
  }
  return files;
}

const allWebFiles = walkAll('.');
for (const f of allWebFiles) {
  applyReplacementsToFile(f, caseStudyNarrativeReplacements);
}

// 3. PURGE ALL OLD DOMAIN TRACES FROM DOCS/ARCHIVE & DOCS
const docsReplacements = [
  { from: /mikekus\.com/g, to: 'birthlabstudio.com' },
  { from: /mike@mikekus\.com/g, to: 'hello@birthlabstudio.com' },
  { from: /https:\/\/mikekus\.framer\.website/g, to: 'https://birthlabstudio.com' },
  { from: /https:\/\/foliostack\.framer\.website/g, to: 'https://birthlabstudio.com' },
  { from: /https:\/\/x\.com\/mikekus/g, to: 'https://x.com/birthlabstudio' },
  { from: /foliostack/gi, to: 'birthlabstudio' },
  { from: /mikejkus/gi, to: 'birthlabstudio' },
  { from: /Mike Kus/g, to: 'BirthLab Studio' },
  { from: /mike-kus-portrait\.jpg/g, to: 'birthlab-og-card.jpg' }
];

function walkDocs(dir) {
  if (!fs.existsSync(dir)) return [];
  let files = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      files = files.concat(walkDocs(p));
    } else if (/\.(html|md|json)$/i.test(p)) {
      files.push(p);
    }
  }
  return files;
}

const docsFiles = walkDocs('docs');
for (const f of docsFiles) {
  applyReplacementsToFile(f, docsReplacements);
}

// 4. Update serve.json to include /birthlab-beer rewrite
const servePath = 'serve.json';
if (fs.existsSync(servePath)) {
  const serveConfig = JSON.parse(fs.readFileSync(servePath, 'utf8'));
  const hasBirthlabBeer = serveConfig.rewrites.some(r => r.source === '/birthlab-beer');
  if (!hasBirthlabBeer) {
    serveConfig.rewrites.push({
      source: '/birthlab-beer',
      destination: '/case-studies/mikesbeer/index.html'
    });
    fs.writeFileSync(servePath, JSON.stringify(serveConfig, null, 2));
    console.log('Added /birthlab-beer rewrite to serve.json');
  }
}

// 5. Update assets/README.md
const assetsReadmePath = 'assets/README.md';
if (fs.existsSync(assetsReadmePath)) {
  let r = fs.readFileSync(assetsReadmePath, 'utf8');
  r = r.replace(/mike-kus-portrait\.jpg/g, 'birthlab-og-card.jpg');
  r = r.replace(/Founder portrait/g, 'Studio team showcase');
  fs.writeFileSync(assetsReadmePath, r, 'utf8');
  console.log('Updated assets/README.md');
}

console.log('--- REBRAND COMPLETE ---');

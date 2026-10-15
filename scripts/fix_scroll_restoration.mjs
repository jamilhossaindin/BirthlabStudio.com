import fs from 'fs';
import path from 'path';

console.log('--- FIXING RELOAD SCROLL POSITION & LETTER SPANS ---');

// 1. Fix Kus—Studio letter spans in index.html if present
const indexPath = 'index.html';
if (fs.existsSync(indexPath)) {
  let indexHtml = fs.readFileSync(indexPath, 'utf8');
  const spanTarget = '<div class="framer-16x098n" data-framer-component-type="RichTextContainer" style="transform:none">';
  const p1 = indexHtml.indexOf(spanTarget);
  if (p1 !== -1) {
    const pEnd = indexHtml.indexOf('</p></div>', p1);
    if (pEnd !== -1) {
      const existingBlock = indexHtml.substring(p1, pEnd + 10);
      if (existingBlock.includes('>K<') || existingBlock.includes('Kus')) {
        const replacementBlock = `${spanTarget}<p class="framer-text framer-styles-preset-15p7l2y" data-styles-preset="VRW66sVfT">Birth-Lab</p></div>`;
        indexHtml = indexHtml.replace(existingBlock, replacementBlock);
        fs.writeFileSync(indexPath, indexHtml, 'utf8');
        console.log('Fixed Kus—Studio letter spans in index.html -> Birth-Lab');
      }
    }
  }
}

// 2. Fix Lenis component in main-entrypoint.mjs
const mainJsPath = 'assets/runtime-scripts/main-entrypoint.mjs';
if (fs.existsSync(mainJsPath)) {
  let js = fs.readFileSync(mainJsPath, 'utf8');

  // Find function gt(e)
  const gtIdx = js.indexOf('function gt(e){');
  if (gtIdx !== -1) {
    const endGt = js.indexOf('p(w,{children:p(`style`', gtIdx);
    if (endGt !== -1) {
      const originalGt = js.substring(gtIdx, endGt);
      console.log('Found gt component in main-entrypoint.mjs');

      // Replace with robust scroll-resetting Lenis hook
      const oldLenisInit = `_(()=>{r.current=new mt({duration:t/10});let e=t=>{r.current.raf(t),requestAnimationFrame(e)};return requestAnimationFrame(e),()=>{r.current.destroy(),r.current=null}},[])`;
      const newLenisInit = `_(()=>{r.current=new mt({duration:t/10});try{if('scrollRestoration'in history){history.scrollRestoration='manual'}r.current.scrollTo(0,{immediate:!0});window.scrollTo(0,0)}catch(e){}let e=t=>{r.current.raf(t),requestAnimationFrame(e)};return requestAnimationFrame(e),()=>{r.current.destroy(),r.current=null}},[])`;

      const oldHook1 = `_(()=>{r.current&&r.current.scrollTo(0,{immediate:!0})},[r])`;
      const newHook1 = `_(()=>{try{if('scrollRestoration'in history){history.scrollRestoration='manual'}window.scrollTo(0,0);let e=()=>{r.current&&r.current.scrollTo(0,{immediate:!0});window.scrollTo(0,0)};e();setTimeout(e,50);setTimeout(e,150);setTimeout(e,300)}catch(e){}},[])`;

      if (js.includes(oldLenisInit)) {
        js = js.replace(oldLenisInit, newLenisInit);
        console.log('Updated Lenis initialization in main-entrypoint.mjs');
      }
      if (js.includes(oldHook1)) {
        js = js.replace(oldHook1, newHook1);
        console.log('Updated Lenis scrollTo Hook 1 in main-entrypoint.mjs');
      }

      fs.writeFileSync(mainJsPath, js, 'utf8');
      console.log('Saved main-entrypoint.mjs');
    }
  }
}

// 3. Update all 21 HTML routes to enforce manual scroll restoration and reset scroll to 0
function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'scripts' && file !== 'docs') {
        results = results.concat(getHtmlFiles(fullPath));
      }
    } else if (file.endsWith('.html') && !file.startsWith('test_') && !file.startsWith('preview_')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = getHtmlFiles('.');
console.log(`Updating scroll behavior in ${htmlFiles.length} live HTML files...`);

for (const f of htmlFiles) {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;

  // Check if our scroll reset snippet is already present
  if (!content.includes('history.scrollRestoration = \'manual\'') && !content.includes('history.scrollRestoration=\'manual\'')) {
    // Insert at the very start of the first <script> tag in <head>
    const scriptTag = '<script>';
    const scriptIdx = content.indexOf(scriptTag);
    if (scriptIdx !== -1) {
      const scrollScript = `<script>
// Enforce immediate scroll-to-top on reload and disable browser auto-scroll restoration
try {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
  window.addEventListener('beforeunload', function() { window.scrollTo(0, 0); });
  window.addEventListener('pageshow', function() { window.scrollTo(0, 0); });
  window.addEventListener('load', function() {
    window.scrollTo(0, 0);
    setTimeout(function() { window.scrollTo(0, 0); }, 50);
    setTimeout(function() { window.scrollTo(0, 0); }, 200);
  });
} catch(e) {}
`;
      content = content.replace(scriptTag, scrollScript);
      changed = true;
    }
  }

  // Remove spurious scroll event from wakeUpPage
  if (content.includes("window.dispatchEvent(new Event('scroll'));")) {
    content = content.replace("window.dispatchEvent(new Event('scroll'));", "window.scrollTo(0, 0);");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(f, content, 'utf8');
    console.log(`Updated scroll lock in ${f}`);
  }
}

console.log('--- SCROLL FIX COMPLETE ---');

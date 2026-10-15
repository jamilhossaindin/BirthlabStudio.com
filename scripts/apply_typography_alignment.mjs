import fs from 'fs';
import path from 'path';

// 1. Read the generated Studio SVG
const studioSvg = fs.readFileSync('scripts/studio_vector.svg', 'utf8').trim();

// Format studioSvg for HTML insertion
const studioSvgHtml = `<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1116 209" fill="rgb(0, 102, 255)" style="width: 100%; height: 100%; object-fit: contain; max-width: 100%; max-height: 100%;">
` + studioSvg.substring(studioSvg.indexOf('<path'), studioSvg.indexOf('</svg>')) + `</svg>`;

// Escape for JS template string in main-entrypoint.mjs
const studioSvgForJs = `<?xml version="1.0" encoding="UTF-8"?>\n` + studioSvgHtml;

// The centered Birth-Lab HTML inside foreignObject:
const oldBirthLabNeedle = `<h1 style="--font-selector:RlM7TWFucm9wZS1zZW1pYm9sZA==;--framer-font-family:&quot;Manrope&quot;, &quot;Manrope Placeholder&quot;, sans-serif;--framer-font-size:209.407343407838px;--framer-font-weight:600;--framer-letter-spacing:0.115em;letter-spacing:0.115em;--framer-line-height:1em;--framer-text-color:var(--token-17127c0d-b79b-43c6-9bd7-ee303933ecaf, rgb(28, 28, 28))" class="framer-text" aria-level="2">Birth-Lab</h1>`;
const oldBirthLabNeedleBlue = `<h1 style="--font-selector:RlM7TWFucm9wZS1zZW1pYm9sZA==;--framer-font-family:&quot;Manrope&quot;, &quot;Manrope Placeholder&quot;, sans-serif;--framer-font-size:209.407343407838px;--framer-font-weight:600;--framer-letter-spacing:0.115em;letter-spacing:0.115em;--framer-line-height:1em;--framer-text-color:var(--token-17127c0d-b79b-43c6-9bd7-ee303933ecaf, rgb(0, 102, 255));color:rgb(0, 102, 255)" class="framer-text" aria-level="2">Birth-Lab</h1>`;

const newBirthLabReplacement = `<div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;text-align:center;"><h1 style="--font-selector:RlM7TWFucm9wZS1zZW1pYm9sZA==;--framer-font-family:&quot;Manrope&quot;, &quot;Manrope Placeholder&quot;, sans-serif;--framer-font-size:209.407343407838px;--framer-font-weight:600;--framer-letter-spacing:0.115em;letter-spacing:0.115em;--framer-line-height:1em;--framer-text-color:var(--token-089eba16-9e51-486f-b517-edaffc7faaa9, rgb(0, 102, 255));color:rgb(0, 102, 255);margin:0;padding:0;text-align:center;display:flex;align-items:center;justify-content:center;width:100%;height:100%;transform:translateY(0.084em)" class="framer-text" aria-level="2">Birth-Lab</h1></div>`;

// Update all HTML files
function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'scripts') {
        results = results.concat(getHtmlFiles(fullPath));
      }
    } else if (file.endsWith('.html') && !file.startsWith('test_') && !file.startsWith('preview_')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = getHtmlFiles('.');
console.log(`Found ${htmlFiles.length} live HTML routes.`);

let updatedCount = 0;
for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. Center Birth-Lab inside foreignObject
  if (content.includes(oldBirthLabNeedle)) {
    content = content.replace(oldBirthLabNeedle, newBirthLabReplacement);
    changed = true;
  } else if (content.includes(oldBirthLabNeedleBlue)) {
    content = content.replace(oldBirthLabNeedleBlue, newBirthLabReplacement);
    changed = true;
  }

  // 2. Replace STUDIO SVG inside framer-1xr0xue
  // Look for the SVG inside framer-1xr0xue
  const studioBoxIdx = content.indexOf('data-framer-name="STUDIO"');
  if (studioBoxIdx !== -1) {
    const svgStart = content.indexOf('<svg id="Layer_1"', studioBoxIdx);
    if (svgStart !== -1) {
      const svgEnd = content.indexOf('</svg>', svgStart) + 6;
      content = content.substring(0, svgStart) + studioSvgHtml + content.substring(svgEnd);
      changed = true;
    }
  }

  // 3. Update CSS rules for padding of framer-1xr0xue and flex-centering of framer-3kntqu
  if (content.includes('padding:30px 30px 0')) {
    content = content.replace(/padding:30px 30px 0/g, 'padding:12px');
    changed = true;
  }
  if (content.includes('padding:20px 20px 0')) {
    content = content.replace(/padding:20px 20px 0/g, 'padding:15px');
    changed = true;
  }

  // Ensure framer-3kntqu has flex centering in CSS
  const old3kntqu = '.framer-3kntqu{--framer-link-text-color:#09f;--framer-link-text-decoration:underline;white-space:pre;flex:1 0 0;width:1px;height:auto;position:relative}';
  const new3kntqu = '.framer-3kntqu{--framer-link-text-color:#09f;--framer-link-text-decoration:underline;white-space:pre;flex:1 0 0;width:1px;height:auto;position:relative;display:flex;align-items:center;justify-content:center;text-align:center}';
  if (content.includes(old3kntqu)) {
    content = content.replace(old3kntqu, new3kntqu);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    updatedCount++;
    console.log(`Updated ${file}`);
  }
}
console.log(`HTML update complete: ${updatedCount} files updated.`);

// 2. Update main-entrypoint.mjs
const mainJsPath = 'assets/runtime-scripts/main-entrypoint.mjs';
if (fs.existsSync(mainJsPath)) {
  let js = fs.readFileSync(mainJsPath, 'utf8');

  // a. Update verticalAlignment from 'top' to 'center' on the BirthLab RichTextContainer
  const oldBLReact = 'fonts:[`FS;Manrope-semibold`],verticalAlignment:`top`,viewBox:`0 0 1116 209`,withExternalLayout:!0})})}),p(`div`,{className:`framer-1xr0xue`';
  const newBLReact = 'fonts:[`FS;Manrope-semibold`],verticalAlignment:`center`,viewBox:`0 0 1116 209`,withExternalLayout:!0})})}),p(`div`,{className:`framer-1xr0xue`';

  if (js.includes(oldBLReact)) {
    js = js.replace(oldBLReact, newBLReact);
    console.log('Updated verticalAlignment to center in main-entrypoint.mjs');
  }

  // b. Update h1 styles in main-entrypoint.mjs for Birth-Lab
  const oldH1Style = '"--framer-text-color":`var(--token-17127c0d-b79b-43c6-9bd7-ee303933ecaf, rgb(28, 28, 28))`},children:`Birth-Lab`}';
  const newH1Style = '"--framer-text-color":`var(--token-089eba16-9e51-486f-b517-edaffc7faaa9, rgb(0, 102, 255))`,"color":`rgb(0, 102, 255)`,"display":`flex`,"alignItems":`center`,"justifyContent":`center`,"textAlign":`center`,"width":`100%`,"height":`100%`,"transform":`translateY(0.084em)`},children:`Birth-Lab`}';

  if (js.includes(oldH1Style)) {
    js = js.replace(oldH1Style, newH1Style);
    console.log('Updated h1 styles for Birth-Lab in main-entrypoint.mjs');
  }

  // c. Update svgCode in ji component for STUDIO
  const studioCodeIdx = js.indexOf('nodeId:`VdTk3WVMl`');
  if (studioCodeIdx !== -1) {
    const svgCodePropIdx = js.indexOf('svgCode:`', studioCodeIdx);
    if (svgCodePropIdx !== -1) {
      const svgCodeEnd = js.indexOf('`})})})})', svgCodePropIdx);
      if (svgCodeEnd !== -1) {
        const prefix = js.substring(0, svgCodePropIdx + 9);
        const suffix = js.substring(svgCodeEnd);
        js = prefix + studioSvgForJs + suffix;
        console.log('Updated STUDIO svgCode in main-entrypoint.mjs');
      }
    }
  }

  // d. Update padding rules in main-entrypoint.mjs CSS
  js = js.replace(/\.framer-gbxhs \.framer-1xr0xue \{ padding: 30px 30px 0px 30px; \}/g, '.framer-gbxhs .framer-1xr0xue { padding: 12px; }');
  js = js.replace(/\.framer-gbxhs \.framer-1xr0xue \{ padding: 20px 20px 0px 20px; \}/g, '.framer-gbxhs .framer-1xr0xue { padding: 15px; }');

  fs.writeFileSync(mainJsPath, js, 'utf8');
  console.log('Updated main-entrypoint.mjs successfully!');
}

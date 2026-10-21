// Keep the studio routes' static documents in sync with their React content.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { servicesContent } from '../assets/runtime-scripts/services-content.mjs';
import { processContent } from '../assets/runtime-scripts/process-content.mjs';
import { installStartupDocument } from './sync-startup.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const h = (tag, props, ...children) => ({ tag, props: props || {}, children });
const voidTags = new Set(['img', 'link', 'meta', 'input', 'br', 'hr']);
// Keep the non-JavaScript document on the same Home footer content/artwork too.
const homeDocument = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const homeFooter = homeDocument.match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
if (!homeFooter) throw new Error('Home footer not found');
function splitSelectors(value) {
  const parts = []; let depth = 0, start = 0;
  for (let i = 0; i < value.length; i++) {
    if (value[i] === '(') depth++;
    else if (value[i] === ')') depth--;
    else if (value[i] === ',' && depth === 0) { parts.push(value.slice(start, i)); start = i + 1; }
  }
  parts.push(value.slice(start)); return parts;
}
function homeLayoutRules(source) {
  let result = '', offset = 0;
  while (offset < source.length) {
    const open = source.indexOf('{', offset);
    if (open < 0) break;
    let end = open + 1, depth = 1, quote = null;
    for (; end < source.length && depth; end++) {
      const char = source[end];
      if (quote) { if (char === '\\') end++; else if (char === quote) quote = null; }
      else if (char === '"' || char === "'") quote = char;
      else if (char === '{') depth++;
      else if (char === '}') depth--;
    }
    if (depth) throw new Error('Unbalanced Home stylesheet');
    const selector = source.slice(offset, open).trim(), body = source.slice(open + 1, end - 1);
    if (/^@(media|supports|container|layer)\b/.test(selector)) {
      const nested = homeLayoutRules(body);
      if (nested) result += selector + '{' + nested + '}';
    } else {
      const layout = splitSelectors(selector).filter(value => value.includes('.framer-gbxhs'));
      if (layout.length) result += layout.join(',') + '{' + body + '}';
    }
    offset = end;
  }
  return result;
}
const homeHead = homeDocument.slice(0, homeDocument.indexOf('</head>'));
const sharedFooterStyles = [...homeHead.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map(match => homeLayoutRules(match[1])).join('\n');
if (!sharedFooterStyles.includes('.framer-15xdtpj')) throw new Error('Home footer layout CSS not found');
fs.writeFileSync(path.join(root, 'assets/runtime-scripts/shared-footer-styles.mjs'), '// Generated from the canonical Home layout CSS by sync:studio-pages.\nexport const sharedFooterStyles = ' + JSON.stringify(sharedFooterStyles) + ';\n');
const spriteIds = [...new Set([...homeFooter.matchAll(/<use\b[^>]*href="#([^"]+)"/g)].map(match => match[1]))];
const sprites = spriteIds.map(id => {
  const position = homeDocument.indexOf(`id="${id}"`);
  const start = homeDocument.lastIndexOf('<svg', position);
  const end = homeDocument.indexOf('</svg>', position) + 6;
  if (position < 0 || start < 0 || end < position) throw new Error(`Missing shared footer artwork: ${id}`);
  return homeDocument.slice(start, end);
}).join('');
const footerSprites = `<svg aria-hidden="true" width="0" height="0" style="position:absolute"><defs>${sprites}</defs></svg>`;
const footerFallback = `<div class="studio-shared-footer" style="background:#fcfcfa"><div class="framer-gbxhs" data-studio-footer style="display:contents">${homeFooter}<div id="template-overlay"></div></div></div>`;
function render(node) {
  if (node === null || node === undefined || node === false) return '';
  if (Array.isArray(node)) return node.map(render).join('');
  if (typeof node !== 'object') return escape(node);
  const { tag, props, children } = node;
  if (tag === 'studio-footer') return footerFallback;
  const attributeName = key => ({ className: 'class', htmlFor: 'for', autoComplete: 'autocomplete', noValidate: 'novalidate', readOnly: 'readonly', tabIndex: 'tabindex' })[key] || key;
  const attributes = Object.entries(props).filter(([key, value]) => key !== 'key' && key !== 'ref' && typeof value !== 'function' && value !== null && value !== undefined && value !== false)
    .map(([key, value]) => value === true ? ` ${attributeName(key)}` : ` ${attributeName(key)}="${escape(value)}"`).join('');
  return `<${tag}${attributes}>${voidTags.has(tag) ? '' : render(children) + `</${tag}>`}`;
}

const servicesDocument = fs.readFileSync(path.join(root, 'services/index.html'), 'utf8');
const baseHead = servicesDocument.slice(0, servicesDocument.indexOf('</head>'))
  .replace(/href="\/assets\/runtime-scripts\/page-services\.css(?:\?[^"]*)?"/g, 'href="/assets/runtime-scripts/page-services.css?v=mobile-startup-20261022"')
  .replace(/<link\b(?=[^>]*data-process-styles)[^>]*>/g, '')
  .replace(/<style\b(?=[^>]*data-studio-footer-layout)[^>]*>[\s\S]*?<\/style>/g, '');
for (const [slug, title, description, routeId, content] of [
  ['services', 'Our Services — BirthLab Studio', 'Brand identity, digital product design, web development, graphic design, motion, illustration, video and 3D by BirthLab Studio.', 'blServices', servicesContent],
  ['process', 'Our Process — BirthLab Studio', 'How BirthLab Studio turns a shared brief into thoughtful design, from discovery and creative direction to delivery and ongoing support.', 'blProcess', processContent],
]) {
  let head = baseHead.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(title)}</title>`)
    .replace(/(<meta\b[^>]*(?:name|property)="(?:og:title|twitter:title)"[^>]*content=")[^"]*"/g, `$1${escape(title)}"`)
    .replace(/(<meta\b[^>]*(?:name|property)="(?:description|og:description|twitter:description)"[^>]*content=")[^"]*"/g, `$1${escape(description)}"`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="https://birthlabstudio.com/${slug}">`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="https://birthlabstudio.com/${slug}">`);
  if (slug === 'process') head += '<link rel="stylesheet" data-process-styles href="/assets/runtime-scripts/page-process.css">';
  head += `<style data-studio-footer-layout>${sharedFooterStyles}</style>`;
  const document = `${head}</head><body><div id="main" data-birthlab-route="${routeId}">${render(content(h))}</div><div id="overlay"></div>${footerSprites}<script>typeof document<"u"&&(window.process={...window.process,env:{...window.process?.env,NODE_ENV:"production"}});</script><script type="module" src="/assets/runtime-scripts/main-entrypoint.mjs"></script></body></html>`;
  fs.mkdirSync(path.join(root, slug), { recursive: true });
  fs.writeFileSync(path.join(root, slug, 'index.html'), installStartupDocument(document));
  console.log(`Synced /${slug}`);
}

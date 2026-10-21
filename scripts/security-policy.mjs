import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

export const assetExtension = /\.(?:avif|css|eot|gif|ico|jpe?g|js|mjs|mp3|mp4|ogg|otf|png|svg|ttf|wav|webm|webp|woff2?)$/i;
export function publicSurface(root) {
  const catalog = JSON.parse(fs.readFileSync(path.join(root, 'scripts/portfolio-projects.json'), 'utf8'));
  const slugs = catalog.map(p => p.slug);
  if (slugs.some(s => !/^[a-z0-9-]+$/.test(s))) throw new Error('Invalid project route');
  const pages = ['index.html', ...['404','about','contact','work','services','process'].map(p => p + '/index.html'), ...slugs.map(p => 'case-studies/' + p + '/index.html')];
  const redirects = new Map(['', '/', '/index', '/index.html'].map(suffix => ['/collaborate' + suffix, '/contact/?enquiry=start-a-project']));
  const routes = new Map();
  for (const file of pages) {
    const prefix = file === 'index.html' ? '' : '/' + file.slice(0, -11);
    for (const route of [prefix || '/', prefix + '/', prefix + '/index', prefix + '/index.html']) routes.set(route, file);
  }
  for (const slug of slugs) for (const suffix of ['', '/']) routes.set('/' + slug + suffix, 'case-studies/' + slug + '/index.html');
  // Keep existing inbound URLs working while primary routes use current concept names.
  const aliasesPath = path.join(root, 'scripts/route-aliases.json');
  const aliases = fs.existsSync(aliasesPath) ? JSON.parse(fs.readFileSync(aliasesPath, 'utf8')) : [];
  for (const { previous, current } of aliases) {
    if (!/^[a-z0-9-]+$/.test(previous) || !slugs.includes(current)) throw new Error('Invalid compatibility route');
    const file = 'case-studies/' + current + '/index.html';
    for (const prefix of ['/' + previous, '/case-studies/' + previous]) {
      for (const suffix of ['', '/', '/index', '/index.html']) routes.set(prefix + suffix, file);
    }
    for (const suffix of ['/index', '/index.html']) routes.set('/' + current + suffix, file);
  }
  for (const file of ['robots.txt', 'sitemap.xml']) routes.set('/' + file, file);
  const assets = new Set();
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(absolute);
      else if (entry.isFile() && assetExtension.test(entry.name)) assets.add('/' + path.relative(root, absolute).split(path.sep).join('/'));
    }
  }
  walk(path.join(root, 'assets'));
  return { pages, routes, redirects, assets, slugs, aliases };
}
export function resolvePublicRequest(raw, surface) {
  if (typeof raw !== 'string' || raw.length > 8192 || !raw.startsWith('/') || raw.startsWith('//')) return { status: 400 };
  let pathname;
  try { pathname = decodeURIComponent(raw.split(/[?#]/, 1)[0]); } catch { return { status: 400 }; }
  if (/[\u0000-\u0020\u007f\\]/.test(pathname) || pathname.split('/').some(s => s === '.' || s === '..')) return { status: 400 };
  if (surface.redirects.has(pathname)) return { status: 308, location: surface.redirects.get(pathname) };
  const file = surface.routes.get(pathname) || (surface.assets.has(pathname) ? pathname.slice(1) : undefined);
  return file ? { status: 200, file } : { status: 404 };
}
export function securityHeaders(root, surface = publicSurface(root)) {
  const hashes = new Set();
  for (const file of surface.pages) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    for (const tag of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (!tag[2].trim() || /\bsrc\s*=|type\s*=\s*["'](?:application\/ld\+json|framer\/appear)/i.test(tag[1])) continue;
      hashes.add("'sha256-" + createHash('sha256').update(tag[2], 'utf8').digest('base64') + "'");
    }
  }
  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' " + [...hashes].sort().join(' '),
      "script-src-attr 'none'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://i.ytimg.com",
      "font-src 'self' data:",
      "media-src 'self' blob:",
      "connect-src 'self'",
      "frame-src https://www.youtube-nocookie.com",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'none'",
      "form-action 'none'",
      "worker-src 'none'",
      "manifest-src 'self'"
    ].join('; '),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin'
  };
}
// Factor shared path segments so Vercel's 4096-character source limit is respected.
function compactRoutePattern(routes, escape) {
  const root = { terminal: false, children: new Map() };
  for (const route of routes) {
    let node = root;
    for (const segment of route.slice(1).split('/')) {
      if (!node.children.has(segment)) node.children.set(segment, { terminal: false, children: new Map() });
      node = node.children.get(segment);
    }
    node.terminal = true;
  }
  function render(node, top = false) {
    if (!node.children.size) return '';
    const groups = new Map();
    for (const [segment, child] of node.children) {
      const suffix = render(child);
      if (!groups.has(suffix)) groups.set(suffix, []);
      groups.get(suffix).push(escape(segment));
    }
    const branches = [...groups].map(([suffix, segments]) => (segments.length === 1 ? segments[0] : '(?:' + segments.join('|') + ')') + suffix);
    const pattern = (top ? '' : '/') + (branches.length === 1 ? branches[0] : '(?:' + branches.join('|') + ')');
    return node.terminal ? '(?:' + pattern + ')?' : pattern;
  }
  return render(root, true);
}
export function vercelConfig(root, surface = publicSurface(root)) {
  const headers = { ...securityHeaders(root, surface), 'Strict-Transport-Security': 'max-age=31536000' };
  const escapeRegex = s => s.replace(/[.*+?^$()|[\]\\]/g, c => '\\' + c);
  const pages = compactRoutePattern(surface.routes.keys(), escapeRegex);
  const assets = "assets/(?:[A-Za-z0-9_-]+/)*[A-Za-z0-9_][A-Za-z0-9_.-]*\\.(?:avif|css|eot|gif|ico|jpe?g|js|mjs|mp3|mp4|ogg|otf|png|svg|ttf|wav|webm|webp|woff2?)";
  const redirects = compactRoutePattern(surface.redirects.keys(), escapeRegex);
  const allowed = '(?:' + pages + '|' + redirects + '|' + assets + ')';
  return {
    $schema: 'https://openapi.vercel.sh/vercel.json',
    version: 2,
    routes: [
      { src: '/(.*)', headers, continue: true },
      { src: '^/(?!' + allowed + '$).*$', status: 404 },
      ...[...surface.redirects].map(([route, location]) => ({ src: '^' + escapeRegex(route) + '$', status: 308, headers: { Location: location } })),
      ...[...surface.routes].filter(([route,file]) => route !== '/' + file).map(([route,file]) => ({ src: '^' + escapeRegex(route) + '$', dest: '/' + file })),
      { handle: 'filesystem' },
      { src: '/(.*)', dest: '/404/index.html', status: 404 }
    ]
  };
}

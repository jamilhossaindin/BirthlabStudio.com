import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicSurface, securityHeaders, vercelConfig } from './security-policy.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const surface = publicSurface(root);
const config = JSON.parse(fs.readFileSync(path.join(root, 'serve.json'), 'utf8'));
config.directoryListing = false;
config.renderSingle = false;
config.symlinks = false;
config.rewrites = surface.slugs.map(slug => ({source:'/' + slug,destination:'/case-studies/' + slug + '/index.html'}));
for (const { previous, current } of surface.aliases) {
  for (const prefix of ['/' + previous, '/case-studies/' + previous]) {
    for (const suffix of ['', '/', '/index', '/index.html']) config.rewrites.push({source:prefix + suffix,destination:'/case-studies/' + current + '/index.html'});
  }
  for (const suffix of ['/index', '/index.html']) config.rewrites.push({source:'/' + current + suffix,destination:'/case-studies/' + current + '/index.html'});
}
const headers = securityHeaders(root, surface);
config.headers = (config.headers || []).filter(h => h.source !== '**');
config.headers.unshift({source:'**',headers:Object.entries(headers).map(([key,value]) => ({key,value}))});
// Defense in depth for direct serve CLI usage. The guarded npm start server is preferred.
const privateRoots = ['.git','.vercel','.agents','node_modules','docs','scripts'];
config.redirects = [...surface.redirects].map(([source,destination]) => ({source,destination,type:308}));
config.redirects.push(...privateRoots.flatMap(p => [p, p + '/**'].map(source => ({source:'/' + source,destination:'/404',type:307}))));
for (const source of ['/*.json','/*.md','/.env*','/.npmrc','/.gitignore','/.vercelignore','/assets/*.json','/assets/*.md']) config.redirects.push({source,destination:'/404',type:307});
fs.writeFileSync(path.join(root, 'serve.json'), JSON.stringify(config,null,2) + '\n');
fs.writeFileSync(path.join(root, 'vercel.json'), JSON.stringify(vercelConfig(root,surface),null,2) + '\n');
console.log('Refreshed security headers and deployment routes for ' + surface.pages.length + ' pages.');

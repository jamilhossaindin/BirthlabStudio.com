import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { networkInterfaces } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import serveHandler from 'serve-handler';
import { publicSurface, resolvePublicRequest, securityHeaders } from './security-policy.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function localNetworkAddresses() {
  return [...new Set(Object.values(networkInterfaces()).flat().filter(address => {
    if (!address || address.internal || address.family !== 'IPv4') return false;
    const [first, second] = address.address.split('.').map(Number);
    return first === 10 || (first === 172 && second >= 16 && second <= 31) || (first === 192 && second === 168);
  }).map(address => address.address))];
}

export function createSiteServer(root = projectRoot, { lan = false } = {}) {
  const allowedHosts = new Set(['localhost', '127.0.0.1', '[::1]', ...(lan ? localNetworkAddresses() : [])]);
  const surface = publicSurface(root);
  const headers = securityHeaders(root, surface);
  const config = JSON.parse(fs.readFileSync(path.join(root, 'serve.json'), 'utf8'));
  config.public = root;
  config.directoryListing = false;
  config.renderSingle = false;
  config.symlinks = false;
  config.headers = (config.headers || []).filter(h => h.source !== '**');
  config.headers.push({ source: '**', headers: Object.entries(headers).map(([key,value]) => ({key,value})) });
  const server = http.createServer({ maxHeaderSize: 16384 }, async (request, response) => {
    for (const [key,value] of Object.entries(headers)) response.setHeader(key, value);
    function finish(status, message) {
      response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
      response.end(request.method === 'HEAD' ? undefined : message);
    }
    try {
      let hostname;
      try {
        const host = request.headers.host;
        if (!host || /[/\\\s,@?#]/.test(host)) return finish(400, 'Bad request');
        const parsed = new URL('http://' + host);
        hostname = parsed.hostname;
        if (parsed.username || parsed.password) return finish(400, 'Bad request');
      } catch { return finish(400, 'Bad request'); }
      if (!allowedHosts.has(hostname)) return finish(403, 'Host not allowed');
      if (!['GET','HEAD'].includes(request.method)) {
        response.setHeader('Allow', 'GET, HEAD');
        return finish(405, 'Method not allowed');
      }
      const resource = resolvePublicRequest(request.url, surface);
      if (resource.location) {
        response.writeHead(resource.status, { Location: resource.location, 'Cache-Control': 'no-store' });
        return response.end();
      }
      if (resource.status !== 200) return finish(resource.status, resource.status === 400 ? 'Bad request' : 'Not found');
      let current = root;
      for (const segment of resource.file.split('/')) {
        current = path.join(current, segment);
        if (fs.lstatSync(current).isSymbolicLink()) return finish(404, 'Not found');
      }
      await serveHandler(request, response, config);
    } catch {
      if (!response.headersSent) finish(500, 'Internal server error');
      else response.destroy();
      console.error('Static request failed; no filesystem details sent to the client.');
    }
  });
  server.headersTimeout = 10000;
  server.requestTimeout = 30000;
  server.keepAliveTimeout = 5000;
  server.maxHeadersCount = 100;
  server.maxRequestsPerSocket = 1000;
  server.on('clientError', (_error, socket) => {
    if (socket.writable) socket.end('HTTP/1.1 400 Bad Request\r\nConnection: close\r\nContent-Length: 0\r\n\r\n');
  });
  return server;
}
if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const port = Number(process.env.PORT || 4000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be a valid TCP port');
  const lan = process.env.LAN === '1';
  const server = createSiteServer(projectRoot, { lan });
  server.on('error', error => { console.error('Cannot start the local server (' + error.code + ').'); process.exitCode = 1; });
  server.listen(port, lan ? '0.0.0.0' : '127.0.0.1', () => {
    console.log('BirthLab Studio: http://localhost:' + port);
    if (lan) for (const address of localNetworkAddresses()) console.log('Local network: http://' + address + ':' + port);
  });
}

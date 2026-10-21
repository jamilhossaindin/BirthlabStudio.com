import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { once } from 'node:events';
import { createSiteServer, localNetworkAddresses } from './server.mjs';
import { publicSurface, vercelConfig } from './security-policy.mjs';

test('static server security boundary', async t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'birthlab-security-test-'));
  let server;
  try {
    for (const dir of ['scripts','assets/runtime-scripts','404','about','work','contact','services','process','collaborate','case-studies/sample','.git','.vercel','node_modules','docs']) fs.mkdirSync(path.join(root, dir), {recursive:true});
    const page = '<!doctype html><title>Fixture</title><h1>Portfolio</h1><script>window.fixture=true;</script>';
    for (const file of ['index.html','404/index.html','about/index.html','work/index.html','contact/index.html','services/index.html','process/index.html','collaborate/index.html','case-studies/sample/index.html']) fs.writeFileSync(path.join(root,file),page);
    fs.writeFileSync(path.join(root,'scripts/portfolio-projects.json'),JSON.stringify([{slug:'sample'}]));
    fs.writeFileSync(path.join(root,'serve.json'),JSON.stringify({rewrites:[{source:'/sample',destination:'/case-studies/sample/index.html'}]}));
    fs.writeFileSync(path.join(root,'assets/runtime-scripts/test.mjs'),'export const value=1;');
    fs.writeFileSync(path.join(root,'assets/test.mp4'),Buffer.from('0123456789'));
    fs.writeFileSync(path.join(root,'robots.txt'),'User-agent: *');
    fs.writeFileSync(path.join(root,'sitemap.xml'),'<urlset/>');
    const marker = 'PRIVATE_FIXTURE_MUST_NOT_BE_SERVED';
    for (const file of ['.git/config','.vercel/project.json','.env','package.json','docs/report.md','node_modules/private.json','assets/.env.js']) fs.writeFileSync(path.join(root,file),marker);
    server=createSiteServer(root);
    server.listen(0,'127.0.0.1'); await once(server,'listening');
    const port=server.address().port;
    const request=(pathname,options={})=>new Promise((resolve,reject)=>{
      const req=http.request({hostname:'127.0.0.1',port,path:pathname,method:options.method||'GET',headers:{Host:'localhost:'+port,...options.headers}},res=>{
        let body='';res.on('data',chunk=>body+=chunk);res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body}));
      });req.on('error',reject);req.end();
    });
    await t.test('known pages, aliases and assets remain accessible',async()=>{
      for(const route of ['/','/about','/work','/contact','/contact/?enquiry=start-a-project','/services','/services/','/process','/process/','/sample','/case-studies/sample','/assets/runtime-scripts/test.mjs','/robots.txt','/sitemap.xml']) assert.equal((await request(route)).status,200,route);
    });
    await t.test('retired Collaborate URLs redirect to Contact without serving a stale page or copying query data',async()=>{
      for(const route of ['/collaborate','/collaborate/','/collaborate/index','/collaborate/index.html','/collaborate?name=private&email=private']){
        const result=await request(route);
        assert.equal(result.status,308,route);
        assert.equal(result.headers.location,'/contact/?enquiry=start-a-project');
        assert.ok(!result.body.includes('Portfolio'),'Old standalone document must not render');
        assert.equal((await request(result.headers.location)).status,200,'Redirect must terminate at Contact');
      }
      const surface=publicSurface(root),config=vercelConfig(root,surface);
      assert.ok(!surface.pages.includes('collaborate/index.html'));
      for(const [route,location] of surface.redirects){
        const redirect=config.routes.find(rule=>rule.status===308&&new RegExp(rule.src).test(route));
        assert.equal(redirect?.headers.Location,location,route);
      }
    });
    await t.test('private existing files cannot be downloaded',async()=>{
      for(const route of ['/.git/config','/.vercel/project.json','/.env','/package.json','/docs/report.md','/node_modules/private.json','/scripts/server.mjs','/assets/.env.js']){
        const result=await request(route);assert.equal(result.status,404,route);assert.ok(!result.body.includes(marker),route);
      }
    });
    await t.test('no directory listings',async()=>{
      for(const route of ['/assets/','/assets/runtime-scripts/','/scripts/','/docs/','/.git/']) assert.equal((await request(route)).status,404,route);
    });
    await t.test('encoded traversal and malformed paths are rejected',async()=>{
      for(const route of ['/../.git/config','/%2e%2e/.git/config','/assets/%2e%2e/.git/config','/assets%5c..%5c.git%5cconfig','/%00','/%ZZ','//evil.invalid/']) assert.equal((await request(route)).status,400,route);
      assert.equal((await request('/%252e%252e/.git/config')).status,404);
      assert.equal((await request('/%2egit/config')).status,404);
    });
    await t.test('unsupported methods are rejected, including on static files',async()=>{
      for(const method of ['POST','PUT','PATCH','DELETE','TRACE','OPTIONS']){
        const result=await request('/',{method});assert.equal(result.status,405,method);assert.equal(result.headers.allow,'GET, HEAD');
      }
    });
    await t.test('untrusted Host headers are blocked',async()=>{
      for(const host of ['evil.invalid','localhost.evil.invalid','evil.invalid:4000']) assert.equal((await request('/',{headers:{Host:host}})).status,403,host);
      for(const host of localNetworkAddresses()) assert.equal((await request('/',{headers:{Host:host}})).status,403,'LAN access requires an explicit opt-in');
    });
    await t.test('LAN mode permits only this computer\'s local addresses and retains private-file protection',async()=>{
      const lanServer=createSiteServer(root,{lan:true});
      try {
        lanServer.listen(0,'127.0.0.1');await once(lanServer,'listening');
        const lanPort=lanServer.address().port;
        const lanRequest=(pathname,host)=>new Promise((resolve,reject)=>{
          const req=http.get({hostname:'127.0.0.1',port:lanPort,path:pathname,headers:{Host:host}},res=>{
            res.resume();res.on('end',()=>resolve(res.statusCode));
          });req.on('error',reject);
        });
        for(const host of ['localhost',...localNetworkAddresses()]){
          assert.equal(await lanRequest('/',host+':'+lanPort),200,host);
          for(const route of ['/package.json','/.env','/scripts/server.mjs','/.git/config']) assert.equal(await lanRequest(route,host+':'+lanPort),404,route);
        }
        for(const host of ['evil.invalid','192.0.2.10','localhost.evil.invalid','192.168.0.186.evil.invalid']) assert.equal(await lanRequest('/',host),403,host);
        for(const host of ['localhost@evil.invalid','localhost/path','localhost?evil.invalid']) assert.equal(await lanRequest('/',host),400,host);
      } finally {
        lanServer.closeAllConnections();await new Promise(resolve=>lanServer.close(resolve));
      }
    });
    await t.test('headers protect successful and error responses',async()=>{
      for(const route of ['/','/.git/config','/assets/runtime-scripts/test.mjs']){
        const result=await request(route);
        assert.equal(result.headers['x-content-type-options'],'nosniff');
        assert.equal(result.headers['x-frame-options'],'DENY');
        assert.ok(result.headers['content-security-policy'].includes("frame-ancestors 'none'"));
        assert.ok(result.headers['content-security-policy'].includes("'sha256-"));
        assert.ok(!result.headers['content-security-policy'].includes("'unsafe-eval'"));
        assert.ok(!result.headers['access-control-allow-origin']);
        assert.ok(!result.headers['strict-transport-security'],'HSTS is reserved for HTTPS hosting');
      }
    });
    await t.test('HEAD and video range requests still work',async()=>{
      const head=await request('/',{method:'HEAD'});assert.equal(head.status,200);assert.equal(head.body,'');
      const range=await request('/assets/test.mp4',{headers:{Range:'bytes=0-3'}});
      assert.equal(range.status,206);assert.equal(range.headers['content-range'],'bytes 0-3/10');assert.equal(range.body,'0123');
    });
    await t.test('Vercel routing rejects private files before filesystem fallback',()=>{
      const surface=publicSurface(root),config=vercelConfig(root,surface),deny=new RegExp(config.routes[1].src);
      for(const route of ['/.git/config','/.env','/package.json','/docs/report.md','/scripts/server.mjs','/assets/.env.js','/unknown-secret.txt']) assert.equal(deny.test(route),true,route);
      for(const route of [...surface.routes.keys(),...surface.redirects.keys(),...surface.assets]) assert.equal(deny.test(route),false,route);
    });
    await t.test('new private files are not automatically published',async()=>{
      fs.writeFileSync(path.join(root,'new-private.txt'),marker);
      assert.equal((await request('/new-private.txt')).status,404);
    });
  } finally {
    if(server) { server.closeAllConnections(); await new Promise(resolve=>server.close(resolve)); }
    // Only this freshly created fixture directory is removed.
    const resolved=path.resolve(root),expected=path.resolve(os.tmpdir())+path.sep+'birthlab-security-test-';
    if(!resolved.startsWith(expected))throw new Error('Fixture outside temporary directory');
    fs.rmSync(resolved,{recursive:true,force:true});
  }
});

'use strict';

// Only static help assets are cached. Do not cache Apps Script, responses,
// credentials, deployment config, or report data and attachments.
const scope = new URL(self.registration.scope);
const prefix = 'silontar-mobile:' + scope.pathname + ':';
const cacheName = prefix + 'v1';
const offline = new URL('offline.html', scope).href;
const assets = [offline, new URL('mobile.css', scope).href, new URL('icon-192.png', scope).href];
const entryPaths = new Set([scope.pathname, new URL('index.html', scope).pathname]);

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(assets)));
});
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name.startsWith(prefix) && name !== cacheName).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== scope.origin) return;
  if (event.request.mode === 'navigate' && entryPaths.has(url.pathname)) {
    event.respondWith(fetch(event.request).catch(async () => {
      return await (await caches.open(cacheName)).match(offline) || Response.error();
    }));
  } else if (assets.includes(url.href) && event.request.mode !== 'navigate') {
    event.respondWith(fetch(event.request).catch(async () => {
      return await (await caches.open(cacheName)).match(url.href) || Response.error();
    }));
  }
});

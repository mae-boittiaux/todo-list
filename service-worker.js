const cacheName = 'todo-list-cache';

const urlsToCache = [
    './',
    './index.js',
    './index.html',
    './styles.css',
    './favicon.ico'
];

self.addEventListener('install', event => {
    console.log("[Service Worker]: Installing service worker...");
    event.waitUntil(
        (async () => {
            const cache = await caches.open(cacheName);
            try {
                await cache.addAll(urlsToCache);
                console.log("[Service Worker]: Resources cached successfully.");
            } catch (error) {
                console.log("[Service Worker]: Failed to cache resources.");
            }
            await self.skipWaiting();
        })()
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        (async () => {
            const cache = await caches.open(cacheName);
            const cachedResponse = await cache.match(event.request);
            const networkPromise = fetch(event.request)
                .then(networkResponse => {
                    if (networkResponse && networkResponse.status === 200) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                })
                .catch(error => {
                    console.log("[Service Worker]: Network request failed.");
                });
            return cachedResponse || networkPromise;
        })()
    );
});

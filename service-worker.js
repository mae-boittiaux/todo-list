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

import { logMessage, MessageScope } from './log-message.js';

const cacheName = 'todo-list-cache';

const urlsToCache = [
    './',
    './index.js',
    './index.html',
    './favicon.ico',
    './log-message.js',
    './service-worker.js',
    './event-listeners.js',
    './stylesheets/styles.css',
    './stylesheets/variables.css',
    './stylesheets/line-colours.css',
    './stylesheets/bullet-points.css',
    './stylesheets/highlighter-buttons.css'
];

self.addEventListener('install', event => {
    logMessage(MessageScope.SERVICE_WORKER, "Installing service worker..");
    event.waitUntil(
        (async () => {
            const cache = await caches.open(cacheName);
            try {
                await cache.addAll(urlsToCache);
                logMessage(MessageScope.SERVICE_WORKER, "Resources cached successfully");
            } catch (error) {
                logMessage(MessageScope.SERVICE_WORKER, "Failed to cache resources");
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
                    logMessage(MessageScope.SERVICE_WORKER, "Network request failed");
                });
            return cachedResponse || networkPromise;
        })()
    );
});

self.addEventListener('activate', event => {
    logMessage(MessageScope.SERVICE_WORKER, "Activating service worker..");
    event.waitUntil(
        (async () => {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        logMessage(MessageScope.SERVICE_WORKER, "Deleting old cache");
                        return caches.delete(cache);
                    }
                })
            );
            await self.clients.claim();
        })()
    );
});

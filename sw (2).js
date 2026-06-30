const CACHE_NAME = 'comprice-scanner-v1';
const urlsToCache = [
    '/ComPrice-Scanner/',
    '/ComPrice-Scanner/index.html',
    '/ComPrice-Scanner/app.js',
    '/ComPrice-Scanner/manifest.json',
    '/ComPrice-Scanner/offline.html'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) return response;
                return fetch(event.request).catch(() => {
                    if (event.request.mode === 'navigate') {
                        return caches.match('/ComPrice-Scanner/offline.html');
                    }
                });
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// service-worker.js
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('sabda-sansar-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/styles.css',
                '/app.js',
                // Add other resources you want to cache
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

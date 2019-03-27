self.addEventListener('install', event => {
    console.log('[Service Worker] Installing Service Worker ...', event);
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating Service Worker ...', event);
    return self.clients.claim();
});

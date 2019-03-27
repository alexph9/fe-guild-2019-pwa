importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');
importScripts('src/lib/idb.js');
importScripts('src/js/utility.js');

if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);

    workbox.precaching.precacheAndRoute([
  {
    "url": "favicon.ico",
    "revision": "0251fdb59b82f5f8f448fca84e94f357"
  },
  {
    "url": "index.html",
    "revision": "69e3576a609fdf825edec844458cfaea"
  },
  {
    "url": "manifest.json",
    "revision": "839abadb6c74e82a34ae5cac52bc697c"
  },
  {
    "url": "offline.html",
    "revision": "7a2ff0fc24a0a6b1a125c98a3664a5ac"
  },
  {
    "url": "src/css/app.css",
    "revision": "574e324013279b516504023455b26b32"
  },
  {
    "url": "src/css/feed.css",
    "revision": "9a683ea9c6fb0e77e78db33c51b987f7"
  },
  {
    "url": "src/css/help.css",
    "revision": "81922f16d60bd845fd801a889e6acbd7"
  },
  {
    "url": "src/js/app.js",
    "revision": "7c2fe4be27096194a1c1243b675891e5"
  },
  {
    "url": "src/js/feed.js",
    "revision": "a0f10ba6c690d40364ae4734b9784ed4"
  },
  {
    "url": "src/js/utility.js",
    "revision": "9626d951f9c9fb4fea37332dd2880e99"
  },
  {
    "url": "src/lib/idb.js",
    "revision": "eb4b9eb51d79d8d6e2c2c813bfa54b1f"
  },
  {
    "url": "src/lib/material.indigo-deep_orange.min.css",
    "revision": "1b5a4a3c84a73a3a53654e9dd3ef70c0"
  },
  {
    "url": "src/lib/material.min.js",
    "revision": "e68511951f1285c5cbf4aa510e8a2faf"
  },
  {
    "url": "src/images/main-image-lg.jpg",
    "revision": "05b87e478ce30957f4e2f00b5c18f80a"
  },
  {
    "url": "src/images/main-image-sm.jpg",
    "revision": "6172dffd0848144bbc3f7504d8585058"
  },
  {
    "url": "src/images/main-image.jpg",
    "revision": "489ce4c1c7ebc7545aa528cea56e50c1"
  }
]);

    workbox.routing.registerRoute(
        /.*(?:googleapis|gstatic)\.com.*$/,
        workbox.strategies.staleWhileRevalidate({
            cacheName: 'google-fonts',
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 50,
                    maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
                })
            ]
        }));

    // Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
    // workbox.routing.registerRoute(
    //     /^https:\/\/fonts\.googleapis\.com/,
    //     workbox.strategies.staleWhileRevalidate({
    //         cacheName: 'google-fonts-stylesheets',
    //     })
    // );

    // Cache the underlying font files with a cache-first strategy for 1 year.
    // workbox.routing.registerRoute(
    //     /^https:\/\/fonts\.gstatic\.com/,
    //     workbox.strategies.cacheFirst({
    //         cacheName: 'google-fonts-webfonts',
    //         plugins: [
    //             new workbox.cacheableResponse.Plugin({
    //                 statuses: [0, 200],
    //             }),
    //             new workbox.expiration.Plugin({
    //                 maxAgeSeconds: 60 * 60 * 24 * 365,
    //                 maxEntries: 30,
    //             }),
    //         ],
    //     })
    // );

    workbox.routing.registerRoute(
        new RegExp('/images/icons/*/'),
        workbox.strategies.staleWhileRevalidate({
            cacheName: 'icons-cache',
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 5,
                    maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
                })
            ]
        }));

    workbox.routing.registerRoute(
        new RegExp('/images/splashscreens/*/'),
        workbox.strategies.staleWhileRevalidate({
            cacheName: 'splashscreens-cache',
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 1,
                    maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
                })
            ]
        }));
    
        workbox.routing.registerRoute(API_URL, args => {
            return fetch(args.event.request)
                .then(response => {
                    const clonedResponse = response.clone();
                    clearAllData('selfies')
                        .then(() => clonedResponse.json())
                        .then(selfies => {
                            for (const selfie in selfies) {
                                writeData('selfies', selfies[selfie])
                            }
                        });
                    return response;
                });
        });

    workbox.routing.registerRoute(
        routeData => routeData.event.request.headers.get('accept').includes('text/html'),
        args => {
            return caches.match(args.event.request)
                .then(response => {
                    if (response) {
                        console.log(response);
                        return response;
                    }

                    // Clone the request - a request is a stream and can be only consumed once
                    const requestToCache = args.event.request.clone();

                    // Try to make the original HTTP request as intended
                    return fetch(requestToCache)
                        .then(response => {
                            // If request fails or server responds with an error code, return that error immediately
                            if (!response || response.status !== 200) {
                                return response;
                            }

                            // Again clone the response because you need to add it into the cache and because it's used
                            // for the final return response
                            const responseToCache = response.clone();

                            caches.open('dynamic')
                                .then(cache => {
                                    cache.put(requestToCache, responseToCache);
                                });

                            return response;
                        });
                })
                .catch(error => {
                    return caches.match('/fe-guild-2019-pwa/offline.html');
                });
        }
    );

} else {
    console.log(`Boo! Workbox didn't load 😬`);
}

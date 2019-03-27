importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');
importScripts('src/lib/idb.js');
importScripts('src/js/utility.js');

if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);

    workbox.precaching.precacheAndRoute([]);

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

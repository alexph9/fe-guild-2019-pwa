importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  workbox.precaching.precacheAndRoute([
  {
    "url": "favicon.ico",
    "revision": "0251fdb59b82f5f8f448fca84e94f357"
  },
  {
    "url": "index.html",
    "revision": "12a7c6789a40869c11db02194afd24ac"
  },
  {
    "url": "manifest.json",
    "revision": "d6476aad7872219e1b1adb43e19e4db1"
  },
  {
    "url": "offline.html",
    "revision": "258d2bfab026c2d82a6962fefbbc53be"
  },
  {
    "url": "src/css/app.css",
    "revision": "3242fd6e304c50ec2902400ecad69399"
  },
  {
    "url": "src/css/feed.css",
    "revision": "ef5b292641220d93e7923dc79c254969"
  },
  {
    "url": "src/css/help.css",
    "revision": "81922f16d60bd845fd801a889e6acbd7"
  },
  {
    "url": "src/js/app.js",
    "revision": "a1357d55fad61dafda2b8b986da42c4f"
  },
  {
    "url": "src/js/feed.js",
    "revision": "35d34a1fac1dcf08cd72efa6a22cdf66"
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
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
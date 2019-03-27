importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  workbox.precaching.precacheAndRoute([
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
    "url": "src/lib/material.indigo-deep_orange.min.css",
    "revision": "1b5a4a3c84a73a3a53654e9dd3ef70c0"
  }
]);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
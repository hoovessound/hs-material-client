/*
  YAY, Service worker :P
*/

const version = 'v1';
const _cacheName = `hs_cache_${version}`;

// List of static files that we need them later on
const preCacheList = [
  '/',

  // The "Apple Shell" lol
  '/index.html',

  // The main application logic
  '/static/js/bundle.js',

  // The offline page
  '/offline.html',

  // Web font for the offline page
  'https://fonts.googleapis.com/css?family=Oswald',

  // The HoovesSound logo
  '/favicon.ico',
];

self.addEventListener('install', event => {
  self.skipWaiting();
  // When the user first visit our page, this event kicks in
  event.waitUntil(
    caches.open(_cacheName)
    .then(cache => {
      cache.addAll(preCacheList);
    })
  );
});

self.addEventListener('fetch', event => {
  // When the browser trys to fetch something like making an API call or getting an image from Imgur, this event kicks in


  // Socket.io stuff
  if(event.request.url.includes('socket.io')){
    return fetch(event.request);
  }

  if(event.request.url.includes('sockjs-node')){
    return fetch(event.request);
  }

  if(event.request.url.endsWith('.map')){
    return fetch(event.request);
  }

  if(event.request.url.includes('google-analytics.com')){
    return fetch(event.request);
  }

  if(event.request.method === 'GET'){
    event.respondWith(
      caches.open(_cacheName)
      .then((cache) => {
        return cache.match(event.request)
        .then((response) => {
          return response || fetch(event.request)
          .then((response) => {
            cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => {
            return cache.match('/offline.html');
          })
        });
      })
    );
  }
});
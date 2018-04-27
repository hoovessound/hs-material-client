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
  'https://storage.googleapis.com/hs-static/favicon.png',

  // Emoji one sheet
  'https://github.com/pladaria/react-emojione/blob/emojione3/assets/sprites/emojione-3.1.2-64x64.png?raw=true',

  // Material UI defalut font
  'https://fonts.googleapis.com/css?family=Roboto:300,400,500',

  // Firebase 4.13.0 SDK
  'https://www.gstatic.com/firebasejs/4.13.0/firebase.js',

  // Socket.io client library
  'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.0/socket.io.js',
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
    return event.respondWith(
      caches.open(_cacheName)
      .then(cache => {
        return cache.match('https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.0/socket.io.js')
        .then(response => {
          if(response){
            return response;
          }else{
            return fetch('https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.0/socket.io.js')
            .then(response => {
              cache.put(event.request, response.clone());
              return response;
            })
          }
        })
      })
    )
  }

  if(event.request.url.includes('sockjs-node')){
    return event.respondWith(
      fetch(event.request)
    )
  }

  if(event.request.url.endsWith('.map')){
    return event.respondWith(
      fetch(event.request)
    )
  }

  if(event.request.url.includes('google-analytics.com')){
    return event.respondWith(
      fetch(event.request)
    )
  }

  if(event.request.url.includes('events')){
    return event.respondWith(
      fetch(event.request)
    )
  }

  if(event.request.url.includes('hot-update')){
    return event.respondWith(
      fetch(event.request)
    )
  }

  // Cache first

  if(event.request.url.includes('api.hoovessound') && event.request.url.includes('/image/') && event.request.method === 'GET'){
    // HoovesSound Image API
    // Serive cache version first
    return event.respondWith(
      caches.open(_cacheName).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response) {
            fetch(event.request).then((response) => {
              cache.put(event.request, response.clone());
            });
            return response;
          }else{
            return fetch(event.request).then((response) => {
              cache.put(event.request, response.clone());
              return response;
            });
          }
        })
      })
    )
  }

  if(event.request.url.includes('fonts.googleapis.com') && event.request.method === 'GET'){
    // HoovesSound Image API
    // Serve cache version first
    return event.respondWith(
      caches.open(_cacheName).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response) {
            fetch(event.request).then((response) => {
              cache.put(event.request, response.clone());
            });
            return response;
          }else{
            return fetch(event.request).then((response) => {
              cache.put(event.request, response.clone());
              return response;
            });
          }
        })
      })
    )
  }

  if(event.request.url.includes('stream.hoovessound') && event.request.method === 'GET'){
    // HoovesSound Music Streaming API
    // Serve the cache version first
    return event.respondWith(
      caches.open(_cacheName)
      .then(cache => {
        return cache.match(event.request)
        .then(response => {
          if (response) {
            fetch(event.request).then((response) => {
              cache.put(event.request, response.clone());
            });
            return response;
          }else{
            return fetch(event.request).then((response) => {
              cache.put(event.request, response.clone());
              return response;
            });
          }
        })
      })
    )
  }

  // Network first caching method

  /*
    Flow:
    Online: API Call -> Network fetch -> Update cache
    Offline (with cache): API Call -> Network fetch(Fail) -> Serve cache
    Offline (without cache): API Call -> Network fetch(Fail) -> Serve cache(Fail) -> Serve offline.html -> IDK lol
  */

  if(event.request.method === 'GET'){
    return event.respondWith(
       fetch(event.request)
        .then(networkResponse => {
          return caches.open(_cacheName)
          .then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
        })
        .catch(() => {
          return caches.open(_cacheName)
          .then(cache => {
            return cache.match(event.request)
            .then(response => {
              if(response){
                return response;
              }else{
                return cache.match('/offline.html')
                .then(response => {
                  return response;
                })
              }
            })
          })
        })
    );
  }
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
    .then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if(cacheName !== _cacheName){
            return caches.delete(cacheName);
          }
        })
      )
    })
  );
});
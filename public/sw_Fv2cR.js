/*
  YAY, Service worker :P
*/

// Import WorkBox library
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.1.0/workbox-sw.js')

// Offline Google Analytics
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.1.0/workbox-sw.js')

if (workbox) {
  workbox.setConfig({
    debug: false,
  });
  workbox.googleAnalytics.initialize()
  const version = 'v1'
  const _cacheName = `hs_cache_${version}`

  // List of static files that we need them later on
  const preCacheList = [
    // The offline page
    '/offline.html',

    // Web font for the offline page
    'https://fonts.googleapis.com/css?family=Oswald',

    // The HoovesSound logo
    '/favicon.ico',
    'https://storage.googleapis.com/hs-static/favicon.png',

    // Emoji one sheet
    'https://github.com/pladaria/react-emojione/blob/emojione3/assets/sprites/emojione-3.1.2-64x64.png?raw=true',

    // Material UI default font
    'https://fonts.googleapis.com/css?family=Roboto:300,400,500',

    // Firebase 4.13.0 SDK
    'https://www.gstatic.com/firebasejs/4.13.0/firebase.js',

    // Socket.io client library
    'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.0/socket.io.js',
  ]

  self.addEventListener('install', event => {
    self.skipWaiting()
    // When the user first visit our page, this event kicks in
    event.waitUntil(
      caches.open(_cacheName)
      .then(cache => {
        cache.addAll(preCacheList)
      })
    )
  })

  workbox.routing.registerRoute(
    new RegExp(/.*\.js/i),
    workbox.strategies.networkFirst()
  )

  workbox.routing.registerRoute(
    new RegExp(/.*\.map/i),
    workbox.strategies.networkFirst()
  )

  workbox.routing.registerRoute(
    new RegExp(/.*sockjs-node.*/i),
    workbox.strategies.networkFirst()
  )

  workbox.routing.registerRoute(
    new RegExp(/.*socket.hoovessound.*/i),
    workbox.strategies.networkFirst()
  )

  workbox.routing.registerRoute(
    new RegExp(/.*api.hoovessound.*\/events/i),
    workbox.strategies.networkFirst()
  )

  workbox.routing.registerRoute(
    new RegExp(/.*/),
    workbox.strategies.staleWhileRevalidate(),
  )
}else{
  console.error('Workbox library didn\'t load, service worker don\'t execute')
}

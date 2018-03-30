// Google's SW-Toolbox library
importScripts('https://cdn.rawgit.com/GoogleChromeLabs/sw-toolbox/2fb9a52c/sw-toolbox.js');

toolbox.options.debug = true;

// Precache the assets
toolbox.precache([
  '*',
]);

toolbox.router.get('*', toolbox.networkFirst);
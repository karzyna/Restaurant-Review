var APP_PREFIX = 'RestaurantReview_'     // Identifier for this app (this needs to be consistent across every cache update)
var VERSION = 'version_09'              // Version of the off-line cache (change this value everytime you want to update cache)
var CACHE_NAME = APP_PREFIX + VERSION
var URLS = [                            // Add URL you want to cache in this list.
  '/index.html',
  '/restaurant.html',
  '/js/main.js',
  '/js/dbhelper.js',
  '/js/restaurant_info.js',
  '/css/styles.css',
  '/img/'            
];

// Respond with cached resources
self.addEventListener('fetch', function (e) {
  console.log('fetch request : ' + e.request.url)
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) { // if cache is available, respond with cache
        console.log('responding with cache : ' + e.request.url)
        return request
      } else {       // if there are no cache, try fetching request
        console.log('file is not cached, fetching : ' + e.request.url)
        return fetch(e.request)
      }

      // You can omit if/else for console.log & put one line below like this too.
      // return request || fetch(e.request)
    }).catch(function(error) {
      console.log(error);
      return caches.match('index.html');
    })
  )
})

// Cache resources
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(URLS)
    })
  )
})

// Delete outdated caches
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create white list
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX)
      })
      // add current cache name to white list
      cacheWhitelist.push(CACHE_NAME)

      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('deleting cache : ' + keyList[i] )
          return caches.delete(keyList[i])
        }
      }))
    })
  )
})

// let staticCacheName = 'restaurant-static-v1';
// self.addEventListener('install', function(event) {
//     event.waitUntil(
//         caches.open(staticCacheName).then(function(cache) {
//             return cache.addAll([
//                 '/',
//                 'index.html',
//                 'restaurant.html',
//                 'css/styles.css',
//                 'js/dbhelper.js',
//                 'js/main.js',
//                 'js/restaurant_info.js',
//                 'img/',
//                 'data/restaurants.json',
//             ]);
//         })
//     );
// });

// self.addEventListener('activate', function(event) {
//     event.waitUntil(
//         caches.keys().then(function(cacheNames) {
//             return Promise.all(
//                 cacheNames.filter(function(cacheName) {
//                     return cacheName.startsWith('restaurant-') && cacheName != staticCacheName;
//                 }).map(function(cacheName) {
//                     return caches.delete(cacheName);
//                 })    
//             );
//         })
//     );
// });

// self.addEventListener('fetch', function(event){
//     // console.log(event.request);
//     event.respondWith(
//         caches.match(event.request).then(function(response) {
//             if (response) return response;
//             return fetch(event.request)
//         })
//     );
// });

// self.addEventListener('message', function(event) {
//     if (event.data.action === 'skipWaiting') {
//        self.skipWaiting();
//     }
// });
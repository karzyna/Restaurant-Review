var staticCacheName = 'restaurant-review-v1';
var contentImgsCache = 'restaurant-content-imgs';
var allCaches = [
    staticCacheName,
    contentImgsCache
];
self.addEventListener('install', function(event){
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache){
            return cache.addAll([
                '/index.html',
                '/restaurant.html',
                '/js/main.js',
                '/js/dbhelper.js',
                '/js/restaurant_info.js',
                '/css/styles.css',
                '/img/'
            ]);
        })
    );
});

self.addEventListener('activate', function(event){
    event.waitUntil(
        caches.keys().then(function(cacheNames){
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith('restaurant-') && !allCaches.includes(cacheName);
                }).map(function(cacheName){
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    var requestUrl = new URL(event.request.url);

    if (requestUrl.origin === location.origin) {
        if (requestUrl.pathname === '/') {
            event.respondWith(caches.match('/index.html'));
            return;
        }
        if (requestUrl.pathname.startsWith('/img/')) {
            event.respondWith(servePhoto(event.request));
            return;
        }  
    }

    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});
//pupapupa
function servePhoto(request) {
    var storageUrl = request.url.replace(/\d+\.jpg$/, '');

    return caches.open(contentImgsCache).then(function(cache){
        return cache.match(storageUrl).then(function(response){
            if (response) return response;

            return fetch(request).then(function(networkResponse){
                cache.put(storageUrl, networkResponse.clone());
                return networkResponse;
            })
        })
    })
};

self.addEventListener('message', function (event) {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
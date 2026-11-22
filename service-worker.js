
const CACHE_NAME = "gastostracker-v1";

const APP_FILES = [
    "./",
    "./index.html",
    "./transaction.html",
    "./history.html",
    "./backup.html",
    "./manifest.json",

    // App icons
    "./icons/icon-192.png",
    "./icons/icon-512.png",

    // Bootstrap
    "./vendor/bootstrap/css/bootstrap.min.css",
    "./vendor/bootstrap/js/bootstrap.bundle.min.js",

    // Bootstrap Icons
    "./vendor/bootstrap-icons/font/bootstrap-icons.min.css",
    "./vendor/bootstrap-icons/font/fonts/bootstrap-icons.woff2",

    // SweetAlert2
    "./vendor/sweetalert2/sweetalert2.min.css",
    "./vendor/sweetalert2/sweetalert2.all.min.js",

    // Custom CSS
    "./assets/css/navbar.css",
    "./assets/css/bottom-nav.css",
    "./assets/css/index.css",
    "./assets/css/transaction.css",
    "./assets/css/history.css",
    "./assets/css/backup.css",

    // JavaScript
    "./assets/js/script.js",
    "./assets/js/index.js",
    "./assets/js/transaction.js",
    "./assets/js/history.js",
    "./assets/js/backup.js"
];


// Install Service Worker
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_FILES))
            .then(() => self.skipWaiting())
    );
});


// Activate Service Worker
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => cacheName !== CACHE_NAME)
                    .map(cacheName => caches.delete(cacheName))
            );
        }).then(() => self.clients.claim())
    );
});


// Handle Offline Requests
self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then(response => {
                if (response.ok) {
                    const responseCopy = response.clone();

                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseCopy);
                    });
                }

                return response;
            });
        })
    );
});

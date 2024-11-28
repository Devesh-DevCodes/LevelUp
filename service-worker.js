const CACHE_NAME = "app-cache-v1";
const urlsToCache = [
    '/',
    '/index.html',                  // The main HTML file
    '/style.css',                   // The main stylesheet
    '/app.js',                       // The main JavaScript file
    '/manifest.json',                // The web app manifest
    '/service-worker.js',            // The service worker file itself

    '/favicon_io/android-chrome-192x192.png',  // App icon (192x192)
    '/favicon_io/android-chrome-512x512.png',  // App icon (512x512)
    '/favicon_io/favicon-32x32.png',  // App icon (32x32)
    '/favicon_io/favicon-16x16.png',  // App icon (16x16)
    '/favicon_io/apple-touch-icon.png',  // App icon for Apple devices
    '/assets/td-3.jpg',              // logo image
    '/assets/td-2.jpg',              // Example image
    '/assets/td-1.png',              // Example image
    '/offline.html',                 // Offline page
  ];
  


// Install event: Caches the specified URLs for offline use
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
}); 
// Fetch event: Intercepts requests and serves cached files when offline 
self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        // Return cached response if available, otherwise fetch from network
        return (
            response || 
            fetch(event.request).catch(() => caches.match("/offline.html"))
          ); 
      })
    );
  });

// Activate event: Cleans up old caches when the service worker is updated
self.addEventListener("activate", event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName); // Delete old caches
            }
          })
        );
      })
    );
  });


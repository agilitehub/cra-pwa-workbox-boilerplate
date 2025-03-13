/**
 * Service Worker Template
 * This file will be used to generate the final service worker during the build process
 */

// Import Workbox from CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

// Use the Workbox modules
workbox.setConfig({
  debug: false // Set to true for development
});

const { 
  routing, 
  strategies, 
  precaching, 
  expiration, 
  backgroundSync, 
  cacheableResponse,
  navigationPreload
} = workbox;

// Enable navigation preload
navigationPreload.enable();

// Precache and route
precaching.precacheAndRoute(self.__WB_MANIFEST);

// Cache static assets
routing.registerRoute(
  ({ request }) => request.destination === 'script' || 
                  request.destination === 'style' || 
                  request.destination === 'document',
  new strategies.StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      }),
    ],
  })
);

// Cache images
routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache Google Fonts stylesheets
routing.registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new strategies.StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// Cache Google Fonts webfont files
routing.registerRoute(
  ({ url }) => url.origin === 'https://fonts.gstatic.com',
  new strategies.CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new expiration.ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
      }),
      new cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Cache API responses
routing.registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new strategies.NetworkFirst({
    cacheName: 'api-responses',
    plugins: [
      new expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
      new cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Background sync for failed API requests
const bgSyncPlugin = new backgroundSync.BackgroundSyncPlugin('apiQueue', {
  maxRetentionTime: 24 * 60, // 24 hours (in minutes)
});

// Register a route for API requests that will use background sync
routing.registerRoute(
  ({ url }) => url.pathname.startsWith('/api/') && 
              (url.pathname.includes('/create') || 
               url.pathname.includes('/update') || 
               url.pathname.includes('/delete')),
  new strategies.NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  'POST'
);

// Offline fallback
routing.setCatchHandler(async ({ event }) => {
  // Return specific fallbacks for different types of requests
  switch (event.request.destination) {
    case 'document':
      return caches.match('/offline.html');
    case 'image':
      return caches.match('/offline-image.png');
    case 'font':
      return caches.match('/offline-font.woff2');
    default:
      return Response.error();
  }
});

// Skip waiting and clients claim
self.skipWaiting();
self.clients.claim();

// Listen for push notifications
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: data.icon || '/logo192.png',
    badge: data.badge || '/logo192.png',
    data: {
      url: data.url || '/',
    },
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
}); 
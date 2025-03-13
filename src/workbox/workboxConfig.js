/**
 * Workbox configuration
 * This file contains the configuration for Workbox caching strategies
 */

// Workbox runtime caching configuration
export const workboxConfig = {
  // Runtime caching rules
  runtimeCaching: [
    // Cache static assets
    {
      urlPattern: /\.(?:js|css|html)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    // Cache images
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    // Cache Google Fonts stylesheets
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets',
      },
    },
    // Cache Google Fonts webfont files
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache API responses
    {
      urlPattern: /^https:\/\/api\./,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-responses',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutes
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache other origin resources
    {
      urlPattern: /^https:\/\//,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'cross-origin',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60, // 1 hour
        },
      },
    },
  ],
};

// Precaching configuration
export const precacheConfig = {
  // Files to precache
  precacheFiles: [
    '/index.html',
    '/static/css/main.css',
    '/static/js/main.js',
    '/manifest.json',
    '/favicon.ico',
    '/logo192.png',
    '/logo512.png',
    '/offline.html',
  ],
  // Ignore URL parameters
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
};

// Background sync configuration
export const backgroundSyncConfig = {
  // Queue name
  queueName: 'syncQueue',
  // Maximum retry attempts
  maxRetentionTime: 24 * 60, // 24 hours (in minutes)
};

// Offline fallback configuration
export const offlineFallbackConfig = {
  // Fallback page for navigation requests
  pageFallback: '/offline.html',
  // Fallback image for image requests
  imageFallback: '/offline-image.png',
  // Fallback font for font requests
  fontFallback: '/offline-font.woff2',
}; 
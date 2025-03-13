# Workbox Implementation

This folder contains all the Workbox-related configuration and service worker logic for the PWA functionality.

## Files

- `serviceWorker.js` - Service worker registration and lifecycle management
- `workboxConfig.js` - Workbox caching strategies and runtime configuration
- `service-worker-template.js` - Service worker template that gets injected with precache manifest

## Implementation Details

The Workbox implementation provides:

- **Precaching** of static assets (HTML, CSS, JS, images)
- **Runtime caching** for dynamic content (API requests, external resources)
- **Offline fallback** pages and resources
- **Cache management** with expiration and size limits
- **Background sync** for offline operations

## How to Use in Your Project

1. **Copy this entire folder** to your project's `/src` directory

2. **Register the service worker** in your main `index.js` file:

```javascript
import { registerServiceWorker } from './workbox/serviceWorker';

// Register the service worker after the app has loaded
if (process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    registerServiceWorker();
  });
}
```

3. **Create a Workbox configuration file** in your project root:

```javascript
// workbox-config.js
module.exports = {
  globDirectory: "build/",
  globPatterns: ["**/*.{html,js,css,png,jpg,jpeg,gif,svg,ico,json}"],
  swDest: "build/service-worker.js",
  swSrc: "src/workbox/service-worker-template.js",
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
};
```

4. **Add the build script** to your `package.json`:

```json
"scripts": {
  "build": "react-scripts build && npm run build:sw",
  "build:sw": "workbox injectManifest workbox-config.js"
}
```

5. **Customize caching strategies** in `workboxConfig.js` as needed

## Customizing Caching Strategies

The `workboxConfig.js` file contains various caching strategies that you can customize:

```javascript
// Example: Customize API caching
export const apiCacheStrategy = {
  cacheName: 'api-cache',
  networkTimeoutSeconds: 10,
  plugins: [
    new ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: 60 * 60, // 1 hour
    }),
  ],
};
```

## Offline Fallbacks

The service worker provides offline fallbacks for:

- Pages: Redirects to `/offline.html` when a page is not available offline
- Images: Uses `/offline-image.svg` when an image cannot be loaded
- API requests: Returns cached data or a default response

## Testing

To test the service worker:

1. Build the application: `npm run build`
2. Serve the build folder: `npx serve -s build`
3. Open Chrome DevTools > Application > Service Workers
4. Check "Offline" in the Network tab
5. Refresh the page to see offline functionality

## References

- [Workbox Documentation](https://developer.chrome.com/docs/workbox)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Workbox Strategies](https://developer.chrome.com/docs/workbox/modules/workbox-strategies/)
- [Workbox Recipes](https://developer.chrome.com/docs/workbox/modules/workbox-recipes/) 
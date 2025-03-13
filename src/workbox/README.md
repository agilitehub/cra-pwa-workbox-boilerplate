# Workbox Configuration

This folder contains all the Workbox-related configuration and service worker logic for the PWA functionality.

## Contents

- `serviceWorker.js` - Service worker registration and configuration
- `workboxConfig.js` - Workbox configuration for caching strategies
- Additional utility files for specific Workbox features

## Implementation Details

The implementation uses Workbox to provide:
- Precaching of static assets
- Runtime caching for dynamic content
- Offline fallback pages
- Background sync capabilities

## Usage

The service worker is registered in the main `index.js` file of the application. The configuration can be customized in the `workboxConfig.js` file.

## References

- [Workbox Documentation](https://developer.chrome.com/docs/workbox)
- [Create React App PWA Configuration](https://create-react-app.dev/docs/making-a-progressive-web-app/) 
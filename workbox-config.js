module.exports = {
  globDirectory: 'build/',
  globPatterns: [
    '**/*.{html,js,css,png,jpg,jpeg,gif,svg,ico,json,woff,woff2,ttf,eot}'
  ],
  swDest: 'build/service-worker.js',
  swSrc: 'src/workbox/service-worker-template.js',
  // Don't include these files in the precache manifest
  globIgnores: [
    'service-worker.js',
    'workbox-*.js',
    'asset-manifest.json',
    'robots.txt'
  ],
  // Increase the limit for the cache size
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
}; 
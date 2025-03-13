# Create React App PWA Workbox Boilerplate

This project provides a boilerplate for creating Progressive Web Applications (PWAs) using Create React App, Workbox, IndexedDB, and Firebase Cloud Messaging. It's designed to be a plug-and-play solution for developers who want to PWA-enable their React applications.

## Features

- **Progressive Web App (PWA)** capabilities using Workbox
- **Offline-first** architecture with service worker caching
- **Local data storage** with IndexedDB
- **Data synchronization** between local storage and backend API
- **Push notifications** via Firebase Cloud Messaging (FCM)
- **Deployment** to Firebase Hosting
- **Modern UI** with TailwindCSS and FontAwesome
- **Centralized configuration** using environment variables

## Demo

A live demo is available at: [https://cra-pwa-workbox-boilerplate.web.app](https://cra-pwa-workbox-boilerplate.web.app)

## Project Structure

```
src/
├── components/         # React components
│   ├── Todo.js         # Todo component with offline support
│   ├── Notifications.js # Push notifications component
│   └── PWAStatus.js    # PWA status and installation component
├── db/                 # Database implementation
│   ├── indexedDB.js    # IndexedDB wrapper
│   ├── dbSync.js       # Data synchronization logic
│   └── models/         # Data models
├── firebase/           # Firebase implementation
│   ├── firebase.js     # Firebase initialization
│   ├── messaging.js    # Firebase Cloud Messaging
│   └── firebaseConfig.js # Firebase configuration
├── workbox/            # Workbox implementation
│   ├── serviceWorker.js # Service worker registration
│   └── service-worker-template.js # Service worker template
└── config.js           # Centralized configuration from environment variables
```

## Environment Variables

This project uses environment variables for configuration to keep sensitive information out of the codebase. This makes it more secure and easier to configure for different environments.

### Setup

1. Copy the `.env.example` file to a new file named `.env`:
   ```
   cp .env.example .env
   ```

2. Edit the `.env` file and replace the placeholder values with your actual configuration:
   ```
   # Firebase Configuration
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   # ... other variables
   ```

3. For Firebase configuration, you'll need to create a Firebase project and web app at [Firebase Console](https://console.firebase.google.com/).

### Available Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_FIREBASE_API_KEY` | Firebase API Key | - |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | - |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase Project ID | - |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | - |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | - |
| `REACT_APP_FIREBASE_APP_ID` | Firebase App ID | - |
| `REACT_APP_FIREBASE_MEASUREMENT_ID` | Firebase Measurement ID | - |
| `REACT_APP_FIREBASE_VAPID_KEY` | Firebase VAPID Key for Web Push | - |
| `REACT_APP_API_ENDPOINT_TODOS` | API Endpoint for Todos | `https://nodered.agilite.io/api/pwa/todos` |
| `REACT_APP_INDEXEDDB_NAME` | IndexedDB Database Name | `pwa-boilerplate` |
| `REACT_APP_INDEXEDDB_VERSION` | IndexedDB Database Version | `1` |
| `REACT_APP_SW_UPDATE_CHECK_INTERVAL` | Service Worker Update Check Interval (ms) | `60000` |

### Important Notes

- **Never commit your `.env` file to version control**. It's already added to `.gitignore`.
- The `.env.example` file should be committed as it serves as documentation for required environment variables.
- For production deployment, you'll need to set these environment variables in your hosting platform.

## Quick Start Guide

### Prerequisites

- Node.js and npm
- Firebase account
- Backend API for data synchronization (optional)

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/cra-pwa-workbox-boilerplate.git
   cd cra-pwa-workbox-boilerplate
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Update the Firebase configuration in `/src/firebase/firebaseConfig.js`

4. Configure API endpoints (optional):
   - Update the API endpoints in `/src/db/dbSync.js`

5. Start the development server:
   ```
   npm start
   ```

6. Build and deploy:
   ```
   npm run deploy
   ```

## Implementing in Your Own React App

Follow these steps to add PWA capabilities to your existing React application:

### 1. Add Required Dependencies

```bash
npm install --save workbox-core workbox-expiration workbox-precaching workbox-routing workbox-strategies workbox-background-sync firebase
npm install --save-dev workbox-cli tailwindcss firebase-tools
```

### 2. Configure Workbox

1. **Create a Workbox configuration file** (`workbox-config.js`) in your project root:

```javascript
module.exports = {
  globDirectory: "build/",
  globPatterns: ["**/*.{html,js,css,png,jpg,jpeg,gif,svg,ico,json}"],
  swDest: "build/service-worker.js",
  swSrc: "src/workbox/service-worker-template.js",
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
};
```

2. **Copy the Workbox folder** from this boilerplate to your project:
   - Copy the entire `/src/workbox` directory to your project's `/src` folder

3. **Update your package.json** to include the build script:

```json
"scripts": {
  "build": "react-scripts build && npm run build:sw",
  "build:sw": "workbox injectManifest workbox-config.js"
}
```

4. **Register the service worker** in your `index.js`:

```javascript
import { registerServiceWorker } from './workbox/serviceWorker';

// Register the service worker after the app has loaded
if (process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    registerServiceWorker();
  });
}
```

### 3. Implement IndexedDB for Offline Data

1. **Copy the database implementation** from this boilerplate:
   - Copy the entire `/src/db` directory to your project's `/src` folder

2. **Update API endpoints** in `src/db/dbSync.js` to match your backend:

```javascript
export const API_ENDPOINTS = {
  TODOS: 'https://your-api.com/todos',
  // Add more endpoints as needed
};
```

3. **Use the database in your components**:

```javascript
import { getAllItems } from '../db/indexedDB';
import { createItemWithSync, updateItemWithSync, deleteItemWithSync } from '../db/dbSync';
import { STORES } from '../db/indexedDB';

// Load data
const items = await getAllItems(STORES.TODOS);

// Create item with sync
const newItem = await createItemWithSync(STORES.TODOS, { text: 'New item', completed: false });

// Update item with sync
await updateItemWithSync(STORES.TODOS, { id: 1, text: 'Updated item', completed: true });

// Delete item with sync
await deleteItemWithSync(STORES.TODOS, 1);
```

### 4. Set Up Firebase Cloud Messaging

1. **Create a Firebase project** at [Firebase Console](https://console.firebase.google.com/)

2. **Copy the Firebase implementation** from this boilerplate:
   - Copy the entire `/src/firebase` directory to your project's `/src` folder

3. **Update Firebase configuration** in `src/firebase/firebaseConfig.js`:

```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const vapidKey = "YOUR_VAPID_KEY";
```

4. **Create a Firebase Messaging Service Worker** file at `public/firebase-messaging-sw.js`:

```javascript
// Firebase Messaging Service Worker
// This file handles background push notifications

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);

  const notificationTitle = payload.notification.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification.body || '',
    icon: '/logo192.png',
    badge: '/logo192.png',
    data: payload.data,
    // Add a click action to open the app when notification is clicked
    click_action: payload.notification.click_action || '/'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Get the notification data
  const clickAction = event.notification.data?.click_action || '/';
  
  // Check if a window is already open and focus it, or open a new window
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if a window is already open
        for (const client of clientList) {
          if (client.url.includes(clickAction) && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(clickAction);
        }
      })
  );
});
```

5. **Initialize Firebase Messaging** in your application:

```javascript
import { initializeMessaging } from './firebase/messaging';

// Initialize Firebase messaging
if ('Notification' in window) {
  initializeMessaging().catch(console.error);
}
```

### 5. Configure Firebase Hosting (Optional)

1. **Install Firebase CLI** if not already installed:
   ```
   npm install -g firebase-tools
   ```

2. **Initialize Firebase Hosting**:
   ```
   firebase login
   firebase init hosting
   ```

3. **Add deploy script** to your `package.json`:
   ```json
   "scripts": {
     "deploy": "npm run build && firebase deploy"
   }
   ```

4. **Deploy your application**:
   ```
   npm run deploy
   ```

## API Requirements

If you're implementing data synchronization, your backend API should support the following endpoints:

### Todo API Endpoints

- `POST /api/todos` - Create a new todo
  - Request body: `{ "text": "Todo text", "completed": false, ... }`
  - Expected response: `{ "id": "server-id", "text": "Todo text", "completed": false, ... }`

- `PUT /api/todos/:id` - Update an existing todo
  - Request body: `{ "id": "todo-id", "text": "Updated text", "completed": true, ... }`
  - Expected response: `{ "id": "todo-id", "text": "Updated text", "completed": true, ... }`

- `DELETE /api/todos/:id` - Delete a todo
  - No request body
  - Expected response: Any successful status code (200-299)

## Testing PWA Features

### Offline Functionality
1. Open the application in Chrome
2. Open Chrome DevTools (F12)
3. Go to the Network tab
4. Check "Offline"
5. Refresh the page
6. The application should still work with cached data

### Push Notifications
1. Click the "Enable Notifications" button
2. Allow notifications when prompted
3. Send a test notification from your backend or Firebase Console

### Installation
1. Look for the install icon in the address bar or use the "Install App" button in the PWA Status tab
2. The application should install as a standalone app

## Troubleshooting

### Service Worker Not Registering
- Make sure you're running in production mode (`npm run build`)
- Check the console for any errors
- Verify that the service worker file is being generated correctly

### IndexedDB Issues
- Use the "Clear Data" button to reset the database if you encounter issues
- Check browser compatibility (IndexedDB is supported in all modern browsers)

### Firebase Messaging Issues
- Ensure your Firebase configuration is correct
- Check that you've set up Firebase Cloud Messaging in your Firebase Console
- Verify that you've generated a VAPID key for web push notifications

## Learn More

- [Workbox Documentation](https://developer.chrome.com/docs/workbox)
- [Firebase Documentation](https://firebase.google.com/docs)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Web Push Notifications](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [PWA Installation](https://web.dev/customize-install/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

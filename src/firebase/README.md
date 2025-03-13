# Firebase Integration

This folder contains all Firebase-related configuration and implementation for the PWA.

## Files

- `firebaseConfig.js` - Firebase project configuration and credentials
- `firebase.js` - Firebase initialization and core functionality
- `messaging.js` - Firebase Cloud Messaging (FCM) for push notifications
- `hosting.js` - Firebase Hosting utilities and configuration

## Implementation Details

The Firebase integration provides:

- **Push notifications** via Firebase Cloud Messaging (FCM)
- **Token management** for FCM registration
- **Notification permission** handling
- **Background notifications** via service worker

## How to Use in Your Project

1. **Create a Firebase project** at [Firebase Console](https://console.firebase.google.com/)

2. **Enable Firebase Cloud Messaging** in your project

3. **Generate a VAPID key** for web push notifications:
   - Go to Project Settings > Cloud Messaging > Web Configuration > Web Push certificates
   - Click "Generate key pair"

4. **Copy this entire folder** to your project's `/src` directory

5. **Update the Firebase configuration** in `firebaseConfig.js`:

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

6. **Create a Firebase Messaging Service Worker** file at `public/firebase-messaging-sw.js`:

```javascript
// Firebase Messaging Service Worker
// This file handles background push notifications

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase configuration - MUST match your main app configuration
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
        for (const client of clientList) {
          if (client.url.includes(clickAction) && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(clickAction);
        }
      })
  );
});
```

7. **Initialize Firebase Messaging** in your application:

```javascript
import { initializeMessaging } from './firebase/messaging';

// Initialize Firebase messaging
if ('Notification' in window) {
  initializeMessaging().catch(console.error);
}
```

## Sending Test Notifications

You can send test notifications from:

1. **Firebase Console**:
   - Go to Engage > Messaging
   - Click "Create your first campaign"
   - Select "Web (Firebase JS SDK v9+)"
   - Configure your notification and send

2. **Using the Firebase Admin SDK** in your backend:

```javascript
const admin = require('firebase-admin');

// Send to a specific device
admin.messaging().send({
  token: 'DEVICE_FCM_TOKEN',
  notification: {
    title: 'Hello from Firebase!',
    body: 'This is a test notification'
  },
  webpush: {
    fcmOptions: {
      link: '/notifications'
    }
  }
});
```

## Firebase Hosting Setup

1. **Install Firebase CLI**:
   ```
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```
   firebase login
   ```

3. **Initialize Firebase Hosting**:
   ```
   firebase init hosting
   ```

4. **Deploy your application**:
   ```
   firebase deploy
   ```

## Troubleshooting

- **Notifications not working**: Check browser permissions and verify your VAPID key
- **Service worker not registering**: Ensure the firebase-messaging-sw.js file is in the public folder
- **Token not generated**: Check your Firebase configuration and browser console for errors

## References

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Web Push Notifications](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Firebase Hosting](https://firebase.google.com/docs/hosting) 
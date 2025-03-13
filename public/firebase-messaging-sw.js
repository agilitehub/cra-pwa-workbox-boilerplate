/**
 * Firebase Messaging Service Worker
 * This file handles background push notifications
 */

// Import Firebase scripts
importScripts('/__/firebase/9.2.0/firebase-app-compat.js')
importScripts('/__/firebase/9.2.0/firebase-messaging-compat.js')
importScripts('/__/firebase/init.js')

// // Firebase configuration
// // Replace with your Firebase configuration
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "your-app.firebaseapp.com",
//   projectId: "your-app",
//   storageBucket: "your-app.appspot.com",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };

// Initialize Firebase
// firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/logo192.png',
    badge: '/logo192.png',
    data: {
      url: payload.notification.click_action || '/',
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there is already a window/tab open with the target URL
      const hadWindowToFocus = clientList.some((client) => {
        // Check if the URL is the same
        if (client.url === event.notification.data.url && 'focus' in client) {
          // Focus the existing window/tab
          client.focus();
          return true;
        }
        return false;
      });
      
      // If no existing window/tab to focus, open a new one
      if (!hadWindowToFocus && clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
}); 
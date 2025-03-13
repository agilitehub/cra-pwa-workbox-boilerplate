/**
 * Firebase Configuration
 * Replace the values with your Firebase project configuration
 */

// Firebase configuration object
export const firebaseConfig = {
  apiKey: "AIzaSyC01DR-ZGKhwYgQ-1JQEphA7YXu833R1tY",
  authDomain: "cra-pwa-workbox-boilerplate.firebaseapp.com",
  projectId: "cra-pwa-workbox-boilerplate",
  storageBucket: "cra-pwa-workbox-boilerplate.firebasestorage.app",
  messagingSenderId: "749117899702",
  appId: "1:749117899702:web:8519428a278655d06f7717",
  measurementId: "G-JYM4QZ8T0F"
};

/**
 * Firebase Messaging Vapid Key
 * This is needed for web push notifications
 * Generate this key in the Firebase Console under Project Settings > Cloud Messaging
 */
export const vapidKey = "BLWv4sH1M7dsLXunAe-9g_7ARxwQ_xvkhCfb-xRgufTfG9Qwubrj8jEIvqqEsZQ1SRTpL7mioMWqP_EJyQ9cuYs";

/**
 * Firebase initialization options
 */
export const firebaseOptions = {
  // Enable persistence for Firestore (if used)
  enablePersistence: true,
  // Enable offline capabilities
  enableOffline: true,
  // Enable analytics (if used)
  enableAnalytics: false,
}; 
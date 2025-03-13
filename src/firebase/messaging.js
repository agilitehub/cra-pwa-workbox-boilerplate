/**
 * Firebase Cloud Messaging (FCM) Implementation
 * This file handles push notifications using Firebase Cloud Messaging
 */

import { getToken, onMessage } from 'firebase/messaging';
import { initializeFirebase, getFirebaseMessaging } from './firebase';
import { vapidKey } from './firebaseConfig';

/**
 * Request permission for notifications
 * @returns {Promise<string|null>} FCM token or null if permission denied
 */
export const requestNotificationPermission = async () => {
  try {
    // Initialize Firebase if not already initialized
    initializeFirebase();
    
    // Request permission
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      // Get messaging instance
      const messaging = getFirebaseMessaging();
      
      if (!messaging) {
        console.error('Firebase messaging is not available');
        return null;
      }
      
      // Get FCM token
      const token = await getToken(messaging, { vapidKey });
      console.log('FCM Token:', token);
      return token;
    } else {
      console.log('Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
};

/**
 * Save FCM token to backend
 * @param {string} token FCM token
 * @returns {Promise<boolean>} Success status
 */
export const saveFCMToken = async (token) => {
  try {
    // Save token to your backend
    // This is a placeholder - implement your API call here
    console.log('Saving FCM token to backend:', token);
    
    // Example API call:
    // const response = await fetch('/api/fcm-token', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ token }),
    // });
    // return response.ok;
    
    return true;
  } catch (error) {
    console.error('Error saving FCM token:', error);
    return false;
  }
};

/**
 * Handle foreground messages
 * @param {Function} callback Function to call when a message is received
 * @returns {Function|null} Unsubscribe function or null if messaging is not available
 */
export const onForegroundMessage = (callback) => {
  const messaging = getFirebaseMessaging();
  
  if (!messaging) {
    console.error('Firebase messaging is not available');
    return null;
  }
  
  return onMessage(messaging, (payload) => {
    console.log('Message received in foreground:', payload);
    callback(payload);
  });
};

/**
 * Display a notification
 * @param {Object} notification Notification data
 */
export const displayNotification = ({ title, body, icon, clickAction }) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const options = {
      body,
      icon: icon || '/logo192.png',
      badge: '/logo192.png',
      data: {
        url: clickAction || '/',
      },
    };
    
    const notification = new Notification(title, options);
    
    notification.onclick = () => {
      window.focus();
      window.location.href = options.data.url;
      notification.close();
    };
  }
};

/**
 * Initialize Firebase Cloud Messaging
 */
export const initializeMessaging = async () => {
  try {
    // Check if service workers are supported
    if ('serviceWorker' in navigator && 'Notification' in window) {
      // Initialize Firebase
      initializeFirebase();
      
      // Request permission and get token
      const token = await requestNotificationPermission();
      
      if (token) {
        // Save token to backend
        await saveFCMToken(token);
        
        // Set up foreground message handler
        onForegroundMessage((payload) => {
          // Display notification for foreground messages
          if (payload.notification) {
            displayNotification({
              title: payload.notification.title,
              body: payload.notification.body,
              icon: payload.notification.icon,
              clickAction: payload.notification.click_action,
            });
          }
        });
      }
    }
  } catch (error) {
    console.error('Error initializing Firebase messaging:', error);
  }
}; 
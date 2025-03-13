/**
 * Firebase Initialization
 * This file initializes Firebase services for the application
 */

import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import { firebaseConfig, firebaseOptions } from './firebaseConfig';

// Initialize Firebase
let app;
let messaging;

/**
 * Initialize Firebase
 * @returns {Object} Firebase app instance
 */
export const initializeFirebase = () => {
  if (!app) {
    try {
      app = initializeApp(firebaseConfig);
      console.log('Firebase initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase:', error);
    }
  }
  return app;
};

/**
 * Get Firebase Messaging instance
 * @returns {Object|null} Firebase messaging instance or null if not supported
 */
export const getFirebaseMessaging = () => {
  if (!messaging && app) {
    try {
      messaging = getMessaging(app);
    } catch (error) {
      console.error('Error getting Firebase messaging:', error);
      return null;
    }
  }
  return messaging;
};

// Initialize Firebase when this module is imported
initializeFirebase(); 
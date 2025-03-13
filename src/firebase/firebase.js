/**
 * Firebase Initialization
 * This file initializes Firebase services for the application
 */

import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import { firebaseConfig } from './firebaseConfig';

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
      // Check if Firebase configuration is valid
      if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
        console.warn(
          'Firebase configuration is incomplete. Make sure to set the required environment variables. ' +
          'See the .env.example file for required variables.'
        );
        return null;
      }
      
      app = initializeApp(firebaseConfig);
      console.log('Firebase initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      return null;
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
      // Check if messaging is supported in this browser
      if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return null;
      }
      
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
/**
 * Application Configuration
 * 
 * This file centralizes all configuration settings from environment variables.
 * It provides default values for local development and ensures type conversion.
 */

// Helper function to get environment variables with defaults
const getEnv = (key, defaultValue = '') => process.env[key] || defaultValue;
const getBoolEnv = (key, defaultValue = false) => {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
};
const getNumEnv = (key, defaultValue = 0) => {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};

// Firebase Configuration
export const firebaseConfig = {
  apiKey: getEnv('REACT_APP_FIREBASE_API_KEY'),
  authDomain: getEnv('REACT_APP_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('REACT_APP_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('REACT_APP_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('REACT_APP_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('REACT_APP_FIREBASE_APP_ID'),
  measurementId: getEnv('REACT_APP_FIREBASE_MEASUREMENT_ID')
};

// Firebase Messaging Vapid Key
export const vapidKey = getEnv('REACT_APP_FIREBASE_VAPID_KEY');

// Firebase Options
export const firebaseOptions = {
  enablePersistence: getBoolEnv('REACT_APP_FIREBASE_ENABLE_PERSISTENCE', true),
  enableOffline: getBoolEnv('REACT_APP_FIREBASE_ENABLE_OFFLINE', true),
  enableAnalytics: getBoolEnv('REACT_APP_FIREBASE_ENABLE_ANALYTICS', false)
};

// API Endpoints
export const API_ENDPOINTS = {
  TODOS: getEnv('REACT_APP_API_ENDPOINT_TODOS', 'https://nodered.agilite.io/api/pwa/todos'),
  // Add more endpoints as needed
};

// IndexedDB Configuration
export const DB_CONFIG = {
  name: getEnv('REACT_APP_INDEXEDDB_NAME', 'pwa-boilerplate'),
  version: getNumEnv('REACT_APP_INDEXEDDB_VERSION', 1)
};

// PWA Configuration
export const PWA_CONFIG = {
  name: getEnv('REACT_APP_PWA_NAME', 'CRA PWA Workbox Boilerplate'),
  shortName: getEnv('REACT_APP_PWA_SHORT_NAME', 'PWA Boilerplate'),
  themeColor: getEnv('REACT_APP_PWA_THEME_COLOR', '#3B82F6'),
  backgroundColor: getEnv('REACT_APP_PWA_BACKGROUND_COLOR', '#F3F4F6')
};

// Service Worker Configuration
export const SW_CONFIG = {
  updateCheckInterval: getNumEnv('REACT_APP_SW_UPDATE_CHECK_INTERVAL', 60000) // Default: 1 minute
};

// Validate critical configuration
export const validateConfig = () => {
  const missingVars = [];
  
  if (!firebaseConfig.apiKey) missingVars.push('REACT_APP_FIREBASE_API_KEY');
  if (!firebaseConfig.projectId) missingVars.push('REACT_APP_FIREBASE_PROJECT_ID');
  if (!firebaseConfig.appId) missingVars.push('REACT_APP_FIREBASE_APP_ID');
  
  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    return false;
  }
  
  return true;
};

// Create a configuration object
const appConfig = {
  firebase: firebaseConfig,
  vapidKey,
  firebaseOptions,
  api: API_ENDPOINTS,
  db: DB_CONFIG,
  pwa: PWA_CONFIG,
  sw: SW_CONFIG,
  isValid: validateConfig()
};

// Export the configuration object as default
export default appConfig; 
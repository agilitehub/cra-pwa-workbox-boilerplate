/**
 * Firebase Hosting Configuration
 * This file contains utilities for Firebase Hosting
 */

/**
 * Get the Firebase Hosting URL for the current project
 * @returns {string} The Firebase Hosting URL
 */
export const getFirebaseHostingUrl = () => {
  // Replace with your Firebase Hosting URL
  // This is typically your-project-id.web.app or your-project-id.firebaseapp.com
  return 'your-project-id.web.app';
};

/**
 * Check if the app is running on Firebase Hosting
 * @returns {boolean} True if running on Firebase Hosting
 */
export const isRunningOnFirebaseHosting = () => {
  const hostname = window.location.hostname;
  return hostname.includes('.web.app') || hostname.includes('.firebaseapp.com');
};

/**
 * Get deployment information
 * @returns {Object} Deployment information
 */
export const getDeploymentInfo = () => {
  // This information would typically be injected during the build process
  // For now, we'll return placeholder values
  return {
    version: process.env.REACT_APP_VERSION || '1.0.0',
    deployedAt: process.env.REACT_APP_DEPLOYED_AT || new Date().toISOString(),
    environment: process.env.NODE_ENV,
  };
}; 
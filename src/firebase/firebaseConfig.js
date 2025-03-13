/**
 * Firebase Configuration
 * 
 * This file imports configuration from the centralized config.js file,
 * which reads values from environment variables.
 */

import { firebaseConfig, vapidKey, firebaseOptions } from '../config';

// Add a warning if configuration is missing
if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
  console.warn(
    'Firebase configuration is incomplete. Make sure to set the required environment variables. ' +
    'See the .env.example file for required variables.'
  );
}

// Export the imported configuration
export { firebaseConfig, vapidKey, firebaseOptions };

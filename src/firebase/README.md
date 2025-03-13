# Firebase Integration

This folder contains all Firebase-related configuration and implementation for the PWA.

## Contents

- `firebaseConfig.js` - Firebase project configuration
- `messaging.js` - Firebase Cloud Messaging (FCM) implementation
- `hosting.js` - Firebase Hosting configuration and deployment utilities
- Additional utility files for Firebase services

## Implementation Details

The Firebase integration provides:
- Push notifications via Firebase Cloud Messaging (FCM)
- Deployment configuration for Firebase Hosting
- Authentication services (if needed)
- Realtime Database or Firestore integration (if needed)

## Setup Requirements

To use the Firebase integration:
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Generate a Firebase configuration object
3. Update the `firebaseConfig.js` file with your project details
4. Set up Firebase Cloud Messaging for push notifications
5. Configure Firebase Hosting for deployment

## References

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Firebase Hosting](https://firebase.google.com/docs/hosting) 
# Create React App PWA Workbox Boilerplate

This project provides a boilerplate for creating Progressive Web Applications (PWAs) using Create React App, Workbox, IndexedDB, and Firebase Cloud Messaging. It's designed to be a plug-and-play solution for developers who want to PWA-enable their React applications.

## Features

- **Progressive Web App (PWA)** capabilities using Workbox
- **Offline-first** architecture with service worker caching
- **Local data storage** with IndexedDB
- **Data synchronization** between local storage and MongoDB
- **Push notifications** via Firebase Cloud Messaging (FCM)
- **Deployment** to Firebase Hosting
- **Modern UI** with Ant Design, TailwindCSS, and FontAwesome

## Project Structure

- `/src/workbox` - Workbox configuration and service worker logic
- `/src/firebase` - Firebase configuration and implementation
- `/src/db` - IndexedDB implementation and MongoDB sync logic
- `/src/components` - React components

## Getting Started

### Prerequisites

- Node.js and npm
- Firebase account
- MongoDB instance (Atlas or self-hosted)

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/cra-pwa-workbox-boilerplate.git
   cd cra-pwa-workbox-boilerplate
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Update the Firebase configuration in `/src/firebase/firebaseConfig.js`

4. Configure MongoDB connection:
   - Set up your MongoDB instance
   - Update the connection details in your backend API
   - Configure the sync endpoints in `/src/db/dbSync.js`

5. Start the development server:
   ```
   npm start
   ```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run deploy`

Builds the app and deploys it to Firebase Hosting.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## PWA Features Implementation

### Service Worker with Workbox

The service worker implementation uses Workbox to provide:
- Precaching of static assets
- Runtime caching for dynamic content
- Offline fallback pages
- Background sync capabilities

See the `/src/workbox` directory for implementation details.

### IndexedDB and MongoDB Sync

The data layer provides:
- Local data storage using IndexedDB
- Data synchronization with MongoDB
- Offline-first data operations
- Background sync for failed operations

See the `/src/db` directory for implementation details.

### API Requirements

The application expects a backend API with the following endpoints:

#### Todo API Endpoints

- `POST /api/pwa/todos` - Create a new todo
  - Request body: `{ "text": "Todo text", "completed": false, ... }`
  - Expected response: `{ "id": "server-id", "text": "Todo text", "completed": false, ... }`

- `PUT /api/pwa/todos/:id` - Update an existing todo
  - Request body: `{ "id": "todo-id", "text": "Updated text", "completed": true, ... }`
  - Expected response: `{ "id": "todo-id", "text": "Updated text", "completed": true, ... }`

- `DELETE /api/pwa/todos/:id` - Delete a todo
  - No request body
  - Expected response: Any successful status code (200-299)

The API endpoints can be configured in `/src/db/dbSync.js` by updating the `API_ENDPOINTS` object.

### Firebase Cloud Messaging

Push notifications are implemented using Firebase Cloud Messaging:
- Notification permission handling
- Token management
- Notification display and handling

See the `/src/firebase` directory for implementation details.

## Deployment

This project is configured for deployment to Firebase Hosting. See the deployment section in the Firebase documentation for more details.

## Learn More

- [Workbox Documentation](https://developer.chrome.com/docs/workbox)
- [Firebase Documentation](https://firebase.google.com/docs)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './workbox/serviceWorker';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Register the service worker for PWA functionality
serviceWorker.register({
  onUpdate: registration => {
    // The PWAStatus component will handle the update notification
    // We don't need to show a confirmation dialog here anymore
    
    // Set up a listener for messages from the service worker
    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
        console.log('Update available notification received from service worker');
        // The PWAStatus component will handle showing the update notification
      }
    });
    
    // Set up a listener for when the waiting service worker becomes active
    const waitingServiceWorker = registration.waiting;
    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener('statechange', event => {
        if (event.target.state === 'activated') {
          // Reload once the new service worker is activated
          window.location.reload();
        }
      });
    }
  },
  onSuccess: registration => {
    console.log('Service Worker registered successfully');
  }
});

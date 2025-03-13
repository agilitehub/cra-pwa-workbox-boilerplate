import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faCheck, faInfoCircle, faExclamationTriangle, faRedo } from '@fortawesome/free-solid-svg-icons';
import { SW_CONFIG } from '../config';

const PWAStatus = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState('checking');
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState(null);

  // Set up service worker message listener and periodic update checks
  useEffect(() => {
    // Function to check for updates
    const checkForUpdates = (reg) => {
      if (!reg) return;
      
      // Check if there's a waiting service worker
      if (reg.waiting) {
        setUpdateAvailable(true);
        return;
      }
      
      // Send a message to the service worker to check for updates
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CHECK_FOR_UPDATES'
        });
      }
    };

    // Listen for messages from the service worker
    const handleServiceWorkerMessage = (event) => {
      if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
        setUpdateAvailable(true);
      }
      
      if (event.data && event.data.type === 'UPDATE_CHECK_RESULT') {
        setUpdateAvailable(event.data.updateAvailable);
      }
    };

    // Add message listener
    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    
    // Set up periodic update checks using interval from config
    const updateCheckInterval = setInterval(() => {
      if (registration) {
        // Force a check for updates
        registration.update().then(() => {
          checkForUpdates(registration);
        });
      }
    }, SW_CONFIG.updateCheckInterval); // Use interval from config
    
    return () => {
      // Clean up
      navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      clearInterval(updateCheckInterval);
    };
  }, [registration]);

  useEffect(() => {
    // Check if the app is installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check service worker status
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) {
          setRegistration(reg);
          setServiceWorkerStatus('registered');
          
          // Check for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            });
          });
          
          // Check if there's already a waiting service worker
          if (reg.waiting) {
            setUpdateAvailable(true);
          }
        } else {
          setServiceWorkerStatus('not-registered');
        }
      }).catch((error) => {
        console.error('Service worker registration failed:', error);
        setServiceWorkerStatus('error');
      });
    } else {
      setServiceWorkerStatus('not-supported');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Install the PWA
  const installApp = async () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice;
    
    // We've used the prompt, and can't use it again, so clear it
    setInstallPrompt(null);
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
  };

  // Update the service worker
  const updateServiceWorker = () => {
    if (!registration || !registration.waiting) return;
    
    // Send a message to the waiting service worker to skip waiting
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    
    // Reload the page to activate the new service worker
    window.location.reload();
  };

  // Force check for updates
  const checkForUpdates = () => {
    if (!registration) return;
    
    // Update the registration
    registration.update().catch(err => {
      console.error('Error checking for updates:', err);
    });
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">PWA Status</h2>
      
      <div className="space-y-4">
        {/* Installation Status */}
        <div>
          <h3 className="font-semibold mb-2">Installation</h3>
          <div className="flex items-center">
            {isInstalled ? (
              <div className="flex items-center text-green-500">
                <FontAwesomeIcon icon={faCheck} className="mr-2" />
                <span>Installed as PWA</span>
              </div>
            ) : installPrompt ? (
              <div>
                <button 
                  onClick={installApp}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Install as App
                </button>
                <p className="text-sm text-gray-500 mt-1">
                  Install this app on your device for offline access and a better experience.
                </p>
              </div>
            ) : (
              <div className="text-gray-500">
                <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                <span>Installation not available</span>
                <p className="text-sm mt-1">
                  You may have already installed the app or your browser doesn't support PWA installation.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Service Worker Status */}
        <div>
          <h3 className="font-semibold mb-2">Service Worker</h3>
          <div>
            {serviceWorkerStatus === 'registered' && (
              <div className="flex items-center text-green-500">
                <FontAwesomeIcon icon={faCheck} className="mr-2" />
                <span>Service worker registered</span>
                <button 
                  onClick={checkForUpdates}
                  className="ml-4 text-blue-500 text-sm underline hover:text-blue-700"
                >
                  Check for updates
                </button>
              </div>
            )}
            
            {serviceWorkerStatus === 'not-registered' && (
              <div className="flex items-center text-yellow-500">
                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                <span>Service worker not registered</span>
              </div>
            )}
            
            {serviceWorkerStatus === 'error' && (
              <div className="flex items-center text-red-500">
                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                <span>Service worker registration failed</span>
              </div>
            )}
            
            {serviceWorkerStatus === 'not-supported' && (
              <div className="flex items-center text-red-500">
                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                <span>Service workers not supported</span>
              </div>
            )}
            
            {serviceWorkerStatus === 'checking' && (
              <div className="flex items-center text-gray-500">
                <span>Checking service worker status...</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Update Available */}
        {updateAvailable && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="flex items-center text-blue-700 mb-2">
              <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
              <span className="font-semibold">Update Available</span>
            </div>
            <p className="text-sm text-blue-600 mb-2">
              A new version of this app is available. Update now to get the latest features and improvements.
            </p>
            <button 
              onClick={updateServiceWorker}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FontAwesomeIcon icon={faRedo} className="mr-2" />
              Update Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PWAStatus; 
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faBell, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Todo from './components/Todo';
import Notifications from './components/Notifications';
import PWAStatus from './components/PWAStatus';
import { initializeMessaging } from './firebase/messaging';
import { initSyncListeners } from './db/dbSync';
import { checkAndFixDatabase } from './db/indexedDB';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('todo');
  const [dbInitialized, setDbInitialized] = useState(false);
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    // Initialize database
    const initDatabase = async () => {
      try {
        await checkAndFixDatabase();
        setDbInitialized(true);
      } catch (error) {
        console.error('Error initializing database:', error);
        setDbError('Failed to initialize database. Please refresh the page.');
      }
    };

    initDatabase();

    // Initialize Firebase messaging
    if ('Notification' in window) {
      initializeMessaging().catch(console.error);
    }

    // Initialize sync listeners
    initSyncListeners();
  }, []);

  if (dbError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
          <h1 className="text-xl font-bold text-red-600 mb-4">Database Error</h1>
          <p className="mb-4">{dbError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">PWA Boilerplate</h1>
          <p className="text-sm opacity-80">A Progressive Web App with Workbox, IndexedDB, and Firebase</p>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'todo' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('todo')}
            >
              <FontAwesomeIcon icon={faTasks} className="mr-2" />
              Todo List
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'notifications' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('notifications')}
            >
              <FontAwesomeIcon icon={faBell} className="mr-2" />
              Notifications
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'pwa' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('pwa')}
            >
              <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
              PWA Status
            </button>
          </div>
        </div>

        <div className="mb-8">
          {activeTab === 'todo' && <Todo />}
          {activeTab === 'notifications' && <Notifications />}
          {activeTab === 'pwa' && <PWAStatus />}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">About This Boilerplate</h2>
          <p className="mb-4">
            This is a Progressive Web App (PWA) boilerplate built with Create React App, Workbox, IndexedDB, and Firebase Cloud Messaging.
            It demonstrates key PWA features like offline functionality, push notifications, and background sync.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border p-3 rounded">
              <h3 className="font-semibold mb-1">Offline Support</h3>
              <p className="text-sm text-gray-600">
                Works offline with cached assets and local data storage using IndexedDB.
              </p>
            </div>
            <div className="border p-3 rounded">
              <h3 className="font-semibold mb-1">Data Synchronization</h3>
              <p className="text-sm text-gray-600">
                Syncs data with MongoDB when online, with background sync for offline changes.
              </p>
            </div>
            <div className="border p-3 rounded">
              <h3 className="font-semibold mb-1">Push Notifications</h3>
              <p className="text-sm text-gray-600">
                Receives push notifications via Firebase Cloud Messaging (FCM).
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center text-sm">
          <p>CRA PWA Workbox Boilerplate &copy; {new Date().getFullYear()}</p>
          <p className="mt-1 text-gray-400">
            Built with React, Workbox, IndexedDB, and Firebase
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

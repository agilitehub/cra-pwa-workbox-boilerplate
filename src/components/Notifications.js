import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faBellSlash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { requestNotificationPermission, displayNotification } from '../firebase/messaging';

const Notifications = () => {
  const [permission, setPermission] = useState(Notification.permission);
  const [fcmToken, setFcmToken] = useState(null);
  const [testTitle, setTestTitle] = useState('Test Notification');
  const [testBody, setTestBody] = useState('This is a test notification from the PWA boilerplate.');

  useEffect(() => {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    // Update permission state when it changes
    const handlePermissionChange = () => {
      setPermission(Notification.permission);
    };

    // Try to observe permission changes (not supported in all browsers)
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'notifications' }).then((status) => {
        status.onchange = handlePermissionChange;
      });
    }
  }, []);

  // Request notification permission
  const requestPermission = async () => {
    try {
      const token = await requestNotificationPermission();
      if (token) {
        setFcmToken(token);
        setPermission(Notification.permission);
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  // Send a test notification
  const sendTestNotification = () => {
    if (Notification.permission !== 'granted') {
      alert('You need to grant notification permission first.');
      return;
    }

    displayNotification({
      title: testTitle,
      body: testBody,
      icon: '/logo192.png',
      clickAction: '/',
    });
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Push Notifications</h2>
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="font-semibold mr-2">Status:</span>
          {permission === 'granted' ? (
            <span className="text-green-500 flex items-center">
              <FontAwesomeIcon icon={faCheck} className="mr-1" />
              Enabled
            </span>
          ) : permission === 'denied' ? (
            <span className="text-red-500 flex items-center">
              <FontAwesomeIcon icon={faTimes} className="mr-1" />
              Blocked
            </span>
          ) : (
            <span className="text-yellow-500">Not requested</span>
          )}
        </div>
        
        {permission !== 'granted' && permission !== 'denied' && (
          <button
            onClick={requestPermission}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          >
            <FontAwesomeIcon icon={faBell} className="mr-2" />
            Enable Notifications
          </button>
        )}
        
        {permission === 'denied' && (
          <div className="text-sm text-red-500 mb-4">
            You have blocked notifications. Please update your browser settings to enable notifications.
          </div>
        )}
        
        {fcmToken && (
          <div className="mb-4">
            <div className="font-semibold mb-1">FCM Token:</div>
            <div className="text-xs bg-gray-100 p-2 rounded break-all">
              {fcmToken}
            </div>
          </div>
        )}
      </div>
      
      {permission === 'granted' && (
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Test Notification</h3>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              value={testBody}
              onChange={(e) => setTestBody(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>
          <button
            onClick={sendTestNotification}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send Test Notification
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications; 
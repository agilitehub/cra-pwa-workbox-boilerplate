/**
 * IndexedDB Implementation
 * This file provides a wrapper around IndexedDB for local data storage
 */

// Database name and version
const DB_NAME = 'pwaBoilerplateDB';
const DB_VERSION = 2; // Incrementing the version to trigger an upgrade

// Store names
export const STORES = {
  TODOS: 'todos',
  SETTINGS: 'settings',
  SYNC_QUEUE: 'syncQueue',
};

/**
 * Open the database
 * @returns {Promise<IDBDatabase>} The database instance
 */
export const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Error opening IndexedDB:', event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const oldVersion = event.oldVersion;

      // Create object stores
      if (!db.objectStoreNames.contains(STORES.TODOS)) {
        const todoStore = db.createObjectStore(STORES.TODOS, { keyPath: 'id', autoIncrement: true });
        todoStore.createIndex('syncStatus', 'syncStatus', { unique: false });
        todoStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
      }

      if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
        const syncQueueStore = db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id', autoIncrement: true });
        syncQueueStore.createIndex('createdAt', 'createdAt', { unique: false });
        syncQueueStore.createIndex('retryCount', 'retryCount', { unique: false });
        syncQueueStore.createIndex('status', 'status', { unique: false });
      } else if (oldVersion < 2) {
        // If upgrading from version 1 to 2, add the missing index to existing store
        const transaction = event.target.transaction;
        const syncQueueStore = transaction.objectStore(STORES.SYNC_QUEUE);
        
        // Check if the index already exists before trying to create it
        if (!syncQueueStore.indexNames.contains('status')) {
          syncQueueStore.createIndex('status', 'status', { unique: false });
        }
      }
    };
  });
};

/**
 * Add an item to a store
 * @param {string} storeName The name of the store
 * @param {Object} item The item to add
 * @returns {Promise<number>} The ID of the added item
 */
export const addItem = async (storeName, item) => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    
    // Add timestamp for new items
    const itemWithTimestamp = {
      ...item,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const request = store.add(itemWithTimestamp);
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onerror = (event) => {
      console.error(`Error adding item to ${storeName}:`, event.target.error);
      reject(event.target.error);
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Get all items from a store
 * @param {string} storeName The name of the store
 * @returns {Promise<Array>} Array of items
 */
export const getAllItems = async (storeName) => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onerror = (event) => {
      console.error(`Error getting items from ${storeName}:`, event.target.error);
      reject(event.target.error);
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Get an item by ID
 * @param {string} storeName The name of the store
 * @param {number|string} id The ID of the item
 * @returns {Promise<Object>} The item
 */
export const getItemById = async (storeName, id) => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onerror = (event) => {
      console.error(`Error getting item from ${storeName}:`, event.target.error);
      reject(event.target.error);
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Update an item
 * @param {string} storeName The name of the store
 * @param {Object} item The item to update
 * @returns {Promise<Object>} The updated item
 */
export const updateItem = async (storeName, item) => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    
    // Add updated timestamp
    const updatedItem = {
      ...item,
      updatedAt: new Date().toISOString(),
    };
    
    const request = store.put(updatedItem);
    
    request.onsuccess = () => {
      resolve(updatedItem);
    };
    
    request.onerror = (event) => {
      console.error(`Error updating item in ${storeName}:`, event.target.error);
      reject(event.target.error);
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Delete an item
 * @param {string} storeName The name of the store
 * @param {number|string} id The ID of the item
 * @returns {Promise<void>}
 */
export const deleteItem = async (storeName, id) => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = (event) => {
      console.error(`Error deleting item from ${storeName}:`, event.target.error);
      reject(event.target.error);
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Clear all items from a store
 * @param {string} storeName The name of the store
 * @returns {Promise<void>}
 */
export const clearStore = async (storeName) => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = (event) => {
      console.error(`Error clearing store ${storeName}:`, event.target.error);
      reject(event.target.error);
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Get items by index
 * @param {string} storeName The name of the store
 * @param {string} indexName The name of the index
 * @param {any} value The value to search for
 * @returns {Promise<Array>} Array of matching items
 */
export const getItemsByIndex = async (storeName, indexName, value) => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(value);
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onerror = (event) => {
      console.error(`Error getting items by index from ${storeName}:`, event.target.error);
      reject(event.target.error);
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Check and fix database structure
 * This function checks if the database structure is correct and fixes it if needed
 * @returns {Promise<boolean>} Success status
 */
export const checkAndFixDatabase = async () => {
  try {
    console.log('Checking database structure...');
    
    // Close any open connections
    const databases = await window.indexedDB.databases();
    const ourDb = databases.find(db => db.name === DB_NAME);
    
    if (ourDb && ourDb.version < DB_VERSION) {
      console.log(`Database version mismatch: current ${ourDb.version}, expected ${DB_VERSION}`);
      
      // Delete the database and recreate it
      await new Promise((resolve, reject) => {
        const deleteRequest = window.indexedDB.deleteDatabase(DB_NAME);
        deleteRequest.onsuccess = () => {
          console.log('Database deleted successfully, will be recreated with correct structure');
          resolve();
        };
        deleteRequest.onerror = (event) => {
          console.error('Error deleting database:', event.target.error);
          reject(event.target.error);
        };
      });
      
      // Open the database to recreate it
      await openDatabase();
      console.log('Database recreated with correct structure');
    } else {
      console.log('Database structure is correct');
    }
    
    return true;
  } catch (error) {
    console.error('Error checking database structure:', error);
    return false;
  }
};

/**
 * Clear all data from all stores
 * This is useful for resetting the application to a clean state
 * @returns {Promise<boolean>} Success status
 */
export const clearAllData = async () => {
  try {
    console.log('Clearing all data from IndexedDB...');
    
    // Clear each store
    await clearStore(STORES.TODOS);
    await clearStore(STORES.SYNC_QUEUE);
    await clearStore(STORES.SETTINGS);
    
    console.log('All data cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
}; 
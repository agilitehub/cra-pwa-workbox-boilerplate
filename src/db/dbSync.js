/**
 * Database Synchronization
 * This file handles synchronization between IndexedDB and MongoDB
 */

import { STORES, addItem, getItemsByIndex, updateItem, deleteItem, getItemById, getAllItems } from './indexedDB';
import { API_ENDPOINTS } from '../config';

// Sync status constants
export const SYNC_STATUS = {
  SYNCED: 'synced',
  PENDING: 'pending',
  FAILED: 'failed',
};

/**
 * API Configuration
 * 
 * These endpoints are imported from the centralized config.js file,
 * which reads values from environment variables.
 * 
 * Each endpoint should support the following operations:
 * - POST /endpoint - Create a new item
 * - PUT /endpoint/:id - Update an existing item
 * - DELETE /endpoint/:id - Delete an item
 * 
 * The API should return the following responses:
 * - For POST: The created item with an ID
 * - For PUT: The updated item
 * - For DELETE: Any successful response (200-299)
 */
export { API_ENDPOINTS };

/**
 * Add an item to the sync queue
 * @param {Object} operation The operation to sync
 * @returns {Promise<number>} The ID of the added operation
 */
export const addToSyncQueue = async (operation) => {
  const syncOperation = {
    ...operation,
    createdAt: new Date().toISOString(),
    retryCount: 0,
    status: SYNC_STATUS.PENDING,
  };
  
  return await addItem(STORES.SYNC_QUEUE, syncOperation);
};

/**
 * Process the sync queue
 * @returns {Promise<boolean>} Success status
 */
export const processSyncQueue = async () => {
  try {
    // Get all pending operations
    let pendingOperations = [];
    try {
      pendingOperations = await getItemsByIndex(STORES.SYNC_QUEUE, 'status', SYNC_STATUS.PENDING);
    } catch (indexError) {
      console.error('Error accessing sync queue index:', indexError);
      
      // Fallback: get all items and filter manually if index access fails
      const allOperations = await getAllItems(STORES.SYNC_QUEUE);
      pendingOperations = allOperations.filter(op => op.status === SYNC_STATUS.PENDING);
    }
    
    if (pendingOperations.length === 0) {
      console.log('No pending operations to sync');
      return true;
    }
    
    console.log(`Processing ${pendingOperations.length} pending operations`);
    
    // Process each operation
    for (const operation of pendingOperations) {
      try {
        await syncOperation(operation);
        
        // Update operation status to synced
        await updateItem(STORES.SYNC_QUEUE, {
          ...operation,
          status: SYNC_STATUS.SYNCED,
        });
      } catch (error) {
        console.error('Error syncing operation:', error);
        
        // Update retry count and status
        const retryCount = operation.retryCount + 1;
        const maxRetries = 5;
        
        await updateItem(STORES.SYNC_QUEUE, {
          ...operation,
          retryCount,
          status: retryCount >= maxRetries ? SYNC_STATUS.FAILED : SYNC_STATUS.PENDING,
          lastError: error.message,
        });
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error processing sync queue:', error);
    return false;
  }
};

/**
 * Validate API response
 * @param {Object} response The response from the API
 * @param {string} operationType The type of operation (create, update, delete)
 * @returns {boolean} Whether the response is valid
 */
const validateApiResponse = (response, operationType) => {
  if (!response) {
    console.error(`Invalid API response for ${operationType} operation: Response is empty`);
    return false;
  }

  // For create and update operations, we expect an object with an ID
  if (operationType === 'create' || operationType === 'update') {
    if (!response.id) {
      console.error(`Invalid API response for ${operationType} operation: Missing ID`, response);
      return false;
    }
    
    // For todos, we expect text and completed fields
    if (response.text === undefined || response.completed === undefined) {
      console.warn(`API response for ${operationType} operation may be missing required fields`, response);
      // Still return true as we can work with just the ID if needed
    }
  }
  
  return true;
};

/**
 * Sync a single operation
 * @param {Object} operation The operation to sync
 * @returns {Promise<Object>} The response from the server
 */
const syncOperation = async (operation) => {
  const { type, storeName, data } = operation;
  
  // Get the API endpoint for the store
  const endpoint = API_ENDPOINTS[storeName.toUpperCase()];
  
  if (!endpoint) {
    throw new Error(`No API endpoint defined for store: ${storeName}`);
  }
  
  let url = endpoint;
  let method = 'POST';
  
  // Determine the HTTP method based on the operation type
  switch (type) {
    case 'create':
      method = 'POST';
      break;
    case 'update':
      method = 'PUT';
      url = `${endpoint}/${data.id}`;
      break;
    case 'delete':
      method = 'DELETE';
      url = `${endpoint}/${data.id}`;
      break;
    default:
      throw new Error(`Unknown operation type: ${type}`);
  }
  
  console.log(`Syncing ${type} operation to ${url}`);
  console.log('Data being sent:', method !== 'DELETE' ? data : { id: data.id });
  
  // Make the API request
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: method !== 'DELETE' ? JSON.stringify(data) : undefined,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error (${response.status}): ${errorText}`);
  }
  
  // For DELETE operations, we just need confirmation that the delete was successful
  // For CREATE and UPDATE operations, we expect the server to return the created/updated item
  
  /*
   * Expected API Response Format:
   * 
   * For POST (create) operations:
   * {
   *   "id": "server-generated-id", // The server-side ID (if different from client ID)
   *   ...other todo fields sent in the request
   * }
   * 
   * For PUT (update) operations:
   * {
   *   "id": "existing-id",
   *   ...updated todo fields
   * }
   * 
   * For DELETE operations:
   * Any successful response (200-299) is sufficient
   * Optionally can return: { "id": "deleted-id" }
   */
  
  if (method === 'DELETE') {
    // For DELETE, we just need to know it was successful, return the ID that was deleted
    return { id: data.id };
  } else {
    // For CREATE/UPDATE, parse the response JSON
    const responseData = await response.json();
    console.log(`Received response for ${type} operation:`, responseData);
    
    // Validate the response
    validateApiResponse(responseData, type);
    
    return responseData;
  }
};

/**
 * Create an item with sync
 * @param {string} storeName The name of the store
 * @param {Object} item The item to create
 * @returns {Promise<Object>} The created item
 */
export const createItemWithSync = async (storeName, item) => {
  try {
    // Add sync status to the item
    const itemWithSync = {
      ...item,
      syncStatus: SYNC_STATUS.PENDING,
    };
    
    // Add to local database
    const id = await addItem(storeName, itemWithSync);
    const createdItem = { ...itemWithSync, id };
    
    // Add to sync queue
    await addToSyncQueue({
      type: 'create',
      storeName,
      data: createdItem,
    });
    
    // Try to sync immediately if online
    if (navigator.onLine) {
      processSyncQueue().catch(console.error);
    }
    
    return createdItem;
  } catch (error) {
    console.error(`Error creating item in ${storeName} with sync:`, error);
    throw error;
  }
};

/**
 * Update an item with sync
 * @param {string} storeName The name of the store
 * @param {Object} item The item to update
 * @returns {Promise<Object>} The updated item
 */
export const updateItemWithSync = async (storeName, item) => {
  try {
    // Add sync status to the item
    const itemWithSync = {
      ...item,
      syncStatus: SYNC_STATUS.PENDING,
    };
    
    // Update in local database
    const updatedItem = await updateItem(storeName, itemWithSync);
    
    // Add to sync queue
    await addToSyncQueue({
      type: 'update',
      storeName,
      data: updatedItem,
    });
    
    // Try to sync immediately if online
    if (navigator.onLine) {
      processSyncQueue().catch(console.error);
    }
    
    return updatedItem;
  } catch (error) {
    console.error(`Error updating item in ${storeName} with sync:`, error);
    throw error;
  }
};

/**
 * Delete an item with sync
 * @param {string} storeName The name of the store
 * @param {number|string} id The ID of the item
 * @returns {Promise<void>}
 */
export const deleteItemWithSync = async (storeName, id) => {
  try {
    // Get the item first
    const item = await getItemById(storeName, id);
    
    if (!item) {
      throw new Error(`Item with ID ${id} not found in ${storeName}`);
    }
    
    // Delete from local database
    await deleteItem(storeName, id);
    
    // Add to sync queue
    await addToSyncQueue({
      type: 'delete',
      storeName,
      data: { id },
    });
    
    // Try to sync immediately if online
    if (navigator.onLine) {
      processSyncQueue().catch(console.error);
    }
  } catch (error) {
    console.error(`Error deleting item from ${storeName} with sync:`, error);
    throw error;
  }
};

/**
 * Initialize sync listeners
 */
export const initSyncListeners = () => {
  // Sync when coming back online
  window.addEventListener('online', () => {
    console.log('Back online, syncing data...');
    processSyncQueue().catch(console.error);
  });
  
  // Register for periodic sync if available
  if ('serviceWorker' in navigator && 'periodicSync' in navigator.serviceWorker) {
    navigator.serviceWorker.ready.then(async (registration) => {
      try {
        // Check if periodic sync is available
        const status = await navigator.permissions.query({
          name: 'periodic-background-sync',
        });
        
        if (status.state === 'granted') {
          // Register for periodic sync
          await registration.periodicSync.register('sync-data', {
            minInterval: 60 * 60 * 1000, // 1 hour
          });
          
          console.log('Registered for periodic background sync');
        }
      } catch (error) {
        console.error('Error registering for periodic background sync:', error);
      }
    });
  }
}; 
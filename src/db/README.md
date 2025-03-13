# IndexedDB Implementation

This folder contains all database-related code for local storage with IndexedDB and synchronization with backend APIs.

## Files

- `indexedDB.js` - Core IndexedDB wrapper with CRUD operations
- `dbSync.js` - Synchronization logic between IndexedDB and backend API
- `models/` - Data models and schemas for structured data

## Implementation Details

The IndexedDB implementation provides:

- **Local data storage** using IndexedDB for offline-first functionality
- **Data synchronization** with backend API when online
- **Background sync** for operations performed while offline
- **Conflict resolution** for handling sync conflicts
- **Data validation** and schema enforcement

## How to Use in Your Project

1. **Copy this entire folder** to your project's `/src` directory

2. **Update API endpoints** in `dbSync.js` to match your backend:

```javascript
export const API_ENDPOINTS = {
  TODOS: 'https://your-api.com/todos',
  // Add more endpoints as needed
};
```

3. **Use the database in your components**:

```javascript
import { getAllItems, getItemById, clearAllData } from '../db/indexedDB';
import { createItemWithSync, updateItemWithSync, deleteItemWithSync } from '../db/dbSync';
import { STORES } from '../db/indexedDB';

// Load all items
const items = await getAllItems(STORES.TODOS);

// Get a specific item
const item = await getItemById(STORES.TODOS, 1);

// Create an item with sync
const newItem = await createItemWithSync(STORES.TODOS, {
  text: 'New todo item',
  completed: false
});

// Update an item with sync
await updateItemWithSync(STORES.TODOS, {
  id: 1,
  text: 'Updated todo item',
  completed: true
});

// Delete an item with sync
await deleteItemWithSync(STORES.TODOS, 1);

// Clear all data (useful for troubleshooting)
await clearAllData();
```

## Database Structure

The IndexedDB database includes the following object stores:

- **todos**: Stores todo items with properties like text, completed, etc.
- **syncQueue**: Stores operations that need to be synchronized with the backend
- **settings**: Stores application settings and preferences

Each store has appropriate indexes for efficient querying.

## Sync Process

The synchronization process works as follows:

1. **Create/Update/Delete** operations are performed locally first
2. Operations are added to the sync queue with status "pending"
3. If online, sync is attempted immediately
4. If offline, sync is attempted when the device comes back online
5. Background sync is also registered for periodic synchronization
6. Failed operations are retried with exponential backoff

## API Requirements

Your backend API should support the following endpoints:

### Todo API Endpoints

- `POST /api/todos` - Create a new todo
  - Request body: `{ "text": "Todo text", "completed": false, ... }`
  - Expected response: `{ "id": "server-id", "text": "Todo text", "completed": false, ... }`

- `PUT /api/todos/:id` - Update an existing todo
  - Request body: `{ "id": "todo-id", "text": "Updated text", "completed": true, ... }`
  - Expected response: `{ "id": "todo-id", "text": "Updated text", "completed": true, ... }`

- `DELETE /api/todos/:id` - Delete a todo
  - No request body
  - Expected response: Any successful status code (200-299)

## Troubleshooting

- **Database version mismatch**: The application includes automatic database version checking and upgrading
- **Sync failures**: Failed operations are retried automatically with exponential backoff
- **Data corruption**: Use the "Clear Data" button in the UI to reset the database

## References

- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Using IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)
- [Workbox Background Sync](https://developer.chrome.com/docs/workbox/modules/workbox-background-sync/)
- [Offline Web Applications](https://web.dev/offline-cookbook/) 
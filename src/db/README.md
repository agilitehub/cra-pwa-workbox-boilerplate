# Database Integration

This folder contains all database-related code for local storage with IndexedDB and synchronization with MongoDB.

## Contents

- `indexedDB.js` - IndexedDB setup and configuration
- `dbSync.js` - Synchronization logic between IndexedDB and MongoDB
- `models/` - Data models and schemas
- Additional utility files for database operations

## Implementation Details

The database integration provides:
- Local data storage using IndexedDB
- Data synchronization with MongoDB
- Offline-first data operations
- Background sync capabilities using Workbox

## Usage

The database layer is designed to be used as follows:
1. All data operations should go through the provided API
2. Data is stored locally first in IndexedDB
3. When online, data is synchronized with MongoDB
4. Background sync handles failed synchronization attempts

## MongoDB Integration

To connect with MongoDB:
1. Set up a MongoDB instance (Atlas or self-hosted)
2. Configure the connection in your backend API
3. Implement the necessary API endpoints for data synchronization
4. Update the `dbSync.js` file with your API endpoints

## References

- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Workbox Background Sync](https://developer.chrome.com/docs/workbox/modules/workbox-background-sync/)
- [MongoDB Documentation](https://docs.mongodb.com/) 
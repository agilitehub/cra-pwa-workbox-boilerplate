import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faSync, faSave, faCheck, faTimes, faEraser } from '@fortawesome/free-solid-svg-icons';
import { getAllItems, checkAndFixDatabase, clearAllData } from '../db/indexedDB';
import { createItemWithSync, updateItemWithSync, deleteItemWithSync, SYNC_STATUS, processSyncQueue } from '../db/dbSync';
import { STORES } from '../db/indexedDB';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState(null);

  // Load todos from IndexedDB on component mount
  useEffect(() => {
    const loadTodos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Check and fix database structure if needed
        await checkAndFixDatabase();
        
        const items = await getAllItems(STORES.TODOS);
        setTodos(items);
      } catch (error) {
        console.error('Error loading todos:', error);
        setError('Failed to load todos. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();

    // Set up online/offline event listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Add a new todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const todo = {
        text: newTodo,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      const createdTodo = await createItemWithSync(STORES.TODOS, todo);
      setTodos([...todos, createdTodo]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  // Toggle todo completion status
  const toggleTodo = async (id) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const updatedTodo = {
        ...todo,
        completed: !todo.completed,
      };

      await updateItemWithSync(STORES.TODOS, updatedTodo);
      setTodos(todos.map(t => t.id === id ? updatedTodo : t));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await deleteItemWithSync(STORES.TODOS, id);
      setTodos(todos.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Manually trigger sync
  const syncData = async () => {
    if (!navigator.onLine) {
      alert('You are offline. Please connect to the internet to sync data.');
      return;
    }

    setIsSyncing(true);
    try {
      await processSyncQueue();
      // Refresh todos after sync
      const items = await getAllItems(STORES.TODOS);
      setTodos(items);
    } catch (error) {
      console.error('Error syncing data:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Clear all data
  const clearData = async () => {
    // Confirm before clearing
    if (!window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      return;
    }
    
    setIsClearing(true);
    try {
      await clearAllData();
      setTodos([]);
      alert('All data has been cleared successfully.');
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('Failed to clear data. Please try again.');
    } finally {
      setIsClearing(false);
    }
  };

  // Get sync status badge color
  const getSyncStatusColor = (status) => {
    switch (status) {
      case SYNC_STATUS.SYNCED:
        return 'bg-green-500';
      case SYNC_STATUS.PENDING:
        return 'bg-yellow-500';
      case SYNC_STATUS.FAILED:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Todo List</h1>
        <div className="flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-sm">{isOnline ? 'Online' : 'Offline'}</span>
          <button 
            onClick={syncData} 
            disabled={isSyncing || !isOnline || isLoading || isClearing}
            className={`ml-4 p-2 rounded ${isOnline && !isLoading && !isClearing ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400'} text-white`}
            title="Sync data with server"
          >
            <FontAwesomeIcon icon={faSync} spin={isSyncing} />
            <span className="ml-2">Sync</span>
          </button>
          <button 
            onClick={clearData} 
            disabled={isClearing || isLoading || isSyncing}
            className={`ml-2 p-2 rounded ${!isClearing && !isLoading && !isSyncing ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-400'} text-white`}
            title="Clear all local data"
          >
            <FontAwesomeIcon icon={faEraser} spin={isClearing} />
            <span className="ml-2">Clear Data</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Refresh Page
          </button>
        </div>
      )}

      {isLoading || isClearing ? (
        <div className="flex justify-center items-center p-8">
          <FontAwesomeIcon icon={faSync} spin size="2x" className="text-blue-500" />
          <span className="ml-3 text-lg">{isClearing ? 'Clearing data...' : 'Loading todos...'}</span>
        </div>
      ) : (
        <>
          <form onSubmit={addTodo} className="flex mb-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo..."
              className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit" 
              className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </form>

          <ul className="space-y-2">
            {todos.map((todo) => (
              <li 
                key={todo.id} 
                className="flex items-center justify-between p-3 bg-white rounded shadow"
              >
                <div className="flex items-center">
                  <button 
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-6 h-6 rounded-full border mr-3 flex items-center justify-center ${todo.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-400'}`}
                  >
                    {todo.completed && <FontAwesomeIcon icon={faCheck} size="xs" />}
                  </button>
                  <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                    {todo.text}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full mr-3 ${getSyncStatusColor(todo.syncStatus)}`}></span>
                  <button 
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </li>
            ))}
            {todos.length === 0 && (
              <li className="p-3 bg-white rounded shadow text-center text-gray-500">
                No todos yet. Add one above!
              </li>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default Todo; 
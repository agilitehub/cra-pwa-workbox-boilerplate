/**
 * Todo Model
 * This file defines the Todo model for IndexedDB
 */

import { STORES } from '../indexedDB';
import { SYNC_STATUS } from '../dbSync';

/**
 * Create a new Todo object
 * @param {string} text The text of the todo
 * @param {boolean} completed Whether the todo is completed
 * @returns {Object} A new Todo object
 */
export const createTodo = (text, completed = false) => {
  return {
    text,
    completed,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    syncStatus: SYNC_STATUS.PENDING,
  };
};

/**
 * Validate a Todo object
 * @param {Object} todo The todo object to validate
 * @returns {boolean} Whether the todo is valid
 */
export const validateTodo = (todo) => {
  if (!todo) return false;
  if (typeof todo.text !== 'string' || todo.text.trim() === '') return false;
  if (typeof todo.completed !== 'boolean') return false;
  return true;
};

/**
 * Get the store name for Todos
 * @returns {string} The store name
 */
export const getStoreName = () => STORES.TODOS;

/**
 * Get the API endpoint for Todos
 * @returns {string} The API endpoint
 */
export const getApiEndpoint = () => '/api/todos'; 
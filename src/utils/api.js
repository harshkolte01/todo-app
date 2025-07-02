import axios from 'axios';

const BASE_URL = 'https://6863849488359a373e952694.mockapi.io/api';

const api = axios.create({
  baseURL: BASE_URL,
});

// --- USERS ENDPOINTS ---

export const getUsers = () => api.get('/users');

export const getUserByUsername = async (username, password) => {
  // Search for matching user
  const res = await api.get('/users');
  return res.data.find(
    (user) => user.username === username && user.password === password
  );
};

// --- TODOS ENDPOINTS ---

export const getTodos = (userId) => api.get(`/users/${userId}/todos`);

export const getTodo = (userId, todoId) => api.get(`/users/${userId}/todos/${todoId}`);

export const createTodo = (userId, todo) => api.post(`/users/${userId}/todos`, todo);

export const updateTodo = (userId, todoId, updatedTodo) =>
  api.put(`/users/${userId}/todos/${todoId}`, updatedTodo);

export const deleteTodo = (userId, todoId) => api.delete(`/users/${userId}/todos/${todoId}`);

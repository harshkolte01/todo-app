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

export const getTodos = () => api.get('/todos');

export const getTodo = (id) => api.get(`/todos/${id}`);

export const createTodo = (todo) => api.post('/todos', todo);

export const updateTodo = (id, updatedTodo) =>
  api.put(`/todos/${id}`, updatedTodo);

export const deleteTodo = (id) => api.delete(`/todos/${id}`);

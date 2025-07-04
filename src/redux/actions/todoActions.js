import {
  getTodos,
  createTodo as apiCreateTodo,
  updateTodo as apiUpdateTodo,
  deleteTodo as apiDeleteTodo,
} from '../../utils/api';

// Action Types
export const FETCH_TODOS_SUCCESS = 'FETCH_TODOS_SUCCESS';
export const ADD_TODO_SUCCESS = 'ADD_TODO_SUCCESS';
export const UPDATE_TODO_SUCCESS = 'UPDATE_TODO_SUCCESS';
export const DELETE_TODO_SUCCESS = 'DELETE_TODO_SUCCESS';

// Thunk Actions
export const fetchTodos = (userId) => async (dispatch) => {
  try {
    const res = await getTodos(userId);
    dispatch({ type: FETCH_TODOS_SUCCESS, payload: res.data });
  } catch (error) {
    // handle error if needed
    console.error('Failed to fetch todos:', error);
  }
};

export const addTodo = (userId, todo) => async (dispatch) => {
  try {
    const res = await apiCreateTodo(userId, todo);
    dispatch({ type: ADD_TODO_SUCCESS, payload: res.data });
  } catch (error) {
    console.error('Failed to add todo:', error);
  }
};

export const updateTodo = (userId, todo) => async (dispatch) => {
  try {
    const res = await apiUpdateTodo(userId, todo.id, todo);
    dispatch({ type: UPDATE_TODO_SUCCESS, payload: res.data });
  } catch (error) {
    console.error('Failed to update todo:', error);
  }
};

export const deleteTodo = (userId, id) => async (dispatch) => {
  try {
    await apiDeleteTodo(userId, id);
    dispatch({ type: DELETE_TODO_SUCCESS, payload: id });
  } catch (error) {
    console.error('Failed to delete todo:', error);
  }
};

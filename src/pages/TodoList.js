import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from '../redux/actions/todoActions';

export default function TodoList() {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.todos);

  const [newTodoText, setNewTodoText] = useState('');

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return;
    const newTodo = {
      text: newTodoText,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    dispatch(addTodo(newTodo));
    setNewTodoText('');
  };

  const handleToggleComplete = (todo) => {
    dispatch(updateTodo({ ...todo, completed: !todo.completed }));
  };

  const handleDelete = (id) => {
    dispatch(deleteTodo(id));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 500, margin: '0 auto' }}>
      <h2>📝 My To-Do List</h2>

      <div style={{ display: 'flex', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Enter a new task..."
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button onClick={handleAddTodo} style={{ marginLeft: 8 }}>Add</button>
      </div>

      {todos.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map((todo) => (
            <li key={todo.id} style={{ display: 'flex', marginBottom: 10 }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo)}
              />
              <span
                style={{
                  flex: 1,
                  marginLeft: 10,
                  textDecoration: todo.completed ? 'line-through' : 'none',
                }}
              >
                {todo.text}
              </span>
              <button onClick={() => handleDelete(todo.id)}>❌</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

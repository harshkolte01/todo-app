import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from '../redux/actions/todoActions';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import { Trash2, CheckSquare, Square } from 'lucide-react';
import ModalPrompt from '../components/ui/ModalPrompt';
import './TodoList.css';

export default function TodoList() {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos?.todos || []);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState(2); // Default to Medium
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalSuccess, setModalSuccess] = useState('');
  const [todoToDelete, setTodoToDelete] = useState(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchTodos(userId));
    }
  }, [dispatch, userId]);

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return;
    const newTodo = {
      text: newTodoText,
      completed: false,
      createdAt: new Date().toISOString(),
      userId: userId,
      priority: newTodoPriority,
    };
    dispatch(addTodo(userId, newTodo));
    setNewTodoText('');
    setNewTodoPriority(2);
  };

  const handleToggleComplete = (todo) => {
    if (todo.userId !== userId) return;
    dispatch(updateTodo(userId, { ...todo, completed: !todo.completed }));
  };

  const handleDelete = (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo || todo.userId !== userId) return;
    setTodoToDelete(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    setModalLoading(true);
    setModalSuccess('Task Deleted');
    setTimeout(async () => {
      await dispatch(deleteTodo(userId, todoToDelete));
      setModalLoading(false);
      setModalSuccess('');
      setModalOpen(false);
      setTodoToDelete(null);
    }, 900);
  };

  const cancelDelete = () => {
    setModalOpen(false);
    setModalLoading(false);
    setModalSuccess('');
    setTodoToDelete(null);
  };

  const userTodos = todos.filter(todo => todo.userId === userId);

  return (
    <>
      <Navbar />
      <div className="todo-container">
        <h2>📝 <span style={{fontWeight: 700}}>My To-Do List</span></h2>
        <div className="todo-input-row">
          <input
            type="text"
            placeholder="Enter a new task..."
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            className="todo-input"
            onKeyDown={e => { if (e.key === 'Enter') handleAddTodo(); }}
          />
          <select
            className="todo-priority-select"
            value={newTodoPriority}
            onChange={e => setNewTodoPriority(Number(e.target.value))}
          >
            <option value={1}>High</option>
            <option value={2}>Medium</option>
            <option value={3}>Low</option>
          </select>
          <Button className="todo-add-btn" onClick={handleAddTodo}>
            Add
          </Button>
        </div>
        {userTodos.length === 0 ? (
          <p className="todo-empty">No tasks yet.</p>
        ) : (
          <ul className="todo-list">
            {userTodos.map((todo) => (
              <li key={todo.id} className="todo-item">
                <span
                  className="todo-checkbox"
                  onClick={() => todo.userId === userId && handleToggleComplete(todo)}
                  tabIndex={0}
                  role="checkbox"
                  aria-checked={todo.completed}
                  style={{ cursor: todo.userId === userId ? 'pointer' : 'not-allowed', opacity: todo.userId === userId ? 1 : 0.5 }}
                >
                  {todo.completed ? (
                    <CheckSquare size={22} color="#6366f1" fill="#e0e7ff" strokeWidth={2.2} />
                  ) : (
                    <Square size={22} color="#a0aec0" strokeWidth={2.2} />
                  )}
                </span>
                <span
                  className={todo.completed ? 'todo-text completed' : 'todo-text'}
                >
                  {todo.text}
                </span>
                {todo.userId === userId && (
                  <button onClick={() => handleDelete(todo.id)} className="todo-delete-btn" aria-label="Delete">
                    <Trash2 size={22} color="#f43f5e" strokeWidth={2.2} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <ModalPrompt
        open={modalOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message="You are deleting this task."
        confirmText="Yes"
        cancelText="No"
        loading={modalLoading}
        successMsg={modalSuccess}
      />
    </>
  );
}

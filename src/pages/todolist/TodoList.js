import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from '../../redux/actions/todoActions';
import Navbar from '../../components/Navbar';
import Button from '../../components/ui/Button';
import { Trash2, CheckSquare, Square, Pencil } from 'lucide-react';
import ModalPrompt from '../../components/ui/ModalPrompt';
import Loading from '../../components/ui/Loading';
import '../../pages/todolist/TodoList.css';

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
  const [editId, setEditId] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 3;

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

  const startEdit = (todo) => {
    setEditId(todo.id);
    setNewTodoText(todo.text);
    setNewTodoPriority(todo.priority || 2);
  };

  const cancelEdit = () => {
    setEditId(null);
    setNewTodoText('');
    setNewTodoPriority(2);
    setEditLoading(false);
  };

  const saveEdit = async () => {
    setEditLoading(true);
    await dispatch(updateTodo(userId, { id: editId, text: newTodoText, priority: newTodoPriority }));
    setEditLoading(false);
    setEditId(null);
    setNewTodoText('');
    setNewTodoPriority(2);
  };

  const userTodos = todos
    .filter(todo => todo.userId === userId)
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : 0;
      const dateB = b.createdAt ? new Date(b.createdAt) : 0;
      return dateB - dateA; // Newest first
    });

  // Pagination logic
  const totalPages = Math.ceil(userTodos.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const currentTodos = userTodos.slice(startIndex, endIndex);

  // Reset to first page when todos change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [userTodos.length]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= 4) {
      // Show all pages if 4 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage <= 3) {
        // Near the beginning: 1, 2, 3, 4, ..., last
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end: 1, ..., last-3, last-2, last-1, last
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle: 1, ..., current-1, current, current+1, ..., last
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <>
      <Navbar />
      <div className="todo-container">
        <h2>📝 <span style={{fontWeight: 700}}>My To-Do List</span></h2>
        <div className="todo-input-row">
          <input
            type="text"
            placeholder={editId ? "Edit your task..." : "Enter a new task..."}
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            className="todo-input"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                editId ? saveEdit() : handleAddTodo();
              }
            }}
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
          {editId ? (
            <>
              <Button className="todo-add-btn" onClick={saveEdit} disabled={editLoading}>
                {editLoading ? (<><Loading small /> Save...</>) : 'Save'}
              </Button>
              <Button className="todo-add-btn todo-cancel-btn" onClick={cancelEdit} disabled={editLoading}>
                Cancel
              </Button>
            </>
          ) : (
            <Button className="todo-add-btn" onClick={handleAddTodo}>
              Add
            </Button>
          )}
        </div>
        {userTodos.length === 0 ? (
          <p className="todo-empty">No tasks yet.</p>
        ) : (
          <>
            <ul className="todo-list">
              {currentTodos.map((todo) => (
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
                  <span className={`todo-priority priority-${todo.priority || 2}`}>
                    {todo.priority === 1 ? 'High' : todo.priority === 3 ? 'Low' : 'Medium'}
                  </span>
                  {todo.userId === userId && (
                    <>
                      <button onClick={() => startEdit(todo)} className="todo-edit-btn" aria-label="Edit">
                        <Pencil size={20} color="#6366f1" strokeWidth={2.2} />
                      </button>
                      <button onClick={() => handleDelete(todo.id)} className="todo-delete-btn" aria-label="Delete">
                        <Trash2 size={22} color="#f43f5e" strokeWidth={2.2} />
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="todo-pagination">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                
                <div className="pagination-numbers">
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      className={`pagination-number ${page === currentPage ? 'active' : ''} ${page === '...' ? 'ellipsis' : ''}`}
                      onClick={() => page !== '...' && handlePageChange(page)}
                      disabled={page === '...'}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
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

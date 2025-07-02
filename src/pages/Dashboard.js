import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import './Dashboard.css';

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;
  const todos = useSelector((state) => state.todos?.todos || []);
  const userTodos = todos.filter(todo => todo.userId === userId);

  // Filter state
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // desc = newest first

  // Filtering logic
  const filteredTodos = userTodos.filter(todo => {
    const statusMatch =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && todo.completed) ||
      (statusFilter === 'incomplete' && !todo.completed);
    const priorityMatch =
      priorityFilter === 'all' ||
      (priorityFilter === '1' && todo.priority === 1) ||
      (priorityFilter === '2' && todo.priority === 2) ||
      (priorityFilter === '3' && todo.priority === 3);
    const created = todo.createdAt ? new Date(todo.createdAt) : null;
    const startMatch = !startDate || (created && created >= new Date(startDate));
    const endMatch = !endDate || (created && created <= new Date(endDate + 'T23:59:59'));
    return statusMatch && priorityMatch && startMatch && endMatch;
  }).sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt) : 0;
    const dateB = b.createdAt ? new Date(b.createdAt) : 0;
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h2>My Tasks Overview</h2>
        <div className="dashboard-filters-row">
          <select
            className="dashboard-filter-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
          <select
            className="dashboard-filter-select"
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="1">High</option>
            <option value="2">Medium</option>
            <option value="3">Low</option>
          </select>
          <input
            type="date"
            className="dashboard-filter-select dashboard-date-input"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            max={endDate || undefined}
            placeholder="Start date"
          />
          <input
            type="date"
            className="dashboard-filter-select dashboard-date-input"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            min={startDate || undefined}
            placeholder="End date"
          />
          <select
            className="dashboard-filter-select"
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
        <table className="dashboard-tasks-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredTodos.length === 0 ? (
              <tr><td colSpan={4} style={{textAlign: 'center', color: '#a0aec0'}}>No tasks found.</td></tr>
            ) : (
              filteredTodos.map((todo) => (
                <tr key={todo.id}>
                  <td>{todo.text || todo.title}</td>
                  <td>
                    {todo.completed ? (
                      <span className="dashboard-status completed">Completed</span>
                    ) : (
                      <span className="dashboard-status incomplete">Incomplete</span>
                    )}
                  </td>
                  <td>
                    <span className={`dashboard-priority priority-${todo.priority || 1}`}>{todo.priority || 1}</span>
                  </td>
                  <td>{todo.createdAt ? new Date(todo.createdAt).toLocaleString() : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

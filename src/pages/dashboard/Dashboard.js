import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../../components/Navbar';
import '../../pages/dashboard/Dashboard.css';

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 3;

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

  // Pagination logic
  const totalPages = Math.ceil(filteredTodos.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const currentTodos = filteredTodos.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, priorityFilter, startDate, endDate, sortOrder]);

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
            {currentTodos.length === 0 ? (
              <tr><td colSpan={4} style={{textAlign: 'center', color: '#a0aec0'}}>No tasks found.</td></tr>
            ) : (
              currentTodos.map((todo) => (
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
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="dashboard-pagination">
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
      </div>
    </>
  );
}

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/todos" className="navbar-link">
          Todos
        </Link>
        <Link to="/dashboard" className="navbar-link">
          Dashboard
        </Link>
      </div>
      <div className="navbar-right">
        {isLoggedIn && user ? (
          <>
            <span className="navbar-username">👤 {user.username}</span>
            <button onClick={handleLogout} className="navbar-button">
              Logout
            </button>
          </>
        ) : (
          <button onClick={() => navigate('/login')} className="navbar-button">
            Login
          </button>
        )}
      </div>
      <div className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <div className={menuOpen ? 'bar open' : 'bar'}></div>
        <div className={menuOpen ? 'bar open' : 'bar'}></div>
        <div className={menuOpen ? 'bar open' : 'bar'}></div>
      </div>
      {menuOpen && (
        <div className="navbar-mobile-menu">
          <Link to="/todos" className="navbar-link" onClick={() => setMenuOpen(false)}>
            Todos
          </Link>
          <Link to="/dashboard" className="navbar-link" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>
          {isLoggedIn && user ? (
            <>
              <span className="navbar-username">👤 {user.username}</span>
              <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="navbar-button">
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => { setMenuOpen(false); navigate('/login'); }} className="navbar-button">
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
} 
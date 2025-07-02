import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/todos" style={styles.link}>
          Todos
        </Link>
        <Link to="/dashboard" style={styles.link}>
          Dashboard
        </Link>
      </div>
      <div style={styles.right}>
        {isLoggedIn && user ? (
          <>
            <span style={styles.username}>👤 {user.username}</span>
            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </>
        ) : (
          <button onClick={() => navigate('/login')} style={styles.button}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: '#f5f5f5',
    borderBottom: '1px solid #ddd',
    marginBottom: '2rem',
  },
  left: {
    display: 'flex',
    gap: '1rem',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  link: {
    textDecoration: 'none',
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  username: {
    marginRight: '1rem',
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    padding: '0.4rem 1rem',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
}; 
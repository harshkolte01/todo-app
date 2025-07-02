import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserByUsername } from '../utils/api';
import axios from 'axios';
import Navbar from '../components/Navbar';

const API_URL = 'https://6863849488359a373e952694.mockapi.io/api/users';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      const user = await getUserByUsername(username, password);
      if (user) {
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/todos');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  const handleSignup = async () => {
    setError('');
    setSignupSuccess('');
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }
    try {
      // Fetch all users and check if username exists
      const res = await axios.get(API_URL);
      const userExists = res.data.some(user => user.username === username);
      if (userExists) {
        setError('Username already exists');
        return;
      }
      // Create user
      await axios.post(API_URL, { username, password });
      setSignupSuccess('Account created! Please log in.');
      setIsSignup(false);
      setUsername('');
      setPassword('');
    } catch (err) {
      console.error('Signup error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        {isSignup ? (
          <>
            <button onClick={handleSignup} style={styles.button}>
              Sign Up
            </button>
            <p>
              Already have an account?{' '}
              <span style={styles.link} onClick={() => { setIsSignup(false); setError(''); setSignupSuccess(''); }}>
                Login
              </span>
            </p>
          </>
        ) : (
          <>
            <button onClick={handleLogin} style={styles.button}>
              Login
            </button>
            <p>
              Don't have an account?{' '}
              <span style={styles.link} onClick={() => { setIsSignup(true); setError(''); setSignupSuccess(''); }}>
                Sign Up
              </span>
            </p>
          </>
        )}
        {error && <p style={styles.error}>{error}</p>}
        {signupSuccess && <p style={styles.success}>{signupSuccess}</p>}
      </div>
    </>
  );
};

const styles = {
  container: {
    width: '300px',
    margin: '100px auto',
    padding: '2rem',
    border: '1px solid #ccc',
    borderRadius: '12px',
    textAlign: 'center',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '0.5rem',
    margin: '0.5rem 0',
    fontSize: '1rem',
  },
  button: {
    width: '100%',
    padding: '0.7rem',
    backgroundColor: '#007bff',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: '1rem',
  },
  success: {
    color: 'green',
    marginTop: '1rem',
  },
  link: {
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default Login;

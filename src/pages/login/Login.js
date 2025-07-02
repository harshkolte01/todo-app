import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserByUsername } from '../../utils/api';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import '../../pages/login/Login.css';

const API_URL = 'https://6863849488359a373e952694.mockapi.io/api/users';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [error, setError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState('');
  const [slide, setSlide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    setLoadingMsg('Logging in...');
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
    } finally {
      setLoading(false);
      setLoadingMsg('');
    }
  };

  const handleSignup = async () => {
    setSignupError('');
    setSignupSuccess('');
    setLoading(true);
    setLoadingMsg('Signing up...');
    if (!signupUsername || !signupPassword) {
      setSignupError('Username and password are required');
      setLoading(false);
      setLoadingMsg('');
      return;
    }
    try {
      // Fetch all users and check if username exists
      const res = await axios.get(API_URL);
      const userExists = res.data.some(user => user.username === signupUsername);
      if (userExists) {
        setSignupError('Username already exists');
        setLoading(false);
        setLoadingMsg('');
        return;
      }
      // Create user
      await axios.post(API_URL, { username: signupUsername, password: signupPassword });
      setSignupSuccess('Account created! Please log in.');
      setIsSignup(false);
      setSignupUsername('');
      setSignupPassword('');
    } catch (err) {
      console.error('Signup error:', err);
      setSignupError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMsg('');
    }
  };

  const handleSwitch = (toSignup) => {
    setSlide(true);
    setTimeout(() => {
      setIsSignup(toSignup);
      setError('');
      setSignupError('');
      setSignupSuccess('');
      setSlide(false);
    }, 350);
  };

  return (
    <>
      <Navbar />
      <div className="login-signup-outer">
        <div className={`login-signup-slider${isSignup ? ' signup-active' : ''}${slide ? ' sliding' : ''}`}> 
          {/* Login Panel */}
          <div className="login-panel">
            <h2>Login</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              autoComplete="username"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              autoComplete="current-password"
            />
            <Button onClick={handleLogin} className="login-btn" disabled={loading}>
              {loading ? (<><Loading small /> Logging in...</>) : 'Login'}
            </Button>
            {error && <p className="login-error">{error}</p>}
            <p className="login-switch-text">
              Don't have an account?{' '}
              <span className="login-link" onClick={() => handleSwitch(true)}>
                Sign Up
              </span>
            </p>
          </div>
          {/* Signup Panel */}
          <div className="signup-panel">
            <h2>Sign Up</h2>
            <input
              type="text"
              placeholder="Username"
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value)}
              className="login-input"
              autoComplete="username"
            />
            <input
              type="password"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              className="login-input"
              autoComplete="new-password"
            />
            <Button onClick={handleSignup} className="login-btn" disabled={loading}>
              {loading ? (<><Loading small /> Signing up...</>) : 'Sign Up'}
            </Button>
            {signupError && <p className="login-error">{signupError}</p>}
            {signupSuccess && <p className="login-success">{signupSuccess}</p>}
            <p className="login-switch-text">
              Already have an account?{' '}
              <span className="login-link" onClick={() => handleSwitch(false)}>
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

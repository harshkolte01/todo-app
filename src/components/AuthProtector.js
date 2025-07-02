import React from 'react';
import { Navigate } from 'react-router-dom';

export default function AuthProtector({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
} 
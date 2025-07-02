import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/login/Login';
import TodoList from '../pages/todolist/TodoList';
import Dashboard from '../pages/dashboard/Dashboard'; 
import AuthProtector from '../components/AuthProtector';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/todos" element={
        <AuthProtector>
          <TodoList />
        </AuthProtector>
      } />
      <Route path="/dashboard" element={
        <AuthProtector>
          <Dashboard />
        </AuthProtector>
      } />
    </Routes>
  );
}

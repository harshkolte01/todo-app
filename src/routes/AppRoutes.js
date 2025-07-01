import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import TodoList from '../pages/TodoList';
import Dashboard from '../pages/Dashboard'; // optional

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/todos" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/todos" element={<TodoList />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

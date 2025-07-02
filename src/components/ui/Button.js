import React from 'react';
import './Button.css';

const Button = ({ children, onClick, type = 'button', className = '', disabled = false }) => (
  <button
    type={type}
    onClick={onClick}
    className={`ui-btn ${className}`}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button; 
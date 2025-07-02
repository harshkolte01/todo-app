import React from 'react';
import './Loading.css';

const Loading = ({ small = false }) => {
  if (small) {
    return (
      <span className="loading-spinner-small">
        <span className="loader-inner-small"></span>
      </span>
    );
  }
  return (
    <div className="loading-container">
      <div className="loader">
        <div className="loader-inner"></div>
      </div>
      <span className="loading-text">Loading...</span>
    </div>
  );
};

export default Loading; 
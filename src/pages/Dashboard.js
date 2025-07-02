import React from 'react';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: 500, margin: '0 auto' }}>
        <h2>Dashboard</h2>
        {/* Add dashboard content here */}
      </div>
    </>
  );
}

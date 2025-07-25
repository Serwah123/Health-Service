import React from 'react';
import { useAuth } from './AuthContext';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className="container">
      <header className="header">
        <div className="logo">Dashboard</div>
        <nav className="nav">
          <button onClick={logout}>Logout</button>
        </nav>
      </header>
      <main className="content">
        <h1>Welcome to your Dashboard!</h1>
        <div className="dashboard-cards">
          <div className="card">
            <h2>Widget 1</h2>
            <p>Some quick stats or info.</p>
          </div>
          <div className="card">
            <h2>Widget 2</h2>
            <p>Another useful widget.</p>
          </div>
          <div className="card" style={{ background: '#ffe0e0' }}>
            <h2>Alert</h2>
            <p>This is an alert component!</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
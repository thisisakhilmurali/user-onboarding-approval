import React from 'react';
import { useAuth } from '../context/AuthContext';
import './home.css';

function StatusBadge({ status }) {
  if (!status) return null;
  const cls = 'badge ' + status.toLowerCase();
  return <span className={cls}>{status}</span>;
}

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="container">
      <h1>User Onboarding Platform</h1>
      {!user && <p>Please register or login.</p>}
      {user && (
        <div className="card">
          <h2>Welcome {user.name}</h2>
          <p>Email: {user.email}</p>
          <p>Status: <StatusBadge status={user.status} /></p>
          {user.role === 'ROLE_ADMIN' && <p>You are an administrator.</p>}
          {user.role !== 'ROLE_ADMIN' && user.status === 'PENDING' && (
            <p className="info">Your account is awaiting approval by an administrator.</p>
          )}
          {user.role !== 'ROLE_ADMIN' && user.status === 'REJECTED' && (
            <p className="error">Your registration was rejected. Contact support if you believe this is a mistake.</p>
          )}
          {user.role !== 'ROLE_ADMIN' && user.status === 'APPROVED' && (
            <p className="success">Your account is approved. Enjoy!</p>
          )}
        </div>
      )}
    </div>
  );
}


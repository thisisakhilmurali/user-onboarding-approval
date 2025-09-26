import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import './NavBar.css';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <nav className="nav-bar">
      <div className="nav-left">
        <Link to="/" className="brand">Onboarding</Link>
      </div>
      <div className="nav-center">
        {!user && <Link to="/register">Register</Link>}
        {!user && <Link to="/login">Login</Link>}
        {isAdmin && <Link to="/admin/pending">Pending Users</Link>}
      </div>
      <div className="nav-right">
        <ThemeToggle />
        {user && <span className="welcome">Hi {user.name}</span>}
        {user && <button onClick={handleLogout} className="btn-link">Logout</button>}
      </div>
    </nav>
  );
}


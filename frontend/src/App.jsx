import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPending from './pages/AdminPending';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import './styles/global.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/pending" element={<AdminRoute><AdminPending /></AdminRoute>} />
          <Route path="*" element={<div className='container'><h2>404</h2><p>Page not found.</p></div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}


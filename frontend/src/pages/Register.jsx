import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

export default function Register() {
  const { register, user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  if (user) return <Navigate to="/" replace />;

  const validate = () => {
    if (!name.trim()) return 'Name is required';
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return 'Valid email required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) { setError(v); return; }
    setSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (e2) {
      setError(e2.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container narrow">
      <h2>Register</h2>
      <form onSubmit={onSubmit} className="form-card">
        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">Registration submitted! Please login (status will be PENDING until approved).</div>}
        <label>Name
          <input value={name} maxLength={120} onChange={e=>setName(e.target.value)} required />
        </label>
        <label>Email
          <input type="email" value={email} maxLength={180} onChange={e=>setEmail(e.target.value)} required />
        </label>
        <label>Password
          <input type="password" value={password} minLength={6} onChange={e=>setPassword(e.target.value)} required />
        </label>
        <button disabled={submitting} type="submit">{submitting ? 'Submitting...' : 'Register'}</button>
      </form>
    </div>
  );
}


import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, user, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const navigate = useNavigate();

  if (user) return <Navigate to="/" replace />;

  const validate = () => {
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return 'Valid email required';
    if (!password || password.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const valErr = validate();
    if (valErr) { setFormError(valErr); return; }
    setSubmitting(true);
    const ok = await login(email, password);
    setSubmitting(false);
    if (ok) navigate('/');
  };

  return (
    <div className="container narrow">
      <h2>Login</h2>
      <form onSubmit={onSubmit} className="form-card">
        {formError && <div className="alert error">{formError}</div>}
        {error && <div className="alert error">{error}</div>}
        <label>Email
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </label>
        <label>Password
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} />
        </label>
        <button type="submit" disabled={submitting}>{submitting ? 'Logging in...' : 'Login'}</button>
      </form>
    </div>
  );
}


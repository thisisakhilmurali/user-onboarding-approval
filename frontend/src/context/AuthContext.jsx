import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, setTokenAccessor, setTokenClear } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // {id,name,email,status,role}
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(!!token);
  const [error, setError] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  }, []);

  setTokenAccessor(() => token);
  setTokenClear(() => logout());

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const me = await api.me();
      setUser(me);
    } catch (e) {
      logout();
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => { refreshProfile(); }, [refreshProfile]);

  const login = async (email, password) => {
    setError(null);
    try {
      const resp = await api.login(email, password);
      localStorage.setItem('auth_token', resp.token);
      setToken(resp.token);
      await refreshProfile();
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    return api.register(name, email, password);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, logout, register, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }


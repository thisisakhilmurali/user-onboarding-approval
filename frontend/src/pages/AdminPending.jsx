import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function AdminPending() {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.listPending();
      setPending(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const optimisticUpdate = (id, newStatus) => {
    setPending(p => p.filter(u => u.id !== id));
  };

  const act = async (id, action) => {
    try {
      optimisticUpdate(id);
      if (action === 'approve') await api.approve(id);
      else await api.reject(id);
    } catch (e) {
      setError(e.message);
      // reload to recover state
      load();
    }
  };

  if (!user || user.role !== 'ROLE_ADMIN') return <div className="container"><p>Access denied.</p></div>;

  return (
    <div className="container">
      <h2>Pending Users</h2>
      {error && <div className="alert error">{error}</div>}
      {loading && <p>Loading...</p>}
      {!loading && pending.length === 0 && <p>No pending users.</p>}
      <table className="data-table">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Email</th><th>Created</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {pending.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{new Date(u.createdDate).toLocaleString()}</td>
              <td className="actions">
                <button onClick={() => act(u.id,'approve')} className="btn small success">Approve</button>
                <button onClick={() => act(u.id,'reject')} className="btn small danger">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


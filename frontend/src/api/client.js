import { API_BASE_URL } from '../config';

let getToken = () => localStorage.getItem('auth_token');
let clearToken = () => localStorage.removeItem('auth_token');

export function setTokenAccessor(accessorFn) { getToken = accessorFn; }
export function setTokenClear(clearFn) { clearToken = clearFn; }

async function request(path, options = {}) {
  const headers = options.headers ? { ...options.headers } : {};
  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const resp = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (resp.status === 401) {
    clearToken();
    throw new Error('UNAUTHORIZED');
  }
  let data;
  const ct = resp.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    data = await resp.json();
  } else {
    data = await resp.text();
  }
  if (!resp.ok) {
    const msg = data?.error || resp.statusText;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  login: (email, password) => request('/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name, email, password) => request('/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  me: () => request('/me'),
  listPending: () => request('/admin/pending'),
  approve: (id) => request(`/admin/approve/${id}`, { method: 'POST' }),
  reject: (id) => request(`/admin/reject/${id}`, { method: 'POST' }),
};


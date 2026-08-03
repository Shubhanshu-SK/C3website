// Central API base URL — reads from Vite env variable, falls back to localhost
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Attach JWT token from localStorage to authenticated requests
export const authHeaders = () => {
  const token = localStorage.getItem('c3_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const publicHeaders = () => ({ 'Content-Type': 'application/json' });

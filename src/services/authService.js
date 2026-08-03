import { API_BASE, publicHeaders } from './apiConfig';

export const loginAdmin = async (username, password) => {
 try {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: publicHeaders(),
    body: JSON.stringify({ username, password }),
  });
  const json = await res.json();

  // 🚨 HANDLE ERRORS CLEANLY
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Invalid username or password');
      }

      if (res.status === 403) {
        throw new Error('Access forbidden. You are not allowed to login.');
      }
    }
  // if (!res.ok) throw new Error(json.message || 'Login failed');
  return json; // { token, username }
    } catch (err) {
    console.error("Login error:", err.message);
    throw err;
  }
};

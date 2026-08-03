import { API_BASE, authHeaders, publicHeaders } from './apiConfig';

export const getProjects = async () => {
  const res = await fetch(`${API_BASE}/projects`, { headers: publicHeaders() });
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
};

export const getProjectById = async (id) => {
  const res = await fetch(`${API_BASE}/projects/${id}`, { headers: publicHeaders() });
  if (!res.ok) throw new Error('Project not found');
  return res.json();
};

export const addProject = async (data) => {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to add project');
  return json;
};

export const updateProject = async (id, data) => {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'PUT', headers: authHeaders(), body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update project');
  return json;
};

export const deleteProject = async (id) => {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'DELETE', headers: authHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to delete project');
  return json;
};

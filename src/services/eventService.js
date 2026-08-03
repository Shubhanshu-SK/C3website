import { API_BASE, authHeaders, publicHeaders } from './apiConfig';

export const getEvents = async () => {
  const res = await fetch(`${API_BASE}/events`, { headers: publicHeaders() });
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
};

export const getEventById = async (id) => {
  const res = await fetch(`${API_BASE}/events/${id}`, { headers: publicHeaders() });
  if (!res.ok) throw new Error('Event not found');
  return res.json();
};

export const addEvent = async (data) => {
  const res = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to add event');
  return json;
};

export const updateEvent = async (id, data) => {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update event');
  return json;
};

export const deleteEvent = async (id) => {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to delete event');
  return json;
};

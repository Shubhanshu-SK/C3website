import { API_BASE, publicHeaders, authHeaders } from './apiConfig';

/**
 * Submit registration for an event (public).
 * @param {string} eventId  - MongoDB _id of the event
 * @param {Object} formData - { fullName, email, enrollmentNo, phoneNumber, institute, branch, source }
 */
export const registerForEvent = async (eventId, formData) => {
  const res = await fetch(`${API_BASE}/registrations/${eventId}`, {
    method: 'POST',
    headers: publicHeaders(),
    body: JSON.stringify(formData),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Registration failed.');
  return json;
};

/**
 * Admin: get all registrations across all events (for initial dashboard load).
 */
export const getAllRegistrations = async () => {
  const res = await fetch(`${API_BASE}/registrations/admin/all`, { headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to load registrations.');
  return json;
};

/**
 * Admin: get registrations for one specific event.
 */
export const getRegistrationsForEvent = async (eventId) => {
  const res = await fetch(`${API_BASE}/registrations/admin/${eventId}`, { headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to load registrations.');
  return json;
};

/**
 * Admin: trigger CSV download for one specific event.
 */
export const downloadRegistrationsCSV = (eventId) => {
  const token = localStorage.getItem('c3_admin_token');
  const url = `${API_BASE}/registrations/admin/${eventId}/csv`;
  fetch(url, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  })
    .then((r) => {
      const disposition = r.headers.get('Content-Disposition') || '';
      const match = disposition.match(/filename="?([^"]+)"?/);
      const filename = match ? match[1] : `registrations-${eventId}.csv`;
      return r.blob().then((blob) => ({ blob, filename }));
    })
    .then(({ blob, filename }) => {
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    });
};

/**
 * Admin: delete ALL registrations for an event.
 */
export const deleteEventRegistrations = async (eventId) => {
  const res = await fetch(
    `${API_BASE}/registrations/admin/${eventId}/all`,
    { method: 'DELETE', headers: authHeaders() }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to delete event registrations.');
  return json;
};

/**
 * Admin: delete a single registration by its MongoDB _id.
 */
export const deleteRegistration = async (registrationId) => {
  const res = await fetch(
    `${API_BASE}/registrations/admin/entry/${registrationId}`,
    { method: 'DELETE', headers: authHeaders() }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to delete registration.');
  return json;
};

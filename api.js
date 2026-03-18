const API_BASE = '/api';

let authToken = localStorage.getItem('armvet_token');
let csrfToken = null;

// Convert snake_case keys to camelCase
function toCamel(obj) {
  if (Array.isArray(obj)) return obj.map(toCamel);
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        k.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
        toCamel(v),
      ])
    );
  }
  return obj;
}

// Fetch CSRF token on init
async function fetchCsrfToken() {
  try {
    const res = await fetch(`${API_BASE}/csrf-token`, { credentials: 'include' });
    const data = await res.json();
    csrfToken = data.csrfToken;
  } catch (err) {
    console.error('Failed to fetch CSRF token:', err);
  }
}

function setAuthToken(token) {
  authToken = token;
  if (token) {
    localStorage.setItem('armvet_token', token);
  } else {
    localStorage.removeItem('armvet_token');
  }
}

function getAuthToken() {
  return authToken;
}

async function apiRequest(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  if (csrfToken && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method)) {
    headers['X-CSRF-Token'] = csrfToken;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (res.status === 401 || res.status === 403) {
    // Token expired or invalid
    if (path !== '/auth/login' && path !== '/auth/verify') {
      setAuthToken(null);
      window.location.reload();
    }
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return toCamel(data);
}

// Auth
export async function login(username, password) {
  await fetchCsrfToken();
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  setAuthToken(data.token);
  return data;
}

export async function verifyToken() {
  if (!authToken) return false;
  try {
    const data = await apiRequest('/auth/verify', { method: 'POST' });
    return data.valid;
  } catch {
    setAuthToken(null);
    return false;
  }
}

export function logout() {
  setAuthToken(null);
}

export function isAuthenticated() {
  return !!authToken;
}

// Stats
export async function fetchStats() {
  return apiRequest('/stats');
}

// Bookings
export async function fetchBookings(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/bookings${query ? '?' + query : ''}`);
}

export async function fetchBooking(id) {
  return apiRequest(`/bookings/${id}`);
}

export async function updateBookingStatus(id, status) {
  return apiRequest(`/bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function deleteBooking(id) {
  return apiRequest(`/bookings/${id}`, { method: 'DELETE' });
}

// Contacts
export async function fetchContacts(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/contacts${query ? '?' + query : ''}`);
}

export async function fetchContact(id) {
  return apiRequest(`/contacts/${id}`);
}

export async function updateContactStatus(id, status) {
  return apiRequest(`/contacts/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function deleteContact(id) {
  return apiRequest(`/contacts/${id}`, { method: 'DELETE' });
}

// Events
export async function fetchEvents(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/events${query ? '?' + query : ''}`);
}

export async function fetchEvent(id) {
  return apiRequest(`/events/${id}`);
}

export async function createEvent(eventData) {
  return apiRequest('/events', {
    method: 'POST',
    body: JSON.stringify(eventData),
  });
}

export async function deleteEvent(id) {
  return apiRequest(`/events/${id}`, { method: 'DELETE' });
}

// Initialize CSRF on load
fetchCsrfToken();

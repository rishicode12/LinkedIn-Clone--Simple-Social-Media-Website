export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

let inMemoryToken = null;

export function setAuthToken(token) {
  inMemoryToken = token ?? null;
}

export function getAuthToken() {
  if (inMemoryToken) return inMemoryToken;
  const stored = localStorage.getItem("token") || sessionStorage.getItem("token") || null;
  inMemoryToken = stored;
  return stored;
}

export async function apiRequest(path, options = {}) {
  const token =
    options.authenticate === false
      ? null
      : options.token ?? getAuthToken();

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    credentials: options.credentials ?? "include",
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}


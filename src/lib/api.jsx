const API_BASE = process.env.NEXT_PUBLIC_API_URL;
import { useAuthStore } from "@/store/useAuthStore";

// Helper to decode and update user from token


async function refreshAccessToken() {

  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  const res = await fetch(`${API_BASE}/api/auth/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  localStorage.setItem("accessToken", data.access);
    // updateUserFromToken(data.access);
  return data.access;
}

export async function apiFetch(path, options = {}) {
  let accessToken = localStorage.getItem("accessToken");

  const doFetch = (token) =>
    fetch(`${API_BASE}${path}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      body: options.body,
    });

  let res = await doFetch(accessToken);

  /* 🔥 Access token expired - refresh silently */
  if (res.status === 401) {
    const newAccess = await refreshAccessToken();

    if (!newAccess) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      useAuthStore.getState().logout();
      throw new Error("Session expired");
    }

    // 🔁 Retry with new token - don't log the 401
    res = await doFetch(newAccess);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API request failed");
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

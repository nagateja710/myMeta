const API_BASE = process.env.NEXT_PUBLIC_API_URL;


export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body,
  });

  if (!res.ok) {
    const text = await res.text();
     throw new Error(text || "API request failed");
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

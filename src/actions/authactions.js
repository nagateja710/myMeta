"use client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
// console.log(API_BASE);

export async function loginUser(username, password) {
  // console.log(API_BASE);
  const res = await fetch(`${API_BASE}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  return res.json(); // { access, refresh }
}

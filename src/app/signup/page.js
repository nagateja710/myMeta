"use client";
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
export default function SignupPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {

      const res = await fetch(`${API_BASE}/api/auth/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Signup failed");
      }

      // 🔐 Store JWT tokens
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);

      // 🧠 Update auth store
      login({ username: data.username });

      // 🚀 Redirect to home
      router.replace("/");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
     <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-1/4 -right-24 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <form
          onSubmit={handleSignup}
          className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl"
        >
          {/* HEADER */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Start tracking your media journey
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400 text-center mb-4">
              {error}
            </div>
          )}

          {/* INPUTS */}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200 disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create account"}
          </button>

          {/* FOOTER */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-medium text-white hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
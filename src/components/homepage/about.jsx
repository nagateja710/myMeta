"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white">
      
      {/* BACKGROUND DECOR */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="max-w-xl text-center">

          {/* BADGE */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-gray-300 backdrop-blur">
            🎬 📚 🎮 Unified Media Tracker
          </div>

          {/* TITLE */}
          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight">
            MyMeta
          </h1>

          {/* TAGLINE */}
          <p className="mt-4 text-lg text-gray-300 leading-relaxed">
            One place to track everything you watch, read, and play.
            <br />
            <span className="text-white font-medium">
              Simple. Personal. Powerful.
            </span>
          </p>

          {/* FEATURES */}
          <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur">
              ⭐ Rate & review
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur">
              🏷 Organize by status
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur">
              📊 Track progress
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur">
              🚀 Built for speed
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signin"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-gray-200 transition"
            >
              Sign in
            </Link>

            <Link
              href="/signup"
              className="rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold hover:bg-white/10 transition"
            >
              Create account
            </Link>
          </div>

          {/* FOOTNOTE */}
          <p className="mt-8 text-xs text-gray-500">
            No ads · No tracking · Your media, your rules
          </p>
        </div>
      </div>
    </div>
  );
}

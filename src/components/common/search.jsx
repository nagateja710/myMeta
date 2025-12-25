"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SearchOverlay from "./SearchOverlay";

import {
  mapBookResult,
  mapMovieResult,
  mapAnimeResult,
  mapGameResult,
} from "@/utils/searchHelper";

const SEARCH_CONFIG = {
  books: {
    placeholder: "Search books...",
    api: (q) =>
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}`,
    extract: (data) => (data.items || []).map(mapBookResult),
  },

  movies: {
    placeholder: "Search movies...",
    api: (q) =>
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        q
      )}&api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`,
    extract: (data) => (data.results || []).map(mapMovieResult),
  },

  anime: {
    placeholder: "Search anime...",
    api: (q) => `https://api.jikan.moe/v4/anime?q=${q}`,
    extract: (data) => (data.data || []).map(mapAnimeResult),
  },

  games: {
    placeholder: "Search games...",
    api: (q) =>
      `https://api.rawg.io/api/games?search=${encodeURIComponent(
        q
      )}&key=${process.env.NEXT_PUBLIC_RAWG_KEY}`,
    extract: (data) => (data.results || []).map(mapGameResult),
  },
};

export default function Search({ onAdd }) {
  const pathname = usePathname();
  const section = pathname.split("/")[1];
  const config = SEARCH_CONFIG[section];

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const containerRef = useRef(null);

  async function handleSearch(q) {
    if (!config || !q.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(config.api(q));
      const data = await res.json();
      setResults(config.extract(data));
    } catch (e) {
      console.error(e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open || !config) return;
    const t = setTimeout(() => handleSearch(query), 400);
    return () => clearTimeout(t);
  }, [query, open, config]);

  useEffect(() => {
    function handler(e) {
      if (!containerRef.current?.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!config) return null;

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={config.placeholder}
        className="w-full px-4 py-2 rounded-full bg-black/10 backdrop-blur text-black placeholder-gray-700 outline-none"
      />

      {open && (
        <div className="absolute left-0 right-0 z-50">
          <SearchOverlay
            loading={loading}
            results={results}
            onAdd={onAdd}
          />
        </div>
      )}
    </div>
  );
}

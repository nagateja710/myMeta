"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SearchOverlay from "./SearchOverlay";
import { SEARCH_CONFIG } from "@/utils/searchHelper";


export default function Search({ onAdd }) {
  const pathname = usePathname();
  const section = pathname.split("/")[2];
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
     const res = await fetch(config.fetchUrl(q));

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

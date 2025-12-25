import SearchOverlay from "./SearchOverlay";

export default function SearchBar({
  query,
  setQuery,
  onSubmit,
  showOverlay,
  loading,
  results,
}) {
  return (
    // ❌ NO flex / NO justify-end here
    <div className="sticky top-16 z-40 mb-6">
      
      {/* This is the ONLY positioning anchor */}
      <div className="relative ml-auto w-90">
        {/* Search input row */}
        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Search books..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 rounded-md border px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-black"
          />

          <button
            type="submit"
            className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-slate-800"
          >
            Search
          </button>
        </form>

        {/* 🔥 OVERLAY — absolutely positioned */}
        {showOverlay && (
          <div className="absolute top-full right-0 mt-2 z-50">
            <SearchOverlay
              loading={loading}
              results={results}
            />
          </div>
        )}
      </div>
    </div>
  );
}

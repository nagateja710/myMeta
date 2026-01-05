
import { useEffect, useRef } from "react";

export default function FilterDropdown({
  filterOpen,
  setFilterOpen,
  selectedStatuses,
  selectedRatings,
  selectedAiringStatuses,
  toggleStatus,
  toggleRating,
  toggleAiringStatus,
  clearAllFilters,
  activeFilterCount,
}) {
  const filterRef = useRef(null);

  // Handle click outside to close filter dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    };

    if (filterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterOpen, setFilterOpen]);

  return (
    <div ref={filterRef} className="relative flex flex-col gap-1 flex-1 sm:flex-initial">
      <label className="text-xs text-gray-400">Filter:</label>
      <button
        onClick={() => setFilterOpen(!filterOpen)}
        className="
          bg-black/40 
          text-white 
          border 
          border-white/30 
          rounded-lg 
          px-3 
          py-1.5 
          text-sm
          focus:outline-none 
          focus:ring-2 
          focus:ring-white/50
          cursor-pointer
          flex
          items-center
          gap-2
          justify-between
          w-full
        "
      >
        <span>
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </span>
        <span className="text-xs">▼</span>
      </button>

      {filterOpen && (
        <div
          className="
            absolute 
            top-full 
            left-0
            right-0
            sm:left-auto
            sm:right-0
            sm:min-w-[280px]
            mt-2 
            bg-black/90 
            backdrop-blur-md
            border 
            border-white/30 
            rounded-lg 
            p-4 
            max-h-[70vh]
            overflow-y-auto
            shadow-xl
            z-50
            mx-2
            sm:mx-0
          "
        >
          {/* Clear all button */}
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/20">
            <span className="text-sm font-semibold text-white">
              Filter Options
            </span>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-300 mb-2 uppercase">
              Status
            </h4>
            <div className="space-y-1.5">
              {["todo", "doing", "completed"].map((status) => (
                <label
                  key={status}
                  className="flex items-center gap-2 text-sm text-white cursor-pointer hover:bg-white/5 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(status)}
                    onChange={() => toggleStatus(status)}
                    className="w-4 h-4 cursor-pointer accent-lime-500"
                  />
                  <span className="capitalize">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-300 mb-2 uppercase">
              Rating
            </h4>

            {/* Star buttons */}
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((starCount) => (
                <button
                  key={starCount}
                  onClick={() => toggleRating(starCount.toString())}
                  className={`
                    w-8 h-8 
                    flex items-center justify-center
                    rounded
                    transition-all
                    ${
                      selectedRatings.includes(starCount.toString())
                        ? "text-amber-400"
                        : "text-amber-100"
                    }
                  `}
                  title={`${starCount} Star${starCount !== 1 ? "s" : ""}`}
                >
                  <span className="text-lg">★</span>
                </button>
              ))}
            </div>

            {/* Not Rated checkbox */}
            <label className="flex items-center gap-2 text-sm text-white cursor-pointer hover:bg-white/5 p-1 rounded">
              <input
                type="checkbox"
                checked={selectedRatings.includes("unrated")}
                onChange={() => toggleRating("unrated")}
                className="w-4 h-4 cursor-pointer accent-lime-500"
              />
              <span>Not Rated</span>
            </label>
          </div>

          {/* Airing Status Filter */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 mb-2 uppercase">
              Airing Status
            </h4>
            <div className="space-y-1.5">
              {["airing", "completed", "hiatus", "unknown"].map((status) => (
                <label
                  key={status}
                  className="flex items-center gap-2 text-sm text-white cursor-pointer hover:bg-white/5 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedAiringStatuses.includes(status)}
                    onChange={() => toggleAiringStatus(status)}
                    className="w-4 h-4 cursor-pointer accent-lime-500"
                  />
                  <span className="capitalize">
                    {status === "unknown" ? "Unknown" : status}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Card from "@/components/cards/card_mymeta";
import AdvancedAddInline from "@/components/cards/AdvancedAddInline";
import { useLibraryStore } from "@/store/useLibraryStore";

/* -----------------------------
   🎨 BACKGROUND CONFIGS
-------------------------------- */
const getRandomItem = (items) => {
  if (items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
};

const BACKGROUND_STYLES = {
  anime: {
    bgClass: "bg-gradient-to-br from-amber-950 via-yellow-950 to-zinc-950",
    pattern: (
      <>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(251,191,36,0.03) 2deg, transparent 4deg)",
          }}
        />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </>
    ),
  },

  movie: {
    bgClass: "bg-gradient-to-br from-purple-950 via-fuchsia-950 to-zinc-950",
    pattern: (
      <>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(168,85,247,0.03) 1px, transparent 1px),
              linear-gradient(rgba(168,85,247,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-fuchsia-500/10 rounded-full blur-3xl" />
      </>
    ),
  },

  series: {
    bgClass: "bg-gradient-to-br from-indigo-950 via-violet-950 to-zinc-950",
    pattern: (
      <>
        {/* Horizontal episode stripes */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 28px,
                rgba(99,102,241,0.05) 28px,
                rgba(99,102,241,0.05) 29px
              )
            `,
          }}
        />

        {/* Soft timeline glow */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
      </>
    ),
  },

  game: {
    bgClass: "bg-gradient-to-br from-slate-950 via-gray-900 to-zinc-950",
    pattern: (
      <>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(148,163,184,0.03) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(148,163,184,0.03) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, rgba(148,163,184,0.03) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(148,163,184,0.03) 75%)
            `,
            backgroundSize: "40px 40px",
            backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0px",
          }}
        />
        <div className="absolute top-0 left-0 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl" />
      </>
    ),
  },

  book: {
    bgClass: "bg-gradient-to-br from-blue-950 via-cyan-950 to-zinc-950",
    pattern: (
      <>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(59,130,246,0.03) 35px, rgba(59,130,246,0.03) 36px)",
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(59,130,246,0.05) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </>
    ),
  },
};

/* ===================================================== */

export default function MediaPage({ type }) {
  const items = useLibraryStore((s) => s.items);
  const hydrated = useLibraryStore((s) => s.hydrated);
  const updateItem = useLibraryStore((s) => s.updateItem);
  const removeItem = useLibraryStore((s) => s.removeItem);

  const [editingItem, setEditingItem] = useState(null);
  const [sortBy, setSortBy] = useState("none");
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Filter states
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedAiringStatuses, setSelectedAiringStatuses] = useState([]);
  
  // Ref for click outside detection
  const filterRef = useRef(null);
  
  const pathname = usePathname();

  const bg = BACKGROUND_STYLES[type] || BACKGROUND_STYLES.book;

  // Handle click outside to close filter dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    };

    // Add event listener when filter is open
    if (filterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterOpen]);

  const filteredItems = useMemo(
    () => items.filter((i) => i.media?.type === type),
    [items, type]
  );

  // Apply filters
  const applyFilters = (items) => {
    let filtered = [...items];

    // Filter by status
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((item) =>
        selectedStatuses.includes(item.status)
      );
    }

    // Filter by rating
    if (selectedRatings.length > 0) {
      filtered = filtered.filter((item) => {
        if (selectedRatings.includes("unrated")) {
          return !item.rating || selectedRatings.includes(item.rating?.toString());
        }
        return selectedRatings.includes(item.rating?.toString());
      });
    }

    // Filter by airing status
    if (selectedAiringStatuses.length > 0) {
      filtered = filtered.filter((item) =>
        selectedAiringStatuses.includes(item.airing_status || "unknown")
      );
    }

    return filtered;
  };

const restItems = useMemo(() => {
  // Apply filters function
  const applyFilters = (items) => {
    let filtered = [...items];

    // Filter by status
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((item) =>
        selectedStatuses.includes(item.status)
      );
    }

    // Filter by rating
    if (selectedRatings.length > 0) {
      filtered = filtered.filter((item) => {
        // Check if "unrated" is selected and item has no rating
        if (selectedRatings.includes("unrated") && !item.rating) {
          return true;
        }
        // Check if item's rating is in selected ratings
        if (item.rating && selectedRatings.includes(item.rating.toString())) {
          return true;
        }
        return false;
      });
    }

    // Filter by airing status
    if (selectedAiringStatuses.length > 0) {
      filtered = filtered.filter((item) =>
        selectedAiringStatuses.includes(item.airing_status || "unknown")
      );
    }

    return filtered;
  };

  return applyFilters(filteredItems);
}, [filteredItems, selectedStatuses, selectedRatings, selectedAiringStatuses]);

  const doingItems = useMemo(
    () => filteredItems.filter((i) => i.status === "doing"),
    [filteredItems]
  );

  const featuredItems = useMemo(() => {
    const featured = [];

    // 1. All "doing" items
    doingItems.forEach((item) => {
      featured.push({ ...item, featuredTag: "LIVE" });
    });

    // 2. Recently completed (1 item)
    const recentCompleted = filteredItems
      .filter((i) => i.status === "completed")
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0];

    if (recentCompleted) {
      featured.push({ ...recentCompleted, featuredTag: "RECENT" });
    }

    // 3. Top rated item
    const topRated = getRandomItem(
      filteredItems
        .filter((i) => i.rating && i.rating === 5)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    );

    if (topRated && !featured.find((f) => f.id === topRated.id)) {
      featured.push({ ...topRated, featuredTag: "TOP RATED" });
    }

    const todoItem = getRandomItem(
      filteredItems.filter(
        (i) => i.status === "todo" && !featured.find((f) => f.id === i.id)
      )
    );

    if (todoItem) {
      featured.push({ ...todoItem, featuredTag: "UP NEXT" });
    }

    return featured;
  }, [filteredItems, doingItems]);

  // Group items by year for updated_at sort
  const groupByYear = (items) => {
    const grouped = {};
    items.forEach((item) => {
      const year = item.updated_at
        ? new Date(item.updated_at).getFullYear()
        : "Unknown";
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(item);
    });
    return grouped;
  };

  // Group by status (todo/doing/1star-5star)
  const groupByStatus = (items) => {
    const grouped = {
      todo: [],
      doing: [],
      "5star": [],
      "4star": [],
      "3star": [],
      "2star": [],
      "1star": [],
      unrated: [],
    };

    items.forEach((item) => {
      if (item.status === "todo") {
        grouped.todo.push(item);
      } else if (item.status === "doing") {
        grouped.doing.push(item);
      } else if (item.rating) {
        grouped[`${item.rating}star`].push(item);
      } else {
        grouped.unrated.push(item);
      }
    });

    return grouped;
  };

  // Group by airing status
  const groupByAiringStatus = (items) => {
    const grouped = {
      airing: [],
      completed: [],
      hiatus: [],
      unknown: [],
    };

    items.forEach((item) => {
      const status = item.airing_status || "unknown";
      if (grouped[status]) {
        grouped[status].push(item);
      } else {
        grouped.unknown.push(item);
      }
    });

    return grouped;
  };

  // Sorted and grouped items
  const sortedItems = useMemo(() => {
    if (sortBy === "none") {
      return { none: restItems };
    }

    if (sortBy === "status") {
      return groupByStatus(restItems);
    }

    if (sortBy === "airing_status") {
      return groupByAiringStatus(restItems);
    }

    if (sortBy === "updated_at") {
      return groupByYear(restItems);
    }

    return { none: restItems };
  }, [restItems, sortBy]);

  const TAG_COLORS = {
    LIVE: "bg-red-500/80 text-white",
    RECENT: "bg-green-500/80 text-white",
    "TOP RATED": "bg-yellow-500/80 text-yellow-900",
    "UP NEXT": "bg-purple-500/80 text-white",
  };

  // Filter toggle handlers
  const toggleStatus = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const toggleRating = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  const toggleAiringStatus = (status) => {
    setSelectedAiringStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const clearAllFilters = () => {
    setSelectedStatuses([]);
    setSelectedRatings([]);
    setSelectedAiringStatuses([]);
  };

  const activeFilterCount =
    selectedStatuses.length +
    selectedRatings.length +
    selectedAiringStatuses.length;

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-gray-400">
        Loading your {type}...
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${bg.bgClass}`}>
      <div className="absolute inset-0">{bg.pattern}</div>

      <div className="relative z-10">
        {/* HEADER */}
<div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
  <div>
    <h1 className="text-2xl font-bold uppercase text-white">{type}</h1>
    <p className="text-sm text-gray-300">Track what youre into</p>
  </div>

  {/* SORT & FILTER CONTROLS */}
  <div className="flex items-start gap-3 w-full sm:w-auto">
    {/* SORT DROPDOWN */}
    <div className="flex flex-col gap-1 flex-1 sm:flex-initial">
      <label className="text-xs text-gray-400">Sort by:</label>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
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
          w-full
        "
      >
        <option value="none">None</option>
        <option value="status">Status (Todo/Doing/Rating)</option>
        <option value="airing_status">Airing Status</option>
        <option value="updated_at">Updated Date</option>
      </select>
    </div>

    {/* FILTER DROPDOWN */}
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

      {/* FILTER DROPDOWN MENU */}
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
              className="w-4 h-4 cursor-pointer accent-white"
            />
            <span className="capitalize">{status}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Rating Filter - NEW LAYOUT */}
    <div className="mb-4">
      <h4 className="text-xs font-semibold text-gray-300 mb-2 uppercase">
        Rating
      </h4>
      
      {/* Star buttons in horizontal layout */}
      <div className="flex items-center gap-1 mb-2">
        {[1,2,3,4,5].map((starCount) => (
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
                  ?"text-amber-400" : "text-amber-100"
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
          className="w-4 h-4 cursor-pointer accent-white"
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
        {["airing", "completed", "hiatus", "unknown"].map(
          (status) => (
            <label
              key={status}
              className="flex items-center gap-2 text-sm text-white cursor-pointer hover:bg-white/5 p-1 rounded"
            >
              <input
                type="checkbox"
                checked={selectedAiringStatuses.includes(status)}
                onChange={() => toggleAiringStatus(status)}
                className="w-4 h-4 cursor-pointer accent-white"
              />
              <span className="capitalize">
                {status === "unknown" ? "Unknown" : status}
              </span>
            </label>
          )
        )}
      </div>
    </div>
  </div>
)}

            </div>
          </div>
        </div>

        {/* EMPTY */}
        {filteredItems.length === 0 && (
          <p className="px-6 text-sm text-gray-400">
            Nothing here yet. Add something ✨
          </p>
        )}



        {/* FEATURED ROW (HORIZONTAL SCROLL) */}
        {featuredItems.length > 0 && (
          <div className="px-6 py-2 bg-black/20 rounded-lg border border-white/30 mx-6 mb-4">
            <h2 className="text-lg font-semibold text-gray-200 mb-2">
              Featured
            </h2>

            <div
              className="
                flex 
                gap-4
                overflow-x-auto
                py-2
                rounded-lg
                scrollbar-hide
                snap-x snap-mandatory
              "
            >
              {featuredItems.map((item) => (
                <div key={item.id} className="snap-start shrink-0 w-45">
                  <Card
                    item={item}
                    onEdit={() => setEditingItem(item)}
                    onUpdated={(u) => updateItem(item.id, u)}
                    onDeleted={(id) => removeItem(id)}
                    tag={item.featuredTag}
                    tagcol={TAG_COLORS[item.featuredTag]}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

                {/* NO RESULTS AFTER FILTERING */}
        {filteredItems.length > 0 && restItems.length === 0 && (
          <div className="px-6 text-center py-8">
            <p className="text-gray-400 mb-2">No items match your filters</p>
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-400 hover:text-blue-300 underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* GROUPED GRID */}
        {restItems.length > 0 && (
          <div className="p-2">
            {Object.keys(sortedItems)
              .sort((a, b) => {
                // Sort years in descending order
                if (sortBy === "updated_at") {
                  if (a === "Unknown") return 1;
                  if (b === "Unknown") return -1;
                  return parseInt(b) - parseInt(a);
                }
                return 0;
              })
              .map((group) => {
                const groupItems = sortedItems[group];
                if (groupItems.length === 0) return null;

                // Display group label
                let groupLabel = group;
                if (sortBy === "status") {
                  const statusLabels = {
                    todo: "To Do",
                    doing: "In Progress",
                    "5star": "⭐⭐⭐⭐⭐ 5 Stars",
                    "4star": "⭐⭐⭐⭐ 4 Stars",
                    "3star": "⭐⭐⭐ 3 Stars",
                    "2star": "⭐⭐ 2 Stars",
                    "1star": "⭐ 1 Star",
                    unrated: "Not Rated",
                  };
                  groupLabel = statusLabels[group] || group;
                } else if (sortBy === "airing_status") {
                  const airingLabels = {
                    airing: "Currently Airing",
                    completed: "Finished Airing",
                    hiatus: "On Hiatus",
                    unknown: "Status Unknown",
                  };
                  groupLabel = airingLabels[group] || group;
                } else if (sortBy === "none") {
                  groupLabel = null;
                }

                return (
                  <div key={group} className="mb-6">
                    {groupLabel && (
                      <h3 className="text-lg font-semibold text-white mb-3 px-2">
                        {groupLabel}
                      </h3>
                    )}
                    <div
                      className="
                        grid
                        [grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]
                        gap-4
                        max-w-full
                        overflow-x-hidden
                      "
                    >
                      {groupItems.map((item) => (
                        <Card
                          key={item.id}
                          item={item}
                          onEdit={() => setEditingItem(item)}
                          onUpdated={(u) => updateItem(item.id, u)}
                          onDeleted={(id) => removeItem(id)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* EDIT MODAL */}
        {editingItem && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3">
            <div className="w-full max-w-[520px]">
              <AdvancedAddInline
                item={editingItem}
                mode="edit"
                onCancel={() => setEditingItem(null)}
                onSaved={(updates, deletedId) => {
                  if (deletedId) {
                    removeItem(deletedId);
                    setEditingItem(null);
                    return;
                  }
                  if (updates) updateItem(editingItem.id, updates);
                  setEditingItem(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

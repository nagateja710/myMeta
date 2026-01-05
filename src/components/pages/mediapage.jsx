"use client";

import { useState } from "react";
import { useLibraryStore } from "@/store/useLibraryStore";
import AdvancedAddInline from "@/components/cards/AdvancedAddInline";

import { BACKGROUND_STYLES } from "@/components/media/BackgroundStyles";
import SortControls from "@/components/media/SortControls";
import FilterDropdown from "@/components/media/FilterDropdown";
import FeaturedSection from "@/components/media/FeaturedSection";
import GroupedGrid from "@/components/media/GroupedGrid";

import { useMediaFilters } from "@/components/media/useMediaFilters";
import { useMediaSort } from "@/components/media/useMediaSort";
import { useFeaturedItems } from "@/components/media/useFeaturedItems";

export default function MediaPage({ type }) {
  const items = useLibraryStore((s) => s.items);
  const hydrated = useLibraryStore((s) => s.hydrated);
  const updateItem = useLibraryStore((s) => s.updateItem);
  const removeItem = useLibraryStore((s) => s.removeItem);

  const [editingItem, setEditingItem] = useState(null);
  const [sortBy, setSortBy] = useState("none");
  const [filterOpen, setFilterOpen] = useState(false);

  const bg = BACKGROUND_STYLES[type] || BACKGROUND_STYLES.book;

  // Filter items by media type
  const typeFilteredItems = items.filter((i) => i.media?.type === type);

  // Apply filters using custom hook
  const {
    selectedStatuses,
    selectedRatings,
    selectedAiringStatuses,
    toggleStatus,
    toggleRating,
    toggleAiringStatus,
    clearAllFilters,
    filteredItems,
    activeFilterCount,
  } = useMediaFilters(typeFilteredItems);

  // Get featured items
  const featuredItems = useFeaturedItems(typeFilteredItems);

  // Remove featured items from main grid
  const restItems = filteredItems;

  // Sort/group items
  const sortedItems = useMediaSort(restItems, sortBy);

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

          {/* CONTROLS */}
          <div className="flex items-start gap-3 w-full sm:w-auto">
            <SortControls sortBy={sortBy} setSortBy={setSortBy} />
            <FilterDropdown
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
              selectedStatuses={selectedStatuses}
              selectedRatings={selectedRatings}
              selectedAiringStatuses={selectedAiringStatuses}
              toggleStatus={toggleStatus}
              toggleRating={toggleRating}
              toggleAiringStatus={toggleAiringStatus}
              clearAllFilters={clearAllFilters}
              activeFilterCount={activeFilterCount}
            />
          </div>
        </div>

        {/* EMPTY STATE */}
        {typeFilteredItems.length === 0 && (
          <p className="px-6 text-sm text-gray-400">
            Nothing here yet. Add something ✨
          </p>
        )}

        {/* FEATURED SECTION */}
        <FeaturedSection
          featuredItems={featuredItems}
          onEdit={setEditingItem}
          updateItem={updateItem}
          removeItem={removeItem}
        />

        {/* NO RESULTS AFTER FILTERING */}
        {typeFilteredItems.length > 0 && restItems.length === 0 && (
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

        {/* MAIN GRID */}
        {restItems.length > 0 && (
          <GroupedGrid
            sortedItems={sortedItems}
            sortBy={sortBy}
            onEdit={setEditingItem}
            updateItem={updateItem}
            removeItem={removeItem}
          />
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

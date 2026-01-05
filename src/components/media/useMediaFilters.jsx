import { useState, useMemo } from "react";

export function useMediaFilters(items) {
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedAiringStatuses, setSelectedAiringStatuses] = useState([]);

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

  const filteredItems = useMemo(() => {
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
        if (selectedRatings.includes("unrated") && !item.rating) {
          return true;
        }
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
  }, [items, selectedStatuses, selectedRatings, selectedAiringStatuses]);

  const activeFilterCount =
    selectedStatuses.length +
    selectedRatings.length +
    selectedAiringStatuses.length;

  return {
    selectedStatuses,
    selectedRatings,
    selectedAiringStatuses,
    toggleStatus,
    toggleRating,
    toggleAiringStatus,
    clearAllFilters,
    filteredItems,
    activeFilterCount,
  };
}
import { useState, useMemo } from "react";
import { LEVELS_PER_TYPE,RATING_TYPES  } from "@/components/ui/ratingtypes";
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
  const level = Number(rating);

  setSelectedRatings((prev) => {
    const values = [];

    // Generate 4, 9, 14, 19, ...
    // based on the available rating types.
    for (let r = level; r <= LEVELS_PER_TYPE * RATING_TYPES.length; r += LEVELS_PER_TYPE) {
      values.push(r.toString());
    }

    const isSelected = values.every((r) =>
      prev.includes(r)
    );

    if (isSelected) {
      // Remove all matching levels
      return prev.filter(
        (r) => !values.includes(r)
      );
    }

    // Add all matching levels
    return [
      ...prev.filter(
        (r) => !values.includes(r)
      ),
      ...values,
    ];
  });
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
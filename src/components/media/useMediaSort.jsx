
import { useMemo } from "react";

export function useMediaSort(items, sortBy) {
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

  const sortedItems = useMemo(() => {
    if (sortBy === "none") {
      return { none: items };
    }

    if (sortBy === "status") {
      return groupByStatus(items);
    }

    if (sortBy === "airing_status") {
      return groupByAiringStatus(items);
    }

    if (sortBy === "updated_at") {
      return groupByYear(items);
    }

    return { none: items };
  }, [items, sortBy]);

  return sortedItems;
}
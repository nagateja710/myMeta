import { useMemo } from "react";
import { RATING_TYPES,LEVELS_PER_TYPE } from "@/components/ui/ratingtypes";

function getRatingTypeIndex(rating) {
  if (!rating || rating <= 0) {
    return -1;
  }

  return Math.floor(
    (rating - 1) / LEVELS_PER_TYPE
  );
}

function getRatingLevel(rating) {
  if (!rating || rating <= 0) {
    return 0;
  }

  return (
    ((rating - 1) % LEVELS_PER_TYPE) + 1
  );
}

function getRatingType(rating) {
  const typeIndex = getRatingTypeIndex(rating);

  if (
    typeIndex < 0 ||
    typeIndex >= RATING_TYPES.length
  ) {
    return null;
  }

  return RATING_TYPES[typeIndex];
}

export function useMediaSort(items, sortBy) {
  const sortByUpdatedAt = (items) => {
    return [...items].sort((a, b) => {
      const dateA = a.updated_at
        ? new Date(a.updated_at).getTime()
        : 0;

      const dateB = b.updated_at
        ? new Date(b.updated_at).getTime()
        : 0;

      return dateB - dateA;
    });
  };

  /*
  |--------------------------------------------------------------------------
  | GROUP BY YEAR
  |--------------------------------------------------------------------------
  */

  const groupByYear = (items) => {
    const grouped = {};

    items.forEach((item) => {
      const year =
        item.updated_at &&
        item.status === "completed"
          ? new Date(
              item.updated_at
            ).getFullYear()
          : "Not Rated";

      if (!grouped[year]) {
        grouped[year] = [];
      }

      grouped[year].push(item);
    });

    return grouped;
  };

  /*
  |--------------------------------------------------------------------------
  | GROUP BY STATUS
  |--------------------------------------------------------------------------
  |
  | todo
  | doing
  | unrated
  |
  | Then dynamically create:
  |
  | 5star
  | 4star
  | ...
  | 1star
  |
  | 5heart
  | ...
  |
  | 5diamond
  | ...
  |--------------------------------------------------------------------------
  */

  const groupByStatus = (items) => {
    const grouped = {
      todo: [],
      doing: [],
      unrated: [],
    };

    /*
     * Create rating groups dynamically.
     */
    RATING_TYPES.forEach((type) => {
      for (
        let level = LEVELS_PER_TYPE;
        level >= 1;
        level--
      ) {
        grouped[`${level}${type.id}`] = [];
      }
    });

    items.forEach((item) => {
      if (item.status === "todo") {
        grouped.todo.push(item);
        return;
      }

      if (item.status === "doing") {
        grouped.doing.push(item);
        return;
      }

      /*
       * Completed but no rating.
       */
      if (!item.rating || item.rating <= 0) {
        grouped.unrated.push(item);
        return;
      }

      const type = getRatingType(item.rating);
      const level = getRatingLevel(item.rating);

      /*
       * Invalid / unsupported rating.
       */
      if (!type || !level) {
        grouped.unrated.push(item);
        return;
      }

      const key = `${level}${type.id}`;

      if (grouped[key]) {
        grouped[key].push(item);
      } else {
        grouped.unrated.push(item);
      }
    });

    return grouped;
  };

  /*
  |--------------------------------------------------------------------------
  | GROUP BY RATINGS
  |--------------------------------------------------------------------------
  */

  const groupByRatings = (items) => {
    const grouped = {
      unrated: [],
    };

    /*
     * Dynamically create all rating groups.
     */
    RATING_TYPES.forEach((type) => {
      for (
        let level = LEVELS_PER_TYPE;
        level >= 1;
        level--
      ) {
        grouped[`${level}${type.id}`] = [];
      }
    });

    items.forEach((item) => {
      if (!item.rating || item.rating <= 0) {
        grouped.unrated.push(item);
        return;
      }

      const type = getRatingType(item.rating);
      const level = getRatingLevel(item.rating);

      if (!type || !level) {
        grouped.unrated.push(item);
        return;
      }

      const key = `${level}${type.id}`;

      if (grouped[key]) {
        grouped[key].push(item);
      } else {
        grouped.unrated.push(item);
      }
    });

    return grouped;
  };

  /*
  |--------------------------------------------------------------------------
  | GROUP BY AIRING STATUS
  |--------------------------------------------------------------------------
  */

  const groupByAiringStatus = (items) => {
    const grouped = {
      airing: [],
      completed: [],
      hiatus: [],
      unknown: [],
    };

    items.forEach((item) => {
      const status =
        item.airing_status || "unknown";

      if (grouped[status]) {
        grouped[status].push(item);
      } else {
        grouped.unknown.push(item);
      }
    });

    return grouped;
  };

  /*
  |--------------------------------------------------------------------------
  | SORT
  |--------------------------------------------------------------------------
  */

  const sortedItems = useMemo(() => {
    if (sortBy === "none") {
      return {
        none: items,
      };
    }

    if (sortBy === "status") {
      const sorted =
        sortByUpdatedAt(items);

      return groupByStatus(sorted);
    }

    if (sortBy === "ratings") {
      const sorted =
        sortByUpdatedAt(items);

      return groupByRatings(sorted);
    }

    if (sortBy === "airing_status") {
      return groupByAiringStatus(items);
    }

    if (sortBy === "updated_at") {
      const sorted =
        sortByUpdatedAt(items);

      return groupByYear(sorted);
    }

    return {
      none: items,
    };
  }, [items, sortBy]);

  return sortedItems;
}
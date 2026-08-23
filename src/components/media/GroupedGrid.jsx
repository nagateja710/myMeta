import Card from "@/components/cards/card_mymeta";
import { RATING_TYPES,LEVELS_PER_TYPE } from "@/components/ui/ratingtypes";


/*
|--------------------------------------------------------------------------
| Generate rating group metadata
|--------------------------------------------------------------------------
|
| Star:
|   5star → ★★★★★
|   4star → ★★★★
|   ...
|
| Heart:
|   5heart → ♥♥♥♥♥
|   ...
|
| Diamond:
|   5diamond → ◆◆◆◆◆
|   ...
|
*/

const ratingLabels = {};

RATING_TYPES.forEach((type) => {
  for (let level = LEVELS_PER_TYPE; level >= 1; level--) {
    const singularLabel =
      type.label.endsWith("s")
        ? type.label.slice(0, -1)
        : type.label;

    const label =
      level === 1
        ? singularLabel
        : type.label;

    ratingLabels[`${level}${type.id}`] = {
      icon: Array(level).fill(type.icon).join(" "),
      color: type.color,
    };
  }
});

/*
|--------------------------------------------------------------------------
| GroupedGrid
|--------------------------------------------------------------------------
*/

export default function GroupedGrid({
  sortedItems,
  sortBy,
  onEdit,
  updateItem,
  removeItem,
}) {
  /*
  |--------------------------------------------------------------------------
  | Get group label
  |--------------------------------------------------------------------------
  */

  const getGroupLabel = (group, currentSortBy) => {
    /*
     * STATUS
     */

    if (currentSortBy === "status") {
      const statusLabels = {
        todo: {
          text: "To Do",
          color: "text-white",
        },

        doing: {
          text: "In Progress",
          color: "text-blue-400",
        },

        unrated: {
          text: "Not Rated",
          color: "text-gray-400",
        },
      };

      /*
       * Rating groups
       *
       * 5star
       * 4star
       * ...
       * 5heart
       * ...
       * 5diamond
       * ...
       */

      if (ratingLabels[group]) {
        return ratingLabels[group];
      }

      return (
        statusLabels[group] || {
          text: group,
          color: "text-white",
        }
      );
    }

    /*
     * RATINGS
     */

    if (currentSortBy === "ratings") {
      if (ratingLabels[group]) {
        return ratingLabels[group];
      }

      if (group === "unrated") {
        return {
          text: "Not Rated",
          color: "text-gray-400",
        };
      }

      return {
        text: group,
        color: "text-white",
      };
    }

    /*
     * AIRING STATUS
     */

    if (currentSortBy === "airing_status") {
      const airingLabels = {
        airing: {
          text: "Currently Airing",
          color: "text-green-400",
        },

        completed: {
          text: "Finished Airing",
          color: "text-blue-400",
        },

        hiatus: {
          text: "On Hiatus",
          color: "text-yellow-400",
        },

        unknown: {
          text: "Status Unknown",
          color: "text-gray-400",
        },
      };

      return (
        airingLabels[group] || {
          text: group,
          color: "text-white",
        }
      );
    }

    /*
     * NONE
     */

    if (currentSortBy === "none") {
      return {
        text: "Total Items",
        color: "text-white",
      };
    }

    /*
     * UPDATED AT
     */

    return {
      text: group,
      color: "text-white",
    };
  };

  /*
  |--------------------------------------------------------------------------
  | Sort groups
  |--------------------------------------------------------------------------
  */

  const sortedGroups = Object.keys(
    sortedItems
  ).sort((a, b) => {
    /*
     * Updated year:
     *
     * 2026
     * 2025
     * 2024
     * Unknown
     */

    if (sortBy === "updated_at") {
      if (a === "Unknown") {
        return 1;
      }

      if (b === "Unknown") {
        return -1;
      }

      return parseInt(b) - parseInt(a);
    }

    /*
     * Keep status/rating order generated
     * by useMediaSort.
     */

    return 0;
  });

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="p-2">
      {sortedGroups.map((group) => {
        const groupItems = sortedItems[group];

        /*
         * Don't render empty groups.
         */

        if (
          !groupItems ||
          groupItems.length === 0
        ) {
          return null;
        }

        const groupLabel = getGroupLabel(
          group,
          sortBy
        );

        return (
          <div
            key={group}
            className="mb-6"
          >
            {/* ==========================================================
                GROUP HEADER
                ========================================================== */}

            {groupLabel && (
              <h3
                className="
                  text-lg
                  font-semibold
                  mb-3
                  px-2
                  flex
                  items-center
                  gap-2
                  min-w-0
                "
              >
                {/* Rating icon */}
                {groupLabel.icon && (
                  <span
                    className={`
                      ${groupLabel.color}
                      whitespace-nowrap
                      shrink-0
                    `}
                  >
                    {groupLabel.icon}
                  </span>
                )}

                {/* Group name */}
                <span
                  className={`
                    ${groupLabel.color}
                    truncate
                  `}
                >
                  {groupLabel.text}
                </span>

                {/* Count */}
                <span className="text-white shrink-0">
                  ({groupItems.length}) :
                </span>
              </h3>
            )}

            {/* ==========================================================
                CARD GRID
                ========================================================== */}

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
                  onEdit={() =>
                    onEdit(item)
                  }
                  onUpdated={(u) =>
                    updateItem(
                      item.id,
                      u
                    )
                  }
                  onDeleted={(id) =>
                    removeItem(id)
                  }
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
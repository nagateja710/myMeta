"use client";

import { useState } from "react";
const LEVELS_PER_TYPE = 5;

/*
|--------------------------------------------------------------------------
| RATING TYPES
|--------------------------------------------------------------------------
|
| DB ranges are automatic:
|
| Stars    = 1  - 5
| Hearts   = 6  - 10
| Diamonds = 11 - 15
|
| Add another type and it automatically becomes 16-20.
|--------------------------------------------------------------------------
*/

const RATING_TYPES = [
  {
    id: "star",
    label: "Stars",
    icon: "★",
    emptyIcon: "☆",
    color: "text-yellow-400",
  },
  {
    id: "heart",
    label: "Hearts",
    icon: "♥",
    emptyIcon: "♡",
    color: "text-red-400",
  },
  {
    id: "diamond",
    label: "Diamonds",
    icon: "◆",
    emptyIcon: "◇",
    color: "text-blue-400",
  },
];

const STATUS_LABELS = {
  todo: "To Do",
  doing: "In Progress",
  completed: "Completed",
};

const STATUS_COLORS = {
  todo: "bg-gray-100 text-gray-600",
  doing: "bg-blue-100 text-blue-600",
  completed: "bg-green-100 text-green-600",
};

/*
|--------------------------------------------------------------------------
| DB RATING HELPERS
|--------------------------------------------------------------------------
*/

function getDbRating(typeIndex, level) {
  return typeIndex * LEVELS_PER_TYPE + level;
}

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

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

export default function RatingSelector({
  status,
  rating = 0,
  pathname,
  onStatusChange,
  onRatingChange,
  onDelete,
}) {
  /*
   * null
   *   -> normal state
   *
   * "type"
   *   -> ★ ♥ ◆
   *
   * "level"
   *   -> ☆ ☆ ☆ ☆ ☆
   */
  const [ratingStep, setRatingStep] =
    useState(null);

  const [selectedType, setSelectedType] =
    useState(null);

  const [showStatusMenu, setShowStatusMenu] =
    useState(false);

  /*
   |--------------------------------------------------------------------------
   | CURRENT RATING
   |--------------------------------------------------------------------------
   */

  const currentTypeIndex =
    getRatingTypeIndex(rating);

  const currentLevel =
    getRatingLevel(rating);

  const currentType =
    currentTypeIndex >= 0 &&
    currentTypeIndex < RATING_TYPES.length
      ? RATING_TYPES[currentTypeIndex]
      : null;

  /*
   |--------------------------------------------------------------------------
   | COMPLETE
   |--------------------------------------------------------------------------
   */

  const completeItem = () => {
    onStatusChange?.("completed");

    /*
     * IMPORTANT:
     *
     * Completion does NOT create a rating.
     */
    onRatingChange?.(0);

    /*
     * Now show ONLY:
     *
     * ★   ♥   ◆
     */
    setSelectedType(null);
    setRatingStep("type");
    setShowStatusMenu(false);
  };

  /*
   |--------------------------------------------------------------------------
   | STATUS
   |--------------------------------------------------------------------------
   */

  const handleStatusChange = (newStatus) => {
    if (newStatus === "completed") {
      completeItem();
      return;
    }

    onStatusChange?.(newStatus);
    onRatingChange?.(0);

    setRatingStep(null);
    setSelectedType(null);
    setShowStatusMenu(false);
  };

  /*
   |--------------------------------------------------------------------------
   | SELECT TYPE
   |--------------------------------------------------------------------------
   */

  const handleTypeSelect = (typeIndex) => {
    setSelectedType(typeIndex);

    /*
     * Switch immediately from:
     *
     * ★ ♥ ◆
     *
     * to:
     *
     * ☆ ☆ ☆ ☆ ☆
     */
    setRatingStep("level");
  };

  /*
   |--------------------------------------------------------------------------
   | SELECT LEVEL
   |--------------------------------------------------------------------------
   */

  const handleLevelSelect = (level) => {
    if (selectedType === null) {
      return;
    }

    const dbRating = getDbRating(
      selectedType,
      level
    );

    onRatingChange?.(dbRating);

    /*
     * CLOSE THE RATING PICKER.
     *
     * The card will now display:
     *
     * ♥ ♥ ♥ ♡ ♡
     */
    setRatingStep(null);
    setSelectedType(null);
  };

  /*
   |--------------------------------------------------------------------------
   | RESET
   |--------------------------------------------------------------------------
   */

  const handleReset = () => {
     onStatusChange?.("todo");
    setRatingStep(null);
    setSelectedType(null);
    setShowStatusMenu(false);
    onRatingChange?.(0);


  };

  /*
   |--------------------------------------------------------------------------
   | CURRENT RATING DISPLAY
   |--------------------------------------------------------------------------
   */

  const renderCurrentRating = () => {
    if (!currentType || currentLevel === 0) {
      return null;
    }

    return (
      <span
        className={`
          ${currentType.color}
          whitespace-nowrap
          text-[15px]
        `}
      >
        {Array.from(
          { length: LEVELS_PER_TYPE },
          (_, index) => {
            const level = index + 1;

            return (
              <span key={level}>
                {level <= currentLevel
                  ? currentType.icon
                  : currentType.emptyIcon}
              </span>
            );
          }
        )}
      </span>
    );
  };

  /*
   |--------------------------------------------------------------------------
   | RENDER
   |--------------------------------------------------------------------------
   */

  return (
    <div className="relative">

      {/* ============================================================
          NORMAL STATUS
          ============================================================ */}

      {status !== "completed" && (
        <button
          type="button"
          onClick={() => {
            setShowStatusMenu((v) => !v);
            setRatingStep(null);
          }}
          className={`
            text-[10px]
            px-2
            py-1
            rounded-full
            font-medium
            ${STATUS_COLORS[status]}
          `}
        >
          {STATUS_LABELS[status]}
        </button>
      )}

      {/* ============================================================
          COMPLETED — IMPORTANT
          ============================================================ */}

      {status === "completed" &&
        ratingStep === null && (
          <button
            type="button"
            onClick={() => {
              /*
               * If already rated:
               *
               * ♥ ♥ ♥ ♡ ♡
               *
               * clicking it opens:
               *
               * ♥ ♥ ♥ ♡ ♡
               *
               * for editing.
               */
              if (rating > 0) {
                setSelectedType(
                  currentTypeIndex
                );

                setRatingStep("level");
              } else {
                /*
                 * Unrated completed item:
                 *
                 * ★ ♥ ◆
                 */
                setSelectedType(null);
                setRatingStep("type");
              }
            }}
            className="
              px-2
              py-1
              rounded-full
              bg-white/70
              backdrop-blur
              hover:bg-white
              transition
              whitespace-nowrap
            "
            title="Change rating"
          >
            {rating > 0
              ? renderCurrentRating()
              : "☆"}
          </button>
        )}

      {/* ============================================================
          STATUS MENU
          ============================================================ */}

      {pathname !== "/" &&
        showStatusMenu && (
          <div
            className="
              absolute
              right-0
              mt-1
              w-36
              bg-white
              border
              rounded
              shadow-lg
              z-50
              overflow-hidden
            "
          >
            {["todo", "doing", "completed"].map(
              (s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    handleStatusChange(s)
                  }
                  className="
                    block
                    w-full
                    px-3
                    py-2
                    text-xs
                    text-left
                    hover:bg-gray-100
                  "
                >
                  {STATUS_LABELS[s]}
                </button>
              )
            )}

            <div className="border-t my-1" />

            <button
              type="button"
              onClick={onDelete}
              className="
                block
                w-full
                px-3
                py-2
                text-xs
                text-left
                text-red-600
                hover:bg-red-50
              "
            >
              Delete
            </button>
          </div>
        )}

      {/* ============================================================
          STEP 1
          CHOOSE ★ / ♥ / ◆
          ============================================================ */}

      {status === "completed" &&
        ratingStep === "type" && (
          <div
            className="
              flex
              items-center
              gap-1
              bg-white/80
              backdrop-blur
              rounded-full
              px-1
            "
          >
            {RATING_TYPES.map(
              (type, index) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() =>
                    handleTypeSelect(index)
                  }
                  className="
                    w-5
                    h-7
                    flex
                    items-center
                    justify-center
                    rounded-full
                    transition
                    text-2xl
                  "
                  title={type.label}
                >
                  <span
                    className={type.color}
                  >
                    {type.icon}
                  </span>
                </button>
              )
            )}
          </div>
        )}

      {/* ============================================================
          STEP 2
          CHOOSE 1-5
          ============================================================ */}

      {status === "completed" &&
        ratingStep === "level" &&
        selectedType !== null && (
          <div
            className="
              flex
              items-center
              gap-1
              bg-white/80
              backdrop-blur
              rounded-full
              px-1
            "
          >
            {Array.from(
              {
                length: LEVELS_PER_TYPE,
              },
              (_, index) => {
                const level = index + 1;

                const type =
                  RATING_TYPES[selectedType];

                /*
                 * If editing an existing rating,
                 * show its current filled state.
                 *
                 * Otherwise:
                 *
                 * ☆ ☆ ☆ ☆ ☆
                 */
                const existingLevel =
                  currentTypeIndex ===
                  selectedType
                    ? currentLevel
                    : 0;

                const filled =
                  level <= existingLevel;

                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() =>
                      handleLevelSelect(
                        level
                      )
                    }
                    className="
                      w-8
                      h-8
                      flex
                      items-center
                      justify-center
                      text-2xl
                      leading-none
                    "
                    title={`${type.label} ${level}/5`}
                  >
                    <span
                      className={
                        filled
                          ? type.color
                          : "text-gray-300"
                      }
                    >
                      {filled
                        ? type.icon
                        : type.emptyIcon}
                    </span>
                  </button>
                );
              }
            )}

            {/* RESET */}
            <button
              type="button"
              onClick={handleReset}
              className="
                w-7
                h-7
                flex
                items-center
                justify-center
                text-xs
                text-gray-400
                hover:text-red-500
              "
              title="Reset rating"
            >
              ✕
            </button>
          </div>
        )}
    </div>
  );
}
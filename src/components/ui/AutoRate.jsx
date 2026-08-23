"use client";

import { useMemo, useState } from "react";

const COMPARISON_COUNT = 5;

export default function AutoRate({
  currentItem,
  items = [],
  onComplete,
  onCancel,
}) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState([]);

  /*
   * Pick 5 random OTHER items.
   *
   * Prefer items that already have a rating because
   * their rating is needed for the calculation.
   */
  const comparisonItems = useMemo(() => {
    const candidates = items.filter(
      (item) =>
        item.id !== currentItem.id &&
        Number(item.rating) > 0
    );

    return [...candidates]
      .sort(() => Math.random() - 0.5)
      .slice(0, COMPARISON_COUNT);
  }, [items, currentItem.id]);

  const opponent = comparisonItems[index];

  /*
   * User answer:
   *
   * true  = current item is better
   * false = opponent is better
   */
  const handleAnswer = (currentIsBetter) => {
    const result = {
      opponentId: opponent.id,
      opponentRating: Number(opponent.rating),
      currentIsBetter,
    };

    const newResults = [
      ...results,
      result,
    ];

    setResults(newResults);

    if (
      index + 1 >=
      comparisonItems.length
    ) {
      calculateRating(newResults);
      return;
    }

    setIndex(index + 1);
  };

  /*
   * Calculate the new rating.
   *
   * This uses the ratings of the cards that
   * were compared against.
   */
  const calculateRating = (comparisonResults) => {
    if (!comparisonResults.length) {
      return;
    }

    /*
     * Average opponent rating.
     */
    const averageOpponentRating =
      comparisonResults.reduce(
        (sum, result) =>
          sum + result.opponentRating,
        0
      ) / comparisonResults.length;

    /*
     * Difference from the average.
     *
     * +1 for winning
     * -1 for losing
     */
    const weightedScore =
      comparisonResults.reduce(
        (sum, result) => {
          const opponentRating =
            result.opponentRating;

          /*
           * Strong opponent:
           * beating them matters more.
           */
          const weight =
            opponentRating /
            Math.max(
              averageOpponentRating,
              1
            );

          return (
            sum +
            (result.currentIsBetter
              ? weight
              : -weight)
          );
        },
        0
      );

    /*
     * Normalize to 0-1.
     */
    const normalized =
      (weightedScore +
        comparisonResults.length) /
      (comparisonResults.length * 2);

    /*
     * Convert to 1-15.
     *
     * 1-5   Stars
     * 6-10  Hearts
     * 11-15 Diamonds
     */
    const rating = Math.max(
      1,
      Math.min(
        15,
        Math.round(normalized * 14) + 1
      )
    );

    onComplete?.({
      rating,
      comparisons: comparisonResults,
    });
  };

  /*
   * Not enough rated items.
   */
  if (comparisonItems.length < 1) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 w-64">
        <p className="text-sm text-gray-600">
          Auto Rate needs at least one
          other rated item.
        </p>

        <button
          type="button"
          onClick={onCancel}
          className="mt-3 text-sm text-blue-600"
        >
          Cancel
        </button>
      </div>
    );
  }

  /*
   * Completed.
   */
  if (!opponent) {
    return null;
  }

  return (
    <div
      className="
        bg-white
        rounded-xl
        shadow-lg
        border
        p-4
        w-64
      "
    >
      <div className="text-center mb-3">
        <div className="text-lg font-semibold">
          ⚡ Auto Rate
        </div>

        <div className="text-xs text-gray-500 mt-1">
          Comparison {index + 1} of{" "}
          {comparisonItems.length}
        </div>
      </div>

      <div className="text-center mb-3">
        <p className="text-sm">
          Do you like
          <strong className="mx-1">
            {currentItem.media?.title ||
              currentItem.title}
          </strong>
          more than this?
        </p>
      </div>

      {/* Opponent */}
      <div className="rounded-lg overflow-hidden border mb-3">
        {opponent.media?.cover_url && (
          <img
            src={opponent.media.cover_url}
            alt=""
            className="
              w-full
              h-40
              object-cover
            "
          />
        )}

        <div className="p-2 text-center">
          <div className="font-semibold text-sm">
            {opponent.media?.title ||
              opponent.title}
          </div>

          <div className="text-xs text-gray-500">
            Rating: {opponent.rating}
          </div>
        </div>
      </div>

      {/* Answers */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() =>
            handleAnswer(true)
          }
          className="
            py-2
            rounded-lg
            bg-green-100
            text-green-700
            text-sm
            font-medium
            hover:bg-green-200
          "
        >
          More 👍
        </button>

        <button
          type="button"
          onClick={() =>
            handleAnswer(false)
          }
          className="
            py-2
            rounded-lg
            bg-gray-100
            text-gray-700
            text-sm
            font-medium
            hover:bg-gray-200
          "
        >
          Less 👎
        </button>
      </div>

      <button
        type="button"
        onClick={onCancel}
        className="
          w-full
          mt-2
          py-1
          text-xs
          text-gray-400
          hover:text-gray-600
        "
      >
        Cancel
      </button>
    </div>
  );
}
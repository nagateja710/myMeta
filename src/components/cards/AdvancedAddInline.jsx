
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  addToLibrary,
  updateUserMedia,
  deleteUserMedia,
} from "@/actions/libraryactions";

import {
  Trash2,
  Sparkles,
  X,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import { useLibraryStore } from "@/store/useLibraryStore";
import ProgressSlider from "../progressSlider";

/* ============================================================
   AUTO RATE CONFIG
   ============================================================ */

const AUTO_RATE_COMPARISONS = 7;

/*
 * Convert a pairwise comparison into an estimated rating.
 *
 * If:
 *
 * selected = 4.0
 * opponent = 4.5
 * selected wins
 *
 * We infer that selected is approximately 4.5 + 0.5 = 5.0
 *
 * If selected loses:
 *
 * 4.5 - 0.5 = 4.0
 *
 * The final rating is the average of the five inferred values.
 */
function getComparisonEstimate(opponentRating, selectedWins) {
  const difference = selectedWins ? -0.5 : 0.5;

  return Math.min(
    5,
    Math.max(1, opponentRating + difference)
  );
}

/* ============================================================
   AUTO RATE MODAL
   ============================================================ */

function AutoRateModal({
  item,
  libraryItems,
  onClose,
  onUseRating,
}) {
  const [comparisonNumber, setComparisonNumber] =
    useState(0);

  const [opponent, setOpponent] =
    useState(null);

  /*
   * The selected item's temporary Elo-style rating.
   *
   * This is NOT saved to the database until the
   * user presses "Use Rating".
   */
  const [estimatedRating, setEstimatedRating] =
    useState(3.0);

  const [results, setResults] =
    useState([]);

  const [finished, setFinished] =
    useState(false);

  /*
   * ----------------------------------------------------------
   * GET RATED ITEMS
   * ----------------------------------------------------------
   */

const selectedType = item.media?.type;

const ratedItems = libraryItems.filter(
  (candidate) => {
    if (candidate.id === item.id) {
      return false;
    }

    /*
     * Only compare with the same media type.
     *
     * anime  → anime
     * movie  → movie
     * series → series
     * game   → game
     * book   → book
     */
    if (
      candidate.media?.type !== selectedType
    ) {
      return false;
    }

    const rating = Number(
      candidate.rating
    );

    return (
      Number.isFinite(rating) &&
      rating >= 1 &&
      rating <= 5
    );
  }
);

  /*
   * ----------------------------------------------------------
   * PICK OPPONENT
   * ----------------------------------------------------------
   *
   * We don't want completely random opponents.
   *
   * If current estimate = 3.8,
   * prefer items rated around:
   *
   * 3.5
   * 3.8
   * 4.0
   *
   * This lets the estimate converge faster.
   */

  function pickOpponent(
    currentRating,
    previousResults
  ) {
    if (ratedItems.length === 0) {
      return null;
    }

    const usedIds =
      previousResults.map(
        (result) =>
          result.opponentId
      );

    /*
     * Prefer opponents we haven't used yet.
     */
    let candidates =
      ratedItems.filter(
        (candidate) =>
          !usedIds.includes(
            candidate.id
          )
      );

    /*
     * If we don't have enough unique items,
     * allow reuse.
     */
    if (candidates.length === 0) {
      candidates = ratedItems;
    }

    /*
     * Sort according to rating distance.
     */
    candidates = [...candidates].sort(
      (a, b) => {
        const ratingA = Number(
          a.rating
        );

        const ratingB = Number(
          b.rating
        );

        const distanceA =
          Math.abs(
            ratingA -
              currentRating
          );

        const distanceB =
          Math.abs(
            ratingB -
              currentRating
          );

        return (
          distanceA -
          distanceB
        );
      }
    );

    /*
     * Don't always select the absolute closest.
     *
     * Take the closest 3 and randomly choose
     * between them.
     */
    const pool =
      candidates.slice(
        0,
        Math.min(
          3,
          candidates.length
        )
      );

    return pool[
      Math.floor(
        Math.random() *
          pool.length
      )
    ];
  }

  /*
   * ----------------------------------------------------------
   * INITIAL OPPONENT
   * ----------------------------------------------------------
   */

  useEffect(() => {
    if (
      ratedItems.length > 0 &&
      !opponent &&
      !finished
    ) {
      setOpponent(
        pickOpponent(
          3,
          []
        )
      );
    }
  }, [
    ratedItems.length,
    opponent,
    finished,
  ]);

  /*
   * ----------------------------------------------------------
   * ELO EXPECTED SCORE
   * ----------------------------------------------------------
   *
   * Returns the probability that the selected
   * item should beat the opponent.
   *
   * Example:
   *
   * Selected = 3.0
   * Opponent = 4.5
   *
   * Expected score is low.
   *
   * Selected = 4.5
   * Opponent = 3.0
   *
   * Expected score is high.
   */

  function expectedScore(
    selectedRating,
    opponentRating
  ) {
    /*
     * Standard Elo formula:
     *
     * 1 / (1 + 10^((opponent - selected) / scale))
     *
     * Because our ratings are 1-5 instead of
     * 0-5000, use a smaller scale.
     */
    const SCALE = 1.2;

    return (
      1 /
      (
        1 +
        Math.pow(
          10,
          (
            opponentRating -
            selectedRating
          ) / SCALE
        )
      )
    );
  }

  /*
   * ----------------------------------------------------------
   * ELO UPDATE
   * ----------------------------------------------------------
   */

  function updateElo(
    currentRating,
    opponentRating,
    selectedWon
  ) {
    const expected =
      expectedScore(
        currentRating,
        opponentRating
      );

    /*
     * Actual result:
     *
     * win  = 1
     * loss = 0
     */
    const actual =
      selectedWon ? 1 : 0;

    /*
     * K controls how much one comparison
     * can change the rating.
     *
     * 0.65 works nicely for a 1-5 scale.
     */
    const K = 0.8;

    const nextRating =
      currentRating +
      K *
        (actual - expected);

    /*
     * Keep rating between 1 and 5.
     */
    return Math.min(
      5,
      Math.max(
        0,
        nextRating
      )
    );
  }

  /*
   * ----------------------------------------------------------
   * HANDLE COMPARISON
   * ----------------------------------------------------------
   */

  function choose(
    selectedWon
  ) {
    if (
      !opponent ||
      finished
    ) {
      return;
    }

    const opponentRating =
      Number(
        opponent.rating
      );

    /*
     * Calculate new Elo-style rating.
     */
    const nextRating =
      updateElo(
        estimatedRating,
        opponentRating,
        selectedWon
      );

    /*
     * Store comparison history.
     */
    const result = {
      opponentId:
        opponent.id,

      opponentTitle:
        opponent.media?.title ||
        "Unknown",

      opponentRating,

      selectedWon,

      ratingBefore:
        estimatedRating,

      ratingAfter:
        nextRating,
    };

    const nextResults = [
      ...results,
      result,
    ];

    setResults(
      nextResults
    );

    setEstimatedRating(
      nextRating
    );

    const nextNumber =
      comparisonNumber + 1;

    setComparisonNumber(
      nextNumber
    );

    /*
     * DONE
     */
    if (
      nextNumber >=
      AUTO_RATE_COMPARISONS
    ) {
      setFinished(true);
      setOpponent(null);
      return;
    }

    /*
     * Pick next opponent based on
     * the NEW rating.
     */
    setOpponent(
      pickOpponent(
        nextRating,
        nextResults
      )
    );
  }

  /*
   * ----------------------------------------------------------
   * FINAL RATING
   * ----------------------------------------------------------
   *
   * Unlike the previous implementation,
   * we don't average individual comparisons.
   *
   * The final Elo state IS the rating.
   */

  const finalRating =
    Math.round(
      estimatedRating * 10
    ) / 10;

  /*
   * Existing application uses integer
   * 1-5 ratings.
   */
  const ratingToUse =
    Math.min(
      5,
      Math.max(
        1,
        Math.round(
          finalRating
        )
      )
    );

  /*
   * ----------------------------------------------------------
   * NO COMPARISON DATA
   * ----------------------------------------------------------
   */

  if (
    ratedItems.length === 0
  ) {
    return (
      <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
        <div className="w-full max-w-md rounded-xl bg-white shadow-2xl p-6 text-center">

          <Sparkles
            className="mx-auto text-purple-500 mb-3"
            size={32}
          />

          <h3 className="text-lg font-semibold">
            Auto Rate
          </h3>

          <p className="text-sm text-gray-500 mt-2">
            You need at least one other
            rated item before Auto Rate
            can work.
          </p>

          <p className="text-xs text-gray-400 mt-2">
            Rate another item manually first.
          </p>

          <button
            onClick={onClose}
            className="mt-5 px-4 py-2 rounded-lg bg-black text-white text-sm"
          >
            Close
          </button>

        </div>
      </div>
    );
  }

  /*
   * ----------------------------------------------------------
   * FINISHED SCREEN
   * ----------------------------------------------------------
   */

  if (finished) {
    return (
      <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">

        <div className="w-full max-w-md rounded-xl bg-white shadow-2xl p-5 sm:p-6">

          <div className="flex justify-between items-center">

            <div className="flex items-center gap-2">

              <Sparkles
                size={18}
                className="text-purple-500"
              />

              <h3 className="text-lg font-semibold">
                Auto Rate Complete
              </h3>

            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-black"
            >
              <X size={20} />
            </button>

          </div>

          {/* ITEM */}
          <div className="flex flex-col items-center mt-5">

            <div className="relative w-28 h-40 overflow-hidden rounded-lg shadow">

              <Image
                src={
                  item.media?.cover_url ||
                  "/images/download.png"
                }
                alt={
                  item.media?.title ||
                  "media"
                }
                fill
                className="object-cover"
                sizes="112px"
                unoptimized
              />

            </div>

            <h4 className="font-semibold text-sm mt-3 text-center">
              {item.media?.title}
            </h4>

            {/* RESULT */}
            <div className="mt-5 text-center">

              <p className="text-xs text-gray-500">
                Suggested rating
              </p>

              <div className="text-4xl font-bold text-yellow-400 mt-1">
                
                {finalRating.toFixed(1)}{" "}★
              </div>

              <p className="text-xs text-gray-400 mt-1">
                Based on{" "}
                {AUTO_RATE_COMPARISONS}{" "}
                comparisons
              </p>

            </div>

          </div>

          {/* COMPARISON SUMMARY */}
          {/* <div className="mt-5 rounded-lg bg-gray-50 p-3">

            <p className="text-xs font-medium text-gray-600 mb-2">
              Comparison results
            </p>

            <div className="flex justify-between text-xs">

              <span className="text-green-600">
                Won{" "}
                {
                  results.filter(
                    (r) =>
                      r.selectedWon
                  ).length
                }
              </span>

              <span className="text-red-500">
                Lost{" "}
                {
                  results.filter(
                    (r) =>
                      !r.selectedWon
                  ).length
                }
              </span>

            </div>

          </div> */}

          {/* ACTIONS */}
          <div className="grid grid-cols-2 gap-3 mt-6">

            <button
              onClick={onClose}
              className="py-2 rounded-lg border text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              onClick={() =>
                onUseRating(
                  ratingToUse
                )
              }
              className="py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-800"
            >
              Use {ratingToUse} ★
            </button>

          </div>

        </div>

      </div>
    );
  }

  /*
   * ----------------------------------------------------------
   * WAITING
   * ----------------------------------------------------------
   */

  if (!opponent) {
    return (
      <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center">

        <div className="bg-white rounded-xl p-6 text-sm">
          Preparing comparisons...
        </div>

      </div>
    );
  }

  /*
   * ----------------------------------------------------------
   * COMPARISON UI
   * ----------------------------------------------------------
   */

  return (
    <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">

      <div className="w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-xl bg-white shadow-2xl p-4 sm:p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">

          <div>

            <div className="flex items-center gap-2">

              <Sparkles
                size={18}
                className="text-purple-500"
              />

              <h3 className="font-semibold">
                Auto Rate
              </h3>

            </div>

            <p className="text-xs text-gray-500 mt-1">
              Which one do you like more?
            </p>

          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black"
          >
            <X size={20} />
          </button>

        </div>

        {/* PROGRESS */}
        <div className="mt-4">

          <div className="flex justify-between text-[11px] text-gray-500 mb-1">

            <span>
              Comparison{" "}
              {comparisonNumber + 1}{" "}
              /{" "}
              {AUTO_RATE_COMPARISONS}
            </span>

            {/* <>
              Estimated ★{" "}
              {/* {estimatedRating.toFixed(1)} */}
            

          </div>

          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">

            <div
              className="h-full bg-purple-500 transition-all duration-300"
              style={{
                width: `${
                  (comparisonNumber /
                    AUTO_RATE_COMPARISONS) *
                  100
                }%`,
              }}
            />

          </div>

        </div>

        {/* COMPARISON */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 mt-6">

          {/* SELECTED ITEM */}
          <button
            onClick={() =>
              choose(true)
            }
            className="
              group
              border
              rounded-xl
              p-3
              sm:p-5
              hover:border-purple-500
              hover:bg-purple-50
              transition
              text-center
            "
          >

            <div className="relative mx-auto w-[105px] sm:w-[140px] aspect-[2/3] overflow-hidden rounded-lg shadow">

              <Image
                src={
                  item.media?.cover_url ||
                  "/images/download.png"
                }
                alt={
                  item.media?.title ||
                  "media"
                }
                fill
                className="object-cover"
                sizes="140px"
                unoptimized
              />

            </div>

            <h4 className="font-semibold text-xs sm:text-sm mt-3 line-clamp-2">
              {item.media?.title}
            </h4>
            <p className="text-[10px] text-gray-400 mt-2"> ★ {estimatedRating.toFixed(1)}*</p>
            <div className="mt-3 flex items-center justify-center gap-1 text-xs text-purple-600">

              <ArrowLeft size={14} />

              <span>
                I like this more
              </span>

            </div>

          </button>

          {/* OPPONENT */}
          <button
            onClick={() =>
              choose(false)
            }
            className="
              group
              border
              rounded-xl
              p-3
              sm:p-5
              hover:border-yellow-500
              hover:bg-yellow-50
              transition
              text-center
            "
          >

            <div className="relative mx-auto w-[105px] sm:w-[140px] aspect-[2/3] overflow-hidden rounded-lg shadow">

              <Image
                src={
                  opponent.media?.cover_url ||
                  "/images/download.png"
                }
                alt={
                  opponent.media?.title ||
                  "media"
                }
                fill
                className="object-cover"
                sizes="140px"
                unoptimized
              />

            </div>

            <h4 className="font-semibold text-xs sm:text-sm mt-3 line-clamp-2">
              {opponent.media?.title}
            </h4>

            <p className="text-[10px] text-gray-400 mt-2">
              ★{" "}
              {Number(
                opponent.rating
              ).toFixed(1)}
            </p>

            <div className="mt-2 flex items-center justify-center gap-1 text-xs text-yellow-600">

              <span>
                I like this more
              </span>

              <ArrowRight size={14} />

            </div>

          </button>

        </div>

        {/* CANCEL */}
        <div className="text-center mt-5">

          <button
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Cancel Auto Rate
          </button>

        </div>

      </div>

    </div>
  );
}



/* ============================================================
   ADVANCED ADD INLINE
   ============================================================ */

export default function AdvancedAddInline({
  item,
  mode = "edit",
  onCancel,
  onSaved,
}) {
  const [saving, setSaving] = useState(false);
  const [showAutoRate, setShowAutoRate] =
    useState(false);

  /*
   * Get all library items.
   *
   * Auto Rate uses these to find rated comparison
   * items.
   */
  const libraryItems = useLibraryStore(
    (state) => state.items
  );

  /* ---------------- MEDIA ---------------- */

  const media = item.media || item;

  /* ---------------- FORM ---------------- */

  const [form, setForm] = useState({
    status: item.status || "todo",
    rating: item.rating || 0,

    progress_watched:
      item.progress_watched || 0,

    progress_total:
      item.progress_total || 100,

    synopsis:
      item.synopsis || "",

    notes:
      item.notes || "",

    updated_date: item.updated_at
      ? item.updated_at.slice(0, 10)
      : "",
  });

  /* ============================================================
     HELPERS
     ============================================================ */

  function setStatus(status) {
    setForm((f) => ({
      ...f,
      status,

      /*
       * To Do cannot have a rating.
       */
      rating:
        status === "todo"
          ? 0
          : f.rating,
    }));
  }

  function setRating(rating) {
    setForm((f) => ({
      ...f,
      rating,

      /*
       * Automatically set rated date
       * if one doesn't already exist.
       */
      updated_date:
        f.updated_date ||
        new Date()
          .toISOString()
          .slice(0, 10),
    }));
  }

  /* ============================================================
     SAVE
     ============================================================ */

  async function save() {
    setSaving(true);

    try {
      /* ========================================================
         ADD
         ======================================================== */

      if (mode === "add") {
        const payload = {
          title: media.title,
          type: media.type,
          release_year:
            media.release_year,

          cover_url:
            media.cover_url,

          status: form.status,

          rating:
            form.status === "todo"
              ? 0
              : form.rating,

          progress_watched:
            Number(
              form.progress_watched
            ) || 0,

          progress_total:
            Number(
              form.progress_total
            ) || 0,

          synopsis: form.synopsis,
          notes: form.notes,
        };

        if (
          form.status === "completed"
        ) {
          payload.updated_at =
            new Date().toISOString();
        }

        const created =
          await addToLibrary(
            payload
          );

        onSaved?.(created);
      }

      /* ========================================================
         EDIT
         ======================================================== */

      if (mode === "edit") {
        const payload = {
          status: form.status,

          rating:
            form.status === "todo"
              ? 0
              : form.rating,

          progress_watched:
            Number(
              form.progress_watched
            ) || 0,

          progress_total:
            Number(
              form.progress_total
            ) || 0,

          synopsis: form.synopsis,
          notes: form.notes,
        };

        const becameCompleted =
          form.status ===
            "completed" &&
          item.status !==
            "completed";

        const ratingChanged =
          form.status ===
            "completed" &&
          Number(form.rating) !==
            Number(item.rating);

        const updatedDateChanged =
          form.updated_date !==
          (
            item.updated_at
              ?.slice(0, 10) || ""
          );

        if (
          updatedDateChanged &&
          form.updated_date
        ) {
          payload.updated_at =
            `${form.updated_date}T00:00:00`;
        } else if (
          becameCompleted ||
          ratingChanged
        ) {
          payload.updated_at =
            new Date().toISOString();
        }

        const updated =
          await updateUserMedia(
            item.id,
            payload
          );

        onSaved?.(updated);
      }

      onCancel();
    } catch (err) {
      console.error(
        "Save failed",
        err
      );

      alert(
        "Failed to save changes"
      );
    } finally {
      setSaving(false);
    }
  }

  /* ============================================================
     REMOVE
     ============================================================ */

  async function remove() {
    if (
      !confirm(
        "Remove this from your library?"
      )
    ) {
      return;
    }

    await deleteUserMedia(
      item.id
    );

    onSaved?.(
      null,
      item.id
    );

    onCancel();
  }

  /* ============================================================
     UI
     ============================================================ */

  return (
    <div className="relative z-30 w-full max-w-[560px] rounded-xl border bg-white p-4 shadow">

      {/* ========================================================
          HEADER
          ======================================================== */}

      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold">
          {mode === "add"
            ? "Add to Library"
            : "Update Entry"}
        </h3>

        {mode === "edit" && (
          <button
            onClick={remove}
            className="text-lg hover:text-red-600"
            title="Remove from library"
          >
            <Trash2 />
          </button>
        )}
      </div>

      {/* ========================================================
          BODY
          ======================================================== */}

      <div className="grid gap-3 grid-cols-[80px_1fr]">

        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-3">

          {/* COVER */}
          <Image
            src={
              media.cover_url ||
              "/images/download.png"
            }
            alt={media.title}
            width={120}
            height={180}
            className="rounded-md object-cover aspect-[2/3]"
            unoptimized
          />

          {/* NOTES */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Notes
            </label>

            <textarea
              placeholder="Your thoughts..."
              rows={5}
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  notes: e.target.value,
                }))
              }
              className="w-full rounded-md border px-3 py-2 text-sm resize-none"
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-2 min-w-0">

          {/* MEDIA INFO */}
          <div>
            <h4 className="font-semibold text-sm">
              {media.title}
            </h4>

            {media.release_year && (
              <p className="text-xs text-gray-500">
                {media.release_year}
              </p>
            )}
          </div>

          {/* STATUS */}
          <div className="flex gap-1 flex-wrap">
            {[
              "todo",
              "doing",
              "completed",
            ].map((s) => (
              <button
                key={s}
                onClick={() =>
                  setStatus(s)
                }
                className={`px-2 py-0.5 rounded-full text-xs ${
                  form.status === s
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* ==================================================
              RATING
              ================================================== */}

          {form.status ===
            "completed" && (
            <div>

              {/* MANUAL RATING */}
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(
                  (i) => (
                    <button
                      key={i}
                      onClick={() =>
                        setRating(i)
                      }
                      className={`text-sm ${
                        i <= form.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      title={`Rate ${i}/5`}
                    >
                      ★
                    </button>
                  )
                )}
              </div>

              {/* AUTO RATE */}
              <button
                type="button"
                onClick={() =>
                  setShowAutoRate(true)
                }
                className="
                  mt-1
                  flex
                  items-center
                  gap-1
                  text-xs
                  text-purple-600
                  hover:text-purple-800
                  transition
                "
              >
                <Sparkles size={13} />
                Auto Rate
              </button>
            </div>
          )}

          {/* UPDATED DATE */}
          {form.status ===
            "completed" && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Rated on
              </label>

              <input
                type="date"
                value={form.updated_date}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    updated_date:
                      e.target.value,
                  }))
                }
                className="w-full rounded-md border px-5 py-2 text-sm bg-white"
              />
            </div>
          )}

          {/* SYNOPSIS */}
          <div className="min-w-0">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              (author / director / tags)
            </label>

            <input
              type="text"
              value={form.synopsis}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  synopsis:
                    e.target.value,
                }))
              }
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* ========================================================
          PROGRESS
          ======================================================== */}

      <div>
        <p className="text-xs font-medium text-gray-900">
          Progress:
        </p>

        <p className="text-xs font-medium text-gray-600 mb-1">
          (% / pages / seasons /
          episodes)
        </p>

        <ProgressSlider
          form={form}
          setForm={setForm}
        />
      </div>

      {/* ========================================================
          ACTIONS
          ======================================================== */}

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={onCancel}
          className="text-sm text-gray-500"
        >
          Cancel
        </button>

        <button
          onClick={save}
          disabled={saving}
          className="bg-black text-white px-4 py-1.5 rounded text-sm disabled:opacity-50"
        >
          {saving
            ? "Saving…"
            : "Save"}
        </button>
      </div>

      {/* ========================================================
          AUTO RATE OVERLAY
          ======================================================== */}

      {showAutoRate && (
        <AutoRateModal
          item={item}
          libraryItems={libraryItems}
          onClose={() =>
            setShowAutoRate(false)
          }
          onUseRating={(rating) => {
            /*
             * IMPORTANT:
             *
             * Auto Rate does NOT save directly.
             *
             * It only changes form.rating.
             *
             * The existing Save button will
             * persist everything normally.
             */
            setRating(rating);
            setShowAutoRate(false);
          }}
        />
      )}
    </div>
  );
}


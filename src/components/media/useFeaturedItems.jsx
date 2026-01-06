import { useMemo, useRef,useState } from "react";

/* -----------------------------
   🔢 STABLE RANDOM (per reload)
-------------------------------- */

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getRandomItem(items, rand) {
  if (!items.length) return null;
  return items[Math.floor(rand() * items.length)];
}

/* -----------------------------
   📅 DATE HELPERS
-------------------------------- */

const daysSince = (date) =>
  (Date.now() - new Date(date)) / (1000 * 60 * 60 * 24);

const currentYear = new Date().getFullYear();

/* -----------------------------
   ⭐ FEATURED HOOK
-------------------------------- */

export function useFeaturedItems(filteredItems) {
  // 🔒 Stable random generator (changes only on reload)
  const [rand] = useState(() => mulberry32(Date.now()));


  const featuredItems = useMemo(() => {

    const featured = [];
    const usedIds = new Set();

    const add = (item, tag) => {
      if (!item || usedIds.has(item.id)) return;
      usedIds.add(item.id);
      featured.push({ ...item, featuredTag: tag });
    };

    /* -----------------------------
       1️⃣ LIVE (all doing)
    -------------------------------- */
    filteredItems
      .filter((i) => i.status === "doing")
      .forEach((item) => add(item, "LIVE"));
/* -----------------------------
   RECENT (completed, latest)
-------------------------------- */
const recentCompletedCandidates = filteredItems
  .filter(
    (i) =>
      i.status === "completed" &&
      i.updated_at &&
      !usedIds.has(i.id)
  )
  .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

add(recentCompletedCandidates[0], "RECENT");



    /* -----------------------------
       3️⃣ TOP RATED THIS YEAR
       random among 5★ this year
    -------------------------------- */
    const topRatedThisYearCandidates = filteredItems.filter(
      (i) =>
        i.rating === 5 &&
        i.updated_at &&
        new Date(i.updated_at).getFullYear() === currentYear &&
        !usedIds.has(i.id)
    );

    add(
      getRandomItem(topRatedThisYearCandidates, rand),
      `${currentYear} Meta`
    );

    /* -----------------------------
       4️⃣ TOP RATED (ALL TIME)
    -------------------------------- */
    const topRatedAllTimeCandidates = filteredItems.filter(
      (i) => i.rating === 5 && !usedIds.has(i.id)
    );

    add(
      getRandomItem(topRatedAllTimeCandidates, rand),
      "TOP RATED"
    );

    /* -----------------------------
       5️⃣ UP NEXT (todo, random)
    -------------------------------- */
    const upNextCandidates = filteredItems.filter(
      (i) => i.status === "todo" && !usedIds.has(i.id)
    );

    add(
      getRandomItem(upNextCandidates, rand),
      "UP NEXT"
    );

        /* -----------------------------
       2️⃣ LONG BREAK (random if many)
       todo + added > 90 days
    -------------------------------- */
    const longBreakCandidates = filteredItems.filter(
      (i) =>
        i.status !== "completed" &&
        i.added_at &&
        daysSince(i.added_at) > 90 &&
        !usedIds.has(i.id)
    );

    add(
      getRandomItem(longBreakCandidates, rand),
      "LONG BREAK"
    );

    return featured;
  }, [filteredItems,rand]);

  return featuredItems;
}

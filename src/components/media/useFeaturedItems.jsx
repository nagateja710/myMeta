
import { useMemo } from "react";

const getRandomItem = (items) => {
  if (items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
};

export function useFeaturedItems(filteredItems) {
  const doingItems = useMemo(
    () => filteredItems.filter((i) => i.status === "doing"),
    [filteredItems]
  );

  const featuredItems = useMemo(() => {
    const featured = [];

    // 1. All "doing" items
    doingItems.forEach((item) => {
      featured.push({ ...item, featuredTag: "LIVE" });
    });

    // 2. Recently completed (1 item)
    const recentCompleted = filteredItems
      .filter((i) => i.status === "completed")
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0];

    if (recentCompleted) {
      featured.push({ ...recentCompleted, featuredTag: "RECENT" });
    }

    // 3. Top rated item
    const topRated = getRandomItem(
      filteredItems
        .filter((i) => i.rating && i.rating === 5)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    );

    if (topRated && !featured.find((f) => f.id === topRated.id)) {
      featured.push({ ...topRated, featuredTag: "TOP RATED" });
    }

    // 4. Todo item - "UP NEXT"
    const todoItem = getRandomItem(
      filteredItems.filter(
        (i) => i.status === "todo" && !featured.find((f) => f.id === i.id)
      )
    );

    if (todoItem) {
      featured.push({ ...todoItem, featuredTag: "UP NEXT" });
    }

    return featured;
  }, [filteredItems, doingItems]);

  return featuredItems;
}
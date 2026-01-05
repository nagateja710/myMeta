
import Card from "@/components/cards/card_mymeta";

export default function GroupedGrid({ 
  sortedItems, 
  sortBy, 
  onEdit, 
  updateItem, 
  removeItem 
}) {
  const getGroupLabel = (group, sortBy) => {
    if (sortBy === "status") {
      const statusLabels = {
        todo: "To Do",
        doing: "In Progress",
        "5star": "⭐⭐⭐⭐⭐ 5 Stars",
        "4star": "⭐⭐⭐⭐ 4 Stars",
        "3star": "⭐⭐⭐ 3 Stars",
        "2star": "⭐⭐ 2 Stars",
        "1star": "⭐ 1 Star",
        unrated: "Not Rated",
      };
      return statusLabels[group] || group;
    }

    if (sortBy === "airing_status") {
      const airingLabels = {
        airing: "Currently Airing",
        completed: "Finished Airing",
        hiatus: "On Hiatus",
        unknown: "Status Unknown",
      };
      return airingLabels[group] || group;
    }

    if (sortBy === "none") {
      return null;
    }

    return group;
  };

  const sortedGroups = Object.keys(sortedItems).sort((a, b) => {
    if (sortBy === "updated_at") {
      if (a === "Unknown") return 1;
      if (b === "Unknown") return -1;
      return parseInt(b) - parseInt(a);
    }
    return 0;
  });

  return (
    <div className="p-2">
      {sortedGroups.map((group) => {
        const groupItems = sortedItems[group];
        if (groupItems.length === 0) return null;

        const groupLabel = getGroupLabel(group, sortBy);

        return (
          <div key={group} className="mb-6">
            {groupLabel && (
              <h3 className="text-lg font-semibold text-white mb-3 px-2">
                {groupLabel}
              </h3>
            )}
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
                  onEdit={() => onEdit(item)}
                  onUpdated={(u) => updateItem(item.id, u)}
                  onDeleted={(id) => removeItem(id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
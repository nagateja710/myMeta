
import Card from "@/components/cards/card_mymeta";

const TAG_COLORS = {
  LIVE: "bg-red-500/80 text-white",
  RECENT: "bg-green-500/80 text-white",
  "TOP RATED": "bg-yellow-500/80 text-yellow-900",
  "UP NEXT": "bg-purple-500/80 text-white",
  "LONG BREAK":"bg-lime-500/80 text-white"

};

function getTagColor(tag) {
  return TAG_COLORS[tag] || "bg-sky-500/80 text-white";
}

export default function FeaturedSection({ 
  featuredItems, 
  onEdit, 
  updateItem, 
  removeItem 
}) {
  if (featuredItems.length === 0) return null;

  return (
    <div className="px-6 py-2 bg-black/20 rounded-lg border border-white/30 mx-6 mb-4">
      <h2 className="text-lg font-semibold text-gray-200 mb-2">Featured</h2>

      <div
        className="
          flex 
          gap-4
          overflow-x-auto
          py-2
          rounded-lg
          scrollbar-hide
          snap-x snap-mandatory
        "
      >
        {featuredItems.map((item) => (
          <div key={item.id} className="snap-start shrink-0 w-45">
            <Card
              item={item}
              onEdit={() => onEdit(item)}
              onUpdated={(u) => updateItem(item.id, u)}
              onDeleted={(id) => removeItem(id)}
              tag={item.featuredTag}
              tagcol={getTagColor(item.featuredTag)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
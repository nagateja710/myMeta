import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLibraryStore } from "@/store/useLibraryStore";

export default function SearchOverlay({ loading, results }) {
  const pathname = usePathname();
  const section = pathname.split("/")[1]; // books | anime | movies | games

  const addItem = useLibraryStore((s) => s.addItem);

  function handleAdd(item) {
    addItem({
      id: crypto.randomUUID(),

      // UI data
      cover: item.cover,
      title: item.title,
      subtitle: item.subtitle,
      year: item.year,

      // defaults
      addedAt: new Date().toISOString().slice(0, 10),
      type: section,
      status: "todo",
      rating: 0,
    });
  }


  return (
    <div className="mt-2 w-full rounded-lg border bg-white shadow-xl max-h-[60vh] overflow-y-auto">
      <ul className="divide-y">
        {results.map((item,index) => (
          <li
            key={`${item.id}-${index}`}
            className="flex items-center gap-3 p-3 hover:bg-slate-100"
          >
            <Image
              src={item.cover}
              alt={item.title}
              width={40}
              height={60}
              className="rounded object-cover"
            />

            <div className="flex-1 text-sm">
              <p className="font-medium">{item.title}</p>
              <p className="text-gray-600">{item.subtitle}</p>
              {item.year && (
                <p className="text-xs text-gray-500">{item.year}</p>
              )}
            </div>

            {/* + BUTTON */}
            <button
              onClick={() => handleAdd(item)}
              className="w-7 h-7 rounded-full bg-black text-white text-lg"
              title="Add"
            >
              +
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

import Image from "next/image";

export default function SearchOverlay({ loading, results }) {
  return (
    <div className="mt-2 w-full rounded-lg border bg-white shadow-xl max-h-[60vh] overflow-y-auto">
      <div className="border-b px-4 py-2 text-sm font-medium">
        Search Results
      </div>

      {loading && <p className="px-4 py-3 text-sm">Searching…</p>}

      {!loading && results.length === 0 && (
        <p className="px-4 py-3 text-sm text-gray-500">No results</p>
      )}

      <ul className="divide-y">
        {results.map((item) => (
          <li
            key={item.id}
            className="flex gap-3 p-3 hover:bg-slate-100 cursor-pointer"
          >
            <Image
              src={item.cover}
              alt={item.title}
              width={40}
              height={60}
              className="rounded object-cover"
            />

            <div className="text-sm">
              <p className="font-medium leading-tight">{item.title}</p>
              <p className="text-gray-600">{item.subtitle}</p>
              {item.year && (
                <p className="text-xs text-gray-500">{item.year}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default function SortControls({ sortBy, setSortBy }) {
  return (
    <div className="flex flex-col gap-1 flex-1 sm:flex-initial">
      <label className="text-xs text-gray-400">Sort by:</label>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="
          bg-black/40 
          text-white 
          border 
          border-white/30 
          rounded-lg 
          px-3 
          py-1.5 
          text-sm
          focus:outline-none 
          focus:ring-2 
          focus:ring-white/50
          cursor-pointer
          w-full
        "
      >
        <option value="none">None</option>
        <option value="status">Status </option>
        <option value="airing_status">Airing Status</option>
        <option value="updated_at">Rated Date</option>
      </select>
    </div>
  );
}
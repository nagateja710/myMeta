"use client";

import Search from "@/components/common/search";

export default function MobileSearchBar() {
  return (
    <div className="
      sticky top-0 z-40
      bg-linear-150 from-blue-400 via-purple-400 to-white
      px-4 py-3
      md:hidden
    ">
      <Search />
    </div>
  );
}

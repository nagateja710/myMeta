import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { LibraryHydrator } from "@/store/LibraryHydrator";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-black m-0 p-0">
        <Navbar />

        {/* 🔥 CENTRALIZED LIBRARY CONTROL */}
        <LibraryHydrator />

        <main className=" pb-16 md:pb-0">
          {children}
        </main>
      </body>
    </html>
  );
}

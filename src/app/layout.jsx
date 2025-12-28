import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { LibraryHydrator } from "@/store/LibraryHydrator";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <Navbar />

        {/* 🔥 CENTRALIZED LIBRARY CONTROL */}
        <LibraryHydrator />

        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}

import "./globals.css";
import Navbar from "@/components/layout/Navbar";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Navbar />
        
        <main className="container">{children}</main>
      </body>
    </html>
  );
}



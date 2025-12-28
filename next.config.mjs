/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "www.shutterstock.com",
      "images.unsplash.com",
      "i.imgur.com",
      "cdn.myanimelist.net",
      "m.media-amazon.com",
    ],
    remotePatterns: [
      // 📘 Google Books (HTTP!)
      {
        protocol: "http",
        hostname: "books.google.com",
      },

      // 📘 Sometimes Google Books also uses HTTPS
      {
        protocol: "https",
        hostname: "books.google.com",
      },

      // 🎌 Anime (MyAnimeList)
      {
        protocol: "https",
        hostname: "cdn.myanimelist.net",
      },

      // 🎬 Movies (TMDB)
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },

      // 🎮 Games (RAWG)
      {
        protocol: "https",
        hostname: "media.rawg.io",
      },
    ],
  },
};



export default nextConfig;

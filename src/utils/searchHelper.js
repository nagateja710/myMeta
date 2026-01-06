/* =========================================================
   🔍 SEARCH CONFIG + HELPERS (SINGLE SOURCE OF TRUTH)
   ========================================================= */

   const tempImg="/images/download.png"
/* ---------- BOOKS ---------- */
function mapBookResult(book) {
  return {
    id: book.id,
    cover:
      book.volumeInfo?.imageLinks?.thumbnail || tempImg,
    title: book.volumeInfo?.title || "Unknown title",
    subtitle: book.volumeInfo?.authors?.[0] || "Unknown author",
    year: book.volumeInfo?.publishedDate?.slice(0, 4) || "",
  };
}

/* ---------- MOVIES ---------- */
function mapMovieResult(movie) { 
  return {
   
    id: movie.id,
    cover: movie.poster_path
      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : tempImg,
    title: movie.title || movie.name,
    subtitle: "Movie",
    year: movie.release_date?.slice(0, 4) || "",
  };
}

/* ---------- ANIME ---------- */
function mapAnimeResult(anime) {
  return {
    id: anime.mal_id,
    cover:
      anime.images?.jpg?.image_url || tempImg,
    title: anime.title,
    subtitle: anime.studios?.[0]?.name || "Studio unknown",
    year: anime.year || "",
  };
}

/* ---------- GAMES ---------- */
function mapGameResult(game) {
  
  return {
    id: game.id,
    cover:
      game.background_image || tempImg,
    title: game.name,
    subtitle: "Game",
    year: game.released?.slice(0, 4) || "",
  };
}

/* ---------- SERIES / TV SHOWS ---------- */
function mapSeriesResult(series) {
  
  return {
    id: series.id,
    cover: series.poster_path
      ? `https://image.tmdb.org/t/p/w200${series.poster_path}`
      : "public\images\download.png",
    title: series.name,
    subtitle: "TV Series",
    year: series.first_air_date?.slice(0, 4) || "",
  };
}

/* =========================================================
   🔧 SEARCH CONFIG
   ========================================================= */

export const SEARCH_CONFIG = {
  books: {
    placeholder: "Search books...",
    fetchUrl: (q) =>
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}`,
    extract: (data) =>
      (data.items || []).map(mapBookResult),
  },

  movies: {
    placeholder: "Search movies...",
    fetchUrl: (q) =>
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        q
      )}&api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`,
    extract: (data) =>
      (data.results || []).map(mapMovieResult),
  },

  anime: {
    placeholder: "Search anime...",
    fetchUrl: (q) =>
      `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}`,
    extract: (data) =>
      (data.data || []).map(mapAnimeResult),
  },

  games: {
    placeholder: "Search games...",
    fetchUrl: (q) =>
      `https://api.rawg.io/api/games?search=${encodeURIComponent(
        q
      )}&key=${process.env.NEXT_PUBLIC_RAWG_KEY}`,
    extract: (data) =>
      (data.results || []).map(mapGameResult),
  },

  /* 🆕 SERIES / TV SHOWS */
  series: {
    placeholder: "Search TV series...",
    fetchUrl: (q) =>
      `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
        q
      )}&api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`,
    extract: (data) =>
      (data.results || []).map(mapSeriesResult),
  },
};

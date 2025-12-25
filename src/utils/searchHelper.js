// utils/searchHelper.js

/* ---------- BOOKS ---------- */
export function mapBookResult(book) {
  return {
    id: book.id,
    cover:
      book.volumeInfo?.imageLinks?.thumbnail ||
      "/images/placeholder-book.png",
    title: book.volumeInfo?.title || "Unknown title",
    subtitle: book.volumeInfo?.authors?.[0] || "Unknown author",
    year: book.volumeInfo?.publishedDate?.slice(0, 4) || "",
  };
}

/* ---------- MOVIES ---------- */
export function mapMovieResult(movie) {
     console.log(movie)
  return {
    id: movie.id,
    cover: movie.poster_path
      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
      : "/images/placeholder-movie.png",
    title: movie.title || movie.name,
    subtitle: movie.director || "Movie",
    year: movie.release_date?.slice(0, 4) || "",
  };
}

/* ---------- ANIME ---------- */
export function mapAnimeResult(anime) {
    
  return {
    id: anime.mal_id,
    cover: anime.images?.jpg?.image_url || "/images/placeholder-anime.png",
    title: anime.title,
    subtitle: anime.studios?.[0]?.name || "Studio unknown",
    year: anime.year || "",
  };
}

/* ---------- GAMES ---------- */
export function mapGameResult(game) {
   
  return {
    id: game.id,
    cover: game.background_image || "/images/placeholder-game.png",
    title: game.name,
    subtitle:"Game",
    year: game.released?.slice(0, 4) || "",
  };
}

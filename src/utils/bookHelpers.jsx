// used to uniquely identify a book
export function getBookKey(book) {
  const title = book.volumeInfo?.title?.toLowerCase() ?? "";
  const author = book.volumeInfo?.authors?.[0]?.toLowerCase() ?? "";
  return `${title}-${author}`;
}

// safely get thumbnail
export function getBookCover(book) {
  return (
    book?.volumeInfo?.imageLinks?.thumbnail ||
    book?.volumeInfo?.imageLinks?.smallThumbnail ||
    "/images/placeholder-book.png"
  );
}

export function filterUniqueSearchBooks(books) {
  const map = new Map();

  for (const book of books) {
    const title = book.volumeInfo?.title?.toLowerCase();
    const firstAuthor =
      book.volumeInfo?.authors?.[0]?.toLowerCase() || "unknown";

    if (!title) continue;

    const key = `${title}-${firstAuthor}`;

    // keep only ONE book per (title + first author)
    if (!map.has(key)) {
      map.set(key, book);
    }
  }

  return Array.from(map.values()).slice(0, 5);
}

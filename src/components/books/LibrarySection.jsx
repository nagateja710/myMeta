import BookCard from "./BookCard";

export default function LibrarySection({ books }) {
  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-bold">My books</h2>

      <div
        className="grid gap-10"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        }}
      >
        {books.map((b) => (
          <BookCard key={b.id} book={b} />
        ))}
      </div>
    </section>
  );
}

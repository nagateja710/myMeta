export default function AboutPage() {
  return (
    <div className="min-h-screen  flex items-center justify-center text-center p-10">
      <div >
        <h1 className="text-3xl font-bold">MyMeta</h1>
        <p className="mt-4 text-gray-600 max-w-md">
          Track movies, anime, books, and games in one place.
          Rate, organize, and revisit your media journey.
        </p>

        <div className="mt-6 flex gap-4 justify-center">
          <a href="/signin" className="px-4 py-2 bg-black text-white rounded">
            Sign in
          </a>
          <a href="/signup" className="px-4 py-2 border rounded">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}

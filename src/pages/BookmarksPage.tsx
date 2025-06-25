// pages/BookmarksPage.tsx
import { useEffect, useState } from "react";
import { useBooks } from "../hooks/useBooks";
import BookCard from "../components/BookCard";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BookmarksPage() {
  const { books, loading } = useBooks();
  const [bookmarked, setBookmarked] = useState<string[]>([]);

  useEffect(() => {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith("bookmark-"));
    const ids = keys.filter((k) => localStorage.getItem(k) === "true").map((k) => k.replace("bookmark-", ""));
    setBookmarked(ids);
  }, []);

  const filtered = books?.filter((b) => bookmarked.includes(b.id));

  if (loading) return <div className="p-6">Loading bookmarks...</div>;

  return (
    <section className="p-6 max-w-6xl mx-auto">
        <Link to="/library" className=""><ArrowLeft className="inline w-10 h-10"/></Link>
      {filtered && filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-10 text-center">No bookmarks yet. Start adding some!</p>
      )}
    </section>
  );
}

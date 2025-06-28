import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Book } from "../models/Book";
import type { Author } from "../models/Book";
import BookCard from "../components/BookCard";

// Lucide Icons
import {
  Copy,
  Twitter,
  Facebook,
  Linkedin,
  Heart,
} from "lucide-react";

export default function AuthorPage() {
  const { id } = useParams();
  const [author, setAuthor] = useState<Author | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const { data: authorData, error: authorErr } = await supabase
          .from("authors")
          .select("*")
          .eq("id", id)
          .single();

        if (authorErr) throw authorErr;

        const { data: booksData, error: booksErr } = await supabase
          .from("books")
          .select("*")
          .eq("author", id)
          .order("created_at", { ascending: false });

        if (booksErr) throw booksErr;

        setAuthor(authorData ?? null);
        setBooks(booksData ?? []);
      } catch (err: any) {
        console.error(err);
        setError("Something went wrong while loading author data.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading && !author) {
    return <p className="p-6 text-center text-gray-500 text-sm">Loading author profile...</p>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!author && !loading) {
    return (
      <div className="p-6 text-center">
        <img
          src="https://illustrations.popsy.co/gray/ghost.svg"
          alt="Not found"
          className="w-40 mx-auto mb-4"
        />
        <p className="text-xl font-semibold">Author not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-14">
      {/* Author Profile Section */}
      <section className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-[#fdfbf7] p-8 rounded-3xl shadow-sm transition">
        <img
          src={author?.avatar_url || "https://illustrations.popsy.co/gray/person-sitting.svg"}
          alt={author?.pen_name}
          className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover shadow"
        />
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-bearBrown">{author?.pen_name}</h1>
            <p className="text-gray-700 whitespace-pre-line text-base leading-relaxed mt-2">
              {author?.bio || "No bio available."}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-sm rounded-full bg-white shadow hover:bg-bearBrown hover:text-white transition"
            >
              <Copy size={18} /> Copy Link
            </button>

            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=Check out ${author?.pen_name}'s books on BearStacks!`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-[#1DA1F2] hover:opacity-80"
            >
              <Twitter size={18} /> Share
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-[#1877F2] hover:opacity-80"
            >
              <Facebook size={18} /> Facebook
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-[#0077b5] hover:opacity-80"
            >
              <Linkedin size={18} /> LinkedIn
            </a>

            <button className="inline-flex items-center gap-2 px-4 py-1.5 text-sm rounded-full bg-red-600 text-white hover:bg-opacity-90 transition">
              <Heart size={18} /> Follow
            </button>
          </div>
        </div>
      </section>

      {/* Books List Section */}
      <section>
        <h2 className="text-2xl font-semibold text-bearBrown mb-6 text-center md:text-left">
          Books by {author?.pen_name}
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading books…</p>
        ) : books.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center mt-10">
            <img
              src="https://illustrations.popsy.co/gray/book-stack.svg"
              alt="No books"
              className="w-56 mx-auto mb-4"
            />
            <p className="text-gray-500 text-sm">This author hasn’t published any books yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}

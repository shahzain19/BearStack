import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Book } from "../models/Book";
import type { Author } from "../models/Book";
import BookCard from "../components/BookCard";

export default function AuthorPage() {
  const { id } = useParams(); // this is the author's ID (text)
  const [author, setAuthor] = useState<Author | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      // Get the author by id (text)
      const { data: authorData } = await supabase
        .from("authors")
        .select("*")
        .eq("id", id)
        .single();

      // Get books where book.author === author.id
      const { data: booksData } = await supabase
        .from("books")
        .select("*")
        .eq("author", id) // author is a text field storing the author's id
        .order("created_at", { ascending: false });

      setAuthor(authorData ?? null);
      setBooks(booksData ?? []);
      setLoading(false);
    }

    load();
  }, [id]);

  if (!author) return <p className="p-6 text-center">Author not found.</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      {/* Author Info */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-[#fdfbf7] p-6 rounded-xl shadow">
        <img
          src={author.avatar_url || "/default-avatar.png"}
          alt={author.pen_name}
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl font-bold text-bearBrown">
            {author.pen_name}
          </h1>
          <p className="text-gray-700 whitespace-pre-line">
            {author.bio || "No bio available."}
          </p>
        </div>
      </div>

      {/* Books */}
      <div>
        {loading ? (
          <p className="text-center">Loading books…</p>
        ) : books.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center mt-10">
            <img
              src="https://illustrations.popsy.co/gray/book-stack.svg"
              alt="No books"
              className="w-60 mx-auto mb-4"
            />
            <p className="opacity-60">
              This author hasn’t published any books yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

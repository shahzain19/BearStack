import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import BookCard from "../components/BookCard";

export default function ShelfView() {
  const { id } = useParams();
  const [shelf, setShelf] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShelfAndBooks = async () => {
      setLoading(true);
      setError("");

      const { data: shelfData, error: shelfError } = await supabase
        .from("shelves")
        .select("id, name")
        .eq("id", id)
        .single();

      if (shelfError || !shelfData) {
        setError("Shelf not found.");
        setLoading(false);
        return;
      }

      setShelf(shelfData);

      const { data: shelfBooks, error: bookError } = await supabase
        .from("shelf_books")
        .select(`
          book_id,
          books:book_id (
            id,
            title,
            cover_url,
            genre
          )
        `)
        .eq("shelf_id", id);

      if (bookError) {
        setError("Failed to fetch books.");
        setLoading(false);
        return;
      }

      const bookList = (shelfBooks || []).map((sb) => sb.books);
      setBooks(bookList);
      setFilteredBooks(bookList);
      setLoading(false);
    };

    fetchShelfAndBooks();
  }, [id]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(query)
    );
    setFilteredBooks(filtered);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg font-[Inter]">
        📚 Loading your cozy shelf...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg font-[Inter]">
        {error}
      </div>
    );

  if (!shelf)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg font-[Inter]">
        Shelf not found.
      </div>
    );

  return (
    <section className="min-h-screen px-4 sm:px-8 py-16 font-[Inter] text-[#4e3b2c] bg-[#fffaf5]">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Shelf Header */}
        <div className="sticky top-0 bg-[#f9f1e7] z-10 py-6 px-4 rounded-xl shadow-md border border-[#e9d9ca] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#7a4f35]">
              {shelf.name}
            </h1>
            <p className="text-sm text-[#a88b75] italic">
              Your hand-picked collection of tales 🍵📖
            </p>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search books..."
            className="px-4 py-2 w-full sm:w-64 rounded-lg border border-[#d5c4b6] bg-white shadow-sm text-[#4e3b2c] focus:outline-none focus:ring-2 focus:ring-[#dec2a2]"
          />
        </div>

        {/* Book Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center mt-24 text-[#b9a89b] text-xl italic space-y-4">
            <div>🧺 This shelf feels empty... time to add some stories.</div>
            <Link
              to="/library"
              className="inline-block px-6 py-2 rounded-full bg-[#7a4f35] text-white shadow hover:bg-[#693f2b] transition"
            >
              Browse Library →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="transition-transform hover:scale-[1.04] hover:-translate-y-1 duration-300"
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

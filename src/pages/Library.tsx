import { useBooks } from "../hooks/useBooks";
import BookGrid from "../components/BookGrid";
import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  SortAsc,
  SortDesc,
  Search,
  Filter,
  Star,
  X,
  Plus,
  Bookmark,
} from "lucide-react";
import type { Book } from "../models/Book";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";

interface BookWithExtras extends Book {
  genre?: string;
  created_at?: string;
  is_favorite?: boolean;
}

export default function Library() {
  const { books: rawBooks, loading } = useBooks();
  const books = rawBooks as unknown as BookWithExtras[];
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showFavorites, setShowFavorites] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userCreatedAt, setUserCreatedAt] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRoleAndCreatedAt = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("role, created_at")
          .eq("id", user.id)
          .single();

        if (!error && data) {
          setUserRole(data.role);
          setUserCreatedAt(data.created_at);
        }
      }
    };

    fetchUserRoleAndCreatedAt();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const genres = useMemo(() => {
    const allGenres = new Set(
      books.map((book) => book.genre?.trim() || "Unknown")
    );
    return ["All", ...Array.from(allGenres)];
  }, [books]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleClearFilters = () => {
    setQuery("");
    setSelectedGenre("All");
    setSortOrder("desc");
    setShowFavorites(false);
  };

  const filteredBooks = useMemo(() => {
    let result = books;

    result = result.filter((book) => {
      const isApproved = book.is_accepted === "yes";
      if (!isApproved) return false;

      if (!userCreatedAt) return true;

      const bookCreatedAt = book.created_at
        ? new Date(book.created_at).getTime()
        : 0;
      const userCreated = new Date(userCreatedAt).getTime();

      return bookCreatedAt <= userCreated || bookCreatedAt > userCreated;
    });

    if (query) {
      result = result.filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (selectedGenre !== "All") {
      result = result.filter((book) => book.genre === selectedGenre);
    }

    if (showFavorites) {
      result = result.filter((book) => book.is_favorite);
    }

    result.sort((a, b) => {
      const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
      return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
    });

    return result;
  }, [books, query, selectedGenre, sortOrder, showFavorites, userCreatedAt]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-4xl font-semibold text-bearBrown inline gap-4">
          <img src="/icon.png" alt="BearStacks Logo" className="inline gap-6 w-12 h-12" />
          BearStacks
        </h1>
        <div className="flex gap-3 flex-wrap">
          {userRole === "admin" && (
            <Link
              to="/admin-approval"
              className="flex items-center gap-2 text-sm border border-[#aaa] px-4 py-2 rounded-full bg-white shadow-sm transition hover:bg-gray-100 hover:text-[#000] hover:border-[#000]"
            >
              <LayoutDashboard size={16} />
              Admin Dashboard
            </Link>
          )}
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm border border-[#aaa] px-4 py-2 rounded-full bg-white shadow-sm transition hover:bg-gray-100 hover:text-[#000] hover:border-[#000]"
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
          <Link
            to="/bookmarks"
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-white hover:bg-bearBrown hover:text-amber-700 shadow-sm transition"
          >
            <Bookmark size={16} />
            Bookmarks
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm border border-red-400 text-red-500 px-4 py-2 rounded-full hover:bg-red-500 hover:text-white shadow-sm transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Filters */}
      <div
        className={`grid md:grid-cols-4 gap-4 mb-3 sticky top-2 bg-white/80 backdrop-blur-lg p-4 rounded-xl transition-shadow z-10 ${
          scrollY > 10 ? "shadow-lg" : ""
        }`}
      >
        <label className="relative w-full">
          <input
            type="text"
            placeholder="Search cozy reads..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-bearBrown/30"
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
        </label>

        <label className="relative w-full">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-xl border border-gray-200 shadow-sm"
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <Filter
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
        </label>

        <button
          onClick={() => setShowFavorites((prev) => !prev)}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border transition shadow-sm ${
            showFavorites
              ? "bg-yellow-100 border-yellow-300 text-yellow-800"
              : "border-gray-200 hover:bg-gray-100"
          }`}
        >
          <Star size={16} />
          {showFavorites ? "Favorites Only" : "All Books"}
        </button>

        <button
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-gray-200 shadow-sm hover:bg-gray-100"
        >
          {sortOrder === "asc" ? <SortAsc size={16} /> : <SortDesc size={16} />}
          {sortOrder === "asc" ? "↑ Newest First" : "↓ Oldest First"}
        </button>
      </div>

      {/* Clear & Add */}
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={handleClearFilters}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-black transition"
        >
          <X size={16} />
          Clear Filters
        </button>
      </div>

      {/* Genre Chips */}
      <div className="flex gap-2 flex-wrap mb-4">
        {genres
          .filter((g) => g !== "All")
          .map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-1 text-sm rounded-full border shadow-sm transition ${
                selectedGenre === genre
                  ? "bg-bearBrown text-white border-bearBrown"
                  : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
              }`}
            >
              {genre}
            </button>
          ))}
      </div>

      {/* Book Count */}
      <p className="text-sm text-gray-500 mb-4">
        Showing <strong>{filteredBooks.length}</strong> of{" "}
        <strong>{books.length}</strong> books
      </p>

      {/* Book Grid */}
      {loading ? (
        <p className="text-center py-12 text-gray-500 animate-pulse">
          Loading your cozy library…
        </p>
      ) : filteredBooks.length > 0 ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          <BookGrid books={filteredBooks} />
        </motion.div>
      ) : (
        <div className="text-center mt-12">
          <img
            src="https://illustrations.popsy.co/gray/book-stack.svg"
            alt="No books"
            className="w-60 mx-auto mb-4 opacity-80"
          />
          <p className="text-gray-500 mb-4">
            No matching books found. Try another genre or add new ones!
          </p>
          <Link
            to="/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bearBrown text-white hover:opacity-90 transition"
          >
            <Plus size={16} />
            Add New Book
          </Link>
        </div>
      )}
    </div>
  );
}

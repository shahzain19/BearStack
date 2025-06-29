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
  X,
  Plus,
  Bookmark,
  User,
  LampDesk,
} from "lucide-react";
import type { Book } from "../models/Book";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import { setTheme, getStoredTheme } from "../contexts/ThemeContext";

export function ThemeToggle() {
  const [theme, setThemeState] = useState<"light" | "dark" | "cozy">("light");

  useEffect(() => {
    const stored = getStoredTheme();
    setTheme(stored);
    setThemeState(stored);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as "light" | "dark" | "cozy";
    setTheme(selected);
    setThemeState(selected);
  };

  return (
    <select
      value={theme}
      onChange={handleChange}
      className="border px-3 py-1 rounded-full text-sm bg-[var(--card)] text-[var(--text)]"
    >
      <option value="light">☀️ Light</option>
      <option value="dark">🌙 Dark</option>
      <option value="cozy">🍂 Cozy</option>
    </select>
  );
}


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
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".avatar-dropdown")) {
        setAvatarDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
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
      const q = query.toLowerCase();
      result = result.filter((book) => {
        return (
          book.title?.toLowerCase().includes(q) ||
          book.summary?.toLowerCase().includes(q) ||
          book.author_pen_name?.toLowerCase().includes(q)
        );
      });
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
    <div className="max-w-[1700px] mx-auto px-4 md:px-8 py-8 font-[Inter] leading-relaxed bg-white min-h-screen">
      <motion.div
        className="flex justify-between items-center mb-12 flex-wrap gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-4">
          BearStacks
        </h1>

        <div className="flex gap-3 flex-wrap">
          {userRole === "admin" && (
            <Link
              to="/admin-approval"
              className="flex items-center gap-2 text-sm border border-[#aaa] px-4 py-2 rounded-full bg-white shadow-sm transition hover:bg-gray-100 hover:text-black hover:border-black"
            >
              <LayoutDashboard size={16} /> Admin Dashboard
            </Link>
          )}
          <Link
            to="/nooks"
            className="flex text-gray-500 items-center gap-2 text-sm hover:bg-gray-100 hover:text-yellow-400 hover:border-black"
          >
            <LampDesk size={35} />
          </Link>
          <Link
            to="/dashboard"
            className="flex text-gray-500 items-center gap-2 text-sm hover:bg-gray-100 hover:text-black hover:border-black"
          >
            <LayoutDashboard size={35} />
          </Link>
          <Link
            to="/bookmarks"
            className="flex text-gray-500 items-center gap-2 text-sm px-4 py-2 rounded-full bg-white hover:text-gray-900 shadow-sm transition"
          >
            <Bookmark size={35} />
          </Link>

          <div className="relative  avatar-dropdown">
            <button
              onClick={() => setAvatarDropdownOpen((prev) => !prev)}
              className="flex text-gray-400 items-center gap-2 text-sm px-4 py-2 rounded-full bg-white hover:text-gray-900 shadow-sm transition cursor-pointer"
            >
              <User size={47} />
            </button>

            {avatarDropdownOpen && (
              <div className="absolute right-0 mt-2 w-88 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                <ul className="flex flex-col text-sm">
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-3 hover:bg-gray-50 transition"
                    >
                      View Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/settings"
                      className="block px-4 py-3 hover:bg-gray-50 transition"
                    >
                      Settings
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition text-red-500"
                    >
                      Log Out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div
        className={`grid md:grid-cols-4 gap-4 mb-10 sticky top-2 bg-white/80 backdrop-blur-lg p-4 rounded-xl transition-shadow z-10 ${
          scrollY > 10 ? "shadow-lg" : ""
        }`}
      >
        <label className="relative w-full">
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 focus:outline-none htext-base rounded-xl border-none"
          />
          <Search
            className="inline items-center absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={24}
          />
        </label>

        <label className="relative w-full">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-xl border border-gray-200 shadow-sm text-base"
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
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-gray-200 shadow-sm hover:bg-gray-100 text-base"
        >
          {sortOrder === "asc" ? <SortAsc size={16} /> : <SortDesc size={16} />}
          {sortOrder === "asc" ? "↑ Newest First" : "↓ Oldest First"}
        </button>
      </div>

      {/* Clear Filters & Add */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleClearFilters}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-black transition"
        >
          <X size={16} /> Clear Filters
        </button>
      </div>

      {/* Genre Chips */}
      <div className="flex gap-3 flex-wrap mb-10">
        {["Fantasy", "Technology", "Adventure", "Mystery"].map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-4 py-1 text-sm rounded-full border shadow-sm transition ${
              selectedGenre === genre
                ? "text-black border-gray-700"
                : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Book Count */}
      <p className="text-base text-gray-500 mb-10">
        Showing <strong>{filteredBooks.length}</strong> of{" "}
        <strong>{books.length}</strong> books
      </p>

      {/* Book Grid */}
      {loading ? (
        <p className="text-center py-16 text-gray-500 text-lg animate-pulse leading-relaxed">
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
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <img
            src="https://illustrations.popsy.co/gray/book-stack.svg"
            alt="No books"
            className="w-60 mx-auto mb-6 opacity-80"
          />
          <p className="text-gray-500 mb-6 text-lg leading-relaxed">
            No matching books found. Try another genre or add new ones!
          </p>
          <Link
            to="/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-bearBrown text-white hover:opacity-90 transition text-sm"
          >
            <Plus size={16} /> Add New Book
          </Link>
        </motion.div>
      )}
    </div>
  );
}

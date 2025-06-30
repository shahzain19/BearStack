import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Plus, User } from "lucide-react";
import { supabase } from "../lib/supabase";

import { useAuthor } from "../hooks/useAuthor";
import { useMyBooks } from "../hooks/useMyBooks";
import BookGrid from "../components/BookGrid";

export default function AuthorDashboard() {
  const { author, loading: authorLoading } = useAuthor();
  const { books: rawBooks, loading: booksLoading } = useMyBooks();
  const books = rawBooks ?? [];

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const total = books.length;
    const published = books.filter((b) => b.status === "published").length;
    const drafts = total - published;
    const reviews = books.reduce(
      (sum, b) => sum + (b.book_reviews?.count || 0),
      0
    );
    const comments = books.reduce(
      (sum, b) => sum + (b.book_comments?.count || 0),
      0
    );
    return { total, published, drafts, reviews, comments };
  }, [books]);

  const filteredBooks = useMemo(() => {
    let list = books.filter((b) =>
      b.title.toLowerCase().includes(query.toLowerCase())
    );
    if (statusFilter !== "all") {
      list = list.filter((b) => b.status === statusFilter);
    }
    return list;
  }, [books, query, statusFilter]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (authorLoading || booksLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6 animate-pulse">
        <div className="h-8 w-1/3 bg-gray-200 rounded" />
        <div className="h-24 bg-gray-200 rounded" />
        <div className="h-10 w-1/4 bg-gray-200 rounded" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-56 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 font-poppins space-y-10">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-bearBrown">📚 Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/dashboard/profile"
            className="btn-secondary flex items-center gap-1"
          >
            <User size={16} /> Profile
          </Link>
          <Link
            to="/dashboard/new"
            className="btn-primary flex items-center gap-1"
          >
            <Plus size={16} /> New Book
          </Link>
          <button
            onClick={handleLogout}
            className="btn-danger flex items-center gap-1"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* No Author Profile View */}
      {!author && (
        <div className="bg-white border border-yellow-200 p-6 rounded-xl shadow-inner space-y-4">
          <h2 className="text-xl font-semibold text-yellow-800">
            🐻 Welcome to the Library Platform!
          </h2>
          <p className="text-gray-700">
            You haven't created your author profile yet, but you’re still
            welcome here! You can:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>🖊️ Create an author profile to start writing books.</li>
            <li>📖 Explore the library and read published books.</li>
            <li>✨ Personalize your dashboard later anytime.</li>
          </ul>
          <div className="flex gap-3 mt-4">
            <Link to="/dashboard/profile" className="btn-primary">
              ➕ Create Author Profile
            </Link>
            <Link to="/library" className="btn-secondary">
              🌟 Browse Library
            </Link>
          </div>
        </div>
      )}

      {/* Author Profile Section */}
      {author && (
        <section>
          <h2 className="text-2xl font-bold mb-4">👤 Author Profile</h2>
          <div className="bg-polarWhite rounded-2xl shadow p-6 flex items-start gap-6">
            <img
              src={author.avatar_url || "/default-avatar.png"}
              alt={author.pen_name}
              className="w-20 h-20 rounded-full object-cover border"
            />
            <div>
              <p className="mb-1 text-lg">
                📖 Pen Name:{" "}
                <strong className="text-bearBrown">{author.pen_name}</strong> (
                <Link to="/dashboard/profile" className="underline">
                  edit
                </Link>
                )
              </p>
              <p className="text-gray-700 whitespace-pre-line">
                {author.bio || "No bio added yet."}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      {books.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
          <StatCard label="Total Books" value={stats.total} />
          <StatCard label="Published" value={stats.published} />
          <StatCard label="Drafts" value={stats.drafts} />
          <StatCard label="Reviews" value={stats.reviews} />
          <StatCard label="Comments" value={stats.comments} />
        </div>
      )}

      {/* Filters */}
      {books.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <input
            type="text"
            placeholder="🔍 Search my books…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-bearBrown/30"
          />
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | "published" | "draft")
            }
            className="w-full sm:w-48 px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      )}

      {/* Books */}
      <section>
        <h2 className="text-2xl font-bold mb-3">📚 My Books</h2>
        {books.length === 0 ? (
          <div className="text-center space-y-4 py-12 bg-white/60 rounded-xl shadow-inner">
            <p className="text-gray-500">
              You haven’t written or published any books yet.
            </p>
            <Link to="/dashboard/new" className="btn-primary">
              ➕ Write your first book
            </Link>
          </div>
        ) : filteredBooks.length > 0 ? (
          <BookGrid books={filteredBooks} />
        ) : (
          <div className="text-center text-gray-500 mt-6">
            No books match your current search or filter.
          </div>
        )}
      </section>
    </div>
  );
}

/* 🧩 StatCard Component */
function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-polarWhite rounded-xl shadow py-5 px-3">
      <p className="text-3xl font-bold text-bearBrown">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}

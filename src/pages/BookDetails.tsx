import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useBooks } from "../hooks/useBooks";
import BookCover from "../components/BookCover";
import { BookOpen, ArrowLeft, Heart, Star, Copy, Share } from "lucide-react";
import AddToShelf from "../components/AddToShelf";
import ReviewSection from "../components/ReviewSection";
import CommentSection from "../components/CommentSection";
import { motion } from "framer-motion";

// Genre-based aura themes
const genreThemes: Record<string, string> = {
  fantasy: "bg-gradient-to-br from-[#fbeec1] to-[#fffaf0]",
  horror: "bg-gradient-to-br from-[#1f1f1f] to-[#3c2c2c] text-white",
  romance: "bg-gradient-to-br from-pink-100 to-pink-50",
  mystery: "bg-gradient-to-br from-[#e6e0c3] to-[#f9f6ee]",
  default: "bg-gradient-to-br from-[#fffdf7] to-[#f9f5ec]",
};

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { book, loading } = useBooks(id);
  const { books: allBooks } = useBooks();

  const [isFav, setIsFav] = useState(false);
  const [rating, setRating] = useState(0);
  const [showFull, setShowFull] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const added = book?.created_at
    ? new Date(book.created_at).toLocaleDateString()
    : null;

  const related = useMemo(() => {
    if (!book || !allBooks) return [];
    return allBooks
      .filter((b) => b.genre === book.genre && b.id !== book.id)
      .slice(0, 4);
  }, [allBooks, book]);

  useEffect(() => {
    if (!book) return;
    setIsBookmarked(localStorage.getItem(`bookmark-${book.id}`) === "true");
    setIsFav(localStorage.getItem(`fav-${book.id}`) === "true");
    setRating(Number(localStorage.getItem(`rating-${book.id}`) || 0));
    setProgress(Number(localStorage.getItem(`progress-${book.id}`) || 0));
  }, [book]);

  useEffect(() => {
    if (book) localStorage.setItem(`bookmark-${book.id}`, String(isBookmarked));
  }, [isBookmarked, book]);

  useEffect(() => {
    if (book) localStorage.setItem(`fav-${book.id}`, String(isFav));
  }, [isFav, book]);

  useEffect(() => {
    if (book) localStorage.setItem(`rating-${book.id}`, String(rating));
  }, [rating, book]);

  useEffect(() => {
    if (book) localStorage.setItem(`progress-${book.id}`, String(progress));
  }, [progress, book]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const shareBook = async () => {
    try {
      if (navigator.share && book) {
        await navigator.share({
          title: book.title,
          text: book.summary,
          url: window.location.href,
        });
      } else {
        alert("Sharing not supported in this browser.");
      }
    } catch {}
  };

  if (loading) {
    return (
      <div className="animate-pulse p-6 max-w-4xl mx-auto">
        <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
        <div className="h-80 bg-gray-200 rounded mb-6" />
        <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-full bg-gray-200 rounded" />
      </div>
    );
  }

  if (!book) return <p className="p-6 text-center">Book not found.</p>;

  const genreKey = book.genre?.toLowerCase() || "default";
  const genreAura = genreThemes[genreKey];

  return (
    <section
      className={`relative max-w-6xl mx-auto my-10 rounded-3xl shadow-xl overflow-hidden ${genreAura}`}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-72 h-72 bg-yellow-100/40 rounded-full blur-3xl -top-10 -left-10" />
        <div className="absolute w-72 h-72 bg-[#ffeccc]/30 rounded-full blur-3xl bottom-0 -right-10" />
      </div>

      <div className="relative z-10 p-6 md:p-10">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/library")}
            className="inline-flex items-center gap-1 text-bearBrown/70 hover:text-bearBrown transition"
          >
            <ArrowLeft size={16} /> Back to Library
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Book Cover */}
          <div className="relative mx-auto md:mx-0 w-64 shrink-0">
            <motion.div
              initial={{ rotateY: 0, rotateX: 0 }}
              whileHover={{ rotateY: 6, rotateX: -3 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="rounded-2xl overflow-hidden shadow-xl ring-4 ring-[#fbeec1]/30"
            >
              <BookCover book={book} className="w-full rounded-2xl" />
            </motion.div>

            {isFav && (
              <Heart
                size={24}
                className="absolute -top-3 -right-3 text-red-600 drop-shadow"
                fill="currentColor"
              />
            )}
          </div>

          {/* Book Info */}
          <article className="flex-1 space-y-5">
            <header className="space-y-1">
              <div className="flex items-start gap-3">
                <h1 className="text-4xl/tight font-bold text-bearBrown flex-1">
                  {book.title}
                </h1>
                <button
                  onClick={() => setIsFav((f) => !f)}
                  aria-label="Favorite"
                >
                  <Heart
                    size={28}
                    fill={isFav ? "currentColor" : "none"}
                    strokeWidth={1.7}
                    className="hover:text-red-600 transition"
                  />
                </button>
                <button
                  onClick={() => setIsBookmarked((b) => !b)}
                  aria-label="Bookmark"
                >
                  <Star
                    size={24}
                    className="hover:text-blue-600 transition ml-2"
                    fill={isBookmarked ? "currentColor" : "none"}
                    strokeWidth={1.7}
                  />
                </button>
              </div>

              <div className="text-sm text-gray-600 flex flex-wrap gap-3">
                {book.genre && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                    {book.genre}
                  </span>
                )}
                {book.author && (
                  <Link
                    to={`/author/${book.author}`}
                    className="underline hover:text-bearBrown"
                  >
                    Author Profile
                  </Link>
                )}
                {added && <span>Added {added}</span>}
              </div>
            </header>

            {/* Summary */}
            <div className="bg-[#fffaf0] border border-[#f3e9c0] p-4 rounded-xl shadow-inner text-[17px] text-gray-800">
              <p
                className={`${
                  showFull ? "" : "line-clamp-4 whitespace-pre-line"
                }`}
              >
                {book.summary}
              </p>
              {book.summary?.length > 140 && (
                <button
                  onClick={() => setShowFull((s) => !s)}
                  className="mt-2 text-sm text-bearBrown hover:underline"
                >
                  {showFull ? "Show less ▲" : "Show more ▼"}
                </button>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  className="text-yellow-500 hover:scale-110 transition-transform"
                  aria-label={`Rate ${n}`}
                >
                  <Star
                    size={24}
                    fill={rating >= n ? "currentColor" : "none"}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="text-sm text-gray-600 pl-2">
                  You rated {rating}/5
                </span>
              )}
            </div>

            {/* Progress */}
            <div>
              <label className="text-sm">Reading progress: {progress}%</label>
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-[var(--bear-brown)]"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to={`/read/${book.id}`}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold bg-[#ffd596] hover:bg-[#ffc670] shadow hover:bg-bearBrown/90 transition"
              >
                <BookOpen size={18} /> Start reading
              </Link>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-sm px-3 py-2 rounded-full border border-gray-300 shadow hover:bg-gray-100 transition"
              >
                <Copy size={16} /> {copied ? "Copied!" : "Copy link"}
              </button>
              <button
                onClick={shareBook}
                className="inline-flex items-center gap-1 text-sm px-3 py-2 rounded-full border border-gray-300 shadow hover:bg-gray-100 transition"
              >
                <Share size={16} /> Share
              </button>
            </div>

            <AddToShelf bookId={book.id} />

            {/* Feedback */}
            <div className="mt-16 pt-12 border-t border-[#f1e8cd]">
              <h2 className="text-2xl font-bold text-bearBrown mb-6 flex items-center gap-2">
                📝 Community Feedback
              </h2>
              <div className="grid md:grid-cols-1 gap-8">
                <div className="bg-[#fffdf7] border border-[#f0e6d2] rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                  <ReviewSection bookId={book.id} />
                </div>
                <div className="bg-[#fffdf7] border border-[#f0e6d2] rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                  <CommentSection bookId={book.id} />
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-semibold mb-4">You may also like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((rb) => (
                <Link
                  to={`/book/${rb.id}`}
                  key={rb.id}
                  className="flex flex-col items-center text-center bg-gray-50 p-3 rounded hover:shadow transition"
                >
                  <img
                    src={rb.cover_url}
                    alt={rb.title}
                    className="w-24 h-32 object-cover rounded mb-2"
                  />
                  <span className="text-xs font-medium text-bearBrown line-clamp-2">
                    {rb.title}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}

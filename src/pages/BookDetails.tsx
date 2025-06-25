import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useBooks } from "../hooks/useBooks";
import BookCover from "../components/BookCover";
import {
  BookOpen,
  ArrowLeft,
  Heart,
  Star,
  Copy,
  Share,
  Trash2,
} from "lucide-react";

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
  const [comments, setComments] = useState<{ id: number; text: string; date: string }[]>([]);
  const commentRef = useRef<HTMLInputElement>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const added = book?.created_at ? new Date(book.created_at).toLocaleDateString() : null;

  const related = useMemo(() => {
    if (!book || !allBooks) return [];
    return allBooks.filter((b) => b.genre === book.genre && b.id !== book.id).slice(0, 4);
  }, [allBooks, book]);

  useEffect(() => {
  if (!book) return;
  const stored = localStorage.getItem(`bookmark-${book.id}`) === "true";
  setIsBookmarked(stored);
}, [book]);

// Save to localStorage
useEffect(() => {
  if (book) {
    localStorage.setItem(`bookmark-${book.id}`, String(isBookmarked));
  }
}, [isBookmarked, book]);

  useEffect(() => {
    if (!book) return;
    setIsFav(localStorage.getItem(`fav-${book.id}`) === "true");
    setRating(Number(localStorage.getItem(`rating-${book.id}`) || 0));
    setProgress(Number(localStorage.getItem(`progress-${book.id}`) || 0));
    setComments(JSON.parse(localStorage.getItem(`comments-${book.id}`) || "[]"));
  }, [book]);

  useEffect(() => { if (book) localStorage.setItem(`fav-${book.id}`, String(isFav)); }, [isFav, book]);
  useEffect(() => { if (book) localStorage.setItem(`rating-${book.id}`, String(rating)); }, [rating, book]);
  useEffect(() => { if (book) localStorage.setItem(`progress-${book.id}`, String(progress)); }, [progress, book]);
  useEffect(() => { if (book) localStorage.setItem(`comments-${book.id}`, JSON.stringify(comments)); }, [comments, book]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const shareBook = async () => {
    try {
      if (navigator.share && book) {
        await navigator.share({ title: book.title, text: book.summary, url: window.location.href });
      } else {
        alert("Sharing not supported in this browser.");
      }
    } catch {}
  };

  const addComment = () => {
    if (!commentRef.current?.value.trim() || !book) return;
    const newC = {
      id: Date.now(),
      text: commentRef.current.value,
      date: new Date().toLocaleString(),
    };
    setComments((prev) => [newC, ...prev]);
    commentRef.current.value = "";
  };
  const deleteComment = (cid: number) =>
    setComments((c) => c.filter((cm) => cm.id !== cid));

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

  return (
    <section>
      <div className="relative mx-auto max-w-5xl p-6 bg-gradient-to-br from-[#FFFDF5] to-[#F9F6EF] rounded-3xl shadow-lg">
        {/* back */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/library")}
            className="inline-flex items-center gap-1 text-bearBrown/70 hover:text-bearBrown transition"
          >
            <ArrowLeft size={16} /> Back to Library
          </button>
        </div>

        {/* layout */}
        <div className="flex flex-col md:flex-row gap-10">
          <div className="relative mx-auto md:mx-0 w-64 shrink-0 [perspective:1000px]">
            <div className="transition-transform duration-300 hover:rotate-y-6 hover:-rotate-x-3 hover:shadow-xl hover:ring-4 hover:ring-bearBrown/10 rounded-2xl overflow-hidden">
              <BookCover book={book} className="w-full rounded-2xl" />
            </div>
            
            {isFav && (
              <Heart size={24} className="absolute -top-3 -right-3 text-red-600 drop-shadow" fill="currentColor" />
            )}
            
          </div>

          <article className="flex-1 space-y-4">
            <header className="space-y-1">
              <div className="flex items-start gap-3">
                <h1 className="text-4xl/tight font-bold text-bearBrown flex-1">{book.title}</h1>
                <button
                  aria-label={isFav ? "Unfavorite" : "Add to favorites"}
                  onClick={() => setIsFav((f) => !f)}
                  className="hover:text-red-600 transition"
                >
                  <Heart size={28} fill={isFav ? "currentColor" : "none"} strokeWidth={1.7} />
                </button>
                <button
  aria-label={isBookmarked ? "Unbookmark" : "Bookmark"}
  onClick={() => setIsBookmarked((b) => !b)}
  className="hover:text-blue-600 transition"
>
  <Star
    size={24}
    className="ml-2"
    fill={isBookmarked ? "currentColor" : "none"}
    strokeWidth={1.7}
  />
</button>

              </div>

              <div className="text-sm text-gray-500 flex flex-wrap gap-3">
                {book.genre && (
                  <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                    {book.genre}
                  </span>
                )}
                {book.author && (
                  <Link to={`/author/${book.author}`} className="underline hover:text-bearBrown">
                    Author Profile
                  </Link>
                )}
                {added && <span>Added {added}</span>}
              </div>
            </header>

            <p className={`whitespace-pre-line leading-relaxed text-[17px] text-gray-700 ${showFull ? "" : "line-clamp-3"}`}>
              {book.summary}
            </p>
            {book.summary?.length > 140 && (
              <button onClick={() => setShowFull((s) => !s)} className="text-sm text-bearBrown hover:underline">
                {showFull ? "Show less ▲" : "Show more ▼"}
              </button>
            )}

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  aria-label={`Rate ${n}`}
                  onClick={() => setRating(n)}
                  className="text-yellow-500 hover:scale-110 transition-transform"
                >
                  <Star size={24} fill={rating >= n ? "currentColor" : "none"} strokeWidth={1.5} />
                </button>
              ))}
              {rating > 0 && (
                <span className="text-sm text-gray-600 pl-2">You rated {rating}/5</span>
              )}
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-sm">Reading progress: {progress}%</label>
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-"
              />
             
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
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

            <section className="mt-6 space-y-3">
              <h2 className="text-lg font-semibold">Comments</h2>
              <div className="flex gap-2">
                <input
                  ref={commentRef}
                  type="text"
                  placeholder="Leave a comment…"
                  className="flex-1 px-3 py-2 rounded border border-gray-300 bg-white"
                />
                <button
                  onClick={addComment}
                  className="px-4 py-2 rounded bg-bearBrown text-white hover:bg-bearBrown/90 transition"
                >
                  Post
                </button>
              </div>
              <ul className="space-y-2">
                {comments.map((c) => (
                  <li key={c.id} className="flex justify-between items-start bg-gray-100 p-2 rounded">
                    <div>
                      <p className="text-sm">{c.text}</p>
                      <span className="text-xs text-gray-500">{c.date}</span>
                    </div>
                    <button
                      onClick={() => deleteComment(c.id)}
                      className="text-gray-400 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
                {comments.length === 0 && (
                  <p className="text-gray-500 text-sm">No comments yet.</p>
                )}
              </ul>
            </section>
          </article>
        </div>

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4">You may also like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((rb) => (
                <Link
                  to={`/book/${rb.id}`}
                  key={rb.id}
                  className="flex flex-col items-center text-center bg-gray-50 p-3 rounded hover:shadow transition"
                >
                  <img src={rb.cover_url} alt={rb.title} className="w-24 h-32 object-cover rounded mb-2" />
                  <span className="text-xs font-medium text-bearBrown line-clamp-2">{rb.title}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}

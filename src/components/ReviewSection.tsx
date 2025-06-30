import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { moderateWithGemini } from "../lib/moderateWithGemini";

interface Review {
  id: string;
  user_id: string;
  book_id: string;
  rating: number;
  review: string;
  created_at: string;
  profiles?: {
    email: string;
  };
}

export default function ReviewSection({ bookId }: { bookId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchReviews();
    supabase.auth.getUser().then(({ data }) => setUser(data?.user));
  }, []);

  async function fetchReviews() {
    setLoading(true);
    const { data, error } = await supabase
      .from("book_reviews")
      .select("*, profiles(email)")
      .eq("book_id", bookId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (!error) setReviews(data || []);
    setLoading(false);
  }

  async function handleSubmit() {
  if (!newReview.trim() || newRating < 1 || !user?.id) return;

  setSubmitting(true);

  const isInappropriate = await moderateWithGemini(newReview.trim());

  if (isInappropriate) {
    alert("⚠️ Your review contains inappropriate content (PG-16+ restricted). Please revise it.");
    setSubmitting(false);
    return;
  }

  const { error: insertError } = await supabase.from("book_reviews").insert({
    user_id: user.id,
    book_id: bookId,
    rating: newRating,
    review: newReview.trim(),
  });

  if (!insertError) {
    const { data: bookData, error: bookError } = await supabase
      .from("books")
      .select("review_count")
      .eq("id", bookId)
      .single();

    if (!bookError && bookData) {
      const currentCount = bookData.review_count ?? 0;
      await supabase
        .from("books")
        .update({ review_count: currentCount + 1 })
        .eq("id", bookId);
    }

    setNewReview("");
    setNewRating(0);
    fetchReviews();
  }

  setSubmitting(false);
}

  return (
  <section className="mt-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-0 font-[Inter]">
    <h2 className="text-4xl font-extrabold text-bearBrown mb-6 tracking-tight">
      Reader Reviews
    </h2>

    {user && (
      <div className="mb-12 border border-[#f1e7d5] bg-[#fffdf7] rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setNewRating(n)}
              className="hover:scale-110 transition-transform"
            >
              <Star
                size={24}
                strokeWidth={1.5}
                fill={n <= newRating ? "#facc15" : "none"}
                className={`transition duration-150 text-yellow-500 ${
                  n <= newRating ? "scale-110" : "opacity-60"
                }`}
              />
            </button>
          ))}
        </div>

        <textarea
          rows={4}
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          className="w-full border border-[#e4d9c2] rounded-xl p-4 text-sm resize-none bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-bearBrown/50 transition"
          placeholder="Share your thoughts about the book…"
        />

        <div className="text-right">
          <button
            onClick={handleSubmit}
            disabled={submitting || newRating === 0 || !newReview.trim()}
            className="inline-block px-5 py-2.5 text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-bg-blue-600/90 shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            {submitting ? "Posting…" : "Submit Review"}
          </button>
        </div>
      </div>
    )}

    <Link
      to={`/book/${bookId}/reviews`}
      className="text-sm text-bearBrown underline mb-6 inline-block hover:text-bearBrown/80 transition"
    >
      View All Reviews →
    </Link>

    <div className="space-y-6">
      {loading ? (
        <p className="text-sm text-gray-500">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No reviews yet. Be the first!</p>
      ) : (
        reviews.map((r) => (
          <div
            key={r.id}
            className="bg-white border border-[#f0e6d2] rounded-2xl p-5 shadow hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-400 text-white flex items-center justify-center font-bold shadow-inner text-sm">
                {r.profiles?.email?.charAt(0).toUpperCase() || "?"}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-bearBrown">
                  {r.profiles?.email || "Anonymous"}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(r.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  size={16}
                  strokeWidth={1.5}
                  fill={n <= r.rating ? "#facc15" : "none"}
                  className="text-yellow-500"
                />
              ))}
            </div>

            <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
              {r.review}
            </p>
          </div>
        ))
      )}
    </div>
  </section>
);

}

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Review = {
  id: string;
  user_id: string;
  review: string;
  rating?: number;
  created_at: string;
  profiles?: { email: string };
};

export default function BookReviews() {
  const { id: bookId } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortNewestFirst, setSortNewestFirst] = useState(true);

  useEffect(() => {
    if (bookId) fetchReviews();
  }, [bookId, sortNewestFirst]);

  async function fetchReviews() {
    setLoading(true);
    const { data, error } = await supabase
      .from("book_reviews")
      .select("*, profiles(email)")
      .eq("book_id", bookId)
      .order("created_at", { ascending: !sortNewestFirst });

    if (error) {
      console.error("Error fetching reviews:", error);
    } else {
      setReviews(data || []);
    }

    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link
        to={`/book/${bookId}`}
        className="text-sm text-bearBrown underline mb-6 inline-block"
      >
        ← Back to Book
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-bearBrown">
          All Reader Reviews
        </h1>

        <button
          onClick={() => setSortNewestFirst(!sortNewestFirst)}
          className="text-sm text-bearBrown underline"
        >
          Sort by: {sortNewestFirst ? "Newest" : "Oldest"}
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-500">No reviews yet.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex items-start gap-4 border border-[#f0e6d2] bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-sm font-bold text-white shadow-inner">
                {review.profiles?.email?.charAt(0).toUpperCase() || "?"}
              </div>

              <div className="flex-1">
                {/* Optional star rating */}
                {typeof review.rating === "number" && (
                  <div className="flex items-center gap-1 text-yellow-400 text-sm mb-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                )}

                <div className="text-sm text-gray-800 leading-relaxed">
                  {review.review}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {review.profiles?.email || "Anonymous"} ·{" "}
                  {new Date(review.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

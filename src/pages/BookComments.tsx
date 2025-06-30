import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Comment = {
  id: string;
  user_id: string;
  comment: string;
  created_at: string;
  profiles?: { email: string };
};

export default function BookComments() {
  const { id: bookId } = useParams();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortNewestFirst, setSortNewestFirst] = useState(true);

  useEffect(() => {
    if (bookId) fetchComments();
  }, [bookId, sortNewestFirst]);

  async function fetchComments() {
    setLoading(true);
    const { data, error } = await supabase
      .from("book_comments")
      .select("*, profiles(email)")
      .eq("book_id", bookId)
      .order("created_at", { ascending: !sortNewestFirst });

    if (error) {
      console.error("Error fetching comments:", error);
    } else {
      setComments(data || []);
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
          All Reader Comments
        </h1>

        <button
          onClick={() => setSortNewestFirst(!sortNewestFirst)}
          className="text-sm text-bearBrown underline"
        >
          Sort by: {sortNewestFirst ? "Newest" : "Oldest"}
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-500">No comments yet.</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start gap-4 border border-[#f0e6d2] bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-sm font-bold text-white shadow-inner">
                {comment.profiles?.email?.charAt(0).toUpperCase() || "?"}
              </div>

              <div className="flex-1">
                <div className="text-sm text-gray-800 leading-relaxed">
                  {comment.comment}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {comment.profiles?.email || "Anonymous"} ·{" "}
                  {new Date(comment.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import { moderateWithGemini } from "../lib/moderateWithGemini";

type Comment = {
  id: string;
  user_id: string;
  comment: string;
  created_at: string;
  profiles?: { email: string };
};

export default function CommentSection({ bookId }: { bookId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user);
    });
  }, []);

  useEffect(() => {
    fetchComments();
  }, [bookId]);

  async function fetchComments() {
    const { data } = await supabase
      .from("book_comments")
      .select("*, profiles(email)")
      .eq("book_id", bookId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (data) setComments(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;

    // 🔒 Moderate using Gemini
    const isInappropriate = await moderateWithGemini(newComment.trim());

    if (isInappropriate) {
      alert(
        "⚠️ Your comment contains inappropriate content (PG-16+ restricted). Please revise it."
      );
      return;
    }

    const { error: insertError } = await supabase.from("book_comments").insert({
      book_id: bookId,
      user_id: user?.id,
      comment: newComment.trim(),
    });

    if (!insertError) {
      const { data: bookData, error: bookError } = await supabase
        .from("books")
        .select("comment_count")
        .eq("id", bookId)
        .single();

      if (!bookError && bookData) {
        const currentCount = bookData.comment_count ?? 0;
        await supabase
          .from("books")
          .update({ comment_count: currentCount + 1 })
          .eq("id", bookId);
      }

      setNewComment("");
      fetchComments();
    }
  }

  return (
    <div className="mt-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-0 font-[Inter]">
      <h2 className="text-4xl font-extrabold text-bearBrown mb-6 tracking-tight">
        Reader Comments
      </h2>

      <Link
        to={`/book/${bookId}/comments`}
        className="text-sm text-bearBrown underline mb-6 inline-block hover:text-bearBrown/80 transition"
      >
        View All Comments →
      </Link>

      {user && (
        <form
          onSubmit={handleSubmit}
          className="mb-12 bg-[#fffdf7] border border-[#f1e7d5] rounded-2xl p-6 shadow-md space-y-4"
        >
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border border-[#e4d9c2] rounded-xl p-4 text-sm resize-none bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-bearBrown/50 transition"
            placeholder="Leave a cozy thought…"
            rows={4}
          />
          <div className="text-right">
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white text-sm rounded-xl font-semibold shadow-md hover:bg-bg-blue-600/90 transition"
            >
              Post Comment
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-center text-sm text-gray-500 italic">
            No cozy thoughts yet. Be the first!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start gap-4 border border-[#f0e6d2] bg-white rounded-2xl p-5 shadow hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-sm font-bold text-white shadow-inner">
                {comment.profiles?.email?.charAt(0).toUpperCase() || "?"}
              </div>

              <div className="flex-1">
                <p className="text-sm text-gray-800 leading-relaxed">
                  {comment.comment}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {comment.profiles?.email || "Anonymous"} ·{" "}
                  {new Date(comment.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

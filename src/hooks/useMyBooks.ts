import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useMyBooks() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const uid = (await supabase.auth.getUser()).data.user?.id;

      // Step 1: Fetch books
      const { data: bookData, error } = await supabase
        .from("books")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: false });

      if (error || !bookData) {
        setBooks([]);
        setLoading(false);
        return;
      }

      // Step 2: Fetch review counts
      const { data: reviewCounts } = await supabase
        .from("book_reviews")
        .select("book_id, count:book_id", { count: "exact", head: false });

      // Step 3: Fetch comment counts
      const { data: commentCounts } = await supabase
        .from("book_comments")
        .select("book_id, count:book_id", { count: "exact", head: false });

      // Step 4: Merge counts into books
      const booksWithCounts = bookData.map((book) => {
        const reviewCount = reviewCounts?.filter(r => r.book_id === book.id).length || 0;
        const commentCount = commentCounts?.filter(c => c.book_id === book.id).length || 0;

        return {
          ...book,
          reviewCount,
          commentCount,
        };
      });

      setBooks(booksWithCounts);
      setLoading(false);
    })();
  }, []);

  return { books, loading };
}

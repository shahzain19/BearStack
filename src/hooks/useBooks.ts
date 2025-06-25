import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Book } from "../models/Book";
import { SAMPLE_BOOKS } from "../components/sampleBooks";

interface BookWithEmail extends Book {
  author_email?: string;
}

export function useBooks(id?: string) {
  const [books, setBooks] = useState<Book[]>([]);
  const [book, setBook] = useState<BookWithEmail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);

      if (id) {
        // First, fetch the book
        const { data: bookData, error: bookError } = await supabase
          .from("books")
          .select("*")
          .eq("id", id)
          .single();

        if (bookError || !bookData) {
          setBook(SAMPLE_BOOKS.find((b) => b.id === id) ?? null);
          setLoading(false);
          return;
        }

        // Then, fetch the user's email from auth.users
        let userEmail: string | undefined;
        if (bookData.user_id) {
          const { data: userData } = await supabase.auth.admin.getUserById(
            bookData.user_id
          );
          userEmail = userData?.user?.email;
        }

        setBook({
          ...bookData,
          author_email: userEmail,
        });
      } else {
        const { data, error } = await supabase
          .from("books")
          .select("*")
          .eq("status", "published");

        if (error || !data?.length) {
          setBooks(SAMPLE_BOOKS);
        } else {
          setBooks(data as Book[]);
        }
      }

      setLoading(false);
    }

    fetchBooks();
  }, [id]);

  return { books, book, loading };
}

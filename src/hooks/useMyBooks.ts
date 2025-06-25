import type { Book } from '../models/Book';
import {useState, useEffect} from "react"
import { supabase } from '../lib/supabase';

export function useMyBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const uid = (await supabase.auth.getUser()).data.user?.id!;
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });
      setBooks(error ? [] : (data as Book[]));
      setLoading(false);
    })();
  }, []);

  return { books, loading };
}

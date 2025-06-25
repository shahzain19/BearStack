import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Author } from '../models/Book';

export function useAuthor(id?: string) {
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = id
        ? await supabase.from('authors').select('*').eq('id', id).single()
        : await supabase          // fetch my author profile
            .from('authors')
            .select('*')
            .eq('user_id', (await supabase.auth.getUser()).data.user?.id!)
            .single();
      setAuthor(error ? null : (data as Author));
      setLoading(false);
    })();
  }, [id]);

  return { author, loading };
}

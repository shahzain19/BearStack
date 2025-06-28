// hooks/useAuthor.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthorData {
  pen_name: string | null;
  profile_pic: string | null;
}

export function useAuthor(authorId?: string) {
  const [author, setAuthor] = useState<AuthorData | null>(null);

  useEffect(() => {
    if (!authorId) return;

    supabase
      .from('authors')
      .select('pen_name, avatar_url')
      .eq('id', authorId)
      .single()
      .then(({ data }) => {
        if (data) {
          setAuthor({
            pen_name: data.pen_name ?? 'Unknown Author',
            profile_pic: data.avatar_url,
          });
        } else {
          setAuthor({
            pen_name: 'Unknown Author',
            profile_pic: null,
          });
        }
      });
  }, [authorId]);

  return author;
}

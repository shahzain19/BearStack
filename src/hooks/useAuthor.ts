// hooks/useAuthor.ts
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface AuthorData {
  pen_name: string;
  avatar_url: string | null;
  bio?: string | null;
  role?: string;
  created_at?: string;
}

export function useAuthor(authorId?: string) {
  const [author, setAuthor] = useState<AuthorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      let id = authorId;

      // If no ID passed, get current user
      if (!id) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setAuthor(null);
          setLoading(false);
          return;
        }
        id = user.id;
      }

      const { data, error } = await supabase
        .from("authors")
        .select("pen_name, avatar_url, bio, created_at")
        .eq("id", id)
        .single();

      if (error || !data) {
        setAuthor(null);
      } else {
        setAuthor({
          pen_name: data.pen_name ?? "Unknown Author",
          avatar_url: data.avatar_url ?? null,
          bio: data.bio ?? null,
          created_at: data.created_at ?? undefined,
        });
      }

      setLoading(false);
    };

    fetchAuthor();
  }, [authorId]);

  return { author, loading };
}

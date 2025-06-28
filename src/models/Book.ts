// models/Book.ts
export interface Book {
  id: string;
  title: string;
  author: string;
  author_pen_name?: string; // ← NEW
  summary: string;
  cover_url: string;
  created_at?: string;
  content?: string;
  author_id?: string;
  user_id?: string;
  genre?: string;
  status?: 'published' | 'draft';
  is_accepted?: 'yes' | 'no' | 'pending';

  /** 💛 whether the current user starred this book */
  is_favorite?: boolean;        // ← NEW
  is_bookmarked?: boolean; // ← NEW
}

// models/Author.ts
export interface Author {
  id: string;
  user_id: string;
  pen_name: string;
  bio?: string;
  avatar_url?: string;
  created_at?: string;
}

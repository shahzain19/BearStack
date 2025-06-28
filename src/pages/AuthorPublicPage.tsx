import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Book } from '../models/Book';
import type { Author } from '../models/Book';
import BookCard from '../components/BookCard';

export default function AuthorPublicPage() {
  const { id } = useParams(); // This is the author's ID from the URL
  const [author, setAuthor] = useState<Author | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Invalid author ID.');
      setLoading(false);
      return;
    }

    async function loadAuthorAndBooks() {
      setLoading(true);
      setError(null);

      // Fetch author by ID
      const { data: authorData, error: authorError } = await supabase
        .from('authors')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (authorError) {
        console.error('Error fetching author:', authorError);
        setError('Could not load author.');
        setLoading(false);
        return;
      }

      if (!authorData) {
        setError('Author not found.');
        setLoading(false);
        return;
      }

      // Fetch books written by this author
      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select('*')
        .eq('author', id)
        .order('created_at', { ascending: false });

      if (booksError) {
        console.error('Error fetching books:', booksError);
      }

      setAuthor(authorData);
      setBooks(booksData ?? []);
      setLoading(false);
    }

    loadAuthorAndBooks();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="animate-pulse text-gray-500">Loading author profile…</p>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="p-6 text-center">
        <img
          src="https://illustrations.popsy.co/gray/reading.svg"
          alt="Not found"
          className="w-64 mx-auto mb-6"
        />
        <p className="text-gray-600">{error ?? 'Something went wrong.'}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-12">
      {/* Author Info */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-[#fffaf4] p-8 rounded-xl shadow-lg border">
        <img
          src={author.avatar_url || '/default-avatar.png'}
          alt={author.pen_name}
          className="w-28 h-28 rounded-full object-cover border-2 border-bearBrown shadow"
        />
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl font-extrabold text-bearBrown">{author.pen_name}</h1>
          <p className="text-gray-700 whitespace-pre-line">{author.bio || 'No bio available yet.'}</p>
        </div>
      </div>

      {/* Books Section */}
      <div>
        <h2 className="text-2xl font-bold text-bearBrown mb-4">Books by {author.pen_name}</h2>
        {books.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center mt-10 opacity-80">
            <img
              src="https://illustrations.popsy.co/gray/book-stack.svg"
              alt="No books"
              className="w-60 mx-auto mb-4"
            />
            <p>This author hasn’t published any books yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

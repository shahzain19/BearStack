import { useState } from 'react';
import type { Book } from '../models/Book';

export default function BookCover({ book, className = '' }: { book: Book; className?: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`aspect-[2/3] overflow-hidden ${className}`}>
      {!loaded && (
        <div className="bg-gray-200 animate-pulse h-full w-full rounded-lg" />
      )}
      <img
        src={book.cover_url}
        alt={book.title}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-300 rounded-lg ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}

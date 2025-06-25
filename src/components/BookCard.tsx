import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { Book } from '../models/Book';
import BookCover from './BookCover';

const MotionLink = motion(Link);

interface BookCardProps {
  book: Book & { is_favorite?: boolean };
  onToggleFavorite?: (id: string, current: boolean) => void;
  className?: string;
}

export default function BookCard({
  book,
  onToggleFavorite,
  className = '',
}: BookCardProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Favorite Button */}
      {onToggleFavorite && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onToggleFavorite(book.id, !!book.is_favorite);
          }}
          className="absolute top-3 right-3 z-10 bg-white rounded-full p-1 border border-yellow-300 text-yellow-500 hover:bg-yellow-100 shadow-md transition"
          title={book.is_favorite ? 'Unfavorite' : 'Favorite'}
        >
          <Star
            size={18}
            className={`transition ${book.is_favorite ? 'fill-yellow-500' : 'fill-none'}`}
          />
        </button>
      )}

      {/* Card Link */}
      <MotionLink
        to={`/book/${book.id}`}
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        className="group block bg-white p-5 rounded-3xl border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-bearBrown/40"
      >
        <BookCover
          book={book}
          className="w-full max-w-[170px] rounded-xl mx-auto shadow-md group-hover:shadow-md transition"
        />
        <div className="mt-4 text-center">
          <h3 className="text-[1.05rem] font-semibold text-bearBrown leading-snug truncate">
            {book.title}
          </h3>
        </div>
      </MotionLink>
    </div>
  );
}

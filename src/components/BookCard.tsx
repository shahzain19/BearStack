// src/components/BookCard.tsx

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Book } from "../models/Book";
import BookCover from "./BookCover";
import { useAuthor } from "../hooks/useAuthor";
import { Star, MessageCircle } from "lucide-react";

const MotionLink = motion(Link);

interface BookCardProps {
  book: Book & {
    is_favorite?: boolean;
    review_count?: number;
    comment_count?: number;
  };
  onToggleFavorite?: (id: string, current: boolean) => void;
  className?: string;
}

export default function BookCard({ book, className = "" }: BookCardProps) {
  const { author } = useAuthor(book.author);

  return (
  <div className={`relative ${className}`}>
    {/* Card Link */}
    <MotionLink
      to={`/book/${book.id}`}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="group block px-5 pt-5 pb-4 rounded-3xl hover:shadow-md transition glass"
    >
      <BookCover
        book={book}
        className="w-full max-w-[170px] aspect-[2/3] object-cover rounded-xl mx-auto shadow-md group-hover:shadow-lg transition"
      />

      <div className="mt-4 text-center">
        <h3 className="font-[MerriWeather] text-base font-bold leading-snug truncate transition">
          {book.title}
        </h3>

        <p className="leading-snug line-clamp-2 text-[var(--text-secondary))] text-sm mt-1 text-left">
          {book.summary}
        </p>

        {/* Author Info with Profile Pic */}
        <div className="flex justify-between items-center mt-3 gap-4">
          <div className="flex items-center gap-2 text-left min-w-0">
            {author?.avatar_url ? (
              <img
                src={author.avatar_url}
                alt="Author"
                className="w-6 h-6 rounded-full object-cover border border-indigo-300 shadow-sm"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-300" />
            )}
            <p className="text-sm font-semibold text-[var(--text-secondary)] truncate">
              {author?.pen_name ?? "Loading..."}
            </p>
          </div>
          <p className="text-xs text-gray-500 italic truncate text-right max-w-[40%]">
            {book.genre ?? "Genre not specified"}
          </p>
        </div>

        {book.created_at && (
          <p className="text-xs text-gray-400 mt-2 text-right">
            {new Date(book.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}

        {/* Review & Comment Stats */}
        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Star size={13} className="text-yellow-500" fill="currentColor" />
            {book.review_count ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={13} className="text-blue-400" fill="currentColor" />
            {book.comment_count ?? 0}
          </span>
        </div>
      </div>
    </MotionLink>
  </div>
);

}

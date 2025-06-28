import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Book } from "../models/Book";
import BookCover from "./BookCover";
import { useAuthor } from "../hooks/useAuthor";

const MotionLink = motion(Link);

interface BookCardProps {
  book: Book & { is_favorite?: boolean };
  onToggleFavorite?: (id: string, current: boolean) => void;
  className?: string;
}

export default function BookCard({
  book,
  className = "",
}: BookCardProps) {
  const author = useAuthor(book.author);

  return (
    <div className={`relative ${className}`}>
      {/* Card Link */}
      <MotionLink
        to={`/book/${book.id}`}
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="group block bg-white p-5 rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-bearBrown/40"
      >
        <BookCover
          book={book}
          className="w-full max-w-[170px] rounded-xl mx-auto shadow-md group-hover:shadow-md transition"
        />

        <div className="mt-4 text-center">
          <h3 className="text-[1.06em] font-semibold text-bearBrown leading-snug truncate">
            {book.title}
          </h3>

          <p className="leading-snug line-clamp-2 text-gray-600 text-sm mt-1 text-left">
            {book.summary}
          </p>

          {/* Author Info with Profile Pic */}
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center gap-2 text-left">
              {author?.profile_pic ? (
                <img
                  src={author.profile_pic}
                  alt="Author"
                  className="w-6 h-6 rounded-full object-cover border border-indigo-300 shadow-sm"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-300" />
              )}
              <p className="text-sm font-semibold text-gray-800">
                {author?.pen_name ?? "Loading..."}
              </p>
            </div>
            <p className="text-sm text-gray-500 italic line-clamp-1 text-right">
              {book.genre ?? "Genre not specified"}
            </p>
          </div>

          {book.created_at && (
            <p className="text-xs text-gray-400 mt-1 text-right">
              {new Date(book.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </MotionLink>
    </div>
  );
}

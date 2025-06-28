import BookCard from "./BookCard";
import type { Book } from "../models/Book";
import { motion } from "framer-motion";

export default function BookGrid({
  books,
}: {
  books: Book[];
  onToggleFavorite?: (id: string, current: boolean) => void;
}) {
  return (
    <motion.div
      className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
    >
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
        />
      ))}
    </motion.div>
  );
}

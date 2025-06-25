import BookCard from './BookCard';
import type { Book } from '../models/Book';

export default function BookGrid({
  books,
  onToggleFavorite,
}: {
  books: Book[];
  onToggleFavorite?: (id: string, current: boolean) => void;
}) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
// This component renders a grid of book cards, allowing for optional favorite toggling.
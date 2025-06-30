// src/components/ShelfManager.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ShelfManager({ bookId }: { bookId: string }) {
  const [shelves, setShelves] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [newShelf, setNewShelf] = useState("");

  const fetchShelves = async () => {
    const { data: allShelves } = await supabase
      .from("shelves")
      .select("id, name")
      .order("created_at");

    const { data: bookShelves } = await supabase
      .from("shelf_books")
      .select("shelf_id")
      .eq("book_id", bookId);

    setShelves(allShelves || []);
    setSelected(bookShelves?.map((s) => s.shelf_id) || []);
  };

  const toggleShelf = async (shelfId: string) => {
    if (selected.includes(shelfId)) {
      await supabase
        .from("shelf_books")
        .delete()
        .eq("shelf_id", shelfId)
        .eq("book_id", bookId);
    } else {
      await supabase.from("shelf_books").insert({ shelf_id: shelfId, book_id: bookId });
    }
    fetchShelves();
  };

  const createShelf = async () => {
    if (!newShelf.trim()) return;
    const { error } = await supabase
      .from("shelves")
      .insert({ name: newShelf });
    if (!error) {
      setNewShelf("");
      fetchShelves();
    }
  };

  useEffect(() => {
    fetchShelves();
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-2">
      <h3 className="font-semibold">🧺 Shelves</h3>

      {shelves.map((shelf) => (
        <button
          key={shelf.id}
          onClick={() => toggleShelf(shelf.id)}
          className={`block w-full px-3 py-2 rounded text-left ${
            selected.includes(shelf.id)
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {shelf.name}
        </button>
      ))}

      <div className="flex gap-2 pt-2">
        <input
          value={newShelf}
          onChange={(e) => setNewShelf(e.target.value)}
          placeholder="New shelf name..."
          className="border rounded px-3 py-1 w-full"
        />
        <button onClick={createShelf} className="bg-black text-white px-3 py-1 rounded">
          Add
        </button>
      </div>
    </div>
  );
}

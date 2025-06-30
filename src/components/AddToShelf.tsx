import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Folder } from "lucide-react";

export default function AddToShelf({ bookId }: { bookId: string }) {
  const [shelves, setShelves] = useState<any[]>([]);
  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchShelves = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;
      const { data } = await supabase
        .from("shelves")
        .select("id, name")
        .eq("user_id", user.id)
        .order("created_at");

      setShelves(data || []);
    };

    fetchShelves();
  }, []);

  const handleAdd = async () => {
    if (!selected) return;
    const { error } = await supabase.from("shelf_books").insert({
      shelf_id: selected,
      book_id: bookId,
    });

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("📚 Book added to shelf!");
    }

    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="space-y-2 mt-4">
      <label className="text-sm font-medium items-center flex gap-2"><Folder className="inline"/> Add to Shelf</label>
      <div className="flex gap-2">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm border-gray-200 focus:outline-none focus:ring-2 focus:ring-bearBrown/50"
        >
          <option value="">Select a shelf</option>
          {shelves.map((shelf) => (
            <option key={shelf.id} value={shelf.id}>
              {shelf.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
        >
          Add
        </button>
      </div>
      {message && <p className="text-sm text-green-600">{message}</p>}
    </div>
  );
}

// src/components/CreateShelfBox.tsx
import { useState } from "react";
import { supabase } from "../lib/supabase";

interface CreateShelfBoxProps {
  onCreated?: () => void;
}

export default function CreateShelfBox({ onCreated }: CreateShelfBoxProps) {
  const [shelfName, setShelfName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCreateShelf = async () => {
    setErrorMsg("");
    if (!shelfName.trim()) {
      setErrorMsg("Shelf name cannot be empty.");
      return;
    }

    setLoading(true);

    // 🧠 Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErrorMsg("You must be logged in.");
      setLoading(false);
      return;
    }

    // ✅ Insert with user_id
    const { error } = await supabase.from("shelves").insert({
      name: shelfName.trim(),
      user_id: user.id,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message || "Failed to create shelf.");
    } else {
      setShelfName("");
      onCreated?.();
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-md border max-w-md mx-auto space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">
        ➕ Create New Shelf
      </h2>

      <div className="flex gap-2">
        <input
          type="text"
          value={shelfName}
          onChange={(e) => setShelfName(e.target.value)}
          placeholder="e.g. Cozy Reads"
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-cozy transition"
        />
        <button
          onClick={handleCreateShelf}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>

      {errorMsg && (
        <div className="text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {errorMsg}
        </div>
      )}
    </div>
  );
}

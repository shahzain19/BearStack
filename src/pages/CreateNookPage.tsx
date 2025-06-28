import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function CreateNookPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState(""); // input as string
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to create a nook.");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const { data, error } = await supabase
      .from("book_nooks")
      .insert({
        title,
        description,
        creator_id: user.id,
        tags,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create nook:", error.message);
      alert("Error creating nook.");
      return;
    }

    // Add creator as member (admin)
    await supabase.from("book_nook_members").insert({
      nook_id: data.id,
      user_id: user.id,
      role: "admin",
    });

    navigate(`/nook/${data.id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">Create a Book Nook</h1>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nook title"
        className="w-full p-2 rounded border"
        required
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Nook description"
        className="w-full p-2 rounded border"
        rows={4}
        required
      />

      <input
        type="text"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
        placeholder="Tags (comma separated, e.g. fantasy, sci-fi)"
        className="w-full p-2 rounded border"
      />

      <button
        type="submit"
        className="bg-bearBrown text-white px-4 py-2 rounded-xl hover:bg-opacity-90"
      >
        Create
      </button>
    </form>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Plus } from "lucide-react";

export default function CreateNookPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
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

    const finalTags = tagsInput
      .split(",")
      .map(tag => tag.trim())
      .filter(Boolean);

    const { data, error } = await supabase
      .from("book_nooks")
      .insert({
        title,
        description,
        created_by: user.id,
        tags: finalTags,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create nook:", error.message);
      alert("Error creating nook.");
      return;
    }

    await supabase.from("book_nook_members").insert({
      nook_id: data.id,
      user_id: user.id,
      role: "admin",
    });

    navigate(`/nook/${data.id}`);
  };

  const handleTagInput = (value: string) => {
    setTagsInput(value);
    const cleanTags = value
      .split(",")
      .map(tag => tag.trim())
      .filter(Boolean);
    setTags(cleanTags);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-24 px-6 font-[Inter]">
      <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-3xl px-10 py-12 transition-all border border-gray-200">
        <h1 className="text-5xl font-[Merriweather] font-bold text-gray-900 mb-10 leading-tight tracking-tight">
          Create Your Book Nook
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">
          <FloatingInput
            label="Nook Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title your nook..."
          />

          <FloatingTextarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this nook about?"
          />

          <FloatingInput
            label="Tags"
            value={tagsInput}
            onChange={(e) => handleTagInput(e.target.value)}
            placeholder="e.g. fantasy, history, romance"
          />

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 text-sm">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[#f3f3f3] border rounded-full text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="bg-[#5999ff] hover:bg-[#3b82f6] text-white text-lg px-6 py-3 rounded-md transition-all flex items-center gap-2"
            >
              <Plus size={18} /> Create Nook
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Floating Label Input
function FloatingInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder=" "
        className="peer w-full px-4 pt-5 pb-2 bg-[#F9F9F9] border border-gray-300 rounded-xl placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#5999ff] focus:bg-white transition-all"
        required
      />
      <label className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-3 peer-focus:text-sm peer-focus:text-[#5999ff]">
        {label}
      </label>
    </div>
  );
}

// Floating Label Textarea
function FloatingTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}) {
  return (
    <div className="relative w-full">
      <textarea
        value={value}
        onChange={onChange}
        placeholder=" "
        rows={5}
        className="peer w-full px-4 pt-5 pb-2 bg-[#F9F9F9] border border-gray-300 rounded-xl placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#5999ff] focus:bg-white transition-all resize-none"
        required
      />
      <label className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-3 peer-focus:text-sm peer-focus:text-[#5999ff]">
        {label}
      </label>
    </div>
  );
}

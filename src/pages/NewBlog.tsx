import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function NewBlog() {
  const [role, setRole] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (userId) {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .single();

        if (!error) {
          setRole(data?.role ?? null);
        } else {
          console.error("Error fetching role:", error);
        }
      }
    };

    fetchRole();
  }, []);

  const handleSubmit = async () => {
    const slug = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { error } = await supabase.from("blogs").insert({
      title,
      slug,
      content,
      author_id: session?.user?.id,
    });

    if (!error) navigate(`/blog/${slug}`);
    else console.error("Error posting blog:", error.message);
  };

  if (role === null)
    return <div className="text-center py-20 text-gray-600">Checking role...</div>;

  if (role !== "admin")
    return (
      <div className="text-center py-20 text-red-500 font-medium">
        🚫 Only admins can publish blogs.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Write a New Blog</h1>
        <p className="text-gray-500 text-sm">
          Start sharing your thoughts with the world, one story at a time.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="text-3xl font-semibold placeholder-gray-400 focus:outline-none border-b pb-3"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tell your story..."
          className="w-full h-[400px] placeholder-gray-400 text-lg leading-relaxed focus:outline-none resize-none"
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}

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

        if (error) {
          console.error("Error fetching role", error);
        } else {
          setRole(data?.role || null);
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

    if (!error) {
      navigate(`/blog/${slug}`);
    } else {
      console.error("Error posting blog:", error.message);
    }
  };

  if (role === null) {
    return <div className="text-center py-20">You are not admin...</div>;
  }

  if (role !== "admin") {
    return (
      <div className="text-center py-20 text-red-500">
        🚫 You do not have access to write blogs.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-6">New Blog Post</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Blog title"
        className="w-full p-3 border rounded mb-4"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Blog content (Markdown or plain text)"
        rows={15}
        className="w-full p-3 border rounded mb-6"
      />

      <button
        onClick={handleSubmit}
        className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition"
      >
        Publish Blog
      </button>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function NewBlog() {
  const [role, setRole] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start writing your story...</p>",
  });

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (userId) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .single();
        setRole(data?.role ?? null);
      }
    };

    fetchRole();
  }, []);

  const handleSubmit = async () => {
    const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const { data: { session } } = await supabase.auth.getSession();
    const html = editor?.getHTML();

    const { error } = await supabase.from("blogs").insert({
      title,
      slug,
      content: html,
      author_id: session?.user?.id,
    });

    if (!error) navigate(`/blog/${slug}`);
    else console.error("Error posting blog:", error.message);
  };

  if (role === null) return <div className="text-center py-20">Checking permissions…</div>;
  if (role !== "admin") return <div className="text-center py-20 text-red-500">Only admins can post blogs.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="text-3xl font-semibold border-b pb-2 w-full mb-6"
      />
      <div className="border rounded-md p-4 min-h-[300px]">
        <EditorContent editor={editor} />
      </div>
      <button
        onClick={handleSubmit}
        className="mt-6 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800"
      >
        Publish
      </button>
    </div>
  );
}

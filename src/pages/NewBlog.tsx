import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function NewBlog() {
  const [role, setRole] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p><br/></p>",
    editorProps: {
      attributes: {
        class: "focus:outline-none prose prose-lg max-w-none min-h-[300px] px-1 text-gray-800",
      },
    },
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

  if (role === null) return <div className="text-center py-20 text-gray-500">Checking permissions…</div>;
  if (role !== "admin") return <div className="text-center py-20 text-red-500">🚫 Only admins can post blogs.</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="text-[2.5rem] font-bold mb-6 w-full placeholder-gray-400 focus:outline-none"
      />

      <div className="border-t border-gray-300 mb-6" />

      <div className="min-h-[300px] px-1 py-2 rounded">
        <EditorContent editor={editor} />
      </div>

      <div className="flex justify-end mt-10">
        <button
          onClick={handleSubmit}
          className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition font-medium text-sm"
        >
          Publish
        </button>
      </div>
    </div>
  );
}

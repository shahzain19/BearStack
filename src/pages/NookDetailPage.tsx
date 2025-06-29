import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { moderateWithGemini } from "../lib/moderateWithGemini";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { BookOpen, MessageCircle, Heart, Users, Tag } from "lucide-react";

export default function NookDetailPage() {
  const { id } = useParams();
  const [nook, setNook] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [posting, setPosting] = useState(false);
  const [moderationError, setModerationError] = useState("");
  const [parentRef] = useAutoAnimate();

  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: "",
  });

  useEffect(() => {
    const fetchNook = async () => {
      const { data: nookData } = await supabase
        .from("book_nooks")
        .select("*")
        .eq("id", id)
        .single();

      const { count: memberCount } = await supabase
        .from("book_nook_members")
        .select("*", { count: "exact", head: true })
        .eq("nook_id", id);

      setNook({ ...nookData, member_count: memberCount ?? 0 });
    };

    const fetchPosts = async () => {
      const { data } = await supabase
        .from("book_nook_posts")
        .select("*, authors(id, pen_name, avatar_url)")
        .eq("nook_id", id)
        .order("created_at", { ascending: false });
      setPosts(data ?? []);
    };

    fetchNook();
    fetchPosts();
  }, [id]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor || !editor.getHTML().trim()) return;

    setPosting(true);
    setModerationError("");

    const content = editor.getHTML();
    const plainText = editor.getText();

    const isInappropriate = await moderateWithGemini(plainText);
    if (isInappropriate) {
      setModerationError(
        "Please revise your message — some language is not suitable."
      );
      setPosting(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const { count } = await supabase
        .from("book_nook_posts")
        .select("*")
        .eq("nook_id", id)
        .eq("is_guest", true);

      if ((count ?? 0) >= 20) {
        alert("Guest post limit reached (20). Please log in.");
        setPosting(false);
        return;
      }

      const { error } = await supabase.from("book_nook_posts").insert({
        nook_id: id,
        content,
        is_guest: true,
      });

      if (error) {
        alert("Failed to post.");
      }
    } else {
      const { data: authorData } = await supabase
        .from("authors")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!authorData) {
        alert("Author profile not found.");
        setPosting(false);
        return;
      }

      const { error } = await supabase.from("book_nook_posts").insert({
        nook_id: id,
        content,
        author_id: authorData.id,
        is_guest: false,
      });

      if (error) {
        alert("Failed to post.");
      }
    }

    editor.commands.clearContent();

    const { data: updatedPosts } = await supabase
      .from("book_nook_posts")
      .select("*, authors(id, pen_name, avatar_url)")
      .eq("nook_id", id)
      .order("created_at", { ascending: false });

    setPosts(updatedPosts ?? []);
    setPosting(false);
  };

  if (!nook) {
    return <p className="p-6 text-center text-zinc-500">Loading Nook...</p>;
  }

  return (
    <div className="min-h-screen bg-white text-zinc-800 font-[Inter] px-6 sm:px-10 lg:px-[12vw] xl:px-[16vw] py-24">
      <div className="w-full mx-auto space-y-32 max-w-screen-xl">
        {/* BACK LINK */}
        <div className="mb-12">
          <a
            href="/nooks"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-800 transition text-sm font-medium"
          >
            ← Back to Nooks
          </a>
        </div>

        {/* HEADER */}
        <header className="space-y-10 text-center">
          <h1 className="text-[3.2rem] sm:text-[4rem] font-extrabold tracking-tight leading-tight text-zinc-900">
            {nook.title}
          </h1>
          <p className="text-xl sm:text-[1.35rem] text-zinc-500 leading-relaxed max-w-2xl mx-auto">
            {nook.description}
          </p>
          <div className="flex flex-wrap justify-center gap-5 text-sm sm:text-base text-zinc-500 font-medium">
            <Badge icon={<BookOpen size={16} />} label="Book Club" />
            <Badge
              icon={<MessageCircle size={16} />}
              label="Discussions Open"
              color="blue"
            />
            <Badge
              icon={<Users size={16} />}
              label={`${nook.member_count} Members`}
              color="yellow"
            />
            <Badge
              icon={<Tag size={16} />}
              label={
                (nook.book_nook_tags ?? []).map((t: any) => t.tag).join(", ") ||
                "General"
              }
              color="rose"
            />
          </div>
        </header>

        {/* EDITOR */}
        <section className="space-y-6 max-w-3xl mx-auto">
          <EditorContent
            editor={editor}
            className="prose prose-lg sm:prose-xl max-w-none min-h-[240px] p-6 bg-zinc-50 border border-zinc-200 rounded-2xl shadow-inner focus-within:ring-2 focus-within:ring-[#ffc017]/70 outline-none transition-all duration-200"
          />
          {moderationError && (
            <p className="text-base text-red-500 font-semibold">
              {moderationError}
            </p>
          )}
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm italic text-zinc-400 hidden sm:block">
              Be respectful, kind, and clear.
            </span>
            <button
              type="submit"
              disabled={posting}
              onClick={handlePostSubmit}
              className="bg-[#5999ff] hover:bg-[#3b82f5] disabled:bg-zinc-300 text-white font-semibold px-8 py-2.5 rounded-md transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
            >
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </section>

        {/* POSTS */}
        <section ref={parentRef} className="space-y-16 max-w-4xl mx-auto">
          <h2 className="text-[2rem] font-semibold text-zinc-800 tracking-tight text-center">
            Community Posts
          </h2>
          {posts.length === 0 ? (
            <p className="text-center text-base text-zinc-400 italic">
              No posts yet. Be the first to contribute.
            </p>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className="group bg-white border border-zinc-200 hover:border-zinc-200 rounded-[2rem] shadow-[0_2px_14px_rgba(0,0,0,0.04)] hover:shadow-[0_3px_20px_rgba(0,0,0,0.06)] hover:-translate-y-[3px] transition-all p-8 sm:p-10 space-y-6"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      post.authors?.avatar_url
                        ? post.authors.avatar_url
                        : `https://api.dicebear.com/7.x/initials/svg?seed=${
                            post.authors?.pen_name ?? "Guest"
                          }`
                    }
                    alt="avatar"
                    className="w-11 h-11 rounded-full object-cover border border-zinc-300 bg-zinc-100"
                  />
                  <div className="text-sm leading-tight">
                    <p className="font-medium text-zinc-800">
                      {post.authors?.pen_name ?? "Guest"}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {new Date(post.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div
                  className="prose prose-lg sm:prose-xl max-w-none text-zinc-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <div className="pt-2 flex gap-6 text-sm text-zinc-500 opacity-100 group-hover:opacity-100 transition-opacity">
                  <button className="hover:text-[#ffc017] flex items-center gap-1 group">
                    <Heart
                      size={14}
                      className="group-hover:scale-110 transition-transform"
                    />{" "}
                    Like
                  </button>
                  <button className="hover:text-[#ffc017] flex items-center gap-1 group">
                    <MessageCircle size={14} /> Reply
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

function Badge({
  icon,
  label,
  color = "green",
}: {
  icon: React.ReactNode;
  label: string;
  color?: "green" | "blue" | "yellow" | "rose";
}) {
  const colorMap: any = {
    green: "text-[#3bf58f] hover:bg-[#3bf58f]/10",
    blue: "text-[#3b82f5] hover:bg-[#3b82f5]/10",
    yellow: "text-[#ffc017] hover:bg-[#ffc017]/10",
    rose: "text-[#f53b41] hover:bg-[#f53b41]/10",
  };
  return (
    <div
      className={`flex items-center gap-1 px-2 py-1 rounded-md transition cursor-pointer ${colorMap[color]}`}
    >
      {icon} {label}
    </div>
  );
}

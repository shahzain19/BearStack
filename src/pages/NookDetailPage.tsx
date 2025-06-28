import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function NookDetailPage() {
  const { id } = useParams();
  const [nook, setNook] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchNook = async () => {
      const { data } = await supabase.from("book_nooks").select("*").eq("id", id).single();
      setNook(data);
    };
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("book_nook_posts")
        .select("*, authors(id, pen_name, avatar_url)")
        .eq("nook_id", id)
        .order("created_at", { ascending: false });
      setPosts(data? [] : []);
    };
    fetchNook();
    fetchPosts();
  }, [id]);

  if (!nook) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{nook.title}</h1>
      <p className="text-gray-600">{nook.description}</p>
      <div className="my-4">
        {nook.tags?.map((tag: string) => (
          <span
            key={tag}
            className="mr-2 text-sm bg-bearCream text-bearBrown px-2 py-0.5 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>
      <hr className="my-4" />
      <h2 className="text-xl font-semibold mb-2">Posts</h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-xl shadow">
            <div className="flex items-center mb-2">
              <img
                src={post.authors.avatar_url}
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="font-semibold">{post.authors.pen_name}</span>
            </div>
            <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

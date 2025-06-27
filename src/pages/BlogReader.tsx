import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  created_at: string;
};

export default function BlogReader() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!error && data) setPost(data);
    };

    fetchPost();
  }, [slug]);

  if (!post) return <div className="text-center py-20">Loading blog post...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <p className="text-sm text-gray-400 mb-2">
        {new Date(post.created_at).toLocaleDateString()}
      </p>
      <h1 className="text-3xl font-bold mb-6">{post.title}</h1>
      <div className="prose prose-lg text-gray-800 max-w-none whitespace-pre-line">
        {post.content}
      </div>
    </div>
  );
}
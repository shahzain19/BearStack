// BlogList.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  created_at: string;
};

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("id, title, slug, created_at")
        .order("created_at", { ascending: false });

      if (!error && data) setPosts(data);
    };

    fetchBlogs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-extrabold mb-6 text-center">
        🧸 BearStacks Blog
      </h1>
      <p className="text-center text-gray-600 mb-12">
        Tips, guides, and cozy updates from the team.
      </p>

      <div className="space-y-8">
        {posts.map((post) => (
          <Link
            to={`/blog/${post.slug}`}
            key={post.id}
            className="block border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all bg-white"
          >
            <p className="text-xs text-gray-400 mb-1">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
            <h2 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition">
              {post.title}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

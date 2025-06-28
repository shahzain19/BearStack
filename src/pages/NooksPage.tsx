import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

export default function NooksPage() {
  const [nooks, setNooks] = useState<any[]>([]);

  useEffect(() => {
    const fetchNooks = async () => {
      const { data, error } = await supabase
        .from("book_nooks")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setNooks(data);
    };
    fetchNooks();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Book Nooks</h1>
      <Link
        to="/nook/create"
        className="inline-block px-4 py-2 mb-4 bg-bearBrown text-white rounded-xl"
      >
        + Create Nook
      </Link>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {nooks.map((nook) => (
          <Link
            key={nook.id}
            to={`/nook/${nook.id}`}
            className="p-4 rounded-2xl bg-white shadow hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">{nook.title}</h2>
            <p className="text-sm text-gray-500">{nook.description}</p>
            <div className="mt-2 text-xs text-bearBrown">
              {nook.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="mr-1 px-2 py-0.5 bg-bearCream text-bearBrown rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
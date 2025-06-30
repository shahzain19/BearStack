import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

export default function NooksPage() {
  const [nooks, setNooks] = useState<any[]>([]);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-[#FAFAFA] py-16 px-6 font-[Inter]">
      <div className="max-w-6xl mx-auto">
        {/* Go Back Link */}
        <button
          onClick={() => navigate("/")}
          className="mb-4 text-sm text-gray-500 hover:text-[#5999ff] transition flex items-center gap-1"
        >
          <span className="text-lg">←</span> Go Back
        </button>

        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-[Merriweather] font-bold text-gray-900 tracking-tight">
            Book Nooks
          </h1>

          <Link
            to="/nook/create"
            className="flex items-center gap-2 px-5 py-3 bg-[#5999ff] hover:bg-[#3b82f6] text-white rounded-md shadow-sm hover:shadow-md transition-all"
          >
            <Plus size={18} /> Create Nook
          </Link>
        </div>

        {nooks.length === 0 ? (
          <div className="text-center text-gray-500 mt-20 text-lg">
            No nooks yet. Be the first to create one!
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {nooks.map((nook) => (
              <Link
                key={nook.id}
                to={`/nook/${nook.id}`}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100 group"
              >
                <h2 className="text-xl font-semibold text-gray-800 group-hover:text-[#5999ff] transition">
                  {nook.title}
                </h2>

                <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                  {nook.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

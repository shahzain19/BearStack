import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  ArrowUpRight,
  BookOpen,
  Info,
  LayoutDashboard,
  PenLine,
  Search,
  X,
} from "lucide-react";

export default function Landing() {
  const [session, setSession] = useState<null | unknown>(null);
  const [checking, setChecking] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [, setBlogs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [, setBlogsLoading] = useState(true);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/library?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("title, slug, content")
        .order("created_at", { ascending: false })
        .limit(4); // latest 3 blogs

      if (!error && data) setBlogs(data);
      setBlogsLoading(false);
    };

    fetchBlogs();
  }, []);

  const iconMap = {
    Library: <BookOpen className="w-4 h-4 mr-1" />,
    Dashboard: <LayoutDashboard className="w-4 h-4 mr-1" />,
    Editor: <PenLine className="w-4 h-4 mr-1" />,
  };

  type IconName = keyof typeof iconMap;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (!checking && session) {
    return <Navigate to="/library" replace />;
  }

  return (
    <div className="font-[Cardo] min-h-screen flex flex-col bg-[#2e2216] text-[#f3e9d2]">
      {/* Header */}
      <header className="w-full flex items-center justify-between py-6 px-12 bg-transparent fixed top-0 z-50 backdrop-blur-2xl">
        <h1 className="text-2xl font-bold text-white">BearStacks</h1>
        <nav className="hidden md:flex gap-6 text-sm text-gray-200">
          <Link to="/library">Library</Link>
          <Link to="/blogs">Blogs</Link>
          <Link to="/nooks">Nooks</Link>
          <Link to="/about">About</Link>
        </nav>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-indigo-700 hover:bg-indigo-600 text-white font-medium px-4 py-2 rounded-xl text-sm shadow-md"
        >
          <ArrowUpRight className="w-4 h-4" /> Login
        </Link>
      </header>

      {/* Hero */}
      <section
        className="relative flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat min-h-screen"
        style={{
          backgroundImage: "url('/LibraryBg2.jpg')",
        }}
      >
        <div className="relative max-w-5xl z-10 w-full">
          <div className="relative mb-6 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="w-full rounded-full border border-gray-800 py-2 px-4 pr-10 text-sm text-white backdrop-blur-sm focus:outline-none focus:ring-transparent"
            />
            {searchQuery && (
              <button
                onClick={handleSearch}
                className="absolute right-3 top-2.5 text-amber-500"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          <h2 className="font-[MedievalSharp] text-4xl sm:text-8xl font-extrabold tracking-tight leading-tighter glassy-text">
            Discover Books & <br /> Share Yours
          </h2>

          <p className="text-gray-200 text-base mt-4 max-w-md mx-auto">
            A warm reading and writing space for creators and book lovers.
            Explore original stories, write your own, and build your cozy
            digital library.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/library"
              className="inline-flex items-center gap-2 px-9 py-4 bg-gradient-to-r from-yellow-500 to-indigo-600 hover:from-yellow-400 hover:to-amber-500 text-white text-base font-semibold rounded-full shadow-[0_4px_24px_rgba(255,200,100,0.3)] transition duration-300 backdrop-blur-md"
            >
              <BookOpen className="w-5 h-5" /> Start Reading
            </Link>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-9 py-4 bg-transparent text-white text-base font-semibold rounded-full shadow-[0_4px_24px_rgba(255,150,150,0.3)] transition duration-300 backdrop-blur-md"
            >
              <Info className="w-5 h-5" /> Learn More
            </Link>
          </div>

          <p className="text-sm text-gray-300 mt-4">
            Free Forever ~ No login for browsing books
          </p>
        </div>
      </section>

      <section
        className="relative py-24 px-4 text-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/LibraryBg3.jpg')" }}
      >
        <h3 className="text-[48px] font-bold mb-6 text-white">
          Inside BearStacks
        </h3>
        <p className="text-[20px] max-w-xl mx-auto mb-12 text-white/80">
          A cozy tour through your Library, Dashboard, and Editor — plus
          features you’ll love.
        </p>

        {/* Screenshots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
          {(["Library", "Dashboard", "Editor"] as IconName[]).map((name) => (
            <div
              key={name}
              className="group relative overflow-hidden rounded-xl shadow-md transform hover:scale-105 transition border border-white/20 cursor-pointer"
              onClick={() => setSelectedImage(`/${name}.png`)}
            >
              <img
                src={`/${name}.png`}
                alt={name}
                className="rounded-xl object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition">
                <span className="text-sm font-semibold flex items-center">
                  {iconMap[name]} {name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <h4 className="text-3xl font-bold mb-10 text-white">
          Features You'll Love
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto text-left text-white/90 text-sm">
          {[
            {
              icon: "📖",
              title: "Build Your Shelf",
              desc: "Create a digital bookshelf of everything you're reading and writing.",
            },
            {
              icon: "✍️",
              title: "Write Beautifully",
              desc: "Use our cozy editor to write books, journals, or daily thoughts.",
            },
            {
              icon: "💬",
              title: "Community Vibes",
              desc: "Discover a friendly and growing space made for readers and writers.",
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col gap-2 hover:scale-105 transition"
            >
              <div className="text-3xl">{icon}</div>
              <p className="text-lg font-semibold">{title}</p>
              <p>{desc}</p>
            </div>
          ))}
        </div>

        {/* Screenshot Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative max-w-4xl w-full p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-white hover:text-red-400 transition"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={selectedImage}
                alt="Full view"
                className="w-full rounded-xl shadow-xl"
              />
            </div>
          </div>
        )}
      </section>

      {/* Books of the Month */}
      <section
        className="relative py-20 px-4 text-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/LibraryBg.png')" }}
      >
        <h3 className="text-[72px] font-extrabold mb-8 tracking-[-5px]">
          Books of the Month
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {["1750840837967.png", "1750702725861.png", "1750688847649.png"].map(
            (cover) => (
              <img
                key={cover}
                src={`https://vexyakzszbzcigwyxynv.supabase.co/storage/v1/object/public/book-covers/covers/${cover}`}
                className="rounded-xl shadow hover:scale-105 transition"
              />
            )
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="relative py-24 px-4 text-center bg-cover bg-center bg-no-repeat animate-fade-in"
        style={{ backgroundImage: "url('/LibraryBg8.jpg')" }}
      >
        <h3 className="text-4xl font-extrabold mb-4">Join BearStacks Today</h3>
        <p className="mb-8 opacity-80 text-md max-w-xl mx-auto">
          Whether you’re a reader, a writer, or somewhere in between — this
          space is for you.
        </p>
        <Link
          to="/login"
          className="bg-bearBrown hover:bg-pandaBlack text-polarWhite font-semibold px-10 py-4 rounded-full shadow-lg text-lg transition transform hover:scale-105"
        >
          Create Free Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="p-4 text-center text-sm opacity-70 bg-transparent text-[#d9d9d9]">
        Made with ❤️ • © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

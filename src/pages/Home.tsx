import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  BookOpen,
  Info,
  LayoutDashboard,
  PenLine,
  X,
} from "lucide-react";

export default function Landing() {
  const [session, setSession] = useState<null | unknown>(null);
  const [checking, setChecking] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
    <div className="min-h-screen flex flex-col bg-[#fff3cd] text-[#2e2e2e]">
      {/* Header */}
      <header className="glass-navbar p-4 flex justify-between items-center mx-4 mt-4 rounded-2xl shadow-lg backdrop-blur-md text-[#2e2e2e] relative z-50">
        <div className="flex items-center gap-2">
          <img src="/icon.png" alt="BearStacks Logo" className="w-8 h-8" />
          <h1 className="text-2xl font-bold tracking-tight">BearStacks</h1>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative min-h-screen bg-gradient-to-b from-[#fff3cd] via-[#fff8e6] to-white overflow-hidden px-6 sm:px-12 pt-0 pb-20 flex items-center"
        style={{
          opacity: 0.9,
        }}
      >
        {/* Background Blobs + Sparkles */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          {/* Original Blobs */}
          <div className="absolute w-[450px] h-[450px] bg-amber-300 rounded-full opacity-30 blur-[120px] top-[-100px] left-[-100px] animate-float-slow" />
          <div className="absolute w-[450px] h-[450px] bg-amber-300 rounded-full opacity-30 blur-[120px] top-[50px] left-[-150px] animate-float-reverse" />
          <div className="absolute w-72 h-72 bg-indigo-200 rounded-full blur-3xl bottom-20 right-20 animate-float" />
          <div className="absolute w-64 h-64 bg-pink-200 rounded-full blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float-reverse" />
          <div className="absolute w-52 h-52 bg-emerald-200 rounded-full blur-[90px] top-10 right-10 animate-float-slow" />
          <div className="absolute w-40 h-40 bg-blue-100 rounded-full blur-[70px] bottom-10 left-16 animate-float-reverse" />
          <div className="absolute w-36 h-36 bg-yellow-100 rounded-full opacity-30 blur-[80px] top-1/3 left-12 animate-float" />
          <div className="absolute w-24 h-24 bg-pink-100 rounded-full opacity-20 blur-[60px] top-10 left-1/2 -translate-x-1/2 animate-float" />

          {/* Sparkles */}
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-[2px] h-[2px] bg-white rounded-full blur-sm animate-pulse`}
              style={{
                top: `${Math.random() * 90}%`,
                left: `${Math.random() * 90}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center w-full z-10">
          {/* Left Text Section */}
          <div className="text-center md:text-left">
            <span className="bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-sm font-medium mb-4 inline-block shadow-sm">
              ✨ Discover + Create + Share
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              Your Cozy Corner for <br className="hidden md:block" />
              Reading & Writing 📚
            </h1>

            <p className="text-gray-600 text-lg max-w-xl mb-8 mx-auto md:mx-0">
              From magical adventures to your own original tales —
              <span className="text-indigo-600 font-semibold">
                {" "}
                BearStacks{" "}
              </span>
              is your home to read, write, and share books in a
              <span className="font-semibold text-gray-800">
                {" "}
                beautiful{" "}
              </span>{" "}
              and
              <span className="font-semibold text-gray-800"> simple </span> way.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 mb-4">
              <Link
                to="/library"
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition transform hover:scale-105 flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                Get Started Free
              </Link>
              <Link
                to="/about"
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-3 rounded-full transition transform hover:scale-105 flex items-center gap-2"
              >
                <Info className="w-5 h-5" />
                Learn More
              </Link>
            </div>

            <p className="text-sm text-gray-500">
              100% free — start your cozy reading & writing journey today!
            </p>
          </div>

          {/* Right Image Section */}
          <div className="flex justify-center md:justify-end">
            <img
              src="/Library.png"
              alt="BearStacks Preview"
              className="rounded-3xl w-[320px] sm:w-[400px] md:w-[600px] transition hover:scale-[1.02]"
            />
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="bg-[#fffef7] py-20 px-4 text-center">
        <h3 className="text-3xl font-bold mb-6">A Peek Inside BearStacks</h3>
        <p className="text-sm max-w-xl mx-auto mb-12 opacity-80">
          Screenshots from our cozy corners — your library, dashboard, and story
          editor.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {(["Library", "Dashboard", "Editor"] as IconName[]).map((name) => (
            <div
              key={name}
              className="group relative overflow-hidden rounded-xl shadow-md transform hover:scale-105 transition border border-gray-300/70 cursor-pointer"
              onClick={() => setSelectedImage(`/${name}.png`)}
            >
              <img
                src={`/${name}.png`}
                alt={name}
                className="rounded-xl object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition">
                <span className="text-sm font-semibold flex items-center">
                  {iconMap[name]} {name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative max-w-4xl w-full p-4"
              onClick={(e) => e.stopPropagation()} // prevent closing on image click
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

      {/* Features */}
      <section className="bg-white py-20 px-4 text-center">
        <h3 className="text-3xl font-bold mb-12">🌟 Features You’ll Love</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto text-left text-sm">
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
      </section>

      {/* Books of the Month */}
      <section className="bg-[#fffef7] py-20 px-4 text-center">
        <h3 className="text-3xl font-bold mb-8">📚 Books of the Month</h3>
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

      {/* FAQ */}
      <section className="bg-white py-20 px-4 text-center">
        <h3 className="text-3xl font-bold mb-10">
          ❓ Frequently Asked Questions
        </h3>
        <div className="max-w-3xl mx-auto text-left space-y-6 text-sm opacity-80">
          <div>
            <p className="font-semibold">Is BearStacks free?</p>
            <p>Yes! All core features are free for all users.</p>
          </div>
          <div>
            <p className="font-semibold">Can I write my own stories?</p>
            <p>
              Absolutely. Cozy Bear has a distraction-free, beautiful writing
              editor.
            </p>
          </div>
          <div>
            <p className="font-semibold">Is this like Goodreads?</p>
            <p>
              Sort of — but think more personal, less corporate, and a lot more
              cozy 🧸
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#fff3cd] py-24 px-4 text-center animate-fade-in">
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
      <footer className="p-4 text-center text-sm opacity-70">
        Made with ❤️ • © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

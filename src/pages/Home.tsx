import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Landing() {
  const [session, setSession] = useState<null | unknown>(null);
  const [checking, setChecking] = useState(true);

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
      <header className="shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          BearStacks
        </h1>
        {!session && (
          <nav className="space-x-4 text-sm">
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/signup" className="hover:underline">
              Sign up
            </Link>
          </nav>
        )}
      </header>

      {/* Hero */}
      <section className="min-h-[100vh] flex flex-col justify-center items-center text-center px-4 bg-[#fff3cd]">
        <h2 className="text-4xl font-extrabold mb-4">Welcome to Your New Favorite Library (I hope)
          
        </h2>
        <p className="max-w-xl text-lg mb-6 opacity-80">
         Whether you're diving into fantasy worlds, documenting your knowledge, or crafting your own stories, Cozy Bear Library helps you organize it all in one beautiful place — made with readers like you in mind.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/signup"
            className="bg-bearBrown hover:bg-pandaBlack text-polarWhite font-semibold px-6 py-3 rounded-full shadow transition"
          >
            Get Started It's Free!
          </Link>
          <Link
            to="/about"
            className="bg-amber-700  text-white hover:bg-amber-800 text-bearBrown font-semibold px-6 py-3 rounded-full transition"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className=" py-16 px-4 text-center">
        <h3 className="text-2xl font-bold mb-6">How It Works</h3>
        <div className="max-w-3xl mx-auto space-y-4 text-sm opacity-80">
          <p>Create your shelf – Sign up and instantly start building your personal library.</p>
          <p>Track and write – Log what you're reading, write your own stories, and organize your book life.</p>
          <p>Discover new authors and explore books you’ll love — curated by our community of passionate readers.</p>
        </div>
      </section>

      {/* Books of the Month */}
      <section className="bg-[#fffef7] py-16 px-4 text-center">
        <h3 className="text-2xl font-bold mb-8">📚 Books of the Month</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <img
              src={`https://vexyakzszbzcigwyxynv.supabase.co/storage/v1/object/public/book-covers/covers/1750840837967.png`}
              className="rounded-xl shadow hover:scale-105 transition"
            />
            <img
              src={`https://vexyakzszbzcigwyxynv.supabase.co/storage/v1/object/public/book-covers/covers/1750702725861.png`}
              className="rounded-xl shadow hover:scale-105 transition"
            />
            <img
              src={`https://vexyakzszbzcigwyxynv.supabase.co/storage/v1/object/public/book-covers/covers/1750688847649.png`}
              className="rounded-xl shadow hover:scale-105 transition"
            />
           
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 px-4 text-center">
        <h3 className="text-2xl font-bold mb-8">❓ FAQ</h3>
        <div className="max-w-3xl mx-auto text-left space-y-6 text-sm opacity-80">
          <div>
            <p className="font-semibold">Is Cozy Bear free?</p>
            <p>Yes! All basic features are completely free.</p>
          </div>
          <div>
            <p className="font-semibold">Can I write my own stories?</p>
            <p>Absolutely — Cozy Bear includes a beautiful editor just for you.</p>
          </div>
          <div>
            <p className="font-semibold">Is this like Goodreads?</p>
            <p>Think of it like Goodreads, but warmer, friendlier, and more personal 🧸</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#fff8e6] py-20 px-4 text-center">
        <h3 className="text-2xl font-bold mb-4">Join BearStacks Online</h3>
        <p className="mb-6 opacity-80 text-sm">
          Thousands of readers are tracking, writing, and loving their books every day.
        </p>
        <Link
          to="/signup"
          className="font-semibold px-8 py-4 rounded-full shadow transition"
        >
          Create Free Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="p-4 text-center text-sm opacity-70">
        Made with 🧸 by book lovers • © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

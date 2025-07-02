// src/pages/Profile.tsx

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  Loader,
  Sparkles,
  Calendar,
  Fingerprint,
  Link2,
  Boxes,
  Package,
  Archive,
} from "lucide-react";
import MagicBadge from "../components/MagicBadge";
import { Link } from "react-router-dom";
import CreateShelfBox from "../components/CreateShelfBox";
import WizardCardReveal from "../components/MagicCardReveal";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [badges, setBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [shelves, setShelves] = useState<any[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [showCard, setShowCard] = useState(() => {
    return localStorage.getItem("wizardCardShown") !== "true";
  });

  useEffect(() => {
    const fetchShelves = async () => {
      const { data } = await supabase
        .from("shelves")
        .select("id, name")
        .order("created_at");
      setShelves(data || []);
    };
    fetchShelves();
  }, []);

  useEffect(() => {
    const getUserAndBadges = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return setLoading(false);
      setUser(user);

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("badges, role")
        .eq("id", user.id)
        .single();

      if (error) console.error("Error fetching badges:", error.message);
      else {
        setBadges(profile?.badges || []);
        setRole(profile?.role || null);
      }

      setLoading(false);
    };

    getUserAndBadges();
  }, []);

  function getUserGradient(userId: string) {
    const gradients = [
      "from-pink-400 via-purple-400 to-yellow-300",
      "from-green-300 via-blue-500 to-purple-600",
      "from-orange-400 via-red-500 to-pink-500",
      "from-teal-400 via-cyan-500 to-blue-600",
      "from-yellow-300 via-pink-500 to-purple-500",
      "from-indigo-400 via-blue-400 to-cyan-400",
      "from-rose-400 via-fuchsia-500 to-indigo-500",
    ];
    const hash = userId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
  }

  const handleCardDone = () => {
    localStorage.setItem("wizardCardShown", "true");
    setShowCard(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Loader className="animate-spin w-6 h-6 text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-base font-medium">
        You’re not logged in.
      </div>
    );
  }

  const avatar = user.user_metadata?.avatar_url;
  const name = user.user_metadata?.full_name || "Anonymous";
  const email = user.user_metadata?.email || "Anonymous";

  return (
    <div className="min-h-screen px-6 py-20 font-sans text-gray-900">
      {showCard && <WizardCardReveal onDone={handleCardDone} />}

      <div className="max-w-5xl mx-auto flex flex-col gap-14">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <div className="relative w-28 h-28 shrink-0">
            <div
              className={`absolute inset-0 rounded-full p-1 overflow-hidden bg-gradient-to-r ${getUserGradient(
                user.id
              )}`}
            >
              <img
                src={avatar}
                alt={`${name}'s avatar`}
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
          </div>

          <div className="text-center sm:text-left w-full font-serif">
            <h1 className="text-5xl font-bold">{name}</h1>
            <p className="text-gray-500 text-lg mt-1">{email}</p>
            <p className="text-sm text-gray-400 mt-2 italic">
              “A reader lives a thousand lives before he dies.” – George R.R.
              Martin
            </p>

            {badges.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl text-gray-400 font-bold mb-3">
                  Your Badges
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {badges.map((badge, idx) => (
                    <MagicBadge key={idx} label={badge} rarity="common" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">🧺 Your Shelves</h2>

          {shelves.length < 5 ? (
            <div className="w-full sm:w-fit">
              <CreateShelfBox
                onCreated={() => {
                  supabase
                    .from("shelves")
                    .select("id, name")
                    .order("created_at")
                    .then(({ data }) => setShelves(data || []));
                }}
              />
            </div>
          ) : (
            <div className="mt-2 text-sm text-red-500 italic">
              ✋ Whoa! You can only have up to 5 shelves for now.
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-6">
            {shelves.map((shelf, i) => (
              <Link
                key={shelf.id}
                to={`/shelf/${shelf.id}`}
                className={`relative group p-6 rounded-xl shadow-md hover:shadow-xl transition-all border ${
                  role === "admin"
                    ? "bg-gradient-to-br from-[#e0f8f2] via-[#d0f0ff] to-[#c7e6ff] border-[#a0e3d3]"
                    : "bg-gradient-to-br from-[#fffaf1] to-[#f9f4ea] border-[#e8dccb]"
                }`}
              >
                <div className="text-[#7a4f35] font-bold text-2xl mb-1 flex items-center gap-2">
                  <Package className="w-6 h-6" /> {shelf.name}
                </div>
                <p className="text-sm text-[#b39a85] italic flex items-center gap-2">
                  <Archive className="w-4 h-4" /> Shelf #{i + 1}
                </p>
                <span className="absolute top-2 right-2 text-[10px] bg-[#f1e4d1] text-[#8c6346] px-2 py-[2px] rounded-full shadow-sm flex gap-2">
                  <Boxes className="w-4 h-4" />{" "}
                  {shelf.id.slice(0, 8).toUpperCase()}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-3xl border-2 border-gray-200 bg-white shadow-md hover:shadow-lg transition overflow-hidden">
            <div
              className={`h-24 relative ${
                role === "admin"
                  ? "bg-gradient-to-r from-[#b2fce4] via-[#c4eaff] to-[#d0fff3]"
                  : `bg-gradient-to-r ${getUserGradient(user.id)}`
              }`}
            >
              <div className="absolute bottom-[-2rem] left-6 flex items-center gap-4">
                <div
                  className={`w-20 h-20 rounded-full border-4 shadow-lg ${
                    role === "admin"
                      ? "p-[2px] bg-gradient-to-r from-[#42e6b5] via-[#57d5ff] to-[#42e6b5] border-transparent"
                      : "p-0 bg-white"
                  }`}
                >
                  <img
                    src={avatar}
                    alt="User Avatar"
                    className="w-full h-full rounded-full object-cover border-4 border-white"
                  />
                </div>
                <div>
                  <h2
                    className={`text-lg font-semibold ${
                      role === "admin" ? "text-black" : "text-white"
                    }`}
                  >
                    {name}
                  </h2>
                  <div
                    className={`mt-1 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium border ${
                      role === "admin"
                        ? "bg-green-100 text-green-800 border-green-300"
                        : "bg-yellow-100 text-yellow-800 border-yellow-200"
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    {role === "admin" ? "Premium Admin" : "Gold Reader"}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-16 pb-6 px-6 sm:px-8 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-700">
                <div>
                  <span className="text-gray-400 flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> Spawned
                  </span>
                  <p className="font-medium">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 flex items-center gap-1">
                    <Fingerprint className="w-4 h-4" /> Member ID
                  </span>
                  <p className="text-xs px-2 py-1 bg-gray-100 border border-gray-300 rounded shadow-sm">
                    #{user.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 flex items-center gap-1">
                    <Link2 className="w-4 h-4" /> Provider
                  </span>
                  <p className="font-medium">Google</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-[#fffdef] border border-yellow-200 p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition">
          <Sparkles className="w-5 h-5 text-yellow-600 mt-1" />
          <p className="text-sm leading-relaxed text-gray-800">
            Did you know? The average reader can finish about{" "}
            <b>50 books a year</b> by just reading 30 minutes a day!
          </p>
        </div>

        {role === "admin" && (
          <div className="rounded-3xl border-4 border-yellow-300 bg-gradient-to-br from-[#fff4d6] via-[#ffe6b3] to-[#ffec99] p-6 shadow-[0_4px_24px_rgba(255,215,0,0.4)] mt-10">
            <h3 className="text-2xl font-bold text-yellow-800 flex items-center gap-3 mb-3">
              👑 Premium Admin
            </h3>
            <p className="text-sm text-yellow-900 leading-relaxed">
              You're not just a reader — you're a keeper of stories. Enjoy full
              access to moderation tools, author management, and curation
              controls.✨
            </p>
            <div className="mt-5">
              <Link
                to="/admin"
                className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white text-sm px-5 py-2 rounded-full shadow-lg transition"
              >
                Open Admin Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

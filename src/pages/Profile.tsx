// src/pages/Profile.tsx

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Loader, Sparkles, Calendar, Fingerprint, Link2 } from "lucide-react";
import MagicBadge from "../components/MagicBadge";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [badges, setBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserAndBadges = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUser(user);

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("badges")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching badges:", error.message);
      } else {
        setBadges(profile?.badges || []);
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
    <div className="min-h-screen px-6 py-20 font-[Inter] text-gray-900">
      <div className="max-w-4xl mx-auto flex flex-col gap-16">
        {/* Profile Header */}
        <div className="flex items-center gap-6">
          <div className="relative w-28 h-28">
            <div
              className={`absolute inset-0 rounded-full p-1 overflow-hidden bg-gradient-to-r ${getUserGradient(
                user.id
              )}`}
            >
              <img
                src={avatar}
                alt={name}
                className="w-full h-full rounded-full object-cover border-4 border-white shadow"
              />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold leading-tight">{name}</h1>
            <p className="text-gray-500 text-base mt-1">{email}</p>
            <p className="text-sm text-gray-400 mt-2 italic">
              “A reader lives a thousand lives before he dies.” – George R.R.
              Martin
            </p>

            {badges.length > 0 && (
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {badges.map((badge, idx) => (
                  <MagicBadge key={idx} label={badge} rarity="common" />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Library Card */}
          <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition">
            {/* Gradient Banner */}
            <div
              className={`bg-gradient-to-r ${getUserGradient(
                user.id
              )} h-24 relative`}
            >
              <div className="absolute bottom-[-2rem] left-6 flex items-center gap-4">
                <img
                  src={avatar}
                  alt={name}
                  className="w-20 h-20 rounded-full border-4 border-white shadow object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold text-white">{name}</h2>
                  <div className="mt-1 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                    <Sparkles className="w-4 h-4" /> Gold Reader
                  </div>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="pt-16 pb-6 px-6 sm:px-8 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-700">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> Spawned
                  </span>
                  <span className="font-medium">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Fingerprint className="w-4 h-4" /> Member ID
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-100 border border-gray-300 rounded shadow-sm">
                    #{user.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Link2 className="w-4 h-4" /> Provider
                  </span>
                  <span className="text-gray-800 font-medium">Google</span>
                </div>
              </div>
            </div>
          </div>

          {/* Book Stats */}
          <div className="rounded-2xl border border-gray-200 shadow-sm p-6 bg-white hover:shadow-md transition">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              📊 Reading Stats
            </h2>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>
                <strong>Books Read:</strong> 12 (soon dynamic)
              </li>
              <li>
                <strong>Currently Reading:</strong> The Wind-Up Bird Chronicle
              </li>
              <li>
                <strong>Favorites:</strong> 3
              </li>
            </ul>
          </div>
        </div>

        {/* Trivia */}
        <div className="rounded-2xl bg-[#fffdef] border border-yellow-200 p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition">
          <Sparkles className="w-5 h-5 text-yellow-600 mt-1" />
          <div className="text-sm leading-relaxed text-gray-800">
            Did you know? The average reader can finish about{" "}
            <b>50 books a year</b> by just reading 30 minutes a day!
          </div>
        </div>
      </div>
    </div>
  );
}

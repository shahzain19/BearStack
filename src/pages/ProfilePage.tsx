import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { BookOpen, Star, CalendarDays, Trophy } from "lucide-react";

interface Badge {
  awarded_at: string;
  badges: {
    title: string;
    description: string;
    icon: string;
  };
}

interface UserStats {
  booksRead: number;
  pagesRead: number;
  reviewsWritten: number;
}

export default function ProfilePage() {
  const { id } = useParams(); // user ID from route
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    const fetchUsername = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", id)
        .single();
      if (data?.username) setUsername(data.username);
    };

    const fetchBadges = async () => {
      const { data, error } = await supabase
        .from("user_badges")
        .select("awarded_at, badges:badge_id(title, description, icon)")
        .eq("user_id", id);

      if (!error && data) {
        setBadges(data as unknown as Badge[]);
      }
    };

    const fetchStats = async () => {
      const booksRead = await supabase
        .from("books_read")
        .select("*", { count: "exact", head: true })
        .eq("user_id", id);

      const reviews = await supabase
        .from("book_reviews")
        .select("*", { count: "exact", head: true })
        .eq("user_id", id);

      const pages = await supabase
        .from("reading_sessions")
        .select("pages")
        .eq("user_id", id);

      const pagesRead =
        pages.data?.reduce((sum, session) => sum + (session.pages || 0), 0) || 0;

      setUserStats({
        booksRead: booksRead.count || 0,
        pagesRead,
        reviewsWritten: reviews.count || 0,
      });
    };

    fetchUsername();
    fetchStats();
    fetchBadges();
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {username || "User"}'s Profile
        </h1>
        <p className="text-gray-500">A cozy space for book lovers 📖</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Stats */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Reading Stats
          </h2>
          <div className="space-y-2 text-gray-700">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5" />
              <span>Books Read: {userStats?.booksRead ?? "—"}</span>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays className="w-5 h-5" />
              <span>Pages Read: {userStats?.pagesRead ?? "—"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5" />
              <span>Reviews Written: {userStats?.reviewsWritten ?? "—"}</span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Achievements
          </h2>
          {badges.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {badges.map((b, i) => (
                <div
                  key={i}
                  className="bg-yellow-100 p-4 rounded-lg text-center w-28 hover:shadow transition"
                  title={b.badges.description}
                >
                  <div className="text-2xl">{b.badges.icon}</div>
                  <div className="text-sm mt-1 font-medium">
                    {b.badges.title}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No badges yet!</p>
          )}
        </div>
      </div>
    </div>
  );
}

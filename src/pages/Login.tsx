import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error checking session:", error.message);
        return;
      }

      if (data.session) {
        navigate("/");
      }
    };

    checkSession();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      console.error("Google login error:", err.message);
    }
  };

  useEffect(() => {
    const assignRandomBadge = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user profile exists and has badges
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("badges")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Profile fetch error:", error.message);
        return;
      }

      // If no badge, assign one randomly
      if (!profile?.badges || profile.badges.length === 0) {
        const badgePool = [
          "🧙 Wizard",
          "🐻 Bear Buddy",
          "📚 Bookworm",
          "🎨 Creative Cub",
          "🌟 Cozy Reader",
        ];
        const randomBadge = badgePool[Math.floor(Math.random() * badgePool.length)];

        const { error: updateError } = await supabase
          .from("profiles")
          .update({ badges: [randomBadge] })
          .eq("id", user.id);

        if (updateError) {
          console.error("Failed to assign badge:", updateError.message);
        } else {
          console.log(`🎖️ Assigned random badge: ${randomBadge}`);
        }
      }
    };

    assignRandomBadge();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-honey">
      <div className="w-full max-w-sm space-y-6 bg-polarWhite rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-bearBrown">📚 Welcome to BearStacks</h1>
        <p className="text-sm text-gray-600">A cozy place to read and write books</p>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-2 rounded-lg bg-bearBrown
                     hover:bg-pandaBlack transition text-polarWhite font-semibold"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}

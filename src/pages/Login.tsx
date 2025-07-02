// src/pages/Login.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import gsap from "gsap";

function LoginSuccessAnimation({ onComplete }: { onComplete: () => void }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          setShow(false);
          onComplete(); // Navigate after animation
        }, 800);
      },
    });

    tl.fromTo(
      "#magic-book",
      {
        scale: 0,
        opacity: 0,
        rotateY: 0,
      },
      {
        scale: 1,
        opacity: 1,
        rotateY: 720,
        duration: 1.8,
        ease: "back.out(1.7)",
      }
    ).to("#magic-book", {
      scale: 3,
      opacity: 0,
      duration: 1.2,
      ease: "power2.inOut",
      delay: 1,
    });
  }, [onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#fff6e0] to-[#f0e0ff]">
      <div
        id="magic-book"
        className="w-32 h-32 bg-gradient-to-br from-[#8d6e63] to-[#3e2723] rounded-xl flex items-center justify-center shadow-2xl text-white text-3xl font-bold tracking-wide"
      >
        📖
      </div>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error checking session:", error.message);
        return;
      }
      if (data.session) {
        setShowAnimation(true); // Trigger animation
      }
    };
    checkSession();
  }, []);

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
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("badges")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Profile fetch error:", error.message);
        return;
      }

      if (!profile?.badges || profile.badges.length === 0) {
        const badgePool = [
          "🧙 Wizard",
          "🐻 Bear Buddy",
          "📚 Bookworm",
          "🎨 Creative Cub",
          "🌟 Cozy Reader",
        ];
        const randomBadge =
          badgePool[Math.floor(Math.random() * badgePool.length)];

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

  if (showAnimation) {
    return <LoginSuccessAnimation onComplete={() => navigate("/")} />;
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-honey">
      <div className="w-full max-w-sm space-y-6 bg-polarWhite rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-bearBrown">
          📚 Welcome to BearStacks
        </h1>
        <p className="text-sm text-gray-600">
          A cozy place to read and write books
        </p>

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

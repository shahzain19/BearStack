// src/components/MagicBadge.tsx
import {
  Sparkle,
  Star,
  Wand,
  Heart,
  BookOpen,
  ShieldCheck,
  PawPrint,
} from "lucide-react";
import React from "react";

interface MagicBadgeProps {
  label: string;
  rarity?: "common" | "rare" | "epic" | "legendary";
  subtitle?: string;
}

const rarityRing = {
  common: "ring-yellow-300",
  rare: "ring-blue-400",
  epic: "ring-purple-500",
  legendary: "ring-pink-500",
};

const themeMap: Record<
  string,
  {
    bg: string;
    text: string;
    aura: string;
    sparkle: string;
    star: string;
    icon: React.ReactNode;
    shine: string;
  }
> = {
  Wizard: {
    bg: "from-indigo-200 via-indigo-500 to-purple-700",
    text: "text-indigo-50",
    aura: "from-indigo-400 via-indigo-200 to-white",
    sparkle: "text-indigo-200",
    star: "text-indigo-100",
    icon: <Wand className="w-6 h-6 text-indigo-100" />,
    shine: "bg-indigo-100/20",
  },
  Bear: {
    bg: "from-amber-200 via-amber-400 to-amber-600",
    text: "text-amber-50",
    aura: "from-amber-300 via-amber-100 to-white",
    sparkle: "text-amber-200",
    star: "text-amber-100",
    icon: <PawPrint className="w-6 h-6 text-amber-100" />,
    shine: "bg-amber-100/20",
  },
  "Heart of Gold": {
    bg: "from-rose-200 via-rose-500 to-pink-700",
    text: "text-rose-50",
    aura: "from-rose-300 via-rose-100 to-white",
    sparkle: "text-rose-200",
    star: "text-rose-100",
    icon: <Heart className="w-6 h-6 text-rose-100" />,
    shine: "bg-rose-100/20",
  },
  "Scholar Sage": {
    bg: "from-sky-300 via-sky-500 to-blue-600",
    text: "text-sky-50",
    aura: "from-sky-300 via-sky-100 to-white",
    sparkle: "text-sky-200",
    star: "text-sky-100",
    icon: <BookOpen className="w-6 h-6 text-sky-100" />,
    shine: "bg-sky-100/20",
  },
  "Guardian Spirit": {
    bg: "from-lime-300 via-lime-500 to-emerald-600",
    text: "text-lime-50",
    aura: "from-lime-300 via-lime-100 to-white",
    sparkle: "text-lime-200",
    star: "text-lime-100",
    icon: <ShieldCheck className="w-6 h-6 text-lime-100" />,
    shine: "bg-lime-100/20",
  },
};

const MagicBadge: React.FC<MagicBadgeProps> = ({
  label,
  rarity = "common",
  subtitle = "Limited Edition",
}) => {
  const theme = themeMap[label] || {
    bg: "from-yellow-200 via-yellow-400 to-yellow-600",
    text: "text-yellow-50",
    aura: "from-yellow-300 via-yellow-100 to-white",
    sparkle: "text-yellow-200",
    star: "text-yellow-100",
    icon: <Wand className="w-6 h-6 text-yellow-100" />,
    shine: "bg-yellow-100/20",
  };

  return (
    <div
      className={`relative group bg-gradient-to-br ${theme.bg}
        rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)]
        hover:shadow-[0_30px_80px_rgba(0,0,0,0.2)] transition-all duration-500 transform hover:-translate-y-1 hover:rotate-[0.5deg] overflow-hidden`}
    >
      {/* Glow Aura */}
      <div className={`absolute -inset-1 blur-2xl rounded-[1.6rem] z-0 opacity-30 bg-gradient-to-br ${theme.aura} group-hover:opacity-50 transition`} />

      {/* Floating Sparkles */}
      <div className={`absolute top-2 right-2 ${theme.sparkle} animate-ping-slow`}>
        <Sparkle />
      </div>
      <div className={`absolute bottom-2 left-2 ${theme.star} animate-spin-slower`}>
        <Star />
      </div>

      {/* Ripple Hover Wave */}
      <div className="absolute inset-0 rounded-[1.6rem] pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-[-50%] w-[200%] h-full bg-white/5 animate-shimmer" />
      </div>

      {/* Spark Particle Drops */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/20 animate-pulse"
          style={{
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
          }}
        />
      ))}

      {/* Badge Core */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <div
          className={`w-16 h-16 rounded-full bg-white/10
            border-4 border-white shadow-inner flex items-center justify-center mb-4 ring-2
            ${rarityRing[rarity]} animate-orbit`}
        >
          {theme.icon}
        </div>
        <div className={`text-base font-bold ${theme.text} tracking-widest drop-shadow`}>
          {label}
        </div>
        <div className="text-xs text-white/80 italic mt-1">{subtitle}</div>
      </div>
    </div>
  );
};

export default MagicBadge;

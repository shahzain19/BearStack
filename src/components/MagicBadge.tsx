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
    bg: "from-indigo-300 via-purple-500 to-indigo-600",
    text: "text-indigo-50",
    aura: "from-purple-400 via-indigo-200 to-white",
    sparkle: "text-indigo-200",
    star: "text-indigo-100",
    icon: <Wand className="w-6 h-6 text-indigo-100 drop-shadow-glow" />,
    shine: "bg-indigo-100/20",
  },
  Bear: {
    bg: "from-amber-200 via-amber-400 to-orange-600",
    text: "text-amber-50",
    aura: "from-amber-300 via-amber-100 to-white",
    sparkle: "text-amber-200",
    star: "text-amber-100",
    icon: <PawPrint className="w-6 h-6 text-amber-100 drop-shadow-glow" />,
    shine: "bg-amber-100/20",
  },
  "Heart of Gold": {
    bg: "from-rose-300 via-pink-500 to-red-600",
    text: "text-rose-50",
    aura: "from-pink-300 via-rose-100 to-white",
    sparkle: "text-rose-200",
    star: "text-rose-100",
    icon: <Heart className="w-6 h-6 text-rose-100 drop-shadow-glow" />,
    shine: "bg-rose-100/20",
  },
  "Scholar Sage": {
    bg: "from-sky-300 via-blue-500 to-indigo-600",
    text: "text-sky-50",
    aura: "from-sky-300 via-sky-100 to-white",
    sparkle: "text-sky-200",
    star: "text-sky-100",
    icon: <BookOpen className="w-6 h-6 text-sky-100 drop-shadow-glow" />,
    shine: "bg-sky-100/20",
  },
  "Guardian Spirit": {
    bg: "from-lime-300 via-green-500 to-emerald-600",
    text: "text-lime-50",
    aura: "from-lime-300 via-lime-100 to-white",
    sparkle: "text-lime-200",
    star: "text-lime-100",
    icon: <ShieldCheck className="w-6 h-6 text-lime-100 drop-shadow-glow" />,
    shine: "bg-lime-100/20",
  },
};

const MagicBadge: React.FC<MagicBadgeProps> = ({
  label,
  rarity = "epic",
  subtitle = "Enchanted Relic",
}) => {
  const theme = themeMap[label] || {
    bg: "from-yellow-200 via-yellow-400 to-yellow-600",
    text: "text-yellow-50",
    aura: "from-yellow-300 via-yellow-100 to-white",
    sparkle: "text-yellow-200",
    star: "text-yellow-100",
    icon: <Wand className="w-6 h-6 text-yellow-100 drop-shadow-glow" />,
    shine: "bg-yellow-100/20",
  };

  return (
    <div
      className={`
        relative group bg-gradient-to-br ${theme.bg}
        rounded-3xl p-6 overflow-hidden cursor-pointer
        transition-all duration-500 hover:scale-[1.03] hover:-rotate-1
        hover:shadow-[0_30px_90px_rgba(0,0,0,0.4)]
        perspective-1000 transform-style-3d
        animate-[float_6s_ease-in-out_infinite]
        w-45
      `}
    >
      {/* Glowing Aura */}
      <div
        className={`absolute -inset-2 z-0 rounded-[1.8rem] blur-3xl bg-gradient-to-br ${theme.aura} opacity-40 animate-pulse`}
      />

      {/* Magical Swirl Background */}
      <div className="absolute w-full h-full animate-spin-slower opacity-10">
        <div className="w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Glow Border Pulse */}
      <div className="absolute inset-0 rounded-[1.6rem] border border-white/10 animate-glow-ring" />

      {/* Spell Ring */}
      <div className="absolute left-1/2 top-1/2 w-48 h-48 border border-dashed border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2 animate-spin-slower" />

      {/* Magic Particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse-slow"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Floating Icon */}
      <div
        className={`w-20 h-20 rounded-full bg-white/10 ring-4 shadow-inner flex items-center justify-center mb-4 mx-auto ${rarityRing[rarity]} animate-bounce-slow z-10`}
      >
        {theme.icon}
      </div>

      {/* Label & Subtitle */}
      <div className="text-center z-10 relative">
        <div
          className={`text-lg font-bold ${theme.text} tracking-widest drop-shadow-md glow-text`}
        >
          {label}
        </div>
        <div className="text-xs text-white/70 italic mt-1">{subtitle}</div>
      </div>

      {/* Extra sparkles */}
      <div className={`absolute top-4 right-4 ${theme.sparkle} animate-ping`}>
        <Sparkle className="w-4 h-4" />
      </div>
      <div className={`absolute bottom-4 left-4 ${theme.star} animate-spin-slower`}>
        <Star className="w-4 h-4" />
      </div>
    </div>
  );
};

export default MagicBadge;

import {
  Sparkle,
  Star,
  Wand,
  Heart,
  BookOpen,
  ShieldCheck,
  PawPrint,
  Globe,
  Feather,
  BrainCircuit,
  Gem,
} from "lucide-react";
import React from "react";

interface MagicBadgeProps {
  label: string;
  rarity?: "common" | "rare" | "epic" | "legendary" | "mythic";
  subtitle?: string;
}

const rarityRing: Record<string, string> = {
  common: "ring-gray-300",
  rare: "ring-blue-400",
  epic: "ring-purple-500",
  legendary: "ring-pink-500",
  mythic:
    "ring-gradient-to-r from-amber-200 via-fuchsia-400 to-pink-600 ring-4 ring-offset-2 ring-offset-black",
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
  }
> = {
  Wizard: {
    bg: "from-indigo-400 via-purple-500 to-indigo-800",
    text: "text-indigo-50",
    aura: "from-purple-400 via-indigo-200 to-white",
    sparkle: "text-indigo-200",
    star: "text-indigo-100",
    icon: <Wand className="w-6 h-6 text-indigo-100 drop-shadow-glow" />,
  },
  Bear: {
    bg: "from-amber-300 via-orange-400 to-rose-500",
    text: "text-amber-50",
    aura: "from-amber-300 via-amber-100 to-white",
    sparkle: "text-amber-200",
    star: "text-amber-100",
    icon: <PawPrint className="w-6 h-6 text-white drop-shadow-glow" />,
  },
  "Heart of Gold": {
    bg: "from-rose-300 via-pink-500 to-red-600",
    text: "text-rose-50",
    aura: "from-pink-300 via-rose-100 to-white",
    sparkle: "text-rose-200",
    star: "text-rose-100",
    icon: <Heart className="w-6 h-6 text-white drop-shadow-glow" />,
  },
  "Scholar Sage": {
    bg: "from-sky-300 via-blue-500 to-indigo-600",
    text: "text-sky-50",
    aura: "from-sky-300 via-sky-100 to-white",
    sparkle: "text-sky-200",
    star: "text-sky-100",
    icon: <BookOpen className="w-6 h-6 text-white drop-shadow-glow" />,
  },
  "Guardian Spirit": {
    bg: "from-lime-300 via-emerald-500 to-green-700",
    text: "text-lime-50",
    aura: "from-lime-300 via-lime-100 to-white",
    sparkle: "text-lime-200",
    star: "text-lime-100",
    icon: <ShieldCheck className="w-6 h-6 text-white drop-shadow-glow" />,
  },
  "Dream Wanderer": {
    bg: "from-blue-400 via-cyan-500 to-sky-700",
    text: "text-sky-50",
    aura: "from-cyan-300 via-blue-100 to-white",
    sparkle: "text-sky-200",
    star: "text-blue-100",
    icon: <Globe className="w-6 h-6 text-white drop-shadow-glow" />,
  },
  Quillmaster: {
    bg: "from-orange-200 via-yellow-400 to-amber-600",
    text: "text-yellow-50",
    aura: "from-yellow-200 via-orange-100 to-white",
    sparkle: "text-yellow-200",
    star: "text-orange-100",
    icon: <Feather className="w-6 h-6 text-white drop-shadow-glow" />,
  },
  "Mind Tinker": {
    bg: "from-violet-300 via-purple-500 to-fuchsia-700",
    text: "text-fuchsia-50",
    aura: "from-purple-300 via-violet-100 to-white",
    sparkle: "text-purple-200",
    star: "text-purple-100",
    icon: <BrainCircuit className="w-6 h-6 text-white drop-shadow-glow" />,
  },
  "Celestial Core": {
    bg: "from-pink-300 via-fuchsia-500 to-purple-800",
    text: "text-pink-50",
    aura: "from-pink-200 via-fuchsia-100 to-white",
    sparkle: "text-pink-200",
    star: "text-pink-100",
    icon: <Gem className="w-6 h-6 text-white drop-shadow-glow" />,
  },
};

export default function MagicBadge({
  label,
  rarity = "epic",
  subtitle = "Enchanted Relic",
}: MagicBadgeProps) {
  const theme = themeMap[label] || {
    bg: "from-yellow-200 via-yellow-400 to-yellow-600",
    text: "text-yellow-50",
    aura: "from-yellow-300 via-yellow-100 to-white",
    sparkle: "text-yellow-200",
    star: "text-yellow-100",
    icon: <Wand className="w-6 h-6 text-white drop-shadow-glow" />,
  };

  return (
    <div
      className={`
        relative group bg-gradient-to-br ${theme.bg}
        rounded-3xl p-6 overflow-hidden cursor-pointer w-full
        transition-transform duration-500 hover:scale-[1.04] hover:rotate-[1deg]
        shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-[float_6s_ease-in-out_infinite]
        perspective-[1000px]
      `}
    >

      {/* Glowing Aura */}
      <div
        className={`absolute -inset-4 z-0 rounded-[2rem] blur-3xl bg-gradient-to-br ${theme.aura} opacity-30 animate-pulse`}
      />

      {/* Magic Ring */}
      <div className="absolute left-1/2 top-1/2 w-56 h-56 border border-dashed border-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 animate-spin-slower" />

      {/* Particles */}
      {Array.from({ length: 14 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse-slow"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Icon with rarity ring */}
      <div
        className={`
          w-20 h-20 mx-auto rounded-full bg-white/10 flex items-center justify-center
          mb-4 shadow-inner border-2 border-white/10 ${rarityRing[rarity] || ""}
          animate-bounce-slow
        `}
      >
        {theme.icon}
      </div>

      {/* Label & subtitle */}
      <div className="text-center z-10 relative">
        <div
          className={`text-xl font-bold tracking-wide drop-shadow ${theme.text}`}
        >
          {label}
        </div>
        <div className="text-xs text-white/70 italic mt-1">{subtitle}</div>
      </div>

      {/* Corner sparkles */}
      <div className={`absolute top-4 right-4 ${theme.sparkle} animate-ping`}>
        <Sparkle className="w-4 h-4" />
      </div>
      <div
        className={`absolute bottom-4 left-4 ${theme.star} animate-spin-slower`}
      >
        <Star className="w-4 h-4" />
      </div>
    </div>
  );
}

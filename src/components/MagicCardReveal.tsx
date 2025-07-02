import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Howl } from "howler";
import { Sparkles, Wand } from "lucide-react";

export default function WizardCardReveal({ onDone }: { onDone?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Setup sound
  const whoosh = useRef(
    new Howl({
      src: ["/FantasyWhoosh.wav"], // make sure this is in public/
      volume: 0.9,
    })
  );

  // Unlock autoplay sound on first click (browser-safe)
  useEffect(() => {
    const unlockAudio = () => {
      whoosh.current.play();
      whoosh.current.stop(); // play then stop immediately to unlock
      document.removeEventListener("click", unlockAudio);
    };
    document.addEventListener("click", unlockAudio);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.set(containerRef.current, { autoAlpha: 1, scale: 1 })

        // Cinematic Background Layers
        .from(".bg-haze", { opacity: 0, duration: 3 })
        .from(".starscape", { opacity: 0, scale: 1.5, duration: 3.5 }, "-=2.8")
        .from(".cosmic-flares", { opacity: 0, duration: 2.5 }, "-=3")
        .from(".aurora", { opacity: 0, duration: 2.5 }, "-=2.8")

        // 🔊 Play sound
        .add(() => whoosh.current.play(), "-=2.5")

        // Card Reveal
        .fromTo(
          cardRef.current,
          {
            opacity: 0,
            scale: 0.1,
            rotateY: 1440,
            rotateX: -1080,
            z: 1000,
          },
          {
            opacity: 1,
            scale: 1,
            rotateY: 0,
            rotateX: 0,
            z: 0,
            duration: 4,
            ease: "expo.out",
          },
          "-=2.5"
        )

        // Glow
        .to(".wizard-glow", {
          opacity: 1,
          scale: 1,
          duration: 2,
          ease: "power3.out",
        }, "-=2")

        // Icon & Text
        .from(".wizard-icon", { y: -100, opacity: 0, duration: 1.6 }, "-=1.8")
        .from(".wizard-title", { y: 40, opacity: 0, duration: 1.2 }, "-=1.2")
        .from(".wizard-desc", { y: 50, opacity: 0, duration: 1.4 }, "-=1.1")

        // Fade out
        .to(containerRef.current, {
          opacity: 0,
          duration: 2.5,
          ease: "power2.inOut",
          delay: 2,
          onComplete: () => onDone?.(),
        });
    }, containerRef);

    return () => ctx.revert();
  }, [onDone]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-md opacity-0 perspective-[1800px] overflow-hidden transition-opacity duration-1000"
    >
      {/* Cinematic Cosmic Background */}
      <div className="absolute inset-0 z-0 bg-haze bg-gradient-to-br from-[#0a001c] via-[#1a0036] to-black opacity-90" />
      <div className="starscape absolute inset-0 bg-stars bg-[length:300%] bg-repeat opacity-20 animate-stars-move z-0" />
      <div className="cosmic-flares absolute inset-0 bg-[radial-gradient(circle_at_center,#bb86fc33_0%,transparent_70%)] blur-3xl z-0" />
      <div className="aurora absolute inset-0 bg-[radial-gradient(ellipse_at_top,#7f00ff22_0%,transparent_60%)] blur-2xl z-0" />

      {/* Wizard Card */}
      <div
        ref={cardRef}
        className="relative z-10 w-[360px] h-[520px] rounded-[2.5rem] bg-gradient-to-br from-indigo-700 via-purple-800 to-indigo-950 p-6 shadow-[0_0_140px_rgba(255,64,255,0.9)] transform-style-preserve-3d border-[3px] border-white/10"
      >
        <div className="wizard-glow absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-purple-400 via-pink-500 to-indigo-500 blur-[80px] opacity-0 scale-0 z-[-1] animate-pulse-slow" />

        {/* Sparkles */}
        {Array.from({ length: 36 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-[6px] h-[6px] bg-white/30 rounded-full animate-float z-[2]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 5}s`,
            }}
          />
        ))}

        {/* Card Content */}
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <Wand className="wizard-icon w-16 h-16 text-indigo-100 mb-5 drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]" />
          <h1 className="wizard-title text-5xl font-extrabold text-white tracking-widest uppercase mb-2">
            Wizard
          </h1>
          <p className="wizard-desc text-base text-indigo-200 leading-relaxed">
            The cosmos has chosen you.
            <br />
            <span className="text-indigo-100 font-semibold">
              Rise. Channel. Transcend.
            </span>
          </p>
        </div>
      </div>

      {/* Manual Trigger (optional) */}
      <div className="absolute bottom-10 right-10 text-indigo-300 animate-ping-slow z-[3] cursor-pointer">
        <Sparkles className="w-9 h-9" onClick={onDone} />
      </div>
    </div>
  );
}

"use client";
import { HeroVideo } from "@/components/hero-video";

/** Angled iPhone-style frame with hero video in the screen */
export function HeroPhoneMockup() {
  return (
    <div className="hero-phone-scene float-phone relative flex justify-center py-4">
      {/* Ground shadow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[72%] h-8 rounded-[50%] bg-black/20 blur-xl pointer-events-none"
        aria-hidden
      />

      <div
        className="hero-phone-tilt relative w-[220px] sm:w-[250px] lg:w-[260px]"
        style={{ transform: "rotateY(-14deg) rotateX(5deg)" }}
      >
        {/* Side buttons */}
        <div
          className="absolute -left-[4px] top-[18%] w-[4px] h-7 rounded-l-md pointer-events-none"
          style={{ background: "linear-gradient(to right, #5a5a5a, #333)" }}
        />
        <div
          className="absolute -left-[4px] top-[28%] w-[4px] h-11 rounded-l-md pointer-events-none"
          style={{ background: "linear-gradient(to right, #5a5a5a, #333)" }}
        />
        <div
          className="absolute -left-[4px] top-[42%] w-[4px] h-11 rounded-l-md pointer-events-none"
          style={{ background: "linear-gradient(to right, #5a5a5a, #333)" }}
        />
        <div
          className="absolute -right-[4px] top-[32%] w-[4px] h-14 rounded-r-md pointer-events-none"
          style={{ background: "linear-gradient(to left, #5a5a5a, #333)" }}
        />

        {/* Titanium bezel */}
        <div
          className="rounded-[2.75rem] sm:rounded-[3rem] p-[3px] sm:p-1"
          style={{
            background: "linear-gradient(145deg, #7a7a7a 0%, #454545 28%, #1a1a1a 62%, #3a3a3a 100%)",
            boxShadow:
              "0 40px 80px -20px rgba(0,0,0,0.55), 0 16px 32px -8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
          }}
        >
          <div className="relative rounded-[2.6rem] sm:rounded-[2.85rem] overflow-hidden bg-black aspect-[9/16]">
            {/* Dynamic Island */}
            <div className="absolute top-2.5 sm:top-3 left-1/2 -translate-x-1/2 z-20 w-[28%] min-w-[72px] max-w-[100px] h-[22px] sm:h-[26px] bg-black rounded-full border border-white/[0.08] flex items-center justify-center gap-2 pointer-events-none">
              <div className="w-[7px] h-[7px] rounded-full bg-[#1c1c1c] border border-[#2a2a2a]" />
              <div className="w-[10px] h-[10px] rounded-full bg-[#0a0a0a] border border-[#252525]" />
            </div>

            <HeroVideo />

            {/* Screen glass sheen */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background:
                  "linear-gradient(125deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 35%, transparent 55%, rgba(0,0,0,0.06) 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

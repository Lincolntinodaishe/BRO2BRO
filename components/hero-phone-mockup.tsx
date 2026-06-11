"use client";
import { HeroVideo } from "@/components/hero-video";

/** Angled Samsung Galaxy-style frame with hero video in the screen */
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
        {/* Volume buttons — left side (Samsung: two separate buttons) */}
        <div
          className="absolute -left-[4px] top-[22%] w-[4px] h-8 rounded-l-md pointer-events-none"
          style={{ background: "linear-gradient(to right, #5a5a5a, #333)" }}
        />
        <div
          className="absolute -left-[4px] top-[34%] w-[4px] h-8 rounded-l-md pointer-events-none"
          style={{ background: "linear-gradient(to right, #5a5a5a, #333)" }}
        />

        {/* Power button — right side (Samsung: shorter, positioned mid-right) */}
        <div
          className="absolute -right-[4px] top-[28%] w-[4px] h-10 rounded-r-md pointer-events-none"
          style={{ background: "linear-gradient(to left, #5a5a5a, #333)" }}
        />

        {/* Samsung Galaxy bezel — thin, dark glossy finish */}
        <div
          className="rounded-[2rem] sm:rounded-[2.1rem] p-[2px]"
          style={{
            background: "linear-gradient(145deg, #6a6a6a 0%, #3a3a3a 25%, #141414 60%, #2e2e2e 100%)",
            boxShadow:
              "0 40px 80px -20px rgba(0,0,0,0.6), 0 16px 32px -8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          {/* Screen */}
          <div className="relative rounded-[1.85rem] sm:rounded-[1.95rem] overflow-hidden bg-black aspect-[9/16]">

            <HeroVideo />

            {/* Screen glass sheen */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background:
                  "linear-gradient(125deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 35%, transparent 55%, rgba(0,0,0,0.06) 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

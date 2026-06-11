"use client";
import { useEffect, useRef } from "react";

const HERO_VIDEO_SRC = "/hero-0611.mov";

/** Horizontal crop trims side bars; vertical stays near 1:1 so UI isn't over-zoomed */
const VIDEO_CROP_SCALE_X = 1.18;
const VIDEO_CROP_SCALE_Y = 1.02;

/** Looping hero video — muted + playsInline for iOS autoplay. */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const tryPlay = () => {
      void video.play().catch(() => {});
    };

    tryPlay();
    video.addEventListener("canplay", tryPlay);

    const onVisible = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      video.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0a0a]">
      <video
        ref={videoRef}
        src={HERO_VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        className="hero-video-crop absolute left-1/2 top-1/2 h-full w-full max-w-none object-contain"
        style={{
          transform: `translate(-50%, -50%) scale(${VIDEO_CROP_SCALE_X}, ${VIDEO_CROP_SCALE_Y})`,
          transformOrigin: "center center",
        }}
        aria-label="BRO2BRO product demo"
      />
    </div>
  );
}

interface HeroStatCardProps {
  className?: string;
  children: React.ReactNode;
}

export function HeroStatCard({ className, children }: HeroStatCardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/80 bg-white/95 backdrop-blur-sm p-3 sm:p-3.5 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.18)] ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

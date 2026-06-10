"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import uamsHealthLogo from "@/brand_assets/uams-logo_health_horizontal_dark.png";
import bro2broLogo from "@/brand_assets/Bro2Bro logo.png";
import {
  ArrowRight, Heart, Shield, Users, MessageCircle, MapPin,
  Calendar, Star, CheckCircle, Activity, Zap, Phone,
  Brain, ChevronRight, Play, Quote, Scissors, UserCheck,
  Building2, Menu, X, Mail, Globe, Award, TrendingUp,
  Lock, Sparkles, HeartHandshake
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

/* ─── NAVBAR ─────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Features",     href: "#features" },
    { label: "Community",    href: "#community" },
    { label: "Providers",    href: "#providers" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <Image src={bro2broLogo} alt="BRO2BRO" height={36} className="h-9 w-auto" />
            <span className="text-xl font-black tracking-widest text-gray-900 uppercase">BRO2BRO</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-7">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Auth CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/dashboard/chat">
              <Button variant="outline" size="sm" className="gap-1.5 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400">
                <MessageCircle className="h-3.5 w-3.5" />
                Chat with AI
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1 animate-fade-in">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-2 border-t border-gray-100 mt-2">
            <Link href="/dashboard/chat" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" className="w-full gap-1.5 border-amber-300 text-amber-700">
                <MessageCircle className="h-3.5 w-3.5" />
                Chat with AI
              </Button>
            </Link>
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" className="w-full">Log in</Button>
            </Link>
            <Link href="/signup" onClick={() => setMobileOpen(false)}>
              <Button className="w-full">Get Started Free</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─── HERO ────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 gradient-mesh overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-teal-300/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-5xl mx-auto w-full">
        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 leading-[0.92] tracking-tight mb-6">
          The Barbershop<br />
          <span className="text-amber-500">Got Men Talking.</span><br />
          We Built<br />
          What Comes Next.
        </h1>

        {/* Sub */}
        <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          BRO2BRO is the AI-powered wellness companion extending trusted community conversations
          into real care — connecting Black men to preventive health, mental wellness, and a
          community that has their back.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/signup">
            <Button size="xl" className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow py-5 text-base font-bold">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="outline" size="xl" className="w-full sm:w-auto gap-2 py-5 text-base font-bold">
              <Play className="h-5 w-5" />
              See How It Works
            </Button>
          </a>
        </div>

        {/* Phone mockup + floating cards */}
        <div className="relative mx-auto w-[290px] float-phone">

          {/* Ambient glow behind phone */}
          <div className="absolute inset-[-60px] -z-10 blur-3xl pointer-events-none opacity-40"
            style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(245,158,11,0.35) 0%, rgba(13,148,136,0.25) 55%, transparent 75%)" }} />

          {/* Floating card 1 — top left */}
          <div className="absolute -left-44 top-8 bg-white rounded-2xl p-4 w-40 hidden xl:block float-card-1"
            style={{ boxShadow: "0 8px 32px -4px rgba(245,158,11,0.2), 0 2px 8px rgba(0,0,0,0.07)" }}>
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <Activity className="h-3 w-3 text-amber-600" />
              </div>
              <span className="text-[10px] text-gray-400 font-medium">Men Screened</span>
            </div>
            <div className="text-3xl font-black text-amber-500">600+</div>
            <div className="text-xs text-gray-400 mt-0.5">since Aug 2023</div>
          </div>

          {/* Floating card 2 — top right */}
          <div className="absolute -right-48 top-20 bg-gray-900 text-white rounded-2xl p-4 w-44 hidden xl:block float-card-2"
            style={{ boxShadow: "0 8px 32px -4px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.12)" }}>
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                <TrendingUp className="h-3 w-3 text-amber-400" />
              </div>
              <span className="text-[10px] text-gray-400 font-medium">BP Control Rate</span>
            </div>
            <div className="text-3xl font-black text-amber-400">63.6%</div>
            <div className="text-xs text-gray-500 mt-0.5">barbershop + AI follow-up</div>
          </div>

          {/* Floating card 3 — bottom left */}
          <div className="absolute -left-48 bottom-24 bg-teal-50 rounded-2xl p-4 w-44 hidden xl:block float-card-3"
            style={{ boxShadow: "0 8px 32px -4px rgba(13,148,136,0.2), 0 2px 8px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                <Scissors className="h-3 w-3 text-teal-600" />
              </div>
              <span className="text-[10px] text-teal-500 font-medium">Partner Barbershops</span>
            </div>
            <div className="text-3xl font-black text-teal-700">61</div>
            <div className="text-xs text-teal-500 mt-0.5">across 15 AR counties</div>
          </div>

          {/* Floating card 4 — bottom right */}
          <div className="absolute -right-40 bottom-16 bg-green-50 rounded-2xl p-4 w-36 hidden xl:block float-card-4"
            style={{ boxShadow: "0 8px 32px -4px rgba(22,163,74,0.2), 0 2px 8px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <CheckCircle className="h-3 w-3 text-green-600" />
              </div>
              <span className="text-[10px] text-green-500 font-medium">Always Free</span>
            </div>
            <div className="text-xl font-black text-green-700">$0/mo</div>
            <div className="text-xs text-green-500 mt-0.5">No app required</div>
          </div>

          {/* iPhone shell */}
          <div className="relative w-[290px]">
            {/* Side buttons */}
            <div className="absolute -left-[5px] top-[96px] w-[5px] h-6 rounded-l-md" style={{ background: "linear-gradient(to right, #4a4a4a, #2e2e2e)" }} />
            <div className="absolute -left-[5px] top-[136px] w-[5px] h-10 rounded-l-md" style={{ background: "linear-gradient(to right, #4a4a4a, #2e2e2e)" }} />
            <div className="absolute -left-[5px] top-[184px] w-[5px] h-10 rounded-l-md" style={{ background: "linear-gradient(to right, #4a4a4a, #2e2e2e)" }} />
            <div className="absolute -right-[5px] top-[148px] w-[5px] h-16 rounded-r-md" style={{ background: "linear-gradient(to left, #4a4a4a, #2e2e2e)" }} />

            {/* Titanium frame */}
            <div className="w-[290px] h-[600px] rounded-[54px] p-[3px]"
              style={{ background: "linear-gradient(145deg, #6b6b6b 0%, #3d3d3d 35%, #1c1c1c 65%, #303030 100%)", boxShadow: "0 32px 80px -12px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08)" }}>

              {/* Inner screen */}
              <div className="w-full h-full rounded-[52px] overflow-hidden bg-black relative">

                {/* Dynamic Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-[112px] h-[34px] bg-black rounded-full flex items-center justify-center gap-3 border border-white/[0.06]">
                  <div className="w-[9px] h-[9px] rounded-full bg-[#1c1c1c] border border-[#2a2a2a]" />
                  <div className="w-[13px] h-[13px] rounded-full bg-[#0a0a0a] border border-[#252525] flex items-center justify-center">
                    <div className="w-[6px] h-[6px] rounded-full bg-[#1a1a1a]" />
                  </div>
                </div>

                {/* Screen content */}
                <div className="h-full flex flex-col bg-white">

                  {/* Status bar */}
                  <div className="bg-black text-white px-5 pt-12 pb-1 flex items-center justify-between shrink-0">
                    <span className="text-[11px] font-bold tracking-tight">9:41</span>
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-end gap-[2px]">
                        {[3, 5, 7, 9].map((h, i) => (
                          <div key={i} className={`w-[3px] rounded-[1px] ${i < 3 ? "bg-white" : "bg-white/30"}`} style={{ height: `${h}px` }} />
                        ))}
                      </div>
                      <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                        <path d="M7 9a1 1 0 100 2 1 1 0 000-2z" fill="white"/>
                        <path d="M3.5 5.5C4.8 4.2 5.8 3.5 7 3.5s2.2.7 3.5 2" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
                        <path d="M.5 2.5C2.5.5 4.6 0 7 0s4.5.5 6.5 2.5" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                      <div className="flex items-center">
                        <div className="w-[20px] h-[11px] rounded-[3px] border-[1.5px] border-white/70 p-[1.5px]">
                          <div className="h-full w-[72%] bg-white rounded-[1px]" />
                        </div>
                        <div className="w-[2px] h-[5px] bg-white/50 rounded-r-sm ml-[1px]" />
                      </div>
                    </div>
                  </div>

                  {/* Chat header */}
                  <div className="bg-black text-white px-4 pt-1 pb-3 flex items-center gap-2.5 shrink-0">
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-white">
                      <Image src={bro2broLogo} alt="Bro.AI" width={32} height={32} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold">Bro.AI</div>
                      <div className="flex items-center gap-1 text-xs text-green-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                        Online · Private
                      </div>
                    </div>
                    <Phone className="h-4 w-4 text-gray-500" />
                  </div>

                  {/* Messages */}
                  <div className="flex-1 px-3 py-3 flex flex-col gap-2 overflow-hidden bg-[#f5f5f5]">
                    <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2.5 max-w-[88%] text-xs text-gray-800 leading-relaxed shadow-sm">
                      Hey. I&apos;m Bro. How have you been doing lately? No judgment here.
                    </div>
                    <div className="bg-black text-white rounded-2xl rounded-tr-sm px-3 py-2.5 max-w-[80%] self-end text-xs">
                      Been stressed. Work&apos;s been a lot lately.
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2.5 max-w-[90%] text-xs text-gray-800 leading-relaxed shadow-sm">
                      I hear you. When&apos;s the last time you got your BP checked?
                    </div>
                    <div className="bg-black text-white rounded-2xl rounded-tr-sm px-3 py-2.5 max-w-[75%] self-end text-xs">
                      Honestly... it&apos;s been a while.
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl rounded-tl-sm px-3 py-2.5 max-w-[92%] text-xs text-gray-800 leading-relaxed">
                      <div className="flex items-center gap-1.5 font-semibold text-amber-700 mb-1">
                        <MapPin className="h-3 w-3" />
                        Found 3 free BP checks near you
                      </div>
                      Two are at barbershops you probably know. Want directions?
                    </div>
                  </div>

                  {/* Input */}
                  <div className="px-3 py-2.5 border-t border-gray-100 bg-white shrink-0">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-2">
                      <span className="text-xs text-gray-400 flex-1">Reply to Bro…</span>
                      <div className="h-5 w-5 bg-black rounded-full flex items-center justify-center shrink-0">
                        <ArrowRight className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Home indicator */}
                  <div className="bg-white pb-2 pt-1 flex justify-center shrink-0">
                    <div className="w-28 h-[5px] bg-black/20 rounded-full" />
                  </div>
                </div>

                {/* Glass sheen overlay */}
                <div className="absolute inset-0 pointer-events-none rounded-[52px]"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 40%, transparent 60%)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── TRUST BAR ────────────────────────────────────────────── */
const partners: { name: string; abbr?: string; color?: string; logo?: typeof uamsHealthLogo }[] = [
  { name: "UAMS Barbershop Talk", logo: uamsHealthLogo },
  { name: "BCBS Arkansas",        abbr: "BCBS", color: "bg-indigo-100 text-indigo-700" },
  { name: "UAPB",                 abbr: "UAPB", color: "bg-amber-100 text-amber-700" },
  { name: "Arkansas Dept. of Health", abbr: "ADH", color: "bg-red-100 text-red-700" },
  { name: "Jumpstart Nova",       abbr: "JSN",  color: "bg-green-100 text-green-700" },
  { name: "CHW Arkansas",         abbr: "CHW",  color: "bg-teal-100 text-teal-700" },
  { name: "American Heart Assoc.", abbr: "AHA", color: "bg-rose-100 text-rose-700" },
  { name: "Robert Wood Johnson",  abbr: "RWJ",  color: "bg-purple-100 text-purple-700" },
];

function PartnerLogo({ name, abbr, color, logo }: { name: string; abbr?: string; color?: string; logo?: typeof uamsHealthLogo }) {
  return (
    <div className="flex items-center gap-3 mx-10 shrink-0">
      {logo ? (
        <Image src={logo} alt={name} height={32} className="h-8 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity" />
      ) : (
        <>
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0", color)}>
            {abbr}
          </div>
          <span className="text-sm font-semibold text-gray-400 whitespace-nowrap">{name}</span>
        </>
      )}
    </div>
  );
}

function TrustBar() {
  return (
    <section className="py-10 border-y border-gray-100 bg-gray-50/50 overflow-hidden">
      <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
        Backed by &amp; Built for the Community
      </p>
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50/80 to-transparent z-10 pointer-events-none" />
        {/* Marquee */}
        <div className="marquee-track">
          {partners.map((p) => <PartnerLogo key={p.name} {...p} />)}
          {partners.map((p) => <PartnerLogo key={p.name + "-2"} {...p} />)}
        </div>
      </div>
    </section>
  );
}

/* ─── IMPACT STATS ─────────────────────────────────────────── */
function ImpactStats() {
  const stats = [
    {
      value: "4.8 yrs",
      label: "Life expectancy gap",
      sub: "Black vs white men — progress stalled since 1980s",
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      value: "43%",
      label: "More ER use",
      sub: "vs preventive care — costlier, later, worse outcomes",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      value: "60%",
      label: "Black Arkansans",
      sub: "have high blood pressure — half completely uncontrolled",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      value: "63.6%",
      label: "BP control rate",
      sub: "barbershop + follow-up vs 11.7% without (LABBPS trial)",
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <Badge variant="gold" size="lg" className="mb-4">The Numbers</Badge>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight">
            This isn&apos;t an awareness problem.<br />
            <span className="text-amber-500">It&apos;s an engagement problem.</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Black men know the risks. What&apos;s missing is sustained connection to care in settings they trust.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className={cn("rounded-2xl p-6 border border-transparent hover:shadow-card-hover transition-all duration-300", s.bg)}
            >
              <div className={cn("text-4xl font-black mb-2", s.color)}>{s.value}</div>
              <div className="text-base font-semibold text-gray-900 mb-1">{s.label}</div>
              <div className="text-sm text-gray-500 leading-relaxed">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── HOW IT WORKS ─────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Connect at your spot",
      body: "Scan a QR code at a partner barbershop, church, gym, or workplace. Or simply text us directly — no app download, no signup needed.",
      icon: Scissors,
      color: "bg-amber-500",
    },
    {
      number: "02",
      title: "Chat with Bro.AI",
      body: "Talk to a judgment-free wellness companion using proven motivational interviewing techniques. It adapts to your age, your language, your situation.",
      icon: MessageCircle,
      color: "bg-black",
    },
    {
      number: "03",
      title: "Get connected to care",
      body: "Find free clinics, book appointments, join accountability crews with your guys, and connect with mentors who've been through it.",
      icon: MapPin,
      color: "bg-teal-600",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="muted" size="lg" className="mb-4">How It Works</Badge>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900">
            From conversation<br />
            <span className="text-amber-500">to sustained care</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
            Three steps. No app required. Works on any phone, anywhere in Arkansas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={s.number} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(100%+8px)] w-[calc(100%-16px)] h-px bg-gray-200 z-0" style={{ width: "calc(100% - 32px)", left: "calc(100% + 16px)" }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full" />
                </div>
              )}
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300 group">
                <div className="flex items-start justify-between mb-6">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", s.color)}>
                    <s.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-4xl font-black text-gray-100 group-hover:text-gray-200 transition-colors">
                    {s.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-gray-500 leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FOR YOU / USER TYPES ─────────────────────────────────── */
function UserTypes() {
  const types = [
    {
      icon: Heart,
      title: "Clients",
      desc: "Get free AI wellness support, find nearby clinics, book appointments, and join accountability crews. No clinical language. No judgment.",
      cta: "Get started free",
      color: "bg-black",
      tags: ["AI Chat", "Resources", "Crews", "Appointments"],
    },
    {
      icon: Scissors,
      title: "Barbers & Mentors",
      desc: "Barbers earn Community Health Worker certification and unlock referral tools. Mentors share their journey and connect with men who need real guidance — health scares, recovery, mental health, all of it.",
      cta: "Join the network",
      color: "bg-amber-500",
      tags: ["CHW Cert", "Referrals", "Peer Support", "+Income"],
    },
    {
      icon: Building2,
      title: "Healthcare Providers",
      desc: "List your clinic, accept referrals from barbershops, and reach underserved patients. Subscription-based with verified provider profiles.",
      cta: "List your practice",
      color: "bg-gray-700",
      tags: ["Referrals", "Listings", "Analytics", "Subscription"],
    },
  ];

  return (
    <section id="community" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="gold" size="lg" className="mb-4">Who It&apos;s For</Badge>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900">
            Built for the whole<br />
            <span className="text-amber-500">community ecosystem</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
            BRO2BRO works because health isn&apos;t individual — it&apos;s relational.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {types.map((t) => (
            <div
              key={t.title}
              className="bg-white rounded-2xl p-6 border-2 border-gray-200 group flex flex-col transition-all duration-300 hover:-translate-y-1"
              style={{ boxShadow: "0 4px 24px -4px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)" }}
            >
              <h3 className="text-2xl font-black text-gray-900 mb-3 text-center">{t.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed flex-1">{t.desc}</p>
              <div className="flex flex-wrap gap-1.5 mt-4 mb-5">
                {t.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" size="sm">{tag}</Badge>
                ))}
              </div>
              <Link href="/signup">
                <Button variant="outline" size="md" className="w-full font-semibold group-hover:bg-black group-hover:text-white group-hover:border-black transition-all">
                  {t.cta} <ChevronRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── AI DEMO ──────────────────────────────────────────────── */
function AIDemo() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hey. I'm BRO2BRO — your wellness companion. How have you been doing lately? No judgment here. 🤝",
    },
  ]);
  const [typing, setTyping] = useState(false);

  const responses: Record<string, string> = {
    default:
      "I hear you. That takes a lot to say. Can I ask — when's the last time you had a blood pressure check? It only takes 60 seconds at most pharmacies.",
    stress:
      "Stress is real, and it builds up physically too. A lot of guys I talk to are carrying more than people know. When's the last time you got your blood pressure checked?",
    good:
      "Glad to hear it. Staying consistent with check-ins is how you keep it that way. Any health goals you're working toward right now?",
    tired:
      "That kind of tired goes deeper than sleep. I hear you. Is it more physical or mental pressure lately?",
  };

  function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((p) => [...p, { role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const lower = trimmed.toLowerCase();
      const key = lower.includes("stress")
        ? "stress"
        : lower.includes("good") || lower.includes("great") || lower.includes("fine")
        ? "good"
        : lower.includes("tired") || lower.includes("exhaust")
        ? "tired"
        : "default";
      setMessages((p) => [...p, { role: "ai", text: responses[key] }]);
      setTyping(false);
    }, 1600);
  }

  const quickReplies = ["Been stressed", "Doing alright", "Tired lately", "What can you help with?"];

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Copy */}
          <div>
            <Badge className="bg-amber-500 text-black border-0 mb-4" size="lg">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              AI Wellness Companion
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
              The AI that talks<br />
              <span className="text-amber-400">the way you do.</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              BRO2BRO uses proven motivational interviewing techniques — the same approach used by
              UAMS Barbershop Talk. It meets you where you are, never lectures, and always points
              toward real professionals and real resources.
            </p>
            <ul className="space-y-3">
              {[
                "Judgment-free, 24/7 wellness check-ins",
                "Age-adapted language — for 18 to 65+",
                "Never stores data you don't want stored",
                "Crisis escalation built in — 988 in seconds",
                "Connects to real clinics, not generic links",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-300">
                  <CheckCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link href="/dashboard/chat">
                <Button variant="gold" size="lg">
                  Try the AI Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Chat demo */}
          <div className="bg-gray-800 rounded-3xl p-1 shadow-float">
            <div className="bg-white rounded-[20px] overflow-hidden">
              {/* Header */}
              <div className="bg-black px-5 py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-white shrink-0">
                  <Image src={bro2broLogo} alt="Bro.AI" width={36} height={36} className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Bro.AI</div>
                  <div className="flex items-center gap-1.5 text-xs text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                    Private · End-to-end encrypted
                  </div>
                </div>
                <div className="ml-auto flex gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
              </div>

              {/* Messages */}
              <div className="h-72 overflow-y-auto px-4 py-4 flex flex-col gap-3">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      m.role === "ai"
                        ? "bg-gray-100 text-gray-800 rounded-tl-sm msg-in self-start"
                        : "bg-black text-white rounded-tr-sm msg-out self-end"
                    )}
                  >
                    {m.text}
                  </div>
                ))}
                {typing && (
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 w-16 flex items-center gap-1 msg-in self-start">
                    <span className="dot1 w-2 h-2 bg-gray-400 rounded-full inline-block" />
                    <span className="dot2 w-2 h-2 bg-gray-400 rounded-full inline-block" />
                    <span className="dot3 w-2 h-2 bg-gray-400 rounded-full inline-block" />
                  </div>
                )}
              </div>

              {/* Quick replies */}
              <div className="px-4 pb-2 flex gap-2 flex-wrap">
                {quickReplies.map((r) => (
                  <button
                    key={r}
                    onClick={() => { setInput(r); }}
                    className="text-xs bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-colors"
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type how you're feeling…"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-black transition-colors"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="h-9 w-9 bg-black rounded-full flex items-center justify-center shrink-0 hover:bg-gray-800 transition-colors disabled:opacity-40"
                  >
                    <ArrowRight className="h-4 w-4 text-white" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 text-center mt-2">
                  This is a demo. Real conversations are private and encrypted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FEATURES GRID ────────────────────────────────────────── */
function Features() {
  const features = [
    { icon: Brain,          title: "AI Wellness Companion",  desc: "Motivational interviewing, 24/7. Adapts to age, language, and cultural context.", color: "bg-purple-100 text-purple-700" },
    { icon: MapPin,         title: "Find Care Near You",     desc: "Clinics, barbershops, churches, and support groups — filtered by zip code.",         color: "bg-amber-100 text-amber-700" },
    { icon: Calendar,       title: "Appointment Booking",    desc: "Book with clinics and counselors directly through the app. No phone tag.",            color: "bg-blue-100 text-blue-700"   },
    { icon: Users,          title: "Crew Accountability",    desc: "Health challenges with your guys. Compete on check-ins, BP, and milestones.",         color: "bg-teal-100 text-teal-700"   },
    { icon: UserCheck,      title: "Mentor Connections",     desc: "Peer mentors who've navigated what you're facing — health, recovery, mental health.",  color: "bg-green-100 text-green-700" },
    { icon: Shield,         title: "Privacy First",          desc: "Zero-knowledge design. You own your data. Delete everything with one tap.",            color: "bg-gray-100 text-gray-700"   },
    { icon: Phone,          title: "SMS-First",              desc: "Works on any phone, no internet required. Reaches rural Arkansas everywhere.",         color: "bg-red-100 text-red-700"     },
    { icon: Activity,       title: "Progress Tracking",      desc: "90-day health journey with milestones, check-in streaks, and family sharing.",         color: "bg-orange-100 text-orange-700"},
    { icon: Mail,           title: "Multi-Channel Alerts",   desc: "Text, email, push, and in-app reminders for appointments and check-ins.",              color: "bg-indigo-100 text-indigo-700"},
    { icon: Zap,            title: "Instant Care Navigation",desc: "AI identifies your needs and surfaces the right resources within seconds.",            color: "bg-yellow-100 text-yellow-700"},
    { icon: Globe,          title: "Community Forum",        desc: "Private, Black-men-first space to share, ask questions, and get real answers.",        color: "bg-pink-100 text-pink-700"   },
    { icon: Award,          title: "CHW Certification",      desc: "Barbers earn Community Health Worker credentials and unlock Medicaid billing.",        color: "bg-lime-100 text-lime-700"   },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="muted" size="lg" className="mb-4">Everything You Need</Badge>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900">
            Every feature designed<br />
            <span className="text-amber-500">with this community in mind</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-4", f.color)}>
                <f.icon className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── TESTIMONIALS ─────────────────────────────────────────── */
function Testimonials() {
  const testimonials = [
    {
      quote: "My barber recommended BRO2BRO after my BP reading came back high. Within a week I had an appointment booked at a clinic I didn't even know was free. That was six months ago. My numbers are finally where they should be.",
      name: "Marcus W.",
      role: "Pine Bluff, AR — 44 years old",
      stars: 5,
    },
    {
      quote: "I've been cutting hair for 22 years. BRO2BRO gave me the tools to actually help my clients after they sit in my chair. Two of my guys have their blood pressure under control now. That means more to me than anything.",
      name: "Joe T.",
      role: "Barber, Little Rock — UAMS Barbershop Talk",
      stars: 5,
    },
    {
      quote: "I was skeptical about talking to an AI about my health. But BRO2BRO doesn't talk down to me — it talks like someone who knows what I'm dealing with. It connected me to a counselor within the same week.",
      name: "DeShawn R.",
      role: "Little Rock, AR — 32 years old",
      stars: 5,
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-amber-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="gold" size="lg" className="mb-4">Real Stories</Badge>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900">
            From the community,<br />
            <span className="text-amber-500">for the community</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-8 border border-amber-100 shadow-card hover:shadow-card-hover transition-all duration-300">
              <Quote className="h-8 w-8 text-amber-300 mb-4" />
              <p className="text-gray-700 leading-relaxed mb-6 text-sm">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-700">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.role}</div>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ──────────────────────────────────────────────────── */
function FAQ() {
  const items = [
    {
      value: "free",
      trigger: "Is BRO2BRO free for users?",
      content:
        "Yes — always. BRO2BRO is completely free for Black men and their families. Healthcare providers, insurers, and employers pay for access because preventing one ER visit ($1,800+) pays for months of BRO2BRO. Users pay nothing, ever.",
    },
    {
      value: "privacy",
      trigger: "What happens to my health data?",
      content:
        "Your data belongs to you. We use a zero-knowledge architecture: no real names stored, health data saved only as categories (not raw values), zip codes never stored, and substance use data stored in a separately encrypted partition. You can delete everything with one tap — we process the request within 24 hours and send SMS confirmation. We never sell your data. Ever.",
    },
    {
      value: "ai",
      trigger: "How does the AI companion work?",
      content:
        "BRO2BRO uses motivational interviewing (MI) techniques — the same evidence-based approach UAMS Barbershop Talk already uses. The AI adapts its language to your age, never makes medical diagnoses, always refers you to real professionals, and has a built-in crisis escalation protocol that surfaces 988 (Suicide & Crisis Lifeline) immediately if you mention self-harm.",
    },
    {
      value: "app",
      trigger: "Do I need a smartphone or internet?",
      content:
        "No. BRO2BRO is SMS-first — it works on any phone, even without internet. This is intentional: 29% of Black households lack broadband access nationally, and rural Arkansas has even lower connectivity. Just text the number. That's it.",
    },
    {
      value: "barber",
      trigger: "How do barbers get involved?",
      content:
        "Barbers can join as Trustees — they get a QR code, conversation prompts, a community health dashboard, and the opportunity to earn Community Health Worker (CHW) certification. Once certified, health check-ins become billable Medicaid encounters. Arkansas passed legislation enabling CHW billing. This is real additional income for doing something barbers are already doing.",
    },
    {
      value: "providers",
      trigger: "How do healthcare providers get listed?",
      content:
        "Providers sign up for a subscription plan (starting free for community orgs, $99/mo for clinics). Listings are verified, prioritized in search results, and connected to BRO2BRO's referral workflow. HIPAA Business Associate Agreements are included in the Enterprise tier.",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="muted" size="lg" className="mb-4">FAQ</Badge>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900">
            Questions, answered<br />
            <span className="text-amber-500">straight</span>
          </h2>
        </div>
        <Accordion items={items} />
      </div>
    </section>
  );
}

/* ─── CTA SECTION ──────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-8 overflow-hidden">
          <Image src={bro2broLogo} alt="BRO2BRO" width={64} height={64} className="w-full h-full object-contain" />
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-6">
          The conversation<br />
          <span className="text-amber-400">doesn&apos;t end here.</span>
        </h2>
        <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10">
          The barbershop started it. BRO2BRO keeps it going. Free for every man who needs it.
          No app. No insurance. No judgment.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button variant="gold" size="xl" className="w-full sm:w-auto shadow-lg">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="outline"
              size="xl"
              className="w-full sm:w-auto border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 hover:text-white"
            >
              Sign in to your account
            </Button>
          </Link>
        </div>
        <p className="mt-6 text-sm text-gray-500">
          Already a healthcare provider?{" "}
          <Link href="/signup?role=provider" className="text-amber-400 hover:text-amber-300 underline">
            List your practice →
          </Link>
        </p>
      </div>
    </section>
  );
}

/* ─── FOOTER ───────────────────────────────────────────────── */
function Footer() {
  const cols = [
    {
      title: "Product",
      links: [
        { label: "How It Works",  href: "#how-it-works" },
        { label: "AI Chat Demo",  href: "/dashboard/chat" },
        { label: "Find Resources",href: "/dashboard/resources" },
        { label: "Community",     href: "/dashboard/community" },
        { label: "Mentors",       href: "/dashboard/mentors" },
      ],
    },
    {
      title: "For Providers",
      links: [
        { label: "Get Listed",        href: "/signup?role=provider" },
        { label: "Provider Dashboard",href: "/dashboard" },
        { label: "Partnership",       href: "#providers" },
        { label: "Contact Sales",     href: "mailto:hello@pulsehealth.app" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About",       href: "#" },
        { label: "Research",    href: "#" },
        { label: "Blog",        href: "#" },
        { label: "Careers",     href: "#" },
        { label: "Press",       href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy",    href: "#" },
        { label: "Terms of Service",  href: "#" },
        { label: "HIPAA Notice",      href: "#" },
        { label: "Accessibility",     href: "#" },
        { label: "Cookie Policy",     href: "#" },
      ],
    },
  ];

  const sponsors = [
    "UAMS Barbershop Talk",
    "BCBS Arkansas",
    "Robert Wood Johnson Foundation",
    "Jumpstart Nova",
    "American Heart Association",
    "CDC Prevention Research Centers",
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      {/* Sponsors */}
      <div className="border-b border-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
            Community Sponsors &amp; Partners
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
            {sponsors.map((s) => (
              <span key={s} className="text-sm text-gray-400 font-medium">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src={bro2broLogo} alt="BRO2BRO" height={32} className="h-8 w-auto" />
              <span className="text-base font-black tracking-widest text-gray-900 uppercase">BRO2BRO</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              The barbershop got men talking. We built what comes next.
            </p>
            <p className="text-xs text-gray-400">
              Little Rock, Arkansas
            </p>
          </div>

          {/* Nav columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © 2026 BRO2BRO Health. Built with ❤️ for the community.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <Lock className="h-3 w-3" />
              Privacy-first by design
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <Shield className="h-3 w-3" />
              HIPAA-aware architecture
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── PAGE ASSEMBLY ────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <TrustBar />
      <UserTypes />
      <HowItWorks />
      <ImpactStats />
      <AIDemo />
      <Features />
      <Testimonials />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Eye, EyeOff,
  Scissors, UserCheck, Building2, HeartHandshake, User
} from "lucide-react";
import Image from "next/image";
import bro2broLogo from "@/brand_assets/Bro2Bro logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const roles = [
  {
    id: "member",
    label: "Men Seeking Help",
    desc: "Access free AI wellness support and community",
    icon: User,
    color: "bg-black",
  },
  {
    id: "barber",
    label: "Barber / Trustee",
    desc: "Earn CHW cert and support your clients",
    icon: Scissors,
    color: "bg-amber-500",
  },
  {
    id: "mentor",
    label: "Mentor",
    desc: "Share your journey with those who need it",
    icon: UserCheck,
    color: "bg-teal-600",
  },
  {
    id: "provider",
    label: "Healthcare Provider",
    desc: "List your practice and receive referrals",
    icon: Building2,
    color: "bg-gray-700",
  },
  {
    id: "family",
    label: "Family / Support",
    desc: "Support and encourage the men in your life",
    icon: HeartHandshake,
    color: "bg-purple-600",
  },
];

export default function SignupPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validateStep2() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Minimum 8 characters";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validateStep2();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 bg-black text-white p-12">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src={bro2broLogo} alt="BRO2BRO" height={36} className="h-9 w-auto" />
          <span className="text-xl font-black tracking-tight text-white">BRO2BRO</span>
        </Link>

        <div>
          <h2 className="text-3xl font-black mb-4 leading-snug">
            The barbershop<br />
            <span className="text-amber-400">got you started.</span><br />
            We&apos;ll take you further.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Free for every man who needs it. No app download required. Start with a text and go from there.
          </p>
          <ul className="space-y-3 text-sm text-gray-300">
            {[
              "100% free for members — always",
              "No insurance required",
              "Privacy-first: you own your data",
              "Works on any phone via SMS",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-xs text-gray-600">UA Little Rock AI Hackathon · Challenge 07 · 2026</div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <Image src={bro2broLogo} alt="BRO2BRO" height={32} className="h-8 w-auto" />
            <span className="text-lg font-black">BRO2BRO</span>
          </Link>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            <div className={cn("h-2 rounded-full transition-all", step === 1 ? "w-8 bg-black" : "w-4 bg-gray-200")} />
            <div className={cn("h-2 rounded-full transition-all", step === 2 ? "w-8 bg-black" : "w-4 bg-gray-200")} />
            <span className="text-xs text-gray-400 ml-2">Step {step} of 2</span>
          </div>

          {step === 1 ? (
            <>
              <h1 className="text-3xl font-black text-gray-900 mb-2">Who are you joining as?</h1>
              <p className="text-gray-500 mb-8 text-sm">
                Pick the role that fits best — you can always add more later.
              </p>

              <div className="space-y-3 mb-8">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRole(r.id)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-150",
                      selectedRole === r.id
                        ? "border-black bg-gray-50"
                        : "border-gray-100 hover:border-gray-200 bg-white"
                    )}
                  >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", r.color)}>
                      <r.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900">{r.label}</div>
                      <div className="text-xs text-gray-500">{r.desc}</div>
                    </div>
                    <div
                      className={cn(
                        "h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center",
                        selectedRole === r.id ? "border-black" : "border-gray-300"
                      )}
                    >
                      {selectedRole === r.id && (
                        <div className="h-2.5 w-2.5 rounded-full bg-black" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <Button
                className="w-full"
                size="lg"
                disabled={!selectedRole}
                onClick={() => setStep(2)}
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Already have an account?{" "}
                <Link href="/login" className="text-black font-semibold underline underline-offset-2">
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-black mb-6 transition-colors"
              >
                ← Back
              </button>

              <h1 className="text-3xl font-black text-gray-900 mb-2">Create your account</h1>
              <p className="text-gray-500 mb-8 text-sm">
                Joining as{" "}
                <span className="font-semibold text-black">
                  {roles.find((r) => r.id === selectedRole)?.label}
                </span>
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Full name"
                  placeholder="Marcus Johnson"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  error={errors.name}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  error={errors.email}
                />
                <Input
                  label="Password"
                  type={showPass ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  error={errors.password}
                  hint="Minimum 8 characters"
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPass((p) => !p)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input type="checkbox" required className="mt-0.5 rounded border-gray-300" />
                  <span className="text-sm text-gray-600">
                    I agree to BRO2BRO&apos;s{" "}
                    <Link href="#" className="text-black underline underline-offset-2">Terms</Link> and{" "}
                    <Link href="#" className="text-black underline underline-offset-2">Privacy Policy</Link>.
                    I understand my health data is private and encrypted.
                  </span>
                </label>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating your account…
                    </span>
                  ) : (
                    <>Create Free Account <ArrowRight className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight, Eye, EyeOff,
  Scissors, UserCheck, Building2, HeartHandshake, User,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

const roles = [
  { id: "member",   label: "Seeking Help",     icon: User,           color: "bg-black"      },
  { id: "barber",   label: "Barber / Trustee", icon: Scissors,       color: "bg-amber-500"  },
  { id: "mentor",   label: "Mentor",           icon: UserCheck,      color: "bg-teal-600"   },
  { id: "provider", label: "Provider",         icon: Building2,      color: "bg-gray-700"   },
  { id: "family",   label: "Family Support",   icon: HeartHandshake, color: "bg-purple-600" },
];

const validRoles = new Set(roles.map((r) => r.id));

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function firebaseMsg(code: string): string {
  switch (code) {
    case "auth/email-already-in-use": return "An account with this email already exists.";
    case "auth/weak-password":        return "Password must be at least 6 characters.";
    case "auth/invalid-email":        return "Enter a valid email address.";
    case "auth/popup-closed-by-user": return "";
    case "auth/too-many-requests":    return "Too many attempts — try again later.";
    default:                          return "Something went wrong. Please try again.";
  }
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState("member");
  const [showPass, setShowPass]         = useState(false);
  const [loading, setLoading]           = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError]               = useState("");
  const [form, setForm]                 = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    const role = searchParams.get("role");
    if (role && validRoles.has(role)) setSelectedRole(role);
  }, [searchParams]);

  function validate() {
    if (!form.name.trim())                 return "Full name is required.";
    if (!form.email)                       return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email.";
    if (!form.password)                    return "Password is required.";
    if (form.password.length < 6)          return "Password must be at least 6 characters.";
    return null;
  }

  async function handleEmailSignUp(ev: React.FormEvent) {
    ev.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(user, { displayName: form.name.trim() });
      router.push("/dashboard");
    } catch (e: unknown) {
      setError(firebaseMsg((e as { code: string }).code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      router.push("/dashboard");
    } catch (e: unknown) {
      setError(firebaseMsg((e as { code: string }).code));
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* Left: video panel */}
      <div className="hidden lg:block relative w-[45%] overflow-hidden">
        <video
          src="/bbshoptalk.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        <div className="relative z-10 h-full flex flex-col justify-between p-10">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandLogo size="md" />
            <span className="text-lg font-black tracking-tight text-white">BRO2BRO</span>
          </Link>
          <div>
            <p className="text-white/90 text-xl font-bold leading-snug mb-1">
              The barbershop got you started.
            </p>
            <p className="text-amber-400 font-black text-xl">We&apos;ll take you further.</p>
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 sm:py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md animate-fade-in">

          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <BrandLogo size="md" />
            <span className="text-lg font-black">BRO2BRO</span>
          </Link>

          <h1 className="text-3xl font-black text-gray-900 mb-1">Create your account</h1>
          <p className="text-gray-500 text-sm mb-6">
            Free forever. Already joined?{" "}
            <Link href="/login" className="text-black font-semibold underline underline-offset-2">
              Sign in
            </Link>
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Google — fastest path */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1 active:scale-[0.98] disabled:opacity-60"
          >
            {googleLoading
              ? <span className="h-4 w-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
              : <GoogleIcon />}
            Continue with Google
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-gray-400">or sign up with email</span>
            </div>
          </div>

          {/* Role — compact chips */}
          <div className="mb-5">
            <p className="text-sm font-medium text-gray-700 mb-2.5">I&apos;m joining as</p>
            <div className="flex flex-wrap gap-2">
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRole(r.id)}
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all duration-150",
                    selectedRole === r.id
                      ? "border-black bg-gray-900 text-white shadow-sm"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <span className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center shrink-0",
                    selectedRole === r.id ? "bg-white/15" : r.color
                  )}>
                    <r.icon className="h-3.5 w-3.5 text-white" />
                  </span>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleEmailSignUp} className="space-y-3.5">
            <Input
              label="Full name"
              placeholder="Marcus Johnson"
              value={form.name}
              autoComplete="name"
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              autoComplete="email"
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
            <Input
              label="Password"
              type={showPass ? "text" : "password"}
              placeholder="At least 6 characters"
              value={form.password}
              autoComplete="new-password"
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              rightIcon={
                <button type="button" onClick={() => setShowPass((p) => !p)} className="text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input type="checkbox" required className="mt-0.5 rounded border-gray-300 accent-black shrink-0" />
              <span className="text-xs text-gray-500 leading-relaxed">
                I agree to the{" "}
                <Link href="#" className="text-gray-800 underline underline-offset-2">Terms</Link> and{" "}
                <Link href="#" className="text-gray-800 underline underline-offset-2">Privacy Policy</Link>.
              </span>
            </label>

            <Button type="submit" className="w-full mt-1" size="lg" disabled={loading || googleLoading}>
              {loading
                ? <span className="flex items-center gap-2"><span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account…</span>
                : <>Create free account <ArrowRight className="ml-2 h-4 w-4" /></>}
            </Button>
          </form>

          <p className="text-[11px] text-gray-400 text-center mt-6 leading-relaxed">
            Your health data stays private and encrypted.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <span className="h-6 w-6 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}

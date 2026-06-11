"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { signInWithEmail } from "@/lib/auth-helpers";

function firebaseMsg(code: string): string {
  switch (code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential": return "Incorrect email or password.";
    case "auth/user-disabled":      return "This account has been disabled.";
    case "auth/too-many-requests":  return "Too many attempts — try again later.";
    case "auth/popup-closed-by-user": return "";
    default:                        return "Something went wrong. Please try again.";
  }
}

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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(firebaseMsg((err as { code: string }).code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    if (!auth) { setError("Sign-in is unavailable. Check Firebase configuration."); return; }
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(firebaseMsg((err as { code: string }).code));
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left: video panel ── */}
      <div className="hidden lg:block relative w-[45%] overflow-hidden">
        <video
          src="/bbshop.mp4"
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
              The barbershop got men talking.
            </p>
            <p className="text-amber-400 font-black text-xl">We built what comes next.</p>
          </div>
        </div>
      </div>

      {/* ── Right: form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">

          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <BrandLogo size="md" />
            <span className="text-lg font-black">BRO2BRO</span>
          </Link>

          <h1 className="text-3xl font-black text-gray-900 mb-1.5">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-8">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-black font-semibold underline underline-offset-2">
              Sign up free
            </Link>
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type={showPass ? "text" : "password"}
              placeholder="Your password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              rightIcon={
                <button type="button" onClick={() => setShowPass((p) => !p)} className="text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
            <label className="flex items-center gap-2 cursor-pointer select-none text-sm pt-1">
              <input type="checkbox" className="rounded border-gray-300 accent-black" />
              <span className="text-gray-600">Remember me</span>
            </label>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading
                ? <span className="flex items-center gap-2"><span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</span>
                : <>Sign in <ArrowRight className="ml-2 h-4 w-4" /></>}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-gray-400">or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1 active:scale-[0.98]"
          >
            <GoogleIcon /> Continue with Google
          </button>

          <p className="text-xs text-gray-400 text-center mt-8 leading-relaxed">
            By signing in you agree to our{" "}
            <Link href="#" className="underline hover:text-black">Terms of Service</Link> and{" "}
            <Link href="#" className="underline hover:text-black">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

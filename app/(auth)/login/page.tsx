"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import bro2broLogo from "@/brand_assets/Bro2Bro logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel (desktop) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-black text-white p-12">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src={bro2broLogo} alt="BRO2BRO" height={36} className="h-9 w-auto" />
          <span className="text-xl font-black tracking-tight text-white">BRO2BRO</span>
        </Link>

        <div>
          <blockquote className="text-2xl font-bold text-white leading-snug mb-4">
            &ldquo;My barber told me to try it. Within a week, my BP was under control for the first time in years.&rdquo;
          </blockquote>
          <p className="text-gray-400 text-sm">Marcus W. — Pine Bluff, AR</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { v: "600+", l: "Men screened" },
            { v: "63.6%", l: "BP control rate" },
            { v: "61", l: "Partner barbershops" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-2xl font-black text-amber-400">{s.v}</div>
              <div className="text-xs text-gray-400 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <Image src={bro2broLogo} alt="BRO2BRO" height={32} className="h-8 w-auto" />
            <span className="text-lg font-black">BRO2BRO</span>
          </Link>

          <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-500 mb-8 text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-black font-semibold underline underline-offset-2">
              Sign up free
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              error={errors.password}
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-black font-medium underline underline-offset-2">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                <>Sign in <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
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

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </Button>
            <Button variant="outline" className="gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-3.9 2.552-5.97 5.067-5.97 1.307 0 2.397.61 3.217.61.787 0 2.olas.65 3.48.65 1.68 0 3.41-1.35 3.41-1.35.07.12.12.27.12.43 0 1.85-1.6 3.79-1.6 3.79s.51.28.51 1.37c0 1.68-1.04 3.53-1.04 3.53.43.37.73.9.73 1.52z"/></svg>
              Apple
            </Button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-8 leading-relaxed">
            By signing in you agree to our{" "}
            <Link href="#" className="underline">Terms of Service</Link> and{" "}
            <Link href="#" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

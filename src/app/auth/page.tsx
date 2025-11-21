"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (mode === "signup") {
      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error ?? "Failed to create account.");
          setLoading(false);
          return;
        }
      }

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
      <section className="mx-auto max-w-md space-y-6 rounded-3xl border border-[#D9A441]/60 bg-black/85 p-5 shadow-lg shadow-black/70 sm:p-8">
        <div className="flex justify-center gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#D9A441]">
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={
              mode === "signup"
                ? "border-b border-[#D9A441] pb-1 text-[#D9A441]"
                : "pb-1 text-[#9CA3AF]"
            }
          >
            Create account
          </button>
          <button
            type="button"
            onClick={() => setMode("login")}
            className={
              mode === "login"
                ? "border-b border-[#D9A441] pb-1 text-[#D9A441]"
                : "pb-1 text-[#9CA3AF]"
            }
          >
            Log in
          </button>
        </div>

        <h1 className="text-center text-2xl font-semibold text-[#FFF9F2]">
          {mode === "signup" ? "Join Holly Jolly Savings" : "Welcome back"}
        </h1>

        {error && (
          <p className="rounded-md border border-red-500/60 bg-red-500/10 p-2 text-xs text-red-200">
            {error}
          </p>
        )}

        {mode === "signup" && (
          <div className="rounded-md border border-[#4B5563] bg-black/60 p-2 text-[11px] text-[#E5E7EB]">
            <p className="font-semibold text-[#FFF9F2]">Password requirements</p>
            <ul className="mt-1 list-disc pl-4 space-y-0.5">
              <li>At least 8 characters long</li>
              <li>Includes at least one number (0-9)</li>
              <li>Includes at least one special character (e.g. ! @ # ?)</li>
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {mode === "signup" && (
            <div className="space-y-1">
              <label className="block text-xs text-[#E5E7EB]" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-[#4B5563] bg-black/60 px-3 py-2 text-xs text-[#F9FAFB] focus:border-[#D9A441] focus:outline-none"
                autoComplete="name"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs text-[#E5E7EB]" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-[#4B5563] bg-black/60 px-3 py-2 text-xs text-[#F9FAFB] focus:border-[#D9A441] focus:outline-none"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-[#E5E7EB]" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-[#4B5563] bg-black/60 px-3 py-2 text-xs text-[#F9FAFB] focus:border-[#D9A441] focus:outline-none"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
            />
          </div>

          {mode === "signup" && (
            <div className="space-y-1">
              <label className="block text-xs text-[#E5E7EB]" htmlFor="confirmPassword">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border border-[#4B5563] bg-black/60 px-3 py-2 text-xs text-[#F9FAFB] focus:border-[#D9A441] focus:outline-none"
                autoComplete="new-password"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-full bg-[#D9A441] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-black shadow hover:bg-[#b88c2a] disabled:opacity-60"
          >
            {loading
              ? mode === "signup"
                ? "Creating account..."
                : "Signing in..."
              : mode === "signup"
                ? "Create account"
                : "Log in"}
          </button>
        </form>

        <div className="space-y-3 pt-3 text-xs">
          <div className="flex items-center gap-2 text-[#9CA3AF]">
            <span className="h-px flex-1 bg-[#4B5563]" />
            <span>Or continue with</span>
            <span className="h-px flex-1 bg-[#4B5563]" />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => signIn("google")}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#4B5563] bg-black/60 px-4 py-2 text-[11px] font-medium text-[#F9FAFB] hover:border-[#D9A441]"
            >
              Continue with Google
            </button>
            <button
              type="button"
              onClick={() => signIn("apple")}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#4B5563] bg-black/60 px-4 py-2 text-[11px] font-medium text-[#F9FAFB] hover:border-[#D9A441]"
            >
              Continue with Apple
            </button>
          </div>
        </div>
      </section>
  );
}

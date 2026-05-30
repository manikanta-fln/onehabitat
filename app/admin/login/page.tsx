"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BRAND_NAME } from "@/utils/constants";
import { adminToast, getAdminErrorMessage } from "@/lib/admin/toast";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(body.error ?? "Login failed");
      }

      const next = searchParams.get("next") || "/admin/dashboard";
      router.push(next);
      router.refresh();
    } catch (err) {
      const message = getAdminErrorMessage(err);
      setError(message);
      adminToast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5 text-left">
      <label className="admin-field">
        <span className="admin-label">Email</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="admin-input"
          placeholder="you@onehabitat.com"
        />
      </label>

      <label className="admin-field">
        <span className="admin-label">Password</span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="admin-input"
          placeholder="Enter your password"
        />
      </label>

      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-error/20 bg-error-container/20 px-4 py-3 text-left font-body text-body-sm text-on-error-container"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="admin-btn-primary w-full py-3 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-[420px] rounded-3xl border border-outline-variant/10 bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-8 text-center">
          <p className="font-headline text-headline-md text-primary">{BRAND_NAME}</p>
          <h1 className="mt-2 font-headline text-headline-sm text-on-surface">
            Admin Console
          </h1>
          <p className="mx-auto mt-2 max-w-[18rem] font-body text-body-sm leading-relaxed text-on-surface-variant">
            Sign in to manage issues, bookings, and customers.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex min-h-[280px] items-center justify-center">
              <p className="font-body text-body-sm text-on-surface-variant">Loading…</p>
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setMsg("");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) setError(error.message);
    else setMsg("Check your email for a reset link.");
  }

  return (
    <main className="mx-auto max-w-sm p-6 text-white">
      <h1 className="mb-4 text-2xl font-semibold">Forgot Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        {msg && <p className="text-sm text-green-400">{msg}</p>}
        <button className="w-full rounded-lg bg-blue-600 p-3">Send reset link</button>
      </form>
      <Link href="/login" className="mt-4 block text-sm text-blue-400">Back to Log in</Link>
    </main>
  );
}

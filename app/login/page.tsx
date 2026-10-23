"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import PasswordInput from "@/components/PasswordInput";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setError(error.message);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-sm p-6 text-white">
      <h1 className="mb-4 text-2xl font-semibold">Log In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3"
        />
        <PasswordInput value={password} onChange={setPassword} />
        <Link href="/forgot-password" className="block text-sm text-blue-400">
          Forgot password?
        </Link>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button className="w-full rounded-lg bg-blue-600 p-3">Log In</button>
      </form>
      <p className="mt-4 text-sm text-gray-400">
        No account? <Link href="/signup" className="text-blue-400">Sign up</Link>
      </p>
    </main>
  );
}

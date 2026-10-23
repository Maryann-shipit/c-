"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import PasswordInput from "@/components/PasswordInput";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setMsg("");
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return setError(error.message);
    if (data.session) router.push("/dashboard");
    else setMsg("Check your email to confirm your account.");
  }

  return (
    <main className="mx-auto max-w-sm p-6 text-white">
      <h1 className="mb-4 text-2xl font-semibold">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3"
        />
        <PasswordInput value={password} onChange={setPassword} />
        {error && <p className="text-sm text-red-400">{error}</p>}
        {msg && <p className="text-sm text-green-400">{msg}</p>}
        <button className="w-full rounded-lg bg-blue-600 p-3">Sign Up</button>
      </form>
      <p className="mt-4 text-sm text-gray-400">
        Already have an account? <Link href="/login" className="text-blue-400">Log in</Link>
      </p>
    </main>
  );
}

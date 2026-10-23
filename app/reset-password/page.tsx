"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import PasswordInput from "@/components/PasswordInput";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError(error.message);
    else router.push("/dashboard");
  }

  return (
    <main className="mx-auto max-w-sm p-6 text-white">
      <h1 className="mb-4 text-2xl font-semibold">Set New Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordInput value={password} onChange={setPassword} placeholder="New password" />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button className="w-full rounded-lg bg-blue-600 p-3">Update password</button>
      </form>
    </main>
  );
}

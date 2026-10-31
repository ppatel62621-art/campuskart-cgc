"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/utils";

export function AuthForm({
  role,
  heading,
  description,
}: {
  role: "vendor" | "admin" | "student";
  heading: string;
  description: string;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);

    if (!isSupabaseConfigured()) {
      setMessage(
        "Supabase env vars are missing. Add them to .env.local, then try again.",
      );
      setBusy(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage(`Signed in as ${role}. Redirecting to the ${role} workspace.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-3xl bg-white p-6 sm:p-8">
      <div>
        <h1 className="font-display text-3xl text-ink">{heading}</h1>
        <p className="mt-2 text-sm leading-6 text-ink-muted">{description}</p>
      </div>
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      {message ? <p className="text-sm text-ink-muted">{message}</p> : null}
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}

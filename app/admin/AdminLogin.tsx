"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const sp = useSearchParams();
  const next = sp.get("next") || "/admin/dashboard";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");

    const r = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!r.ok) {
      setErr(await r.text());
      return;
    }
    window.location.href = next;
  }

  return (
    <main className="container" style={{ maxWidth: 480, padding: "64px 0" }}>
      <h1 className="text-3xl font-extrabold mb-2">Admin login</h1>
      <form onSubmit={onSubmit} className="form">
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {err && <p className="muted" style={{ color: "#b91c1c" }}>{err}</p>}
        <button className="btn btn-cta" type="submit">Sign in</button>
      </form>
    </main>
  );
}

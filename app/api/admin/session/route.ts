// app/api/admin/session/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
const BACKEND = (process.env.BACKEND_API_URL ?? "").trim();

export async function POST(req: NextRequest) {
  if (!BACKEND) return new NextResponse("BACKEND_API_URL not set", { status: 500 });

  let body: any;
  try { body = await req.json(); } catch { return new NextResponse("Invalid JSON", { status: 400 }); }
  const password = String(body?.password ?? "").trim();
  if (!password) return new NextResponse("Password required", { status: 400 });

  const r = await fetch(`${BACKEND}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
    cache: "no-store",
  });

  const text = await r.text();
  if (!r.ok) return new NextResponse(text || "Login failed", { status: r.status });

  let token: string | undefined;
  try { ({ token } = JSON.parse(text)); } catch { return new NextResponse("Malformed backend response", { status: 502 }); }
  if (!token) return new NextResponse("No token from backend", { status: 500 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 12,
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
  return res;
}

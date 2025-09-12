// app/api/admin/_lib/proxy.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const BACKEND = (process.env.BACKEND_API_URL ?? "").trim(); // e.g. http://localhost:3001/api

type ForwardInit = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
  cache?: RequestCache;
};

// Await cookies() here (for Next versions where it's async)
export async function adminForward(
  path: string,
  init: ForwardInit = {}
): Promise<NextResponse> {
  if (!BACKEND) {
    return NextResponse.json({ error: "BACKEND_API_URL not set" }, { status: 500 });
  }

  const store = await cookies(); // 👈 await here
  const token = store.get("admin_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const url = `${BACKEND}${path}`;
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(init.headers ?? {}),
    Authorization: `Bearer ${token}`,
  };

  const r = await fetch(url, {
    method: init.method ?? "GET",
    headers,
    body:
      init.body === undefined
        ? undefined
        : typeof init.body === "string"
        ? init.body
        : JSON.stringify(init.body),
    cache: init.cache ?? "no-store",
  });

  const ct = r.headers.get("content-type") ?? "application/json";
  const text = await r.text();
  return new NextResponse(text, { status: r.status, headers: { "Content-Type": ct } });
}

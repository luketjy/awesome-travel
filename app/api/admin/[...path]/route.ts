// app/api/admin/[...path]/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
const BACKEND = (process.env.BACKEND_API_URL ?? "").trim(); // e.g. http://localhost:3001/api

async function forward(req: Request, segs: string[]) {
  if (!BACKEND) {
    return NextResponse.json({ error: "BACKEND_API_URL not set" }, { status: 500 });
  }

  // No specific subpath -> nothing to proxy
  if (segs.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Let /api/admin/session be handled by app/api/admin/session/route.ts
  if (segs[0] === "session") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Require auth cookie set by /api/admin/session
  const store = await cookies();
  const token = store.get("admin_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { search } = new URL(req.url);
  const target = `${BACKEND}/admin/${segs.join("/")}${search}`;

  const method = req.method as "GET" | "POST" | "PATCH" | "PUT" | "DELETE" | "HEAD";

  let body: BodyInit | undefined;
  if (method !== "GET" && method !== "HEAD") {
    const txt = await req.text();
    body = txt || undefined;
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  if (method !== "GET" && method !== "HEAD") {
    headers["Content-Type"] = "application/json";
  }

  // Optional: uncomment while debugging
  // console.log("[admin-proxy]", method, target, "cookie=", token ? "yes" : "no");

  const r = await fetch(target, {
    method,
    headers,
    body,
    cache: "no-store",
  });

  const text = await r.text();
  const resp = new NextResponse(text, { status: r.status });

  // Pass through useful headers from the backend
  for (const [k, v] of r.headers) {
    const kl = k.toLowerCase();
    if (["content-type", "cache-control", "etag", "link", "vary", "x-total-count"].includes(kl)) {
      resp.headers.set(k, v);
    }
  }
  if (!resp.headers.has("content-type")) {
    resp.headers.set("content-type", "application/json");
  }

  return resp;
}

// Note: in newer Next versions, params is a Promise and must be awaited.
type Ctx = { params: Promise<{ path?: string[] }> };

export async function GET(req: Request, ctx: Ctx) {
  const { path = [] } = await ctx.params;
  return forward(req, path);
}

export async function POST(req: Request, ctx: Ctx) {
  const { path = [] } = await ctx.params;
  return forward(req, path);
}

export async function PATCH(req: Request, ctx: Ctx) {
  const { path = [] } = await ctx.params;
  return forward(req, path);
}

export async function PUT(req: Request, ctx: Ctx) {
  const { path = [] } = await ctx.params;
  return forward(req, path);
}

export async function DELETE(req: Request, ctx: Ctx) {
  const { path = [] } = await ctx.params;
  return forward(req, path);
}

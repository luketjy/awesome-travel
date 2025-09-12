// app/api/[...path]/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
const BACKEND = (process.env.BACKEND_API_URL ?? "").trim(); 

async function forward(req: Request, segs: string[]) {
  if (!BACKEND) return new NextResponse("BACKEND_API_URL not set", { status: 500 });

  // Let the dedicated admin proxy handle /api/admin/*
  if (segs[0] === "admin") return new NextResponse("Not found", { status: 404 });

  const { search } = new URL(req.url);
  const target = `${BACKEND}/${segs.join("/")}${search}`;

  const method = req.method as "GET" | "POST" | "PATCH" | "PUT" | "DELETE" | "HEAD";
  let body: BodyInit | undefined;
  if (method !== "GET" && method !== "HEAD") {
    const txt = await req.text();
    body = txt || undefined;
  }

  const r = await fetch(target, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body,
    cache: "no-store",
  });

  const ct = r.headers.get("content-type") ?? "application/json";
  const resp = await r.text();
  return new NextResponse(resp, { status: r.status, headers: { "Content-Type": ct } });
}

// In newer Next, params is async → await it
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

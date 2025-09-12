// lib/adminClient.ts
export type ApiInit = Omit<RequestInit, "credentials" | "headers"> & {
  headers?: Record<string, string>;
};

function normalizePath(path: string): string {
  // Full URL → use as-is
  if (/^https?:\/\//i.test(path)) return path;

  // Already an /api/... path → use as-is
  if (path.startsWith("/api/")) return path;

  // Ensure it starts with /admin/ (accept "admin/..." or "/admin/...")
  const adminPath =
    path.startsWith("/admin")
      ? path
      : `/admin${path.startsWith("/") ? path : `/${path}`}`;

  // Prefix the Next API base
  return `/api${adminPath}`;
}

export async function api(path: string, init: ApiInit = {}) {
  const url = normalizePath(path);
  const method = init.method ?? "GET";

  // Helpful debug line — see exactly what’s being called:
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.debug("[adminClient] →", method, url);
  }

  const r = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
    body: init.body as BodyInit | undefined,
    cache: init.cache ?? "no-store",
    credentials: "include", // send cookie to Next API
  });

  const ct = r.headers.get("content-type") || "";
  const isJson = ct.includes("application/json");
  const text = await r.text();
  const data = isJson && text ? JSON.parse(text) : text;

  if (!r.ok) {
    throw new Error(
      (isJson && (data as any)?.error) || text || `Request failed (${r.status})`
    );
  }

  return isJson ? data : { ok: true, body: text };
}

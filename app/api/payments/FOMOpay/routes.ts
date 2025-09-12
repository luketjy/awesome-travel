import { NextResponse } from "next/server";
import crypto from "crypto";

const MID = process.env.FOMO_MID!;
const PSK = process.env.FOMO_PSK!; // keep server-side only!

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const raw = await req.text(); // DO NOT JSON.parse for signature
    const auth = req.headers.get("x-fomopay-authorization") || "";
    // Format: "FOMOPAY1-HMAC-SHA256 Version=1.1,Credential=<MID>,Nonce=<nonce>,Timestamp=<ts>,Signature=<sig>"
    if (!auth.startsWith("FOMOPAY1-HMAC-SHA256")) return NextResponse.json({ ok: true });

    const kv: Record<string, string> = {};
    auth.split(" ").slice(1).join(" ").split(",").forEach(p => {
      const [k, v] = p.trim().split("=");
      if (k && v) kv[k] = v;
    });

    const { Version, Credential, Nonce, Timestamp, Signature } = kv;
    if (Version !== "1.1" || Credential !== MID) return NextResponse.json({ ok: true });

    const msg = `${raw}${Timestamp}${Nonce}`;
    const hmac = crypto.createHmac("sha256", PSK).update(msg).digest("hex");

    if (hmac !== Signature) {
      // signature mismatch -> ignore silently (don’t 500)
      return NextResponse.json({ ok: true });
    }

    // ✅ Signature verified — reply 200 ASAP
    return NextResponse.json({ ok: true });
  } catch {
    // Always reply 200 quickly per doc to avoid retries
    return NextResponse.json({ ok: true });
  }
}

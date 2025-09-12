"use client";

import { useEffect, useState } from "react";

type Status = "loading" | "success" | "fail" | "unknown";

export default function ResultPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      try {
        // 1) get order id from sessionStorage or URL
        let id = sessionStorage.getItem("fomo_last_order_id") || "";
        if (!id) {
          const url = new URL(window.location.href);
          id = url.searchParams.get("orderId") || url.searchParams.get("id") || "";
        }
        if (!id) {
          setStatus("unknown");
          setError("Missing order id.");
          return;
        }

        // 2) call your **Express backend**, not Next
        const base = process.env.NEXT_PUBLIC_API_URL; // e.g. https://api.your-domain.com
        if (!base) {
          setStatus("unknown");
          setError("NEXT_PUBLIC_API_BASE not set");
          return;
        }

        const r = await fetch(
          `${base.replace(/\/$/, "")}/payments/fomopay/orders/${encodeURIComponent(id)}`,
          { cache: "no-store" }
        );

        if (!r.ok) {
          setStatus("unknown");
          setError(`Backend returned ${r.status}`);
          return;
        }

        const data = await r.json();
        setDetails(data);

        // 3) derive status (adjust if your backend uses different fields)
        const s = String(data?.status || data?.orderStatus || "").toUpperCase();
        if (s === "SUCCESS") setStatus("success");
        else if (["FAIL", "FAILED", "ERROR", "CLOSED"].includes(s)) setStatus("fail");
        else setStatus("unknown");
      } catch (e: any) {
        setStatus("unknown");
        setError(e?.message || "Unexpected error");
      }
    };

    run();
  }, []);

  return (
    <main className="container" style={{ padding: "32px 0" }}>
      <h1 className="text-3xl font-extrabold mb-2">Payment result</h1>

      {status === "loading" && <p>Checking payment status…</p>}
      {status === "success" && <p className="text-green-700 font-bold">Payment successful 🎉</p>}
      {status === "fail" && <p className="text-red-700 font-bold">Payment failed or cancelled.</p>}
      {status === "unknown" && <p>We couldn’t determine the status. Please contact support.</p>}

      {error && (
        <p className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {details && (
        <pre className="mt-4 p-3 bg-gray-50 rounded border overflow-auto">
          {JSON.stringify(details, null, 2)}
        </pre>
      )}
    </main>
  );
}

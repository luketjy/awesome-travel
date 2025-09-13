"use client";

import { useSearchParams } from "next/navigation";
// import other client hooks as needed (useState, useEffect, etc.)

export default function CheckoutClient() {
  const sp = useSearchParams();
  // example usage: read query params like ?tour=...&date=...
  const tour = sp.get("tour") || "";
  const date = sp.get("date") || "";

  return (
    <main className="container" style={{ padding: "32px 0" }}>
      <h1 className="text-3xl font-extrabold mb-2">Checkout</h1>
      <p className="text-sm text-gray-600">Tour: {tour || "(none)"}</p>
      <p className="text-sm text-gray-600">Date: {date || "(none)"}</p>
      {/* your existing checkout UI goes here */}
    </main>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// optional helper to fetch tours if you need price
async function getTours() {
  const r = await fetch("/api/tours", { cache: "no-store" });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

type Contact = { name: string; email: string; phone: string };

export default function CheckoutPage() {
  const sp = useSearchParams();
  const router = useRouter();

  const tourId = Number(sp.get("tour") || 0);
  const date = sp.get("date") || "";
  const time = sp.get("time") || "";
  const slotId = Number(sp.get("slotId") || 0);
  const qty = Math.max(1, Math.min(12, Number(sp.get("qty") || 1)));

  const [pricePP, setPricePP] = useState<number | null>(null);
  const total = useMemo(() => (pricePP != null ? qty * pricePP : null), [qty, pricePP]);

  // ---- contact info ----
  const [contact, setContact] = useState<Contact>({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Partial<Contact>>({});

  // simple validators
  const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const phoneOk = (v: string) => {
    const digits = v.replace(/\D/g, "");
    return digits.length >= 8 && digits.length <= 15;
  };
  const nameOk = (v: string) => v.trim().length >= 2;

  const isFormValid =
    total != null && nameOk(contact.name) && emailOk(contact.email) && phoneOk(contact.phone);

  // prefill contact from query/localStorage
  useEffect(() => {
    try {
      const fromStore = localStorage.getItem("checkout_contact");
      const init: Contact = {
        name: sp.get("name") || (fromStore ? JSON.parse(fromStore).name : "") || "",
        email: sp.get("email") || (fromStore ? JSON.parse(fromStore).email : "") || "",
        phone: sp.get("phone") || (fromStore ? JSON.parse(fromStore).phone : "") || "",
      };
      setContact(init);
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist contact as user types
  useEffect(() => {
    try {
      localStorage.setItem("checkout_contact", JSON.stringify(contact));
    } catch {
      /* ignore */
    }
  }, [contact]);

  useEffect(() => {
    // fetch tour price if not passed
    getTours()
      .then((tours) => {
        const t = tours.find((x: any) => x.id === tourId);
        if (t) setPricePP(t.price_pp ?? t.pricePP ?? null);
      })
      .catch(() => {});
  }, [tourId]);

  function validateNow() {
    const e: Partial<Contact> = {};
    if (!nameOk(contact.name)) e.name = "Please enter your full name.";
    if (!emailOk(contact.email)) e.email = "Enter a valid email.";
    if (!phoneOk(contact.phone)) e.phone = "Enter a valid phone (8–15 digits).";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onPay() {
    if (!validateNow() || !total) return;

    const r = await fetch("/api/payments/fomopay/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: total,
        currency: "SGD",
        subject: `Tour #${tourId} x ${qty}`,
        description: `${date} ${time} (slot ${slotId})`,
        orderNo: `book-${Date.now()}`,
        returnPath: "/checkout/result",
        backPath: "/booking",
        // attach contact so your backend can create a booking/lead record
        customer: {
          name: contact.name.trim(),
          email: contact.email.trim(),
          phone: contact.phone.trim(),
        },
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      alert(data?.error || "Create order failed");
      return;
    }

    // keep order + contact so /checkout/result can reconcile later
    sessionStorage.setItem("fomo_last_order_id", data.orderId);
    sessionStorage.setItem("fomo_contact", JSON.stringify(contact));

    // redirect to FOMO hosted page
    window.location.href = data.url;
  }

  return (
    <main className="container" style={{ padding: "32px 0" }}>
      <h1 className="text-3xl font-extrabold mb-2">Checkout</h1>
      <p className="muted mb-4">
        {date && time ? `${date} at ${time}` : "Selected timeslot"}
      </p>

      <div className="card max-w-xl">
        <div className="card-body space-y-4">
          {/* Contact details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Your details</h2>
            </div>

            <label className="block">
              <span className="text-sm">Full name</span>
              <input
                className="input w-full"
                placeholder="Jane Tan"
                value={contact.name}
                onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                onBlur={validateNow}
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </label>

            <label className="block">
              <span className="text-sm">Email</span>
              <input
                className="input w-full"
                type="email"
                placeholder="jane@example.com"
                value={contact.email}
                onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                onBlur={validateNow}
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </label>

            <label className="block">
              <span className="text-sm">Phone</span>
              <input
                className="input w-full"
                placeholder="+65 8123 4567"
                value={contact.phone}
                onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                onBlur={validateNow}
              />
              {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
            </label>
          </div>

          {/* Quantity & pricing */}
          <div className="flex items-center justify-between pt-2">
            <div>Quantity</div>
            <div className="flex items-center gap-2">
              <button
                className="btn btn-outline"
                onClick={() =>
                  router.push(
                    `/checkout?tour=${tourId}&date=${date}&time=${encodeURIComponent(
                      time
                    )}&slotId=${slotId}&qty=${Math.max(1, qty - 1)}`
                  )
                }
              >
                –
              </button>
              <div className="min-w-[2rem] text-center font-bold">{qty}</div>
              <button
                className="btn btn-outline"
                onClick={() =>
                  router.push(
                    `/checkout?tour=${tourId}&date=${date}&time=${encodeURIComponent(
                      time
                    )}&slotId=${slotId}&qty=${Math.min(12, qty + 1)}`
                  )
                }
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>Price per person</div>
            <div className="font-bold">
              {pricePP != null ? `S$${pricePP.toFixed(2)}` : "—"}
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-3">
            <div>Total</div>
            <div className="text-xl font-extrabold">
              {total != null ? `S$${total.toFixed(2)}` : "—"}
            </div>
          </div>

          <button
            className="btn btn-cta w-full"
            onClick={onPay}
            disabled={!isFormValid}
            title={!isFormValid ? "Please complete your details" : ""}
          >
            Pay with FOMO Pay
          </button>
        </div>
      </div>
    </main>
  );
}

// app/booking/page.tsx
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Calendar, { CalendarSelectedSlot } from "@/components/Calendar";

type Tour = { id: number; name: string; price_pp: number };

export default function BookingPage() {
  const router = useRouter();

  // Selection from Calendar
  const [selected, setSelected] = useState<CalendarSelectedSlot | null>(null);

  // Quantity
  const [qty, setQty] = useState<number>(1);

  // Tours (to display price)
  const [tours, setTours] = useState<Tour[]>([]);

  useEffect(() => {
    fetch("/api/tours", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: Tour[]) => setTours(data || []))
      .catch(() => {});
  }, []);

  const selectedTour = useMemo(() => {
    if (!selected) return null;
    return tours.find((t) => t.id === selected.tourId) || null;
  }, [selected, tours]);

  // Price per person for selected tour
  const unitPrice = selectedTour?.price_pp ?? 0;

  // Safe max quantity (remaining → capacity → default 12)
  const maxQty = useMemo(() => {
    const raw = Number(selected?.remaining ?? selected?.capacity ?? 12);
    return Number.isFinite(raw) && raw >= 1 ? raw : 12;
  }, [selected]);

  const clampQty = useCallback(
    (n: number) => {
      const safeMax = Number.isFinite(maxQty) && maxQty >= 1 ? maxQty : 12;
      const safeN = Number.isFinite(n) ? n : 1;
      return Math.min(safeMax, Math.max(1, safeN));
    },
    [maxQty]
  );

  function dec() {
    setQty((n) => clampQty((Number.isFinite(n) ? n : 1) - 1));
  }
  function inc() {
    setQty((n) => clampQty((Number.isFinite(n) ? n : 1) + 1));
  }

  function handleSelect(s: CalendarSelectedSlot) {
    setSelected(s);
    setQty(1); // start fresh at 1 when picking a new slot
  }

  const total = unitPrice * (Number.isFinite(qty) ? qty : 1);

  // ⬇️ Build checkout URL and navigate
  const reserve = useCallback(() => {
    if (!selected) return;

    const params = new URLSearchParams({
      tour: String(selected.tourId),
      tourName: selectedTour?.name ?? "Selected tour",
      date: selected.date,
      time: selected.time,
      slotId: String(selected.timeslotId),
      qty: String(clampQty(qty)),
      // Pass price so checkout can render immediately (it can also re-fetch/verify)
      price: unitPrice ? unitPrice.toFixed(2) : "0",
    });

    router.push(`/checkout?${params.toString()}`);
  }, [selected, selectedTour?.name, clampQty, qty, unitPrice, router]);

  return (
    <main className="section section-alt">
      <div className="container">
        <header className="section-head" data-aos="fade-up">
          <h1 className="text-3xl sm:text-4xl font-extrabold">
            Book your Singapore experience
          </h1>
          <p className="muted">
            Pick a tour and choose a date with available seats. Choose quantity now; you’ll fill details on the next page.
          </p>
        </header>

        <div className="grid grid-cols-12 gap-4 items-start">
          <div className="col-span-12 lg:col-span-7">
            {/* Calendar emits the picked slot */}
            <Calendar onSelect={handleSelect} selected={selected ?? undefined} />
          </div>

          <aside className="col-span-12 lg:col-span-5">
            <div className="card" data-aos="fade-up" data-aos-delay="80">
              <div className="card-body">
                <h2 className="font-bold text-xl mb-2">How it works</h2>
                <ol className="list-decimal ml-5 space-y-1 text-gray-700">
                  <li>Select a tour</li>
                  <li>Pick a date &amp; time with available seats</li>
                  <li>Choose quantity &amp; continue to checkout</li>
                  <li>Fill details &amp; pay</li>
                </ol>
                <p className="muted text-sm mt-3">
                  Free rescheduling up to 48 hours before the tour start (subject to availability).
                </p>
              </div>
            </div>

            {/* Quantity & price summary */}
            <div className="card mt-4" data-aos="fade-up" data-aos-delay="120">
              <div className="card-body">
                <h2 className="font-bold text-xl mb-2">Your booking</h2>

                {selected ? (
                  <>
                    <p className="muted tiny" style={{ marginBottom: 8 }}>
                      {selected.date} at {selected.time}
                      {selected.remaining !== undefined ? ` • ${selected.remaining} left` : ""}
                    </p>

                    {/* Price per person */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="muted">Price per person</div>
                      <div className="font-bold">
                        {unitPrice ? `S$${unitPrice.toFixed(2)}` : "—"}
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="font-bold mb-1">Quantity</div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 12,
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={dec}
                        disabled={(Number.isFinite(qty) ? qty : 1) <= 1}
                      >
                        −
                      </button>

                      <input
                        type="number"
                        min={1}
                        max={maxQty}
                        step={1}
                        inputMode="numeric"
                        value={Number.isFinite(qty) ? qty : 1}
                        onChange={(e) => {
                          const v = e.currentTarget.valueAsNumber; // avoids NaN from "-"
                          if (!Number.isFinite(v)) {
                            setQty(1); // user typed "-" or cleared; snap back to 1
                            return;
                          }
                          setQty(clampQty(v));
                        }}
                        onBlur={() => {
                          setQty((n) => (Number.isFinite(n) ? clampQty(n) : 1));
                        }}
                        style={{ width: 96, textAlign: "center" }}
                        required
                      />

                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={inc}
                        disabled={(Number.isFinite(qty) ? qty : 1) >= maxQty}
                      >
                        +
                      </button>

                      <span className="muted tiny">{maxQty} max</span>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between text-lg mb-3">
                      <div className="font-bold">Total</div>
                      <div className="font-extrabold">
                        {unitPrice ? `S$${total.toFixed(2)}` : "—"}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-cta w-full"
                      onClick={reserve}
                      // ✅ Only require a selected slot; allow price to load on checkout if needed
                      disabled={!selected}
                    >
                      Reserve {clampQty(qty)} ticket{clampQty(qty) > 1 ? "s" : ""} for {selected.time}
                    </button>
                  </>
                ) : (
                  <p className="muted">Pick a date &amp; time to continue.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

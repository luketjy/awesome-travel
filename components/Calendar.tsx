"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getTours, getAvailabilityByMonth, getDaySlots } from "@/lib/api";

/** --- Types coming from your APIs --- */
type Tour = { id: number; name: string; price_pp: number };
type Slot = { id: number; time: string; remaining: number };

// components/Calendar.tsx

export type CalendarSelectedSlot = {
  tourId: number;
  timeslotId: number;
  date: string;   // "YYYY-MM-DD"
  time: string;   // "HH:mm"
  remaining?: number;  // ← make optional
  capacity?: number;   // ← optional is fine too
};

export type CalendarProps = {
  onSelect?: (s: CalendarSelectedSlot) => void;
  selected?: CalendarSelectedSlot | undefined;
};

/** Safer: format YYYY-MM-DD in local time (no UTC shift) */
function ymdLocal(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fmtMonth(y: number, m: number) {
  return new Date(y, m, 1).toLocaleString(undefined, {
    month: "long",
    year: "numeric",
  });
}

export default function Calendar({ onSelect, selected }: CalendarProps) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [tourId, setTourId] = useState<number | null>(null);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  // availability map for the current month: { "YYYY-MM-DD": Slot[] }
  const [availability, setAvailability] = useState<Record<string, Slot[]>>({});

  // currently opened day and its slots
  const [pickedDate, setPickedDate] = useState<string | null>(null);
  const [daySlots, setDaySlots] = useState<Slot[]>([]);
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [loadingDay, setLoadingDay] = useState(false);
  const [error, setError] = useState<string>("");

  /** Load tours once */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getTours();
        if (!alive) return;
        setTours(data);
        if (data.length) setTourId(data[0].id);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "Failed to load tours");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  /** Load month availability whenever tour or month changes */
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!tourId) return;
      setError("");
      setLoadingMonth(true);
      try {
        const from = ymdLocal(new Date(year, month, 1));
        const to = ymdLocal(new Date(year, month + 1, 0));
        const days = await getAvailabilityByMonth(tourId, from, to);
        if (!alive) return;
        const map: Record<string, Slot[]> = {};
        (days || []).forEach((d: { date: string; slots: Slot[] }) => {
          map[d.date] = d.slots || [];
        });
        setAvailability(map);
        setPickedDate(null);
        setDaySlots([]);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "Failed to load availability");
      } finally {
        if (alive) setLoadingMonth(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [tourId, year, month]);

  /** Build calendar grid */
  const calendarCells = useMemo(() => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startWeekday = first.getDay();
    const days = last.getDate();

    const leading = Array.from({ length: startWeekday }, () => null);
    const curr = Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
    const totalCells = startWeekday + days;
    const trailing = Array.from({ length: (7 - (totalCells % 7)) % 7 }, () => null);
    return [...leading, ...curr, ...trailing];
  }, [year, month]);

  /** Open a day and fetch its slots */
  async function openDay(d: Date) {
    if (!tourId) return;
    setError("");
    setLoadingDay(true);
    const date = ymdLocal(d);
    try {
      const slots: Slot[] = await getDaySlots(tourId, date);
      setPickedDate(date);
      setDaySlots(slots || []);
      // Scroll to timeslots block
      document.getElementById("timeslots")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } catch (e: any) {
      setError(e?.message || "Failed to load timeslots");
    } finally {
      setLoadingDay(false);
    }
  }

  return (
    <div className="card" data-aos="fade-up">
      <div className="card-body">
        <h2 className="font-bold text-xl mb-3">Availability</h2>

        {/* Tour selector */}
        <label className="block mb-3">
          Tour*
          <select
            className="w-full mt-1 border rounded-md px-3 py-2"
            value={tourId ?? ""}
            onChange={(e) => setTourId(Number(e.target.value))}
          >
            {tours.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} — S${t.price_pp}
              </option>
            ))}
          </select>
        </label>

        {/* Month nav */}
        <div className="flex items-center justify-between mb-2">
          <div className="font-extrabold">{fmtMonth(year, month)}</div>
          <div className="flex gap-2">
            <button
              className="btn btn-outline px-3 py-1.5"
              onClick={() => {
                const m = month - 1;
                if (m < 0) {
                  setMonth(11);
                  setYear((y) => y - 1);
                } else setMonth(m);
              }}
              aria-label="Previous month"
            >
              ‹
            </button>
            <button
              className="btn btn-outline px-3 py-1.5"
              onClick={() => {
                const m = month + 1;
                if (m > 11) {
                  setMonth(0);
                  setYear((y) => y + 1);
                } else setMonth(m);
              }}
              aria-label="Next month"
            >
              ›
            </button>
          </div>
        </div>

        {/* Day headings */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center font-bold text-gray-500">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarCells.map((d, idx) => {
            if (!d) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="min-h-[72px] rounded-2xl bg-gray-50 border border-gray-200"
                  aria-hidden
                />
              );
            }

            const iso = ymdLocal(d);
            const slots = availability[iso] || [];
            const totalRemaining = slots.reduce((a, b) => a + (b?.remaining ?? 0), 0);
            const available = totalRemaining > 0;

            return (
              <button
                key={iso}
                onClick={() => available && openDay(d)}
                className={`min-h-[80px] rounded-2xl border text-left p-2 flex flex-col justify-between
                  ${
                    available
                      ? "bg-white border-orange-200 hover:border-[color:var(--brand-2)] cursor-pointer"
                      : "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                aria-disabled={!available}
                aria-label={`${iso}: ${
                  available ? `${totalRemaining} seats` : "Full / Closed"
                }`}
              >
                <span className="font-bold">{d.getDate()}</span>
                <span
                  className={`text-xs rounded-full px-2 py-0.5 w-fit ${
                    available
                      ? "bg-orange-100 text-orange-900 border border-orange-200"
                      : "bg-red-100 text-red-800 border border-red-200"
                  }`}
                >
                  {available ? `${totalRemaining} seats` : "Full / Closed"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Timeslots */}
        <div id="timeslots" className="mt-6">
          {pickedDate && (
            <>
              <h3 className="font-bold mb-2">
                Available times on <span className="underline">{pickedDate}</span>
              </h3>

              {loadingDay ? (
                <p>Loading times…</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {daySlots.map((s) => {
                    const isSel =
                      selected &&
                      selected.date === pickedDate &&
                      selected.timeslotId === s.id &&
                      selected.tourId === (tourId ?? -1);

                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() =>
                          onSelect?.({
                            tourId: tourId as number,
                            timeslotId: s.id,
                            date: pickedDate,
                            time: s.time,
                            remaining: s.remaining,
                          })
                        }
                        className={`border rounded-full px-3 py-1.5 font-bold
                          hover:border-[color:var(--brand-2)]
                          ${isSel ? "border-[color:var(--brand-2)]" : ""}`}
                        title={`${s.remaining} remaining`}
                        aria-pressed={isSel}
                      >
                        {s.time} ({s.remaining})
                      </button>
                    );
                  })}
                  {daySlots.length === 0 && (
                    <div className="muted">No seats left for this day.</div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {loadingMonth && <p className="tiny muted mt-2">Loading month…</p>}
        {error && <p className="tiny text-red-700 mt-2">⚠ {error}</p>}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/adminClient";

type Tour = {
  id: number;
  key: string;
  name: string;
  pricePP: number;
  active: boolean;
};

type Booking = {
  id: number;
  customerName: string;
  email: string;
  groupSize: number;
  status: string;
  timeslotId: number;
  createdAt: string;
};

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);

  const [tours, setTours] = useState<Tour[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [holds, setHolds] = useState<number>(0);

  // Create Timeslot form
  const [tourId, setTourId] = useState<number>(0);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("09:00");
  const [capacity, setCapacity] = useState<number>(12);
  const [createMsg, setCreateMsg] = useState("");

  // Blackout Day form
  const [boDate, setBoDate] = useState<string>("");
  const [boTourId, setBoTourId] = useState<string>(""); // empty = all tours
  const [blackoutMsg, setBlackoutMsg] = useState("");

  async function load() {
    setLoading(true);
    const data = await api("/admin/overview");
    setTours(data.tours);
    setBookings(data.bookings);
    setHolds(data.holds);
    setTourId(data.tours?.[0]?.id ?? 0);
    setLoading(false);
  }

  

  useEffect(() => {
    load().catch(console.error);
  }, []);

  async function onCreateTimeslot(e: React.FormEvent) {
    e.preventDefault();
    setCreateMsg("");
    if (!tourId || !date || !time) {
      setCreateMsg("Please fill all fields.");
      return;
    }
    await api("/admin/timeslots", {
      method: "POST",
      body: JSON.stringify({ tourId, date, time, capacity }),
    });
    setCreateMsg("Timeslot created.");
  }

  async function onToggleTourActive(id: number, active: boolean) {
    await api(`/admin/tours/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ active }),
    });
    load();
  }

  async function onBlackout(e: React.FormEvent) {
    e.preventDefault();
    setBlackoutMsg("");
    if (!boDate) {
      setBlackoutMsg("Pick a date.");
      return;
    }
    const body: any = { date: boDate };
    if (boTourId) body.tourId = Number(boTourId);
    const res = await api("/admin/blackout", {
      method: "DELETE",
      body: JSON.stringify(body),
    });
    setBlackoutMsg(`Blackout applied. Deleted ${res.deleted} timeslot(s).`);
  }

  if (loading) {
    return (
      <main className="container" style={{ padding: "40px 0" }}>
        Loading…
      </main>
    );
  }

  return (
    <main className="container" style={{ padding: "32px 0" }}>
      <h1 className="text-3xl font-extrabold mb-2">Admin dashboard</h1>
      <p className="muted tiny" style={{ marginBottom: 20 }}>
        awesometraveltours • quick ops tools
      </p>

      {/* Tours */}
      <section className="section">
        <h2 className="text-xl font-bold mb-2">Tours</h2>
        <div className="cards">
          {tours.map((t) => (
            <article key={t.id} className="card" style={{ gridColumn: "span 6" }}>
              <div className="card-body">
                <h3 className="font-bold">{t.name}</h3>
                <p className="muted tiny">
                  Key: {t.key} • Price: S${t.pricePP} • Active: {String(t.active)}
                </p>
                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  <button
                    className="btn btn-sm"
                    onClick={() => onToggleTourActive(t.id, !t.active)}
                  >
                    {t.active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Create timeslot */}
      <section className="section">
        <h2 className="text-xl font-bold mb-2">Create timeslot</h2>
        <form onSubmit={onCreateTimeslot} className="form" style={{ maxWidth: 560 }}>
          <label>
            Tour
            <select
              value={tourId}
              onChange={(e) => setTourId(Number(e.target.value))}
            >
              {tours.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid-3">
            <label>
              Date
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>
            <label>
              Time
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </label>
            <label>
              Capacity
              <input
                type="number"
                min={1}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
              />
            </label>
          </div>

          <button className="btn btn-cta" type="submit">
            Add timeslot
          </button>
          {createMsg && (
            <p className="tiny muted" style={{ marginTop: 6 }}>
              {createMsg}
            </p>
          )}
        </form>
      </section>

      {/* Blackout day */}
      <section className="section">
        <h2 className="text-xl font-bold mb-2">Blackout day</h2>
        <form onSubmit={onBlackout} className="form" style={{ maxWidth: 560 }}>
          <div className="grid-3">
            <label>
              Date
              <input
                type="date"
                value={boDate}
                onChange={(e) => setBoDate(e.target.value)}
                required
              />
            </label>
            <label>
              Tour (optional)
              <select
                value={boTourId}
                onChange={(e) => setBoTourId(e.target.value)}
              >
                <option value="">All tours</option>
                {tours.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="tiny muted">
                Deletes every timeslot for that date (irreversible).
              </span>
            </div>
          </div>

          <button className="btn btn-outline" type="submit">
            Apply blackout
          </button>
          {blackoutMsg && (
            <p className="tiny muted" style={{ marginTop: 6 }}>
              {blackoutMsg}
            </p>
          )}
        </form>
      </section>

      {/* Recent bookings */}
      <section className="section">
        <h2 className="text-xl font-bold mb-2">Recent bookings</h2>
        <div className="card">
          <div className="card-body">
            <p className="muted tiny">Active holds: {holds}</p>
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Size</th>
                    <th>Status</th>
                    <th>Timeslot</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>{b.customerName}</td>
                      <td>{b.email}</td>
                      <td>{b.groupSize}</td>
                      <td>{b.status}</td>
                      <td>{b.timeslotId}</td>
                      <td>{new Date(b.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

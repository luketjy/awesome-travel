const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

async function safeGet<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error(String(res.status));
    return res.json();
  } catch {
    return fallback;
  }
}

export async function getTours(){
  return safeGet(`${API}/tours`, [
    // fallback (dev without backend)
    { id: 1, name: "City Essentials (Half-Day)", price_pp: 89 },
    { id: 2, name: "Foodie Night Walk", price_pp: 99 },
    { id: 3, name: "Sentosa Family Day", price_pp: 149 }
  ]);
}

export async function getAvailabilityByMonth(tourId:number, from:string, to:string){
  return safeGet(`${API}/tours/${tourId}/availability?from=${from}&to=${to}`, []);
}

export async function getDaySlots(tourId:number, date:string){
  return safeGet(`${API}/tours/${tourId}/day/${date}`, []);
}

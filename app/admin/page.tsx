import { Suspense } from "react";
import AdminLogin from "./AdminLogin";

// avoid static prerendering here
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading admin…</div>}>
      <AdminLogin />
    </Suspense>
  );
}

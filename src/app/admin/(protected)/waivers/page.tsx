import { Suspense } from "react";
import WaiversManager from "@/components/admin/WaiversManager";

export const metadata = { title: "Waivers | Admin" };

export default function WaiversPage() {
  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <p className="text-xs font-semibold text-warm-gray uppercase tracking-widest mb-1">Admin</p>
        <h1 className="text-3xl font-serif font-bold text-forest">Liability Waivers</h1>
        <p className="text-warm-gray mt-1">Track signed waivers and share the QR code with guests.</p>
      </div>
      <Suspense fallback={<div className="animate-pulse h-48 bg-gray-100 rounded-2xl" />}>
        <WaiversManager />
      </Suspense>
    </div>
  );
}

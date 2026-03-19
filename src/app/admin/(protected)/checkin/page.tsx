import { Suspense } from "react";
import CheckinView from "@/components/admin/CheckinView";

export const metadata = { title: "Guest Check-In | Admin" };

export default function CheckinPage() {
  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <p className="text-xs font-semibold text-warm-gray uppercase tracking-widest mb-1">Admin</p>
        <h1 className="text-3xl font-serif font-bold text-forest">Guest Check-In</h1>
        <p className="text-warm-gray mt-1">Verify the reservation and issue a confirmation code.</p>
      </div>
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <svg className="animate-spin w-6 h-6 text-forest" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      }>
        <CheckinView />
      </Suspense>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface BookingData {
  type: "paid" | "gift";
  id: string;
  customerName: string;
  email: string;
  phone?: string;
  tourName: string;
  date: string;
  guests: string;
  isPrivateCharter?: boolean;
  notes?: string;
  addOns?: string;
  certCode?: string;
  amount: number;
  checkedIn: boolean;
  checkedInAt: string | null;
  confirmationCode: string | null;
}

export default function CheckinView() {
  const params = useSearchParams();
  const pi = params.get("pi");
  const cert = params.get("cert");
  const token = params.get("token");

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);

  useEffect(() => {
    if (!token || (!pi && !cert)) {
      setError("Invalid check-in link.");
      setLoading(false);
      return;
    }

    const qs = pi ? `pi=${pi}&token=${token}` : `cert=${cert}&token=${token}`;
    fetch(`/api/admin/checkin?${qs}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to load booking.");
        setBooking(data);
        if (data.checkedIn && data.confirmationCode) {
          setConfirmationCode(data.confirmationCode);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [pi, cert, token]);

  const handleCheckin = async () => {
    if (!booking || !token) return;
    setChecking(true);
    try {
      const body = pi ? { pi, token } : { cert, token };
      const res = await fetch("/api/admin/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Check-in failed.");
      setConfirmationCode(data.confirmationCode);
      setBooking((b) => b ? { ...b, checkedIn: true, confirmationCode: data.confirmationCode } : b);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Check-in failed.");
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <svg className="animate-spin w-8 h-8 text-forest" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="text-red-700 font-semibold mb-1">Check-in Error</p>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!booking) return null;

  const formattedDate = booking.date
    ? new Date(booking.date + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric", year: "numeric",
      })
    : "—";

  return (
    <div className="max-w-lg mx-auto space-y-5">

      {/* Confirmation code banner — shown after check-in */}
      {confirmationCode && (
        <div className="bg-forest rounded-2xl p-6 text-center">
          <div className="w-14 h-14 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">Checked In</p>
          <p className="text-white text-sm mb-3">Guest is confirmed. Give them this code:</p>
          <div className="bg-white/10 rounded-xl px-6 py-3 inline-block">
            <p className="text-gold font-mono text-2xl font-bold tracking-widest">{confirmationCode}</p>
          </div>
        </div>
      )}

      {/* Already checked in notice */}
      {booking.checkedIn && !confirmationCode && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 items-start">
          <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-amber-800 font-semibold text-sm">Already Checked In</p>
            {booking.checkedInAt && (
              <p className="text-amber-700 text-xs mt-0.5">
                {new Date(booking.checkedInAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Booking card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="bg-forest/5 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-warm-gray uppercase tracking-widest mb-0.5">Reservation</p>
            <p className="font-bold text-forest text-lg">{booking.customerName}</p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
            booking.checkedIn
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-amber-100 text-amber-700 border border-amber-200"
          }`}>
            {booking.checkedIn ? "Checked In" : "Pending Check-In"}
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {[
            { label: "Tour", value: booking.tourName || "—" },
            { label: "Date", value: formattedDate },
            {
              label: "Guests",
              value: booking.isPrivateCharter
                ? "Private Charter"
                : booking.guests ? `${booking.guests} guest${Number(booking.guests) !== 1 ? "s" : ""}` : "—",
            },
            { label: "Email", value: booking.email || "—" },
            booking.phone ? { label: "Phone", value: booking.phone } : null,
            booking.addOns ? { label: "Add-ons", value: booking.addOns } : null,
            booking.certCode ? { label: "Gift Cert", value: booking.certCode } : null,
            booking.amount > 0 ? { label: "Paid", value: `$${booking.amount.toFixed(2)}` } : null,
            booking.notes ? { label: "Notes", value: booking.notes } : null,
          ]
            .filter(Boolean)
            .map((row) => (
              <div key={row!.label} className="flex justify-between gap-4 px-6 py-3">
                <span className="text-xs font-semibold text-warm-gray uppercase tracking-wide w-24 shrink-0 pt-0.5">{row!.label}</span>
                <span className="text-sm text-forest font-medium text-right">{row!.value}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Check-in button */}
      {!booking.checkedIn && (
        <button
          onClick={handleCheckin}
          disabled={checking}
          className="w-full bg-forest text-white rounded-2xl py-4 font-bold text-base hover:bg-forest/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {checking ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Checking in…
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Check In Guest
            </>
          )}
        </button>
      )}

    </div>
  );
}

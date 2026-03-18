"use client";

import { useEffect, useState, useCallback } from "react";

interface Order {
  id: string;
  tourName: string;
  date: string; // YYYY-MM-DD
  guests: string;
  isPrivateCharter: boolean;
  customerName: string;
  email: string;
  phone: string;
  amount: number;
  stripeUrl: string;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Consistent tour color based on name hash
const TOUR_COLORS = [
  "bg-forest text-white",
  "bg-gold text-forest",
  "bg-sage text-white",
  "bg-blue-500 text-white",
  "bg-purple-500 text-white",
  "bg-orange-500 text-white",
];

function tourColor(tourName: string): string {
  let hash = 0;
  for (let i = 0; i < tourName.length; i++) hash = (hash * 31 + tourName.charCodeAt(i)) & 0xffff;
  return TOUR_COLORS[hash % TOUR_COLORS.length];
}

function toLocalDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function BookingCalendarWidget() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("Failed to load bookings.");
      const data: Order[] = await res.json();
      setOrders(data.filter((o) => o.date));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Build a map: dateStr -> orders[]
  const byDate = orders.reduce<Record<string, Order[]>>((acc, o) => {
    if (!acc[o.date]) acc[o.date] = [];
    acc[o.date].push(o);
    return acc;
  }, {});

  // Calendar grid
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = toLocalDateStr(today);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
    setSelectedDate(null);
  };

  const selectedOrders = selectedDate ? (byDate[selectedDate] ?? []) : [];

  // Count bookings this month
  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthOrders = orders.filter((o) => o.date.startsWith(monthPrefix));
  const monthGuests = monthOrders.reduce((s, o) => {
    const n = parseInt(o.guests);
    return s + (isNaN(n) ? 0 : n);
  }, 0);

  return (
    <div className="lg:grid lg:gap-6" style={{ gridTemplateColumns: "3fr 2fr" }}>
      <div>
      {/* Month summary strip */}
      <div className="flex items-center gap-6 mb-4 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-forest inline-block" />
          <span className="text-gray-500">{monthOrders.length} booking{monthOrders.length !== 1 ? "s" : ""} this month</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gold inline-block" />
          <span className="text-gray-500">{monthGuests} guest{monthGuests !== 1 ? "s" : ""}</span>
        </div>
        {loading && <span className="text-gray-400 text-xs">Refreshing…</span>}
        {error && <span className="text-red-500 text-xs">{error}</span>}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Calendar header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <button
            onClick={prevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="font-semibold text-forest">
            {MONTHS[month]} {year}
          </h3>
          <button
            onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {DAYS.map((d) => (
            <div key={d} className="py-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {/* Leading empty cells */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[72px] border-b border-r border-gray-50 bg-gray-50/50" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayOrders = byDate[dateStr] ?? [];
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;
            const hasPast = new Date(dateStr) < today && dateStr !== todayStr;

            return (
              <div
                key={day}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className={`min-h-[72px] border-b border-r border-gray-100 p-1.5 cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-forest/5 ring-2 ring-inset ring-forest/30"
                    : dayOrders.length > 0
                    ? "hover:bg-green-50"
                    : "hover:bg-gray-50"
                } ${hasPast ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span
                    className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${
                      isToday
                        ? "bg-forest text-white"
                        : isSelected
                        ? "text-forest"
                        : "text-gray-500"
                    }`}
                  >
                    {day}
                  </span>
                  {dayOrders.length > 1 && (
                    <span className="text-xs bg-forest/10 text-forest font-semibold px-1.5 py-0.5 rounded-full leading-none">
                      {dayOrders.length}
                    </span>
                  )}
                </div>

                {/* Show up to 2 booking chips */}
                <div className="space-y-0.5">
                  {dayOrders.slice(0, 2).map((o) => (
                    <div
                      key={o.id}
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded truncate leading-tight ${tourColor(o.tourName)}`}
                      title={`${o.tourName} — ${o.customerName}`}
                    >
                      {o.tourName.split(" ").slice(0, 2).join(" ")}
                    </div>
                  ))}
                  {dayOrders.length > 2 && (
                    <div className="text-[10px] text-gray-400 pl-1">+{dayOrders.length - 2} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>

      {/* Detail panel — right column on desktop, below on mobile */}
      <div className={!selectedDate ? "hidden lg:flex lg:items-start" : "mt-4 lg:mt-0"}>
        {selectedDate ? (
          <DetailPanel
            selectedDate={selectedDate}
            selectedOrders={selectedOrders}
            onClose={() => setSelectedDate(null)}
          />
        ) : (
          <div className="hidden lg:flex w-full bg-white rounded-2xl border border-gray-200 items-center justify-center text-gray-400 text-sm min-h-[200px]">
            Select a date to view bookings
          </div>
        )}
      </div>
    </div>
  );
}

function DetailPanel({
  selectedDate,
  selectedOrders,
  onClose,
}: {
  selectedDate: string;
  selectedOrders: Order[];
  onClose: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
        <h4 className="font-semibold text-forest text-sm">
          {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
            weekday: "long", month: "long", day: "numeric", year: "numeric",
          })}
        </h4>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {selectedOrders.length === 0 ? (
        <div className="px-5 py-8 text-center text-gray-400 text-sm">No bookings on this date.</div>
      ) : (
        <div className="divide-y divide-gray-100 overflow-y-auto">
          {selectedOrders.map((o) => (
            <div key={o.id} className="px-5 py-4 flex items-start gap-4">
              <div className={`w-2 self-stretch rounded-full shrink-0 ${tourColor(o.tourName).split(" ")[0]}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <p className="font-semibold text-forest text-sm leading-snug">{o.tourName}</p>
                  <span className="font-bold text-forest text-sm shrink-0">${o.amount.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-700 mb-0.5">{o.customerName}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500 mb-2">
                  {o.email && <span>{o.email}</span>}
                  {o.phone && <span>{o.phone}</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {o.isPrivateCharter ? "Private Charter" : `${o.guests} guest${o.guests === "1" ? "" : "s"}`}
                  </span>
                  {o.isPrivateCharter && (
                    <span className="text-xs bg-gold/15 text-gold-dark font-medium px-2 py-0.5 rounded-full">
                      Private
                    </span>
                  )}
                </div>
              </div>
              <a
                href={o.stripeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-forest underline shrink-0 hover:text-forest/70 transition-colors"
              >
                Stripe →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

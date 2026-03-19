"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Pagination from "./Pagination";

const PAGE_SIZE = 20;
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface Order {
  id: string;
  tourId: string;
  tourName: string;
  date: string;
  guests: string;
  isPrivateCharter: boolean;
  customerName: string;
  email: string;
  phone: string;
  notes: string;
  amount: number;
  status: string;
  createdAt: string;
  stripeUrl: string;
}

interface Tour {
  id: string;
  name: string;
}

type DateRange = "7d" | "30d" | "90d" | "1y" | "all";
type TourFilter = "all" | string;

const DATE_RANGE_OPTIONS: { key: DateRange; label: string }[] = [
  { key: "7d",  label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
  { key: "1y",  label: "1 year" },
  { key: "all", label: "All time" },
];

function getStartDate(range: DateRange): Date | null {
  if (range === "all") return null;
  const d = new Date();
  if (range === "7d")  d.setDate(d.getDate() - 7);
  if (range === "30d") d.setDate(d.getDate() - 30);
  if (range === "90d") d.setDate(d.getDate() - 90);
  if (range === "1y")  d.setFullYear(d.getFullYear() - 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function buildChartData(orders: Order[], range: DateRange) {
  const useWeeks = range === "1y" || range === "all";
  const buckets = new Map<string, { revenue: number; orders: number; guests: number }>();

  orders.forEach((o) => {
    const d = new Date(o.createdAt);
    let key: string;
    if (useWeeks) {
      const day = d.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      const mon = new Date(d);
      mon.setDate(d.getDate() + diff);
      key = mon.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } else {
      key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    const prev = buckets.get(key) ?? { revenue: 0, orders: 0, guests: 0 };
    const guestCount = o.isPrivateCharter ? 1 : Number(o.guests) || 1;
    buckets.set(key, {
      revenue: prev.revenue + o.amount,
      orders: prev.orders + 1,
      guests: prev.guests + guestCount,
    });
  });

  return Array.from(buckets.entries())
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([date, vals]) => ({ date, ...vals }));
}

export default function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [tourFilter, setTourFilter] = useState<TourFilter>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) setOrders(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTours = useCallback(async () => {
    const res = await fetch("/api/admin/tours");
    if (res.ok) {
      const data = await res.json();
      setTours(data.tours ?? []);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchTours();
  }, [fetchOrders, fetchTours]);

  const start = getStartDate(dateRange);

  const dateFiltered = useMemo(() =>
    start ? orders.filter((o) => new Date(o.createdAt) >= start) : orders,
    [orders, start]
  );

  const filtered = useMemo(() =>
    tourFilter === "all" ? dateFiltered : dateFiltered.filter((o) => o.tourId === tourFilter),
    [dateFiltered, tourFilter]
  );

  const totalRevenue = filtered.reduce((s, o) => s + o.amount, 0);
  const totalOrders = filtered.length;
  const totalGuests = filtered.reduce((s, o) => s + (o.isPrivateCharter ? 1 : Number(o.guests) || 1), 0);
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  const chartData = useMemo(() => buildChartData(filtered, dateRange), [filtered, dateRange]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const metrics = [
    { label: "Revenue",      value: `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    { label: "Orders",       value: totalOrders.toString() },
    { label: "Total Guests", value: totalGuests.toString() },
    { label: "Avg Order",    value: `$${avgOrderValue.toFixed(2)}` },
  ];

  return (
    <div>
      {/* Date + Tour filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-warm-gray uppercase tracking-wider">Period:</span>
          {DATE_RANGE_OPTIONS.map(({ key, label }) => (
            <button key={key} onClick={() => { setDateRange(key); setPage(1); }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${dateRange === key ? "bg-forest text-white" : "bg-gray-100 text-warm-gray hover:bg-gray-200"}`}>
              {label}
            </button>
          ))}
        </div>
        {tours.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-warm-gray uppercase tracking-wider">Tour:</span>
            <select
              value={tourFilter}
              onChange={(e) => { setTourFilter(e.target.value); setPage(1); }}
              className="text-sm font-medium text-forest bg-white border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-forest/30"
            >
              <option value="all">All Tours</option>
              {tours.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-warm-gray font-medium mb-1">{m.label}</p>
            <p className="text-2xl font-bold text-forest">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-8">
        <p className="text-sm font-semibold text-forest mb-4">Revenue, Orders &amp; Guests Over Time</p>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-warm-gray text-sm">
            No orders for this period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="revenue" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
              <YAxis yAxisId="count" orientation="right" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
                formatter={(value, name) => {
                  if (name === "revenue") return [`$${Number(value).toFixed(2)}`, "Revenue"];
                  if (name === "orders") return [value, "Orders"];
                  return [value, "Guests"];
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} formatter={(v) => v === "revenue" ? "Revenue" : v === "orders" ? "Orders" : "Guests"} />
              <Line yAxisId="revenue" type="monotone" dataKey="revenue" stroke="#2D5016" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Line yAxisId="count" type="monotone" dataKey="orders" stroke="#C9A84C" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Line yAxisId="count" type="monotone" dataKey="guests" stroke="#6B8F5E" strokeWidth={2} dot={false} activeDot={{ r: 4 }} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <svg className="animate-spin w-6 h-6 text-forest" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-warm-gray text-sm">
          No orders found for this period.
        </div>
      ) : (
        <>
        <div className="space-y-3">
          {paginated.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                {/* Amount */}
                <div className="w-16 h-14 bg-forest/5 rounded-xl flex flex-col items-center justify-center shrink-0">
                  <p className="text-forest font-bold text-base">${order.amount.toFixed(0)}</p>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-forest text-sm">{order.customerName}</p>
                    {order.isPrivateCharter && (
                      <span className="text-xs bg-gold/20 text-yellow-700 font-semibold px-2 py-0.5 rounded-full">Private Charter</span>
                    )}
                  </div>
                  <p className="text-xs text-warm-gray">{order.tourName}</p>
                  <p className="text-xs text-warm-gray mt-0.5">
                    {order.date
                      ? new Date(order.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
                      : new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    {!order.isPrivateCharter && ` · ${order.guests} guest${Number(order.guests) !== 1 ? "s" : ""}`}
                  </p>
                </div>

                {/* Right badges */}
                <div className="shrink-0 flex items-center gap-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-green-50 text-green-700 border-green-200">
                    Paid
                  </span>
                  <p className="text-xs text-warm-gray hidden sm:block">
                    Booked {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>

                <svg className={`w-4 h-4 text-gray-300 transition-transform shrink-0 ${expanded === order.id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {expanded === order.id && (
                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider mb-1">Email</p>
                    <p className="text-forest">{order.email}</p>
                  </div>
                  {order.phone && (
                    <div>
                      <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider mb-1">Phone</p>
                      <a href={`tel:${order.phone}`} className="text-forest hover:underline">{order.phone}</a>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider mb-1">Tour Date</p>
                    <p className="text-forest">
                      {order.date
                        ? new Date(order.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider mb-1">Guests</p>
                    <p className="text-forest">{order.isPrivateCharter ? `Private Charter (up to 8)` : `${order.guests} guest${Number(order.guests) !== 1 ? "s" : ""}`}</p>
                  </div>
                  {order.notes && (
                    <div className="sm:col-span-2">
                      <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider mb-1">Notes</p>
                      <p className="text-forest italic">&ldquo;{order.notes}&rdquo;</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider mb-1">Stripe Payment</p>
                    <a href={order.stripeUrl} target="_blank" rel="noopener noreferrer" className="text-forest underline text-xs font-mono hover:text-forest/70">
                      {order.id}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider mb-1">Booked At</p>
                    <p className="text-forest text-xs">{new Date(order.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <Pagination page={page} totalPages={totalPages} totalItems={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      )}
    </div>
  );
}

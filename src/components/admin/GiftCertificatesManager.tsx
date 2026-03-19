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
import type { GiftCertRequest, GiftCertStatus } from "@/lib/giftCertStore";

type Filter = "all" | GiftCertStatus;

type DateRange = "7d" | "30d" | "90d" | "1y" | "all";

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

function buildChartData(certs: GiftCertRequest[], range: DateRange) {
  const start = getStartDate(range);
  const paid = certs.filter(
    (c) => c.status === "active" || c.status === "redeemed"
  );
  const inRange = start
    ? paid.filter((c) => new Date(c.createdAt) >= start)
    : paid;

  // Group by day (for ≤90d) or week (for 1y/all)
  const useWeeks = range === "1y" || range === "all";

  const buckets = new Map<string, { revenue: number; sold: number }>();

  inRange.forEach((c) => {
    const d = new Date(c.createdAt);
    let key: string;
    if (useWeeks) {
      // ISO week start (Monday)
      const day = d.getDay();
      const diff = (day === 0 ? -6 : 1 - day);
      const mon = new Date(d);
      mon.setDate(d.getDate() + diff);
      key = mon.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } else {
      key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    const prev = buckets.get(key) ?? { revenue: 0, sold: 0 };
    buckets.set(key, {
      revenue: prev.revenue + Number(c.amount),
      sold: prev.sold + 1,
    });
  });

  // Fill gaps between first and last date
  if (inRange.length === 0) return [];

  const sorted = Array.from(buckets.entries()).sort(
    (a, b) =>
      new Date(a[0] + ", " + new Date().getFullYear()).getTime() -
      new Date(b[0] + ", " + new Date().getFullYear()).getTime()
  );

  return sorted.map(([date, vals]) => ({ date, ...vals }));
}

function Analytics({ certs, range, onRangeChange }: {
  certs: GiftCertRequest[];
  range: DateRange;
  onRangeChange: (r: DateRange) => void;
}) {
  const start = getStartDate(range);
  const paid = certs.filter((c) => c.status === "active" || c.status === "redeemed");
  const inRange = start ? paid.filter((c) => new Date(c.createdAt) >= start) : paid;

  const totalRevenue = inRange.reduce((s, c) => s + Number(c.amount), 0);
  const cardsSold = inRange.length;
  const avgValue = cardsSold ? totalRevenue / cardsSold : 0;
  const redemptionRate = inRange.length
    ? (inRange.filter((c) => c.status === "redeemed").length / inRange.length) * 100
    : 0;

  const chartData = useMemo(() => buildChartData(certs, range), [certs, range]);

  const metrics = [
    { label: "Revenue", value: `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    { label: "Cards Sold", value: cardsSold.toString() },
    { label: "Avg Value", value: `$${avgValue.toFixed(2)}` },
    { label: "Redemption Rate", value: `${redemptionRate.toFixed(0)}%` },
  ];

  return (
    <div className="mb-8 space-y-4">
      {/* Date filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-warm-gray uppercase tracking-wider mr-1">Period:</span>
        {DATE_RANGE_OPTIONS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onRangeChange(key)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              range === key
                ? "bg-forest text-white"
                : "bg-gray-100 text-warm-gray hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-warm-gray font-medium mb-1">{m.label}</p>
            <p className="text-2xl font-bold text-forest">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <p className="text-sm font-semibold text-forest mb-4">Revenue &amp; Cards Sold</p>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-warm-gray text-sm">
            No data for this period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="revenue" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
              <YAxis yAxisId="sold" orientation="right" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
                formatter={(value, name) => name === "revenue" ? [`$${Number(value).toFixed(2)}`, "Revenue"] : [value, "Cards Sold"]}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} formatter={(v) => v === "revenue" ? "Revenue" : "Cards Sold"} />
              <Line yAxisId="revenue" type="monotone" dataKey="revenue" stroke="#2D5016" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Line yAxisId="sold" type="monotone" dataKey="sold" stroke="#C9A84C" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

const STATUS_META: Record<string, { label: string; styles: string }> = {
  pending_payment: { label: "Pending Payment", styles: "bg-amber-50 text-amber-700 border-amber-200" },
  active:          { label: "Active",           styles: "bg-green-50 text-green-700 border-green-200" },
  redeemed:        { label: "Redeemed",         styles: "bg-blue-50 text-blue-700 border-blue-200"   },
};

export default function GiftCertificatesManager() {
  const [requests, setRequests] = useState<GiftCertRequest[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/gift-certificates");
      if (res.ok) setRequests(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const resendCertificate = async (id: string) => {
    setActionId(id);
    try {
      const res = await fetch("/api/admin/send-gift-cert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast("Certificate email resent.", "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to resend.", "error");
    } finally {
      setActionId(null);
    }
  };

  const markRedeemed = async (id: string) => {
    setActionId(id);
    try {
      const res = await fetch("/api/admin/gift-certificates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "redeemed", redeemedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error("Failed to update.");
      showToast("Marked as redeemed.", "success");
      await fetchRequests();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed.", "error");
    } finally {
      setActionId(null);
    }
  };

  const outstandingAmount = requests
    .filter((r) => r.status === "active")
    .reduce((s, r) => s + Number(r.amount), 0);
  const outstandingCount = requests.filter((r) => r.status === "active").length;

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const counts = {
    all:             requests.length,
    pending_payment: requests.filter((r) => r.status === "pending_payment").length,
    active:          requests.filter((r) => r.status === "active").length,
    redeemed:        requests.filter((r) => r.status === "redeemed").length,
  };

  const filters: { key: Filter; label: string }[] = [
    { key: "all",             label: "All" },
    { key: "active",          label: "Active" },
    { key: "pending_payment", label: "Pending Payment" },
    { key: "redeemed",        label: "Redeemed" },
  ];

  return (
    <div>
      {/* Analytics */}
      <Analytics certs={requests} range={dateRange} onRangeChange={setDateRange} />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.type === "success" ? "bg-forest" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      {/* Outstanding balance */}
      <div className="flex items-center justify-between bg-forest/5 border border-forest/15 rounded-2xl px-5 py-4 mb-6">
        <div>
          <p className="text-xs font-semibold text-forest/60 uppercase tracking-widest mb-0.5">Outstanding Balance</p>
          <p className="text-2xl font-bold text-forest">
            ${outstandingAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-warm-gray mt-0.5">
            {outstandingCount} active certificate{outstandingCount !== 1 ? "s" : ""} not yet redeemed
          </p>
        </div>
        <div className="w-12 h-12 bg-forest/10 rounded-xl flex items-center justify-center shrink-0">
          <svg className="w-6 h-6 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-6 flex-wrap">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { setFilter(key); setPage(1); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === key ? "bg-white text-forest shadow-sm" : "text-warm-gray hover:text-forest"}`}
          >
            {label}
            {(counts[key as keyof typeof counts] ?? 0) > 0 && (
              <span className={`ml-1.5 text-xs ${filter === key ? "text-warm-gray" : "text-warm-gray/60"}`}>
                {counts[key as keyof typeof counts]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <svg className="animate-spin w-6 h-6 text-forest" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-warm-gray text-sm">
          No {filter === "all" ? "" : filter.replace("_", " ")} certificates found.
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {paginated.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                actionId={actionId}
                onResend={resendCertificate}
                onRedeem={markRedeemed}
              />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} totalItems={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      )}
    </div>
  );
}

function RequestCard({
  req,
  actionId,
  onResend,
  onRedeem,
}: {
  req: GiftCertRequest;
  actionId: string | null;
  onResend: (id: string) => void;
  onRedeem: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isBusy = actionId === req.id;
  const meta = STATUS_META[req.status] ?? { label: req.status, styles: "bg-gray-50 text-gray-500 border-gray-200" };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Amount */}
        <div className="w-14 h-14 bg-forest/5 rounded-xl flex items-center justify-center shrink-0">
          <p className="text-forest font-bold text-lg">${req.amount}</p>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-forest text-sm">{req.yourName}</p>
            {req.recipientName && (
              <>
                <svg className="w-3 h-3 text-warm-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <p className="text-sm text-warm-gray">{req.recipientName}</p>
              </>
            )}
          </div>
          <p className="text-xs text-warm-gray">{req.yourEmail}</p>
          <p className="text-xs text-warm-gray mt-0.5">
            {new Date(req.createdAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${meta.styles}`}>
            {meta.label}
          </span>

          {req.status === "active" && (
            <>
              <button
                onClick={() => onResend(req.id)}
                disabled={isBusy}
                title="Resend certificate email"
                className="p-2 rounded-full border border-gray-200 text-warm-gray hover:text-forest hover:border-forest/30 transition-colors disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={() => onRedeem(req.id)}
                disabled={isBusy}
                className="px-4 py-2 bg-forest text-white text-xs font-bold rounded-full hover:bg-forest/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {isBusy ? (
                  <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : "Mark Redeemed"}
              </button>
            </>
          )}
        </div>

        <svg className={`w-4 h-4 text-gray-300 transition-transform shrink-0 ${expanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {req.certificateCode && (
            <div>
              <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider mb-1">Certificate Code</p>
              <p className="font-mono font-bold text-forest text-base">{req.certificateCode}</p>
            </div>
          )}
          {req.message && (
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider mb-1">Personal Message</p>
              <p className="text-forest italic">&ldquo;{req.message}&rdquo;</p>
            </div>
          )}
          {req.stripePaymentIntentId && (
            <div>
              <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider mb-1">Stripe Payment</p>
              <a
                href={`https://dashboard.stripe.com/payments/${req.stripePaymentIntentId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-forest underline text-xs font-mono hover:text-forest/70"
              >
                {req.stripePaymentIntentId}
              </a>
            </div>
          )}
          {req.sentAt && (
            <div>
              <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider mb-1">Sent At</p>
              <p className="text-forest text-xs">{new Date(req.sentAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}</p>
            </div>
          )}
          {req.redeemedAt && (
            <div>
              <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider mb-1">Redeemed At</p>
              <p className="text-forest text-xs">{new Date(req.redeemedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}</p>
            </div>
          )}
          <div>
            <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider mb-1">Record ID</p>
            <p className="font-mono text-xs text-warm-gray">{req.id}</p>
          </div>
        </div>
      )}
    </div>
  );
}

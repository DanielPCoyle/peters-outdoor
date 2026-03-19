"use client";

import { useEffect, useState } from "react";
import Pagination from "./Pagination";

const PAGE_SIZE = 20;

interface PrivateTour {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  time: string | null;
  guests: number;
  price: number;
  location: string | null;
  notes: string | null;
  clientName: string;
  clientEmail: string;
  status: string;
  createdAt: string;
}

const EMPTY_FORM = {
  title: "",
  description: "",
  date: "",
  time: "",
  guests: 1,
  price: "",
  location: "",
  notes: "",
  clientName: "",
  clientEmail: "",
};

function fmt12h(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    paid: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-600",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

export default function PrivateToursManager() {
  const [tours, setTours] = useState<PrivateTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/admin/private-tours")
      .then((r) => r.json())
      .then((d) => setTours(d.tours ?? []))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/private-tours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        guests: Number(form.guests),
        price: parseFloat(String(form.price)),
        time: form.time || null,
        location: form.location || null,
        notes: form.notes || null,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setTours((prev) => [data.tour, ...prev]);
      setForm({ ...EMPTY_FORM });
      setShowForm(false);
      showToast("Private tour created!");
    } else {
      showToast(data.error ?? "Failed to create tour.", false);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this private tour? This cannot be undone.")) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/private-tours/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTours((prev) => prev.filter((t) => t.id !== id));
      showToast("Tour deleted.");
    } else {
      showToast("Failed to delete.", false);
    }
    setDeletingId(null);
  };

  const handleCopyLink = async (slug: string) => {
    const url = `${window.location.origin}/book/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const totalPages = Math.ceil(tours.length / PAGE_SIZE);
  const paginated = tours.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pendingCount = tours.filter((t) => t.status === "pending").length;
  const paidCount = tours.filter((t) => t.status === "paid").length;
  const totalRevenue = tours.filter((t) => t.status === "paid").reduce((sum, t) => sum + t.price, 0);

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl text-sm font-semibold shadow-lg text-white ${toast.ok ? "bg-forest" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Tours", value: tours.length },
          { label: "Awaiting Payment", value: pendingCount },
          { label: "Paid", value: paidCount },
          { label: "Revenue", value: `$${totalRevenue.toFixed(2)}` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-warm-gray font-medium mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-forest">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Header + create button */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-forest uppercase tracking-widest">Private Tours</h2>
        <button
          onClick={() => { setShowForm(true); setForm({ ...EMPTY_FORM }); }}
          className="flex items-center gap-2 px-4 py-2 bg-forest text-white text-sm font-semibold rounded-xl hover:bg-forest/90 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Private Tour
        </button>
      </div>

      {/* Create form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-forest px-6 py-5 flex items-center justify-between shrink-0">
              <div>
                <p className="text-gold text-xs font-bold uppercase tracking-widest mb-1">Admin</p>
                <h2 className="font-serif text-xl font-bold text-white">New Private / Corporate Tour</h2>
              </div>
              <button onClick={() => setShowForm(false)} className="text-white/60 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                {/* Client info */}
                <div>
                  <p className="text-xs font-bold text-forest uppercase tracking-widest mb-3">Client Info</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-warm-gray mb-1">Client Name *</label>
                      <input required value={form.clientName} onChange={(e) => set("clientName", e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-forest focus:outline-none focus:ring-2 focus:ring-forest/30"
                        placeholder="Jane Smith" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-warm-gray mb-1">Client Email *</label>
                      <input required type="email" value={form.clientEmail} onChange={(e) => set("clientEmail", e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-forest focus:outline-none focus:ring-2 focus:ring-forest/30"
                        placeholder="jane@example.com" />
                    </div>
                  </div>
                </div>

                {/* Tour info */}
                <div>
                  <p className="text-xs font-bold text-forest uppercase tracking-widest mb-3">Tour Details</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-warm-gray mb-1">Tour Title *</label>
                      <input required value={form.title} onChange={(e) => set("title", e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-forest focus:outline-none focus:ring-2 focus:ring-forest/30"
                        placeholder="Private Striped Bass Charter" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-warm-gray mb-1">Description</label>
                      <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-forest focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none"
                        placeholder="Optional details shown to the client on their booking page…" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-warm-gray mb-1">Date *</label>
                        <input required type="date" value={form.date} onChange={(e) => set("date", e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-forest focus:outline-none focus:ring-2 focus:ring-forest/30" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-warm-gray mb-1">Time (optional)</label>
                        <input type="time" value={form.time} onChange={(e) => set("time", e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-forest focus:outline-none focus:ring-2 focus:ring-forest/30" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-warm-gray mb-1">Guests *</label>
                        <input required type="number" min={1} value={form.guests} onChange={(e) => set("guests", parseInt(e.target.value))}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-forest focus:outline-none focus:ring-2 focus:ring-forest/30" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-warm-gray mb-1">Total Price ($) *</label>
                        <input required type="number" step="0.01" min="1" value={form.price} onChange={(e) => set("price", e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-forest focus:outline-none focus:ring-2 focus:ring-forest/30"
                          placeholder="850.00" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-warm-gray mb-1">Meeting Location (optional)</label>
                      <input value={form.location} onChange={(e) => set("location", e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-forest focus:outline-none focus:ring-2 focus:ring-forest/30"
                        placeholder="Kent Island Launch Ramp, Stevensville MD" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-warm-gray mb-1">Internal Notes (not shown to client)</label>
                      <textarea value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} rows={2}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-forest focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none"
                        placeholder="Any internal notes…" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="shrink-0 px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3 bg-white">
                <p className="text-xs text-warm-gray">A unique payment link will be generated for this client.</p>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="px-5 py-2.5 border border-gray-200 text-warm-gray text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="px-5 py-2.5 bg-forest text-white text-sm font-semibold rounded-xl hover:bg-forest/90 transition-colors disabled:opacity-60 flex items-center gap-2">
                    {saving ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Creating…
                      </>
                    ) : "Create & Get Link"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tour list */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <svg className="animate-spin w-6 h-6 text-forest" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : tours.length === 0 ? (
          <div className="px-5 py-16 text-center text-warm-gray text-sm">
            No private tours yet. Create one to generate a shareable payment link.
          </div>
        ) : (
          <>
          <div className="divide-y divide-gray-100">
            {paginated.map((tour) => {
              const bookingUrl = typeof window !== "undefined" ? `${window.location.origin}/book/${tour.slug}` : `/book/${tour.slug}`;
              const isExpanded = expandedId === tour.id;
              return (
                <div key={tour.id}>
                  <div
                    className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : tour.id)}
                  >
                    {/* Expand chevron */}
                    <svg
                      className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-forest truncate">{tour.title}</p>
                        {statusBadge(tour.status)}
                      </div>
                      <p className="text-xs text-warm-gray mt-0.5">
                        {tour.clientName} · {new Date(tour.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        {tour.time ? ` · ${fmt12h(tour.time)}` : ""} · {tour.guests} {tour.guests === 1 ? "guest" : "guests"}
                      </p>
                    </div>

                    <span className="text-sm font-bold text-gold shrink-0">${tour.price.toFixed(2)}</span>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleCopyLink(tour.slug)}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-warm-gray text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                        title="Copy payment link"
                      >
                        {copiedSlug === tour.slug ? (
                          <>
                            <svg className="w-3.5 h-3.5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy Link
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(tour.id)}
                        disabled={deletingId === tour.id}
                        className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-40 p-1"
                        title="Delete tour"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="px-5 pb-4 bg-gray-50 border-t border-gray-100 space-y-3">
                      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-warm-gray font-medium mb-0.5">Client Email</p>
                          <a href={`mailto:${tour.clientEmail}`} className="text-forest underline">{tour.clientEmail}</a>
                        </div>
                        {tour.location && (
                          <div>
                            <p className="text-xs text-warm-gray font-medium mb-0.5">Meeting Point</p>
                            <p className="text-forest">{tour.location}</p>
                          </div>
                        )}
                        {tour.description && (
                          <div className="sm:col-span-2">
                            <p className="text-xs text-warm-gray font-medium mb-0.5">Description</p>
                            <p className="text-forest">{tour.description}</p>
                          </div>
                        )}
                        {tour.notes && (
                          <div className="sm:col-span-2">
                            <p className="text-xs text-warm-gray font-medium mb-0.5">Internal Notes</p>
                            <p className="text-forest">{tour.notes}</p>
                          </div>
                        )}
                        <div className="sm:col-span-2">
                          <p className="text-xs text-warm-gray font-medium mb-0.5">Payment Link</p>
                          <div className="flex items-center gap-2">
                            <code className="text-xs text-forest bg-white border border-gray-200 rounded-lg px-3 py-1.5 flex-1 truncate">
                              {bookingUrl}
                            </code>
                            <a
                              href={`/book/${tour.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 text-xs text-forest underline font-medium"
                            >
                              Preview
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <Pagination page={page} totalPages={totalPages} totalItems={tours.length} pageSize={PAGE_SIZE} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Tour } from "@/lib/tourStore";
import type { AddOn } from "@/lib/addOnStore";
import TourTimeSlotsPanel from "@/components/admin/TourTimeSlotsPanel";

// ─── Form helpers ──────────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: "",
  tagline: "",
  description: "",
  price: "",
  duration: "2–3 hours",
  imageUrl: "",
  wildlife: "",
  isActive: true,
  sortOrder: "0",
  maxGuests: "8",
};

type FormData = typeof EMPTY_FORM;

function tourToForm(t: Tour): FormData {
  return {
    name: t.name,
    tagline: t.tagline,
    description: t.description,
    price: String(t.price),
    duration: t.duration,
    imageUrl: t.imageUrl,
    wildlife: t.wildlife.join(", "),
    isActive: t.isActive,
    sortOrder: String(t.sortOrder),
    maxGuests: String(t.maxGuests ?? 8),
  };
}

function formToPayload(f: FormData) {
  return {
    name: f.name.trim(),
    tagline: f.tagline.trim(),
    description: f.description.trim(),
    price: Number(f.price),
    duration: f.duration.trim() || "2–3 hours",
    imageUrl: f.imageUrl.trim(),
    wildlife: f.wildlife.split(",").map((s) => s.trim()).filter(Boolean),
    isActive: f.isActive,
    sortOrder: Number(f.sortOrder) || 0,
    maxGuests: Number(f.maxGuests) || 8,
  };
}

// ─── Details tab ───────────────────────────────────────────────────────────

function DetailsTab({ tour, onSaved }: { tour: Tour; onSaved: (updated: Tour) => void }) {
  const [form, setForm] = useState<FormData>(tourToForm(tour));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/tours/${tour.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formToPayload(form)),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const { tour: updated } = await res.json();
      onSaved(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Newport Bay Salt Marsh"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tagline *</label>
          <input
            value={form.tagline}
            onChange={(e) => set("tagline", e.target.value)}
            placeholder="Kayak Maryland's hidden gem..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price ($ per person) *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            placeholder="75"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
          <input
            value={form.duration}
            onChange={(e) => set("duration", e.target.value)}
            placeholder="2–3 hours"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests per Slot</label>
          <input
            type="number"
            min="1"
            max="50"
            value={form.maxGuests}
            onChange={(e) => set("maxGuests", e.target.value)}
            placeholder="8"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
          <input
            value={form.imageUrl}
            onChange={(e) => set("imageUrl", e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Wildlife <span className="text-gray-400 font-normal">(comma-separated)</span>
          </label>
          <input
            value={form.wildlife}
            onChange={(e) => set("wildlife", e.target.value)}
            placeholder="Osprey, Herons, Coastal Birds"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
          <input
            type="number"
            min="0"
            value={form.sortOrder}
            onChange={(e) => set("sortOrder", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
          />
        </div>
        <div className="flex items-center gap-3 pt-6">
          <input
            type="checkbox"
            id="isActive"
            checked={form.isActive}
            onChange={(e) => set("isActive", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-forest focus:ring-forest/30"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
            Active (visible to customers)
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="pt-2">
        <button
          onClick={handleSave}
          disabled={saving || !form.name || !form.tagline || !form.description || !form.price || !form.imageUrl}
          className="px-6 py-2.5 rounded-xl bg-forest text-white text-sm font-semibold hover:bg-forest/90 transition-colors disabled:opacity-40 flex items-center gap-2"
        >
          {saving ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving…
            </>
          ) : saved ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Add-ons tab ───────────────────────────────────────────────────────────

function AddOnsTab({ tourId }: { tourId: string }) {
  const [allAddOns, setAllAddOns] = useState<AddOn[]>([]);
  const [tourAddOnIds, setTourAddOnIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/addons").then((r) => r.json()),
      fetch(`/api/admin/tours/${tourId}/addons`).then((r) => r.json()),
    ]).then(([all, tourOnes]) => {
      setAllAddOns(all.addOns ?? []);
      setTourAddOnIds(new Set((tourOnes.addOns ?? []).map((a: AddOn) => a.id)));
      setLoading(false);
    });
  }, [tourId]);

  const toggle = async (addOnId: string) => {
    const next = new Set(tourAddOnIds);
    if (next.has(addOnId)) next.delete(addOnId);
    else next.add(addOnId);
    setTourAddOnIds(next);
    setSaving(true);
    await fetch(`/api/admin/tours/${tourId}/addons`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addOnIds: Array.from(next) }),
    });
    setSaving(false);
  };

  if (loading) return <div className="text-sm text-gray-400 py-4">Loading add-ons…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          Select which add-ons are available for this tour.
        </p>
        {saving && <span className="text-xs text-gray-400">Saving…</span>}
      </div>
      {allAddOns.length === 0 ? (
        <p className="text-sm text-gray-400">
          No add-ons exist yet.{" "}
          <a href="/admin/addons" className="underline text-forest">Create some in Add-ons →</a>
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {allAddOns.map((a) => (
            <label
              key={a.id}
              className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                tourAddOnIds.has(a.id)
                  ? "border-forest/40 bg-forest/5"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                checked={tourAddOnIds.has(a.id)}
                onChange={() => toggle(a.id)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-forest focus:ring-forest/30"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 leading-tight">{a.name}</p>
                {a.description && (
                  <p className="text-xs text-gray-500 leading-tight mt-0.5">{a.description}</p>
                )}
                <p className="text-xs font-semibold text-forest mt-1">+${a.price.toFixed(2)}</p>
              </div>
              {!a.isActive && (
                <span className="text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded shrink-0">Inactive</span>
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

type Tab = "details" | "addons" | "timeslots";

export default function TourEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [tab, setTab] = useState<Tab>("details");

  const fetchTour = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/tours/${id}`);
      if (res.status === 404) { setNotFound(true); return; }
      const data = await res.json();
      setTour(data.tour);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchTour(); }, [fetchTour]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <svg className="animate-spin w-6 h-6 text-forest" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (notFound || !tour) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center py-24">
        <p className="text-gray-500 text-lg font-medium mb-4">Tour not found.</p>
        <button onClick={() => router.push("/admin/tours")} className="text-forest underline text-sm">
          ← Back to Tours
        </button>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "details", label: "Details" },
    { key: "addons", label: "Add-ons" },
    { key: "timeslots", label: "Time Slots" },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <button
        onClick={() => router.push("/admin/tours")}
        className="flex items-center gap-1.5 text-sm text-warm-gray hover:text-forest transition-colors mb-5"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Tours
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{tour.name}</h1>
          <p className="text-gray-500 text-sm mt-0.5 italic">{tour.tagline}</p>
        </div>
        <span
          className={`mt-1 shrink-0 text-xs px-2.5 py-1 rounded-full font-semibold ${
            tour.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          {tour.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-0 -mb-px">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
                tab === t.key
                  ? "border-forest text-forest"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {tab === "details" && (
          <DetailsTab
            tour={tour}
            onSaved={(updated) => setTour(updated)}
          />
        )}
        {tab === "addons" && <AddOnsTab tourId={tour.id} />}
        {tab === "timeslots" && <TourTimeSlotsPanel tourId={tour.id} />}
      </div>
    </div>
  );
}

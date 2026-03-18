"use client";

import { useState, useEffect, useCallback } from "react";
import type { Tour } from "@/lib/tourStore";
import type { AddOn } from "@/lib/addOnStore";

type TourWithCount = Tour & { addOnCount?: number };

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
};

type FormData = typeof EMPTY_FORM;

function TourForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: FormData;
  onSave: (data: FormData) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState(initial);
  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
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

      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          className="flex-1 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(form)}
          disabled={saving || !form.name || !form.tagline || !form.description || !form.price || !form.imageUrl}
          className="flex-[2] py-2 rounded-lg bg-forest text-white text-sm font-semibold hover:bg-forest/90 transition-colors disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save Tour"}
        </button>
      </div>
    </div>
  );
}

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
    wildlife: f.wildlife
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    isActive: f.isActive,
    sortOrder: Number(f.sortOrder) || 0,
  };
}

function TourAddOnsPanel({ tourId }: { tourId: string }) {
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

  if (loading) return <div className="text-xs text-gray-400 py-2">Loading add-ons…</div>;

  return (
    <div className="mt-6 pt-6 border-t border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700">Assigned Add-ons</h4>
        {saving && <span className="text-xs text-gray-400">Saving…</span>}
      </div>
      {allAddOns.length === 0 ? (
        <p className="text-xs text-gray-400">
          No add-ons exist yet.{" "}
          <a href="/admin/addons" className="underline text-forest">Create some in Add-ons →</a>
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {allAddOns.map((a) => (
            <label
              key={a.id}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
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

export default function ToursManager() {
  const [tours, setTours] = useState<TourWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tours");
      const data = await res.json();
      setTours(data.tours ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (form: FormData) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formToPayload(form)),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setShowCreate(false);
      await load();
      showToast("Tour created.");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Failed to create.", false);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string, form: FormData) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/tours/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formToPayload(form)),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setEditingId(null);
      await load();
      showToast("Tour updated.");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Failed to update.", false);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (tour: Tour) => {
    const res = await fetch(`/api/admin/tours/${tour.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !tour.isActive }),
    });
    if (res.ok) {
      await load();
      showToast(tour.isActive ? "Tour deactivated." : "Tour activated.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tour? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/tours/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      await load();
      showToast("Tour deleted.");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Failed to delete.", false);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-lg ${
            toast.ok ? "bg-green-700 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tour Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">{tours.length} tour{tours.length !== 1 ? "s" : ""}</p>
        </div>
        {!showCreate && (
          <button
            onClick={() => { setShowCreate(true); setEditingId(null); }}
            className="flex items-center gap-2 px-4 py-2 bg-forest text-white text-sm font-semibold rounded-xl hover:bg-forest/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Tour
          </button>
        )}
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">New Tour</h2>
          <TourForm
            initial={EMPTY_FORM}
            onSave={handleCreate}
            onCancel={() => setShowCreate(false)}
            saving={saving}
          />
        </div>
      )}

      {/* Tour list */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading tours…</div>
      ) : tours.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium text-gray-500 mb-1">No tours yet</p>
          <p className="text-sm">Click "Add Tour" to create your first tour.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tours.map((tour) => (
            <div key={tour.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {editingId === tour.id ? (
                <div className="p-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Editing: {tour.name}
                  </h3>
                  <TourForm
                    initial={tourToForm(tour)}
                    onSave={(form) => handleUpdate(tour.id, form)}
                    onCancel={() => setEditingId(null)}
                    saving={saving}
                  />
                  <TourAddOnsPanel tourId={tour.id} />
                </div>
              ) : (
                <div className="flex gap-4 p-4">
                  {/* Image */}
                  {tour.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={tour.imageUrl}
                      alt={tour.name}
                      className="w-24 h-20 object-cover rounded-xl shrink-0"
                    />
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-semibold text-gray-900 text-sm">{tour.name}</h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              tour.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {tour.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 italic mb-1">{tour.tagline}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="font-semibold text-forest">${tour.price}/pp</span>
                          <span>{tour.duration}</span>
                          {(tour.addOnCount ?? 0) > 0 ? (
                            <span className="inline-flex items-center gap-1 bg-forest/10 text-forest font-medium px-2 py-0.5 rounded-full">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              {tour.addOnCount} add-on{tour.addOnCount !== 1 ? "s" : ""}
                            </span>
                          ) : (
                            <span className="text-gray-300">No add-ons</span>
                          )}
                          {tour.wildlife.length > 0 && (
                            <span className="text-gray-400">{tour.wildlife.slice(0, 3).join(", ")}{tour.wildlife.length > 3 ? "…" : ""}</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleToggleActive(tour)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          {tour.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => { setEditingId(tour.id); setShowCreate(false); }}
                          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(tour.id)}
                          disabled={deletingId === tour.id}
                          className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                        >
                          {deletingId === tour.id ? "…" : "Delete"}
                        </button>
                      </div>
                    </div>

                    {/* ID for Builder.io reference */}
                    <p className="mt-2 text-xs text-gray-300 font-mono truncate">
                      ID: {tour.id}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

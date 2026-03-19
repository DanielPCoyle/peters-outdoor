"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Tour } from "@/lib/tourStore";

type TourWithCount = Tour & { addOnCount?: number };

export default function ToursManager() {
  const router = useRouter();
  const [tours, setTours] = useState<TourWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [createForm, setCreateForm] = useState({
    name: "",
    tagline: "",
    description: "",
    price: "",
    duration: "2–3 hours",
    imageUrl: "",
    wildlife: "",
    isActive: true,
    sortOrder: "0",
  });

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

  useEffect(() => { load(); }, [load]);

  const setField = (field: string, value: string | boolean) =>
    setCreateForm((f) => ({ ...f, [field]: value }));

  const formToPayload = () => ({
    name: createForm.name.trim(),
    tagline: createForm.tagline.trim(),
    description: createForm.description.trim(),
    price: Number(createForm.price),
    duration: createForm.duration.trim() || "2–3 hours",
    imageUrl: createForm.imageUrl.trim(),
    wildlife: createForm.wildlife.split(",").map((s) => s.trim()).filter(Boolean),
    isActive: createForm.isActive,
    sortOrder: Number(createForm.sortOrder) || 0,
  });

  const handleCreate = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formToPayload()),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const { tour } = await res.json();
      setShowCreate(false);
      setCreateForm({ name: "", tagline: "", description: "", price: "", duration: "2–3 hours", imageUrl: "", wildlife: "", isActive: true, sortOrder: "0" });
      showToast("Tour created.");
      // Navigate directly to the edit page for the new tour
      router.push(`/admin/tours/${tour.id}`);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Failed to create.", false);
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

  const canCreate =
    createForm.name && createForm.tagline && createForm.description &&
    createForm.price && createForm.imageUrl;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-lg ${toast.ok ? "bg-green-700 text-white" : "bg-red-600 text-white"}`}>
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
            onClick={() => setShowCreate(true)}
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
        <div className="mb-6 bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">New Tour</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input value={createForm.name} onChange={(e) => setField("name", e.target.value)} placeholder="Newport Bay Salt Marsh" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline *</label>
              <input value={createForm.tagline} onChange={(e) => setField("tagline", e.target.value)} placeholder="Kayak Maryland's hidden gem..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea value={createForm.description} onChange={(e) => setField("description", e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($/person) *</label>
              <input type="number" min="0" step="0.01" value={createForm.price} onChange={(e) => setField("price", e.target.value)} placeholder="75" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input value={createForm.duration} onChange={(e) => setField("duration", e.target.value)} placeholder="2–3 hours" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
              <input value={createForm.imageUrl} onChange={(e) => setField("imageUrl", e.target.value)} placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Wildlife <span className="text-gray-400 font-normal">(comma-separated)</span></label>
              <input value={createForm.wildlife} onChange={(e) => setField("wildlife", e.target.value)} placeholder="Osprey, Herons, Coastal Birds" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowCreate(false)} className="flex-1 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleCreate} disabled={saving || !canCreate} className="flex-[2] py-2 rounded-lg bg-forest text-white text-sm font-semibold hover:bg-forest/90 transition-colors disabled:opacity-40">
              {saving ? "Creating…" : "Create Tour"}
            </button>
          </div>
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
        <div className="space-y-3">
          {tours.map((tour) => (
            <div key={tour.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
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
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <h3 className="font-semibold text-gray-900 text-sm">{tour.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tour.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {tour.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 italic mb-1 truncate">{tour.tagline}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                        <span className="font-semibold text-forest">${tour.price}/pp</span>
                        <span>{tour.duration}</span>
                        {(tour.addOnCount ?? 0) > 0 ? (
                          <span className="inline-flex items-center gap-1 bg-forest/10 text-forest font-medium px-2 py-0.5 rounded-full">
                            {tour.addOnCount} add-on{tour.addOnCount !== 1 ? "s" : ""}
                          </span>
                        ) : (
                          <span className="text-gray-300">No add-ons</span>
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
                        onClick={() => router.push(`/admin/tours/${tour.id}`)}
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

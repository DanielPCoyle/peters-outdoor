"use client";

import { useState, useEffect, useCallback } from "react";
import type { AddOn } from "@/lib/addOnStore";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  isActive: true,
  sortOrder: "0",
};

type FormData = typeof EMPTY_FORM;

function AddOnForm({
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
            placeholder="Waterproof bag rental"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Keep your belongings dry throughout the tour"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            placeholder="15"
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
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="addOnIsActive"
            checked={form.isActive}
            onChange={(e) => set("isActive", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-forest focus:ring-forest/30"
          />
          <label htmlFor="addOnIsActive" className="text-sm font-medium text-gray-700">
            Active (available to customers)
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
          disabled={saving || !form.name || !form.price}
          className="flex-[2] py-2 rounded-lg bg-forest text-white text-sm font-semibold hover:bg-forest/90 transition-colors disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save Add-on"}
        </button>
      </div>
    </div>
  );
}

function addOnToForm(a: AddOn): FormData {
  return {
    name: a.name,
    description: a.description,
    price: String(a.price),
    isActive: a.isActive,
    sortOrder: String(a.sortOrder),
  };
}

function formToPayload(f: FormData) {
  return {
    name: f.name.trim(),
    description: f.description.trim(),
    price: Number(f.price),
    isActive: f.isActive,
    sortOrder: Number(f.sortOrder) || 0,
  };
}

export default function AddOnsManager() {
  const [addOns, setAddOns] = useState<AddOn[]>([]);
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
      const res = await fetch("/api/admin/addons");
      const data = await res.json();
      setAddOns(data.addOns ?? []);
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
      const res = await fetch("/api/admin/addons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formToPayload(form)),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setShowCreate(false);
      await load();
      showToast("Add-on created.");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Failed to create.", false);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string, form: FormData) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/addons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formToPayload(form)),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setEditingId(null);
      await load();
      showToast("Add-on updated.");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Failed to update.", false);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (addOn: AddOn) => {
    const res = await fetch(`/api/admin/addons/${addOn.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !addOn.isActive }),
    });
    if (res.ok) {
      await load();
      showToast(addOn.isActive ? "Add-on deactivated." : "Add-on activated.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this add-on? It will be removed from all tours.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/addons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      await load();
      showToast("Add-on deleted.");
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
          <p className="text-xs font-semibold text-warm-gray uppercase tracking-widest mb-1">Configuration</p>
          <h1 className="text-2xl font-bold text-gray-900">Add-ons</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Optional extras offered to customers during booking
          </p>
        </div>
        {!showCreate && (
          <button
            onClick={() => { setShowCreate(true); setEditingId(null); }}
            className="flex items-center gap-2 px-4 py-2 bg-forest text-white text-sm font-semibold rounded-xl hover:bg-forest/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Add-on
          </button>
        )}
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">New Add-on</h2>
          <AddOnForm
            initial={EMPTY_FORM}
            onSave={handleCreate}
            onCancel={() => setShowCreate(false)}
            saving={saving}
          />
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading…</div>
      ) : addOns.length === 0 && !showCreate ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-200">
          <p className="text-lg font-medium text-gray-500 mb-1">No add-ons yet</p>
          <p className="text-sm">Create your first add-on, then assign it to tours.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addOns.map((addOn) => (
            <div key={addOn.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {editingId === addOn.id ? (
                <div className="p-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Editing: {addOn.name}
                  </h3>
                  <AddOnForm
                    initial={addOnToForm(addOn)}
                    onSave={(form) => handleUpdate(addOn.id, form)}
                    onCancel={() => setEditingId(null)}
                    saving={saving}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4">
                  {/* Color dot */}
                  <div className="w-10 h-10 bg-forest/10 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-gray-900 text-sm">{addOn.name}</h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          addOn.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {addOn.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {addOn.description && (
                      <p className="text-xs text-gray-500 mb-1">{addOn.description}</p>
                    )}
                    <p className="text-sm font-bold text-forest">+${addOn.price.toFixed(2)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleActive(addOn)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      {addOn.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => { setEditingId(addOn.id); setShowCreate(false); }}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(addOn.id)}
                      disabled={deletingId === addOn.id}
                      className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                    >
                      {deletingId === addOn.id ? "…" : "Delete"}
                    </button>
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

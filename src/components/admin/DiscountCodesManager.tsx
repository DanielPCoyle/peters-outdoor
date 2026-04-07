"use client";

import { useEffect, useState, useCallback } from "react";

interface DiscountCode {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

const INPUT = "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-forest/30";

export default function DiscountCodesManager() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Create form state
  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    maxUses: "",
    expiresAt: "",
  });
  const [creating, setCreating] = useState(false);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchCodes = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/discount-codes");
      if (res.ok) setCodes(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCodes(); }, [fetchCodes]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim() || !form.discountValue) return;
    setCreating(true);
    try {
      const res = await fetch("/api/admin/discount-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create.");
      }
      showToast("Discount code created.", "success");
      setForm({ code: "", description: "", discountType: "percentage", discountValue: "", maxUses: "", expiresAt: "" });
      setShowCreate(false);
      await fetchCodes();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to create.", "error");
    } finally {
      setCreating(false);
    }
  };

  const toggleActive = async (code: DiscountCode) => {
    try {
      await fetch("/api/admin/discount-codes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: code.id, isActive: !code.isActive }),
      });
      await fetchCodes();
    } catch {
      showToast("Failed to update.", "error");
    }
  };

  const deleteCode = async (id: string) => {
    try {
      await fetch("/api/admin/discount-codes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      showToast("Discount code deleted.", "success");
      await fetchCodes();
    } catch {
      showToast("Failed to delete.", "error");
    }
  };

  const activeCodes = codes.filter((c) => c.isActive);
  const inactiveCodes = codes.filter((c) => !c.isActive);

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.type === "success" ? "bg-forest" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total Codes", value: codes.length },
          { label: "Active", value: activeCodes.length },
          { label: "Total Uses", value: codes.reduce((s, c) => s + c.usedCount, 0) },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-warm-gray font-medium mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-forest">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Create button */}
      <div className="mb-6">
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-5 py-2.5 bg-forest text-white text-sm font-bold rounded-xl hover:bg-forest/90 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Discount Code
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 space-y-4">
          <h3 className="text-sm font-bold text-forest">Create Discount Code</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-forest mb-1">Code *</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                placeholder="e.g. SUMMER15"
                className={INPUT}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-forest mb-1">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="e.g. Summer newsletter promo"
                className={INPUT}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-forest mb-1">Discount Type *</label>
              <select
                value={form.discountType}
                onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value }))}
                className={INPUT}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-forest mb-1">
                Discount Value * {form.discountType === "percentage" ? "(%)" : "($)"}
              </label>
              <input
                type="number"
                min="0"
                step={form.discountType === "percentage" ? "1" : "0.01"}
                value={form.discountValue}
                onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))}
                placeholder={form.discountType === "percentage" ? "e.g. 15" : "e.g. 10.00"}
                className={INPUT}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-forest mb-1">Max Uses (optional)</label>
              <input
                type="number"
                min="1"
                value={form.maxUses}
                onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))}
                placeholder="Unlimited"
                className={INPUT}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-forest mb-1">Expires (optional)</label>
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                className={INPUT}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={creating}
              className="px-5 py-2.5 bg-forest text-white text-sm font-bold rounded-xl hover:bg-forest/90 disabled:opacity-50"
            >
              {creating ? "Creating…" : "Create Code"}
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-5 py-2.5 border border-gray-200 text-warm-gray text-sm font-semibold rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <svg className="animate-spin w-6 h-6 text-forest" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : codes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-warm-gray text-sm">
          No discount codes yet. Create one to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {[...activeCodes, ...inactiveCodes].map((code) => {
            const isExpired = code.expiresAt && new Date(code.expiresAt) < new Date();
            const isMaxed = code.maxUses && code.usedCount >= code.maxUses;
            return (
              <div key={code.id} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-forest/5 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-mono font-bold text-forest text-sm">{code.code}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                      !code.isActive ? "bg-gray-50 text-gray-500 border-gray-200" :
                      isExpired || isMaxed ? "bg-amber-50 text-amber-700 border-amber-200" :
                      "bg-green-50 text-green-700 border-green-200"
                    }`}>
                      {!code.isActive ? "Inactive" : isExpired ? "Expired" : isMaxed ? "Maxed Out" : "Active"}
                    </span>
                  </div>
                  <p className="text-xs text-warm-gray mt-0.5">
                    {code.discountType === "percentage" ? `${code.discountValue}% off` : `$${code.discountValue.toFixed(2)} off`}
                    {code.description && ` — ${code.description}`}
                  </p>
                  <p className="text-xs text-warm-gray">
                    Used {code.usedCount}{code.maxUses ? `/${code.maxUses}` : ""} times
                    {code.expiresAt && ` · Expires ${new Date(code.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleActive(code)}
                    title={code.isActive ? "Deactivate" : "Activate"}
                    className="p-2 rounded-full border border-gray-200 text-warm-gray hover:text-forest hover:border-forest/30 transition-colors"
                  >
                    {code.isActive ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => deleteCode(code.id)}
                    title="Delete"
                    className="p-2 rounded-full border border-gray-200 text-warm-gray hover:text-red-600 hover:border-red-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

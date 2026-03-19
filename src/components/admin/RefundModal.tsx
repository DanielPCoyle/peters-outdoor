"use client";

import { useState } from "react";

interface Props {
  paymentIntentId: string;
  originalAmount: number;
  label: string; // e.g. "Order #pi_xxx" or "Gift Certificate"
  onSuccess: (refunded: number) => void;
  onClose: () => void;
}

export default function RefundModal({ paymentIntentId, originalAmount, label, onSuccess, onClose }: Props) {
  const [mode, setMode] = useState<"full" | "partial">("full");
  const [partialAmount, setPartialAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refundAmount = mode === "full" ? originalAmount : parseFloat(partialAmount) || 0;
  const isValid = refundAmount > 0 && refundAmount <= originalAmount;

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId,
          amount: mode === "full" ? null : refundAmount,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Refund failed.");
      onSuccess(data.refunded);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Refund failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-serif text-xl font-bold text-forest mb-1">Issue Refund</h2>
        <p className="text-xs text-warm-gray mb-5">{label}</p>

        <div className="bg-gray-50 rounded-xl p-4 mb-5">
          <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider mb-1">Original Charge</p>
          <p className="text-2xl font-bold text-forest">${originalAmount.toFixed(2)}</p>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode("full")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors border ${
              mode === "full"
                ? "bg-forest text-white border-forest"
                : "bg-white text-warm-gray border-gray-200 hover:border-forest/40"
            }`}
          >
            Full Refund
          </button>
          <button
            onClick={() => setMode("partial")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors border ${
              mode === "partial"
                ? "bg-forest text-white border-forest"
                : "bg-white text-warm-gray border-gray-200 hover:border-forest/40"
            }`}
          >
            Partial Refund
          </button>
        </div>

        {mode === "partial" && (
          <div className="mb-4">
            <label className="block text-xs font-semibold text-forest mb-1.5">Refund Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray text-sm">$</span>
              <input
                type="number"
                min="0.01"
                max={originalAmount}
                step="0.01"
                value={partialAmount}
                onChange={(e) => setPartialAmount(e.target.value)}
                placeholder={`0.00 – ${originalAmount.toFixed(2)}`}
                className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-gray-200 text-forest text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                autoFocus
              />
            </div>
          </div>
        )}

        {error && (
          <p className="text-red-600 text-xs mb-4">{error}</p>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
          <p className="text-amber-700 text-xs font-medium">
            Refunding{" "}
            <strong>${isValid ? refundAmount.toFixed(2) : "—"}</strong>{" "}
            to the customer&apos;s original payment method. This cannot be undone.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-warm-gray text-sm font-semibold hover:border-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing…
              </>
            ) : (
              `Refund $${isValid ? refundAmount.toFixed(2) : "—"}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

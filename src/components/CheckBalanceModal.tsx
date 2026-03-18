"use client";

import { useState } from "react";

type Result =
  | { status: "active"; code: string; amount: number }
  | { status: "redeemed"; code: string; amount: number }
  | { status: "error"; message: string };

export default function CheckBalanceModal() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const handleCheck = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/validate-gift-cert?code=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (data.valid) {
        setResult({ status: "active", code: data.code, amount: data.amount });
      } else {
        // Distinguish redeemed from truly invalid
        if (data.error?.toLowerCase().includes("redeemed")) {
          // Fetch amount even for redeemed certs by checking the message
          setResult({ status: "redeemed", code: trimmed, amount: 0 });
        } else {
          setResult({ status: "error", message: data.error ?? "Gift certificate not found." });
        }
      }
    } catch {
      setResult({ status: "error", message: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCode("");
    setResult(null);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full mt-3 py-2.5 rounded-full border border-forest/30 text-forest text-sm font-semibold hover:bg-forest/5 transition-colors"
      >
        Check Gift Certificate Balance
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div
            className="bg-cream rounded-3xl w-full max-w-sm shadow-2xl p-7"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-serif text-xl font-bold text-forest">Check Balance</h2>
                <p className="text-warm-gray text-xs mt-0.5">Enter your certificate code below</p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-forest/10 hover:bg-forest/20 flex items-center justify-center text-forest transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Input */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={code}
                onChange={(e) => { setCode(e.target.value.toUpperCase()); setResult(null); }}
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                placeholder="PETERS-XXXXXX"
                className="flex-1 px-4 py-3 rounded-xl border border-sage-muted/30 bg-white text-forest placeholder-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-forest/30 text-sm font-mono tracking-wider"
                autoFocus
              />
              <button
                onClick={handleCheck}
                disabled={!code.trim() || loading}
                className="px-5 py-3 rounded-xl bg-forest text-white text-sm font-semibold hover:bg-forest/90 transition-colors disabled:opacity-40"
              >
                {loading ? "…" : "Check"}
              </button>
            </div>

            {/* Result */}
            {result?.status === "active" && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-mono font-bold text-green-800 text-lg tracking-wider">{result.code}</p>
                <p className="text-green-700 text-sm mt-1">Active — Available Balance</p>
                <p className="font-serif text-4xl font-bold text-green-800 mt-2">${result.amount.toFixed(2)}</p>
                <p className="text-green-700 text-xs mt-3">
                  Redeem at checkout on the{" "}
                  <a href="/booking" className="underline font-semibold" onClick={handleClose}>
                    booking page
                  </a>
                </p>
              </div>
            )}

            {result?.status === "redeemed" && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-mono font-bold text-blue-800 text-lg tracking-wider">{result.code}</p>
                <p className="text-blue-700 text-sm mt-1">This certificate has already been redeemed.</p>
                <p className="text-blue-600 text-xs mt-3">
                  Questions?{" "}
                  <a href="mailto:info@petersoutdoor.com" className="underline font-semibold">
                    info@petersoutdoor.com
                  </a>
                </p>
              </div>
            )}

            {result?.status === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700 text-center">
                {result.message}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

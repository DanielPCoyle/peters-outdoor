"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

interface Denomination {
  label: string;
  value: number;
  sublabel: string;
}

const FALLBACK_DENOMINATIONS: Denomination[] = [
  { label: "$60",  value: 60,  sublabel: "1 Tour Guest" },
  { label: "$120", value: 120, sublabel: "2 Tour Guests" },
  { label: "$180", value: 180, sublabel: "3 Tour Guests" },
  { label: "Custom", value: 0, sublabel: "Enter any amount" },
];

type Step = "details" | "payment" | "confirmation";

const INPUT =
  "w-full px-4 py-3 rounded-xl border border-sage-muted/30 bg-white text-forest placeholder-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-forest/30 text-sm";

// ── Step indicator ────────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "details", label: "Details" },
    { key: "payment", label: "Payment" },
    { key: "confirmation", label: "Done" },
  ];
  const idx = steps.findIndex((s) => s.key === current);
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              i < idx ? "bg-forest text-white" : i === idx ? "bg-gold text-forest" : "bg-sage-muted/30 text-warm-gray"
            }`}>
              {i < idx ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : i + 1}
            </div>
            <span className={`text-xs mt-1 font-medium ${i === idx ? "text-forest" : "text-warm-gray"}`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mb-4 ${i < idx ? "bg-forest" : "bg-sage-muted/30"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Stripe payment form ───────────────────────────────────────────────────────

function PaymentForm({
  amount,
  yourName,
  requestId,
  onSuccess,
  onBack,
}: {
  amount: number;
  yourName: string;
  requestId: string | null;
  onSuccess: (certCode: string) => void;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setError(null);

    const { error: submitErr } = await elements.submit();
    if (submitErr) { setError(submitErr.message ?? "Payment failed."); setProcessing(false); return; }

    const { error: confirmErr } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    if (confirmErr) { setError(confirmErr.message ?? "Payment failed."); setProcessing(false); return; }

    // Payment succeeded — call complete to generate + send the certificate
    try {
      const res = await fetch("/api/gift-certificate/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to issue certificate.");
      onSuccess(data.certificateCode);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payment succeeded but certificate delivery failed. Please contact us.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-forest/5 rounded-2xl p-4 border border-forest/10 flex justify-between items-center text-sm">
        <div>
          <p className="font-semibold text-forest">Gift Certificate</p>
          <p className="text-warm-gray text-xs">Purchaser: {yourName}</p>
        </div>
        <p className="text-forest font-bold text-xl">${amount.toFixed(2)}</p>
      </div>

      <div className="bg-white rounded-2xl border border-sage-muted/20 p-5">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={processing}
          className="flex-1 py-3 rounded-full border border-forest/30 text-forest font-semibold text-sm hover:bg-forest/5 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-[2] py-3 rounded-full bg-forest text-white font-bold text-sm hover:bg-forest/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing…
            </>
          ) : `Pay $${amount.toFixed(2)}`}
        </button>
      </div>

      <p className="text-center text-xs text-warm-gray flex items-center justify-center gap-1.5">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Secured by Stripe. Your card is never stored on our servers.
      </p>
    </form>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function GiftCertificateForm() {
  const [step, setStep] = useState<Step>("details");
  const [denominations, setDenominations] = useState<Denomination[]>(FALLBACK_DENOMINATIONS);
  const [isCustom, setIsCustom] = useState(false);
  const [selectedDenom, setSelectedDenom] = useState(60);
  const [customAmount, setCustomAmount] = useState("");

  useEffect(() => {
    fetch("/api/settings/gift-cert-denominations")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.denominations) && data.denominations.length > 0) {
          setDenominations(data.denominations);
          const firstNonCustom = data.denominations.find((d: Denomination) => d.value > 0);
          if (firstNonCustom) setSelectedDenom(firstNonCustom.value);
        }
      })
      .catch(() => {}); // fall back to defaults
  }, []);
  const [form, setForm] = useState({ yourName: "", yourEmail: "", recipientName: "", message: "" });
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [certCode, setCertCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amount = isCustom ? parseFloat(customAmount) || 0 : selectedDenom;
  const canContinue = !!form.yourName && !!form.yourEmail && amount >= 25;

  const handleContinueToPayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/gift-certificate/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not initialize payment.");
      setClientSecret(data.clientSecret);
      setRequestId(data.requestId);
      setStep("payment");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ── Confirmation ─────────────────────────────────────────────────────────

  if (step === "confirmation") {
    return (
      <div className="bg-white rounded-2xl border border-sage-muted/20 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-forest/10 rounded-full mb-4">
            <svg className="w-7 h-7 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-serif text-2xl font-bold text-forest mb-2">Certificate Sent!</h3>
          <p className="text-warm-gray text-sm">
            Your gift certificate has been emailed to{" "}
            <strong className="text-forest">{form.yourEmail}</strong>.
          </p>
        </div>

        {certCode && (
          <div className="bg-forest/5 border-2 border-gold/40 rounded-2xl p-6 text-center mb-6">
            <p className="text-xs font-semibold text-warm-gray uppercase tracking-widest mb-2">Certificate Code</p>
            <p className="font-mono font-bold text-forest text-3xl tracking-wider">{certCode}</p>
            <p className="text-xs text-warm-gray mt-2">Valid for any tour · No expiration</p>
          </div>
        )}

        <div className="text-sm text-warm-gray space-y-2">
          <p className="font-semibold text-forest text-xs uppercase tracking-wider mb-3">How to Redeem</p>
          <p>1. Browse tours at <a href="/tours" className="text-forest underline">petersoutdoor.com/tours</a></p>
          <p>2. Call <a href="tel:410-357-1025" className="text-forest underline">410-357-1025</a> or email <a href="mailto:info@petersoutdoor.com" className="text-forest underline">info@petersoutdoor.com</a></p>
          <p>3. Mention the certificate code when booking</p>
        </div>
      </div>
    );
  }

  // ── Details step ──────────────────────────────────────────────────────────

  if (step === "details") {
    return (
      <div className="bg-white rounded-2xl border border-sage-muted/20 p-7">
        <h3 className="font-serif text-2xl font-bold text-forest mb-6">Purchase a Gift Certificate</h3>
        <StepIndicator current="details" />

        <div className="space-y-5">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-forest mb-2">Select Amount</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {denominations.map((d) => {
                const active = d.value === 0 ? isCustom : (!isCustom && selectedDenom === d.value);
                return (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => {
                      if (d.value === 0) { setIsCustom(true); }
                      else { setIsCustom(false); setSelectedDenom(d.value); }
                    }}
                    className={`rounded-xl border-2 p-2.5 text-center transition-all ${active ? "border-forest bg-forest/5" : "border-sage-muted/30 hover:border-forest/40"}`}
                  >
                    <p className={`font-bold text-sm ${active ? "text-forest" : "text-forest/70"}`}>{d.label}</p>
                    <p className="text-warm-gray text-xs mt-0.5 leading-tight">{d.sublabel}</p>
                  </button>
                );
              })}
            </div>
            {isCustom && (
              <div className="mt-3 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-forest font-semibold">$</span>
                <input
                  type="number" min="25" step="1"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter amount (min $25)"
                  className={`${INPUT} pl-8`}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-forest mb-1.5">Your Name *</label>
              <input type="text" required value={form.yourName} onChange={(e) => setForm((f) => ({ ...f, yourName: e.target.value }))} placeholder="Jane Smith" className={INPUT} />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest mb-1.5">Your Email *</label>
              <input type="email" required value={form.yourEmail} onChange={(e) => setForm((f) => ({ ...f, yourEmail: e.target.value }))} placeholder="jane@example.com" className={INPUT} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-forest mb-1.5">
                Recipient&rsquo;s Name <span className="text-warm-gray font-normal">(optional)</span>
              </label>
              <input type="text" value={form.recipientName} onChange={(e) => setForm((f) => ({ ...f, recipientName: e.target.value }))} placeholder="Who's the lucky person?" className={INPUT} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-forest mb-1.5">
                Personal Message <span className="text-warm-gray font-normal">(optional)</span>
              </label>
              <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="Add a heartfelt note to include on the certificate…" rows={3} className={`${INPUT} resize-none`} />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>
          )}

          <div className="flex items-center justify-between pt-1">
            {amount >= 25 && (
              <p className="text-forest font-bold text-lg">
                Total: <span className="text-gold">${amount.toFixed(2)}</span>
              </p>
            )}
            <button
              onClick={handleContinueToPayment}
              disabled={!canContinue || loading}
              className="ml-auto px-8 py-3 rounded-full bg-gold text-forest font-bold text-sm hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Please wait…
                </>
              ) : "Continue to Payment →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Payment step ──────────────────────────────────────────────────────────

  if (step === "payment" && clientSecret && stripePromise) {
    return (
      <div className="bg-white rounded-2xl border border-sage-muted/20 p-7">
        <h3 className="font-serif text-2xl font-bold text-forest mb-6">Purchase a Gift Certificate</h3>
        <StepIndicator current="payment" />
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "stripe",
              variables: { colorPrimary: "#2D5016", colorBackground: "#ffffff", borderRadius: "12px", fontFamily: "inherit" },
            },
          }}
        >
          <PaymentForm
            amount={amount}
            yourName={form.yourName}
            requestId={requestId}
            onSuccess={(code) => { setCertCode(code); setStep("confirmation"); }}
            onBack={() => setStep("details")}
          />
        </Elements>
      </div>
    );
  }

  if (step === "payment" && !stripePromise) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
        <strong>Stripe not configured.</strong> Add <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> to your <code className="bg-amber-100 px-1 rounded">.env.local</code>.
      </div>
    );
  }

  return null;
}

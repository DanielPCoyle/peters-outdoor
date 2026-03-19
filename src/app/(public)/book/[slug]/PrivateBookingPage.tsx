"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Image from "next/image";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

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
  clientName: string;
  clientEmail: string;
  status: string;
}

function fmt12h(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function formatDate(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

function CheckoutForm({ tour, onSuccess }: { tour: PrivateTour; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError(null);
    setPaying(true);

    const { error: submitErr } = await elements.submit();
    if (submitErr) { setError(submitErr.message ?? "Payment failed."); setPaying(false); return; }

    const { error: confirmErr, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (confirmErr) {
      setError(confirmErr.message ?? "Payment failed.");
      setPaying(false);
      return;
    }

    // Mark paid server-side
    await fetch(`/api/private-tours/${tour.slug}/pay`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentIntentId: paymentIntent?.id }),
    });

    onSuccess();
    setPaying(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={paying || !stripe}
        className="w-full py-3.5 bg-forest text-white font-bold text-base rounded-2xl hover:bg-forest/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {paying ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing…
          </>
        ) : (
          `Pay $${tour.price.toFixed(2)}`
        )}
      </button>
    </form>
  );
}

export default function PrivateBookingPage({ slug }: { slug: string }) {
  const [tour, setTour] = useState<PrivateTour | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [initializingPayment, setInitializingPayment] = useState(false);
  const [paid, setPaid] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/private-tours/${slug}`)
      .then(async (r) => {
        if (!r.ok) { setNotFound(true); return; }
        const { tour } = await r.json();
        setTour(tour);
        if (tour.status === "paid") setPaid(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleStartPayment = async () => {
    if (!tour) return;
    setInitializingPayment(true);
    setPayError(null);
    const res = await fetch(`/api/private-tours/${slug}/pay`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) { setPayError(data.error ?? "Failed to initialize payment."); setInitializingPayment(false); return; }
    setClientSecret(data.clientSecret);
    setInitializingPayment(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
        <svg className="animate-spin w-8 h-8 text-forest" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (notFound || !tour) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-gold font-semibold text-xs uppercase tracking-widest mb-2">Oops</p>
          <h1 className="font-serif text-3xl font-bold text-forest mb-3">Link Not Found</h1>
          <p className="text-warm-gray">This booking link may have expired or been cancelled. Contact us for help.</p>
          <a href="mailto:info@petersoutdoor.com" className="mt-6 inline-block px-6 py-3 bg-forest text-white rounded-full text-sm font-semibold hover:bg-forest/90 transition-colors">
            Contact Us
          </a>
        </div>
      </div>
    );
  }

  if (paid) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-forest rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gold font-semibold text-xs uppercase tracking-widest mb-2">All Set!</p>
          <h1 className="font-serif text-3xl font-bold text-forest mb-3">You're Booked!</h1>
          <p className="text-warm-gray mb-1">Thank you, <strong className="text-forest">{tour.clientName}</strong>. Your private tour is confirmed.</p>
          <p className="text-warm-gray text-sm">We'll be in touch with details. Questions? Email us at <a href="mailto:info@petersoutdoor.com" className="text-forest underline">info@petersoutdoor.com</a>.</p>
          <div className="mt-6 bg-white rounded-2xl border border-sage-muted/20 p-5 text-left space-y-2">
            <div className="flex justify-between text-sm"><span className="text-warm-gray">Tour</span><span className="text-forest font-medium">{tour.title}</span></div>
            <div className="flex justify-between text-sm"><span className="text-warm-gray">Date</span><span className="text-forest font-medium">{formatDate(tour.date)}</span></div>
            {tour.time && <div className="flex justify-between text-sm"><span className="text-warm-gray">Time</span><span className="text-forest font-medium">{fmt12h(tour.time)}</span></div>}
            <div className="flex justify-between text-sm"><span className="text-warm-gray">Guests</span><span className="text-forest font-medium">{tour.guests}</span></div>
            <div className="flex justify-between text-sm border-t border-sage-muted/20 pt-2 mt-2"><span className="text-warm-gray font-semibold">Total Paid</span><span className="text-forest font-bold">${tour.price.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      {/* Header */}
      <div className="bg-forest px-6 py-8">
        <div className="max-w-xl mx-auto flex flex-col items-center text-center">
          <Image src="/logo-horizontal.png" alt="W.H. Peters Outdoor Adventures" width={180} height={54} className="h-11 w-auto object-contain mb-5" priority />
          <p className="text-gold text-xs font-bold uppercase tracking-widest mb-1">Private Tour · Exclusive Booking</p>
          <h1 className="font-serif text-2xl font-bold text-white">{tour.title}</h1>
          <p className="text-white/70 text-sm mt-2">Reserved for <strong className="text-white">{tour.clientName}</strong></p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8 space-y-5">
        {/* Tour details */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-forest/5 border-b border-gray-100 px-6 py-4">
            <h2 className="text-sm font-bold text-forest uppercase tracking-widest">Your Tour Details</h2>
          </div>
          <div className="px-6 py-5 space-y-3">
            <div className="flex items-start gap-3">
              <svg className="w-4 h-4 text-gold mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-xs text-warm-gray">Date</p>
                <p className="text-forest font-semibold text-sm">{formatDate(tour.date)}</p>
              </div>
            </div>
            {tour.time && (
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-gold mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-xs text-warm-gray">Time</p>
                  <p className="text-forest font-semibold text-sm">{fmt12h(tour.time)}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <svg className="w-4 h-4 text-gold mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="text-xs text-warm-gray">Guests</p>
                <p className="text-forest font-semibold text-sm">{tour.guests} {tour.guests === 1 ? "person" : "people"}</p>
              </div>
            </div>
            {tour.location && (
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-gold mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-xs text-warm-gray">Meeting Point</p>
                  <p className="text-forest font-semibold text-sm">{tour.location}</p>
                </div>
              </div>
            )}
            {tour.description && (
              <p className="text-warm-gray text-sm leading-relaxed pt-1 border-t border-gray-100">{tour.description}</p>
            )}
          </div>
          <div className="bg-forest/5 border-t border-gray-100 px-6 py-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-forest">Total</span>
            <span className="text-2xl font-bold text-gold">${tour.price.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-forest/5 border-b border-gray-100 px-6 py-4">
            <h2 className="text-sm font-bold text-forest uppercase tracking-widest">Secure Payment</h2>
          </div>
          <div className="px-6 py-5">
            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe", variables: { colorPrimary: "#2D5016", borderRadius: "12px" } } }}>
                <CheckoutForm tour={tour} onSuccess={() => setPaid(true)} />
              </Elements>
            ) : (
              <div className="space-y-4">
                <p className="text-warm-gray text-sm">Click below to securely complete your payment via Stripe. Your card details are never stored on our servers.</p>
                {payError && <p className="text-red-600 text-sm">{payError}</p>}
                <button
                  onClick={handleStartPayment}
                  disabled={initializingPayment}
                  className="w-full py-3.5 bg-forest text-white font-bold text-base rounded-2xl hover:bg-forest/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {initializingPayment ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Setting up payment…
                    </>
                  ) : (
                    `Pay $${tour.price.toFixed(2)} — Reserve My Spot`
                  )}
                </button>
                <p className="text-center text-xs text-warm-gray flex items-center justify-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secured by Stripe · 256-bit encryption
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-warm-gray pb-6">
          Questions? <a href="mailto:info@petersoutdoor.com" className="text-forest underline">info@petersoutdoor.com</a> · <a href="tel:410-357-1025" className="text-forest underline">410-357-1025</a>
        </p>
      </div>
    </div>
  );
}

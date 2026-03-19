"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import BookingCalendar from "./BookingCalendar";
import BookingCheckout from "./BookingCheckout";
import type { Tour, AddOn } from "@/lib/tourStore";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

const MAX_GUESTS = 8;
const PRIVATE_CHARTER_PRICE = 399;

type Step = "select" | "details" | "payment" | "confirmation" | string;

interface BookingDetails {
  tourId: string;
  date: Date;
  guests: number;
  name: string;
  email: string;
  phone: string;
  notes: string;
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(d: Date) {
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function StepIndicator({ current }: { current: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "select", label: "Tour & Date" },
    { key: "details", label: "Your Info" },
    { key: "payment", label: "Payment" },
  ];
  const currentIdx = steps.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((step, i) => (
        <div key={step.key} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                i < currentIdx
                  ? "bg-forest text-white"
                  : i === currentIdx
                  ? "bg-gold text-forest"
                  : "bg-sage-muted/30 text-warm-gray"
              }`}
            >
              {i < currentIdx ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span className={`text-xs mt-1 font-medium ${i === currentIdx ? "text-forest" : "text-warm-gray"}`}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mb-4 ${i < currentIdx ? "bg-forest" : "bg-sage-muted/30"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function TourInfoModal({ tour, onClose }: { tour: Tour; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-cream rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-52 w-full">
          <Image src={tour.imageUrl} alt={tour.name} fill className="object-cover" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <p className="text-gold font-semibold text-xs uppercase tracking-wider mb-1">{tour.duration}</p>
          <h3 className="font-serif text-2xl font-bold text-forest mb-2">{tour.name}</h3>
          <p className="text-warm-gray text-sm italic mb-3">{tour.tagline}</p>
          <p className="text-forest/80 text-sm leading-relaxed mb-4">{tour.description}</p>
          <div>
            <p className="text-xs font-semibold text-forest uppercase tracking-wider mb-2">Wildlife You May See</p>
            <div className="flex flex-wrap gap-2">
              {tour.wildlife.map((w) => (
                <span key={w} className="text-xs bg-forest/10 text-forest px-3 py-1 rounded-full">{w}</span>
              ))}
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-gold font-bold text-xl">${tour.price}<span className="text-warm-gray font-normal text-sm"> / person</span></span>
            <button onClick={onClose} className="px-6 py-2 bg-forest text-white text-sm font-semibold rounded-full hover:bg-forest/90 transition-colors">
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingSystem() {
  const topRef = useRef<HTMLDivElement>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [toursLoading, setToursLoading] = useState(true);
  const [step, setStep] = useState<Step>("select");
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [infoTour, setInfoTour] = useState<Tour | null>(null);

  useEffect(() => {
    fetch("/api/tours")
      .then((r) => r.json())
      .then((data) => setTours(data.tours ?? []))
      .catch(console.error)
      .finally(() => setToursLoading(false));
  }, []);

  const goToStep = useCallback((s: Step) => {
    setStep(s);
    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, []);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState(2);
  const [details, setDetails] = useState({ name: "", email: "", phone: "", notes: "" });
  const [isPrivateCharter, setIsPrivateCharter] = useState(false);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [fullyPaidByGiftCert, setFullyPaidByGiftCert] = useState(false);
  const [giftCertInput, setGiftCertInput] = useState("");
  const [appliedGiftCert, setAppliedGiftCert] = useState<{ code: string; discount: number } | null>(null);
  const [giftCertLoading, setGiftCertLoading] = useState(false);
  const [giftCertError, setGiftCertError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tour = tours.find((t) => t.id === selectedTourId);
  const tourAddOns: AddOn[] = tour?.addOns ?? [];
  const selectedAddOns = tourAddOns.filter((a) => selectedAddOnIds.includes(a.id));
  const addOnsTotal = selectedAddOns.reduce((s, a) => s + a.price, 0);
  const tourSubtotal = tour ? (isPrivateCharter ? PRIVATE_CHARTER_PRICE : tour.price * guests) : 0;
  const baseTotal = tourSubtotal + addOnsTotal;
  const discount = appliedGiftCert ? Math.min(appliedGiftCert.discount, baseTotal) : 0;
  const total = baseTotal - discount;

  const toggleAddOn = (id: string) =>
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const canProceedToDetails = selectedTourId && selectedDate;

  const handleProceedToDetails = () => {
    if (canProceedToDetails) goToStep("details");
  };

  const handleProceedToPayment = async () => {
    if (!tour || !selectedDate) return;
    setLoading(true);
    setError(null);
    // Reset payment state when re-entering payment step
    setClientSecret(null);
    setFullyPaidByGiftCert(false);

    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: tour.id,
          date: selectedDate.toISOString().split("T")[0],
          guests,
          isPrivateCharter,
          selectedAddOnIds,
          ...details,
          giftCertCode: appliedGiftCert?.code ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to initialize payment.");
      if (data.fullyPaid) {
        setFullyPaidByGiftCert(true);
      } else {
        setClientSecret(data.clientSecret);
      }
      goToStep("payment");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyGiftCert = async () => {
    const code = giftCertInput.trim().toUpperCase();
    if (!code) return;
    setGiftCertLoading(true);
    setGiftCertError(null);
    try {
      const res = await fetch(`/api/validate-gift-cert?code=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (!data.valid) {
        setGiftCertError(data.error ?? "Invalid gift certificate.");
        return;
      }
      setAppliedGiftCert({ code: data.code, discount: data.amount });
      setGiftCertInput("");
      // Re-create the payment intent with the discount applied
      if (step === "payment" && tour && selectedDate) {
        setLoading(true);
        setClientSecret(null);
        setFullyPaidByGiftCert(false);
        const res2 = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tourId: tour.id,
            date: selectedDate.toISOString().split("T")[0],
            guests,
            isPrivateCharter,
            selectedAddOnIds,
            ...details,
            giftCertCode: data.code,
          }),
        });
        const data2 = await res2.json();
        if (!res2.ok) throw new Error(data2.error ?? "Failed to apply gift certificate.");
        if (data2.fullyPaid) {
          setFullyPaidByGiftCert(true);
        } else {
          setClientSecret(data2.clientSecret);
        }
        setLoading(false);
      }
    } catch (err: unknown) {
      setGiftCertError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setGiftCertLoading(false);
    }
  };

  const handleRemoveGiftCert = async () => {
    setAppliedGiftCert(null);
    setGiftCertError(null);
    if (step === "payment" && tour && selectedDate) {
      setLoading(true);
      setClientSecret(null);
      setFullyPaidByGiftCert(false);
      try {
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tourId: tour.id,
            date: selectedDate.toISOString().split("T")[0],
            guests,
            isPrivateCharter,
            selectedAddOnIds,
            ...details,
          }),
        });
        const data = await res.json();
        if (res.ok) setClientSecret(data.clientSecret);
      } catch {
        // ignore — user can go back and retry
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFreePay = async () => {
    if (!tour || !selectedDate || !appliedGiftCert) return;
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      await fetch("/api/complete-free-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          giftCertCode: appliedGiftCert.code,
          tourName: tour.name,
          date: selectedDate.toISOString().split("T")[0],
          guests: isPrivateCharter ? `Private Charter (up to ${MAX_GUESTS})` : guests,
          ...details,
        }),
      });
      handlePaymentSuccess();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (stripePaymentIntentId?: string) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    goToStep("confirmation");
    // Redeem gift cert if one was applied (partial coverage paid via Stripe)
    if (appliedGiftCert) {
      fetch("/api/redeem-gift-cert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: appliedGiftCert.code }),
      }).catch(console.error);
    }
    // Fire-and-forget confirmation email
    fetch("/api/send-confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tourId: selectedTourId,
        date: selectedDate?.toISOString().split("T")[0],
        guests: isPrivateCharter ? `Private Charter (up to ${MAX_GUESTS})` : guests,
        total,
        stripePaymentIntentId,
        ...details,
      }),
    }).catch(console.error);
  };

  if (step === "confirmation") {
    // modal still renderable on confirmation screen too
  }

  const renderModal = infoTour ? (
    <TourInfoModal tour={infoTour} onClose={() => setInfoTour(null)} />
  ) : null;

  if (step === "confirmation") {
    return (
      <>
        {renderModal}
      <div className="text-center py-12 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-forest/10 rounded-full mb-6">
          <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-serif text-3xl font-bold text-forest mb-3">You're booked!</h2>
        <p className="text-warm-gray mb-2">
          A confirmation receipt has been sent to <strong className="text-forest">{details.email}</strong>.
        </p>
        <div className="mt-6 bg-white rounded-2xl border border-sage-muted/20 p-6 text-left max-w-sm mx-auto space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-warm-gray">Tour</span>
            <span className="text-forest font-medium">{tour?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-warm-gray">Date</span>
            <span className="text-forest font-medium">{selectedDate && formatDate(selectedDate)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-warm-gray">Guests</span>
            <span className="text-forest font-medium">{guests}</span>
          </div>
          {appliedGiftCert && discount > 0 && (
            <div className="flex justify-between text-sm text-green-700">
              <span>Gift certificate ({appliedGiftCert.code})</span>
              <span className="font-medium">−${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm border-t border-sage-muted/20 pt-2 mt-2">
            <span className="text-warm-gray font-semibold">Total paid</span>
            <div className="text-right">
              {appliedGiftCert && discount > 0 && (
                <p className="text-warm-gray line-through text-xs">${baseTotal.toFixed(2)}</p>
              )}
              <span className="text-forest font-bold">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        {/* Social Share */}
        <div className="mt-8">
          <p className="text-sm font-semibold text-forest mb-3">Share your adventure</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fpetersoutdoor.com&quote=${encodeURIComponent(`I just booked the ${tour?.name} with W.H. Peters Outdoor Adventures — can't wait to get on the water! 🚣`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1877F2] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Share on Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just booked the ${tour?.name} with W.H. Peters Outdoor Adventures! 🚣 Can't wait to explore Maryland's Eastern Shore.`)}&url=https%3A%2F%2Fpetersoutdoor.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Post on X
            </a>
          </div>
        </div>

        <p className="mt-6 text-sm text-warm-gray">
          Questions? Email{" "}
          <a href="mailto:info@petersoutdoor.com" className="text-forest underline">
            info@petersoutdoor.com
          </a>
        </p>
      </div>
      </>
    );
  }

  return (
    <>
      {renderModal}
    <div ref={topRef} className="max-w-2xl mx-auto scroll-mt-24">
      {step !== "confirmation" && <StepIndicator current={step} />}

      {/* Step 1: Tour + Date + Guests */}
      {step === "select" && (
        <div className="space-y-6">
          {/* Tour selection */}
          <div>
            <h3 className="font-semibold text-forest mb-3">Select a Tour</h3>
            {toursLoading ? (
              <div className="flex items-center justify-center py-10 text-warm-gray text-sm gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading tours…
              </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tours.map((t) => (
                <div
                  key={t.id}
                  onClick={() => { setSelectedTourId(t.id); setSelectedAddOnIds([]); }}
                  className={`relative cursor-pointer rounded-2xl border-2 overflow-hidden transition-all ${
                    selectedTourId === t.id
                      ? "border-forest"
                      : "border-sage-muted/20 hover:border-forest/40"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative h-40 sm:h-28 w-full">
                    <Image src={t.imageUrl} alt={t.name} fill className="object-cover" />
                    {selectedTourId === t.id && (
                      <div className="absolute inset-0 bg-forest/20 flex items-center justify-center">
                        <div className="w-6 h-6 bg-forest rounded-full flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                    {/* Info button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setInfoTour(t); }}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors"
                      aria-label={`More info about ${t.name}`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                  {/* Card body */}
                  <div className="bg-white p-3">
                    <p className="font-semibold text-forest text-sm leading-tight">{t.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-warm-gray">{t.duration}</p>
                      <p className="text-gold font-bold text-sm">${t.price}<span className="text-warm-gray font-normal text-xs"> /pp</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>

          {/* Calendar */}
          <div>
            <h3 className="font-semibold text-forest mb-3">Select a Date</h3>
            <BookingCalendar selected={selectedDate} onSelect={setSelectedDate} />
          </div>

          {/* Guest count */}
          <div>
            <h3 className="font-semibold text-forest mb-3">Number of Guests</h3>
            <div className="bg-white rounded-2xl border border-sage-muted/20 p-4 flex items-center justify-between">
              <div>
                <p className="text-forest font-medium text-sm">Guests</p>
                <p className="text-warm-gray text-xs">Max {MAX_GUESTS} per tour</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  className="w-8 h-8 rounded-full border border-sage-muted/30 flex items-center justify-center text-forest hover:bg-forest/5 transition-colors font-bold"
                >
                  −
                </button>
                <span className="text-forest font-bold text-lg w-6 text-center">{guests}</span>
                <button
                  onClick={() => setGuests((g) => Math.min(MAX_GUESTS, g + 1))}
                  className="w-8 h-8 rounded-full border border-sage-muted/30 flex items-center justify-center text-forest hover:bg-forest/5 transition-colors font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Private Charter Upgrade */}
          <div
            onClick={() => setIsPrivateCharter((v) => !v)}
            className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${
              isPrivateCharter
                ? "border-forest bg-forest/5"
                : "border-sage-muted/20 hover:border-forest/40 bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-forest text-sm">Private Charter Upgrade</p>
                  <span className="text-xs bg-gold/20 text-gold-dark font-semibold px-2 py-0.5 rounded-full">
                    Just your group
                  </span>
                </div>
                <p className="text-warm-gray text-xs leading-relaxed">
                  Reserve the entire tour exclusively for your group. No strangers, flexible timing, completely private experience.
                </p>
                <p className="text-forest font-bold text-sm mt-2">
                  ${PRIVATE_CHARTER_PRICE} flat{" "}
                  <span className="text-warm-gray font-normal">
                    (up to {MAX_GUESTS} guests)
                  </span>
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isPrivateCharter ? "border-forest bg-forest" : "border-sage-muted/40"
                }`}
              >
                {isPrivateCharter && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Add-ons */}
          {tour && tourAddOns.length > 0 && (
            <div>
              <h3 className="font-semibold text-forest mb-3">Optional Add-ons</h3>
              <div className="space-y-2">
                {tourAddOns.map((a) => {
                  const checked = selectedAddOnIds.includes(a.id);
                  return (
                    <div
                      key={a.id}
                      onClick={() => toggleAddOn(a.id)}
                      className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${
                        checked
                          ? "border-forest bg-forest/5"
                          : "border-sage-muted/20 hover:border-forest/40 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-semibold text-forest text-sm">{a.name}</p>
                          {a.description && (
                            <p className="text-warm-gray text-xs leading-relaxed mt-0.5">{a.description}</p>
                          )}
                          <p className="text-forest font-bold text-sm mt-1.5">+${a.price.toFixed(2)}</p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            checked ? "border-forest bg-forest" : "border-sage-muted/40"
                          }`}
                        >
                          {checked && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Summary + CTA */}
          {canProceedToDetails && (
            <div className="bg-forest/5 rounded-2xl p-4 border border-forest/10">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-warm-gray">{tour?.name}</span>
                {isPrivateCharter ? (
                  <span className="text-forest font-medium">Private Charter</span>
                ) : (
                  <span className="text-forest font-medium">${tour?.price} × {guests}</span>
                )}
              </div>
              {selectedAddOns.map((a) => (
                <div key={a.id} className="flex justify-between items-center text-sm mb-1">
                  <span className="text-warm-gray">{a.name}</span>
                  <span className="text-forest font-medium">+${a.price.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center border-t border-forest/10 pt-2 mt-1">
                <span className="text-forest font-bold">Total</span>
                <span className="text-forest font-bold text-lg">${total.toFixed(2)}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleProceedToDetails}
            disabled={!canProceedToDetails}
            className="w-full py-3.5 rounded-full bg-gold text-forest font-bold text-sm hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {canProceedToDetails
              ? `Continue — ${formatDate(selectedDate!)} · ${isPrivateCharter ? "Private Charter" : `${guests} guest${guests > 1 ? "s" : ""}`}`
              : "Select a tour and date to continue"}
          </button>
        </div>
      )}

      {/* Step 2: Contact details */}
      {step === "details" && (
        <div className="space-y-5">
          <div className="bg-forest/5 rounded-2xl p-4 border border-forest/10 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-warm-gray">
                {tour?.name} · {selectedDate && formatDate(selectedDate)} ·{" "}
                {isPrivateCharter ? "Private Charter" : `${guests} guest${guests > 1 ? "s" : ""}`}
              </span>
              <button onClick={() => goToStep("select")} className="text-forest underline text-xs">Edit</button>
            </div>
            <p className="text-forest font-bold mt-1">${total.toFixed(2)} total</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-forest mb-1.5">Full Name *</label>
              <input
                type="text"
                value={details.name}
                onChange={(e) => setDetails((d) => ({ ...d, name: e.target.value }))}
                placeholder="Jane Smith"
                className="w-full px-4 py-3 rounded-xl border border-sage-muted/30 bg-white text-forest placeholder-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-forest/30 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest mb-1.5">Email *</label>
              <input
                type="email"
                value={details.email}
                onChange={(e) => setDetails((d) => ({ ...d, email: e.target.value }))}
                placeholder="jane@example.com"
                className="w-full px-4 py-3 rounded-xl border border-sage-muted/30 bg-white text-forest placeholder-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-forest/30 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest mb-1.5">Phone</label>
              <input
                type="tel"
                value={details.phone}
                onChange={(e) => setDetails((d) => ({ ...d, phone: e.target.value }))}
                placeholder="(555) 000-0000"
                className="w-full px-4 py-3 rounded-xl border border-sage-muted/30 bg-white text-forest placeholder-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-forest/30 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-forest mb-1.5">Special Requests or Notes</label>
              <textarea
                value={details.notes}
                onChange={(e) => setDetails((d) => ({ ...d, notes: e.target.value }))}
                placeholder="Accessibility needs, experience level, dietary restrictions, etc."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-sage-muted/30 bg-white text-forest placeholder-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-forest/30 text-sm resize-none"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => goToStep("select")}
              className="flex-1 py-3 rounded-full border border-forest/30 text-forest font-semibold text-sm hover:bg-forest/5 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleProceedToPayment}
              disabled={!details.name || !details.email || loading}
              className="flex-[2] py-3 rounded-full bg-forest text-white font-bold text-sm hover:bg-forest/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Preparing payment…
                </>
              ) : (
                "Continue to Payment"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === "payment" && (
        <div className="space-y-5">
          {/* Order summary */}
          <div className="bg-forest/5 rounded-2xl p-4 border border-forest/10 text-sm space-y-1">
            <div className="flex justify-between">
              <div>
                <p className="text-forest font-semibold">{tour?.name}</p>
                <p className="text-warm-gray">
                  {selectedDate && formatDate(selectedDate)} ·{" "}
                  {isPrivateCharter ? "Private Charter" : `${guests} guest${guests > 1 ? "s" : ""}`}
                </p>
                <p className="text-warm-gray">{details.name} · {details.email}</p>
              </div>
              <div className="text-right shrink-0">
                {discount > 0 && (
                  <p className="text-warm-gray line-through text-xs">${baseTotal.toFixed(2)}</p>
                )}
                <p className="text-forest font-bold text-lg">${total.toFixed(2)}</p>
              </div>
            </div>
            {selectedAddOns.length > 0 && (
              <div className="pt-1 border-t border-forest/10 space-y-0.5">
                {selectedAddOns.map((a) => (
                  <div key={a.id} className="flex justify-between text-xs text-forest/70">
                    <span>{a.name}</span>
                    <span>+${a.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
            {discount > 0 && (
              <div className="pt-1 border-t border-forest/10 flex justify-between text-xs">
                <span className="text-forest/70">Gift certificate ({appliedGiftCert?.code})</span>
                <span className="text-green-700 font-semibold">−${discount.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Gift certificate input */}
          {!appliedGiftCert ? (
            <div className="bg-white rounded-2xl border border-sage-muted/20 p-4">
              <p className="text-sm font-semibold text-forest mb-3">Have a gift certificate?</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={giftCertInput}
                  onChange={(e) => { setGiftCertInput(e.target.value.toUpperCase()); setGiftCertError(null); }}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyGiftCert()}
                  placeholder="PETERS-XXXXXX"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-sage-muted/30 bg-white text-forest placeholder-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-forest/30 text-sm font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={handleApplyGiftCert}
                  disabled={!giftCertInput || giftCertLoading}
                  className="px-5 py-2.5 rounded-xl bg-forest text-white text-sm font-semibold hover:bg-forest/90 transition-colors disabled:opacity-40"
                >
                  {giftCertLoading ? "…" : "Apply"}
                </button>
              </div>
              {giftCertError && (
                <p className="mt-2 text-xs text-red-600">{giftCertError}</p>
              )}
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-800">{appliedGiftCert.code}</p>
                  <p className="text-xs text-green-700">−${discount.toFixed(2)} applied</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveGiftCert}
                className="text-xs text-green-700 underline hover:text-green-900"
              >
                Remove
              </button>
            </div>
          )}

          {/* Fully covered by gift cert */}
          {fullyPaidByGiftCert && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
                <p className="text-green-800 font-semibold text-sm">Your gift certificate covers the full amount!</p>
                <p className="text-green-700 text-xs mt-1">No payment needed — just confirm your booking below.</p>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => goToStep("details")}
                  className="flex-1 py-3 rounded-full border border-forest/30 text-forest font-semibold text-sm hover:bg-forest/5 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFreePay}
                  disabled={loading}
                  className="flex-[2] py-3 rounded-full bg-forest text-white font-bold text-sm hover:bg-forest/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Confirming…
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Loading new PI after gift cert applied */}
          {!fullyPaidByGiftCert && loading && !clientSecret && (
            <div className="flex items-center justify-center py-8 text-warm-gray text-sm gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Updating payment…
            </div>
          )}

          {/* Stripe Elements (partial or no gift cert) */}
          {!fullyPaidByGiftCert && clientSecret && stripePromise && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#2D5016",
                    colorBackground: "#ffffff",
                    borderRadius: "12px",
                    fontFamily: "inherit",
                  },
                },
              }}
            >
              <BookingCheckout
                totalAmount={total}
                onSuccess={handlePaymentSuccess}
                onBack={() => goToStep("details")}
              />
            </Elements>
          )}

          {!stripePromise && !fullyPaidByGiftCert && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
              <strong>Stripe not configured.</strong> Add <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> to your <code className="bg-amber-100 px-1 rounded">.env.local</code> file.
            </div>
          )}
        </div>
      )}

    </div>
    </>
  );
}

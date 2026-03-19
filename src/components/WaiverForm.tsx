"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import SignaturePad from "signature_pad";
import Image from "next/image";


export default function WaiverForm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [tourDate, setTourDate] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waiverContent, setWaiverContent] = useState<string>("");

  useEffect(() => {
    fetch("/api/waiver-content")
      .then((r) => r.json())
      .then(({ content }) => setWaiverContent(content))
      .catch(() => {});
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const pad = padRef.current;
    if (!canvas || !pad) return;
    const ratio = window.devicePixelRatio || 1;
    const data = pad.isEmpty() ? null : pad.toData();
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d")?.scale(ratio, ratio);
    pad.clear();
    if (data) pad.fromData(data);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pad = new SignaturePad(canvas, {
      minWidth: 1.5,
      maxWidth: 3,
      penColor: "#1a1a1a",
      backgroundColor: "rgba(0,0,0,0)",
    });
    padRef.current = pad;

    pad.addEventListener("endStroke", () => setIsEmpty(pad.isEmpty()));

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  const handleClear = () => {
    padRef.current?.clear();
    setIsEmpty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) { setError("Please enter your full name."); return; }
    if (isEmpty) { setError("Please sign the form."); return; }
    if (!agreed) { setError("Please confirm you have read and agree to the terms."); return; }

    setError(null);
    setSubmitting(true);

    try {
      const signatureData = padRef.current!.toDataURL("image/png");
      const res = await fetch("/api/waivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, tourDate, signatureData }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Submission failed.");
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-[#2D5016] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-[#C9A84C] text-xs font-semibold uppercase tracking-widest mb-2">Waiver Signed</p>
          <h1 className="font-serif text-3xl font-bold text-[#2D5016] mb-4">You&rsquo;re All Set!</h1>
          <p className="text-gray-600 text-base leading-relaxed mb-2">
            Thank you, <strong className="text-[#2D5016]">{fullName}</strong>. Your liability waiver has been recorded.
          </p>
          <p className="text-gray-500 text-sm">
            Enjoy your adventure with W.H. Peters Outdoor Adventures. Please check in with your guide when you arrive.
          </p>
          <div className="mt-8 pt-8 border-t border-[#C9A84C]/30">
            <p className="text-xs text-gray-400">W.H. Peters Outdoor Adventures · Ocean City, Maryland</p>
            <p className="text-xs text-gray-400 mt-1">
              <a href="tel:410-357-1025" className="hover:text-[#2D5016]">410-357-1025</a>
              {" · "}
              <a href="mailto:info@petersoutdoor.com" className="hover:text-[#2D5016]">info@petersoutdoor.com</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      {/* Header */}
      <div className="bg-[#2D5016] px-6 pt-24 pb-8 text-center">
        <div className="max-w-xl mx-auto">
          <Image
            src="/Logo.jpeg"
            alt="W.H. Peters Outdoor Adventures"
            width={80}
            height={80}
            className="h-20 w-auto object-contain mx-auto mb-5"
            priority
          />
          <p className="text-[#C9A84C] text-xs font-semibold uppercase tracking-widest mb-1">Before Your Tour</p>
          <h1 className="font-serif text-2xl font-bold text-white">Liability Waiver</h1>
          <p className="text-[#a8c890] text-sm mt-2">Please read carefully and sign before participating.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto px-4 py-8 space-y-6">

        {/* Guest info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-bold text-[#2D5016] uppercase tracking-widest">Your Information</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full legal name"
              autoComplete="name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D5016]/30 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D5016]/30 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tour Date <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="date"
              value={tourDate}
              onChange={(e) => setTourDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2D5016]/30 text-sm"
            />
          </div>
        </div>

        {/* Liability text */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-[#2D5016]/5 border-b border-gray-200 px-6 py-4">
            <h2 className="text-sm font-bold text-[#2D5016] uppercase tracking-widest">Release of Liability</h2>
          </div>
          <div className="px-6 py-5 max-h-72 overflow-y-auto">
            {waiverContent ? (
              <div
                className="prose prose-sm max-w-none text-gray-600 [&_h2]:text-sm [&_h2]:font-bold [&_h2]:text-[#2D5016] [&_h3]:text-xs [&_h3]:font-bold [&_h3]:text-[#2D5016] [&_p]:text-xs [&_p]:leading-relaxed [&_ul]:text-xs [&_ol]:text-xs"
                dangerouslySetInnerHTML={{ __html: waiverContent }}
              />
            ) : (
              <div className="flex items-center gap-2 text-gray-400 text-xs py-4">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading waiver content…
              </div>
            )}
          </div>
        </div>

        {/* Signature */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-[#2D5016]/5 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#2D5016] uppercase tracking-widest">
              Signature <span className="text-red-500 font-normal normal-case">*</span>
            </h2>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-gray-400 hover:text-[#2D5016] transition-colors font-medium"
            >
              Clear
            </button>
          </div>
          <div className="px-6 py-4">
            <p className="text-xs text-gray-500 mb-3">Sign with your finger or mouse in the box below.</p>
            <div className="relative border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 overflow-hidden"
              style={{ height: 160 }}>
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full touch-none"
              />
              {isEmpty && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-gray-300 text-sm select-none">Sign here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Agreement checkbox */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5 shrink-0">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              agreed ? "bg-[#2D5016] border-[#2D5016]" : "border-gray-300 bg-white group-hover:border-[#2D5016]/50"
            }`}>
              {agreed && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-sm text-gray-700 leading-relaxed">
            I have read and understand the Release of Liability above. I am 18 years of age or older (or a parent/guardian signing on behalf of a minor). I agree to be bound by its terms.
          </span>
        </label>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#2D5016] text-white rounded-2xl py-4 font-bold text-base hover:bg-[#2D5016]/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting…
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              I Agree &amp; Sign Waiver
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-400 pb-4">
          Your signature is recorded securely along with the date and time.
        </p>
      </form>
    </div>
  );
}

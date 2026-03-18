"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div>
        <h3 className="font-semibold text-cream mb-1">Stay in the Loop</h3>
        <p className="text-sage-light text-sm">
          Get seasonal tour announcements, wildlife sightings, and exclusive offers.
        </p>
      </div>

      {status === "success" ? (
        <p className="text-sage-light text-sm font-medium flex items-center gap-2 shrink-0">
          <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          You&rsquo;re subscribed!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto shrink-0">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 sm:w-56 px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-cream placeholder-sage-light/60 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-5 py-2.5 bg-gold text-forest font-semibold text-sm rounded-full hover:bg-gold-light transition-colors disabled:opacity-60 shrink-0"
          >
            {status === "loading" ? "…" : "Subscribe"}
          </button>
        </form>
      )}
    </div>
  );
}

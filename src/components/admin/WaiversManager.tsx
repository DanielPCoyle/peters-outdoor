"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const WaiverContentEditor = dynamic(() => import("./WaiverContentEditor"), { ssr: false });

interface Waiver {
  id: string;
  createdAt: string;
  fullName: string;
  email: string | null;
  tourDate: string | null;
  ipAddress: string | null;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://petersoutdoor.com";
const WAIVER_URL = `${SITE_URL}/waiver`;
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=12&color=2D5016&bgcolor=FFFFFF&data=${encodeURIComponent(WAIVER_URL)}`;

export default function WaiversManager() {
  const [waivers, setWaivers] = useState<Waiver[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);
  const [editingContent, setEditingContent] = useState(false);

  useEffect(() => {
    fetch("/api/waivers")
      .then((r) => r.json())
      .then((data) => setWaivers(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(WAIVER_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = waivers.filter((w) =>
    w.fullName.toLowerCase().includes(search.toLowerCase()) ||
    w.email?.toLowerCase().includes(search.toLowerCase()) ||
    w.tourDate?.includes(search)
  );

  const todayStr = new Date().toISOString().split("T")[0];
  const todayCount = waivers.filter((w) => w.tourDate === todayStr || w.createdAt.startsWith(todayStr)).length;

  return (
    <div className="space-y-6">
      {editingContent && <WaiverContentEditor onClose={() => setEditingContent(false)} />}

      {/* QR + link card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col sm:flex-row gap-6 items-center">
        <div className="shrink-0 bg-[#f5f0e8] rounded-2xl p-3 border-2 border-[#C9A84C]/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={QR_URL} alt="Waiver QR code" width={220} height={220} className="rounded-lg" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-xs font-semibold text-warm-gray uppercase tracking-widest mb-1">Guest Waiver</p>
          <h2 className="text-xl font-bold text-forest mb-2">Liability Waiver QR Code</h2>
          <p className="text-sm text-warm-gray leading-relaxed mb-4">
            Print or display this QR code at the dock. Guests scan it to read and sign the liability waiver before their tour.
          </p>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-4 py-2 bg-forest text-white text-sm font-semibold rounded-xl hover:bg-forest/90 transition-colors"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Link
                </>
              )}
            </button>
            <a
              href={WAIVER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-forest text-forest text-sm font-semibold rounded-xl hover:bg-forest/5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Preview Page
            </a>
            <a
              href={QR_URL}
              download="waiver-qr.png"
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-warm-gray text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download QR
            </a>
            <button
              onClick={() => setEditingContent(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-warm-gray text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Waiver
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Total Waivers", value: waivers.length },
          { label: "Signed Today", value: todayCount },
          { label: "This Month", value: waivers.filter((w) => w.createdAt.startsWith(new Date().toISOString().slice(0, 7))).length },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-warm-gray font-medium mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-forest">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search + list */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or tour date…"
            className="flex-1 text-sm text-forest placeholder-gray-400 focus:outline-none"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <svg className="animate-spin w-6 h-6 text-forest" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-16 text-center text-warm-gray text-sm">
            {search ? "No waivers match your search." : "No waivers signed yet."}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((w) => (
              <div key={w.id} className="flex items-center gap-4 px-5 py-4">
                <div className="w-9 h-9 bg-forest/10 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-forest font-bold text-sm">
                    {w.fullName.trim().charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-forest text-sm">{w.fullName}</p>
                  <p className="text-xs text-warm-gray truncate">
                    {w.email ?? "No email"}
                    {w.tourDate && ` · Tour: ${new Date(w.tourDate + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-warm-gray">
                    {new Date(w.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                  <p className="text-xs text-warm-gray">
                    {new Date(w.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

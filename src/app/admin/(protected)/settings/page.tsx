"use client";

import { useState, useEffect } from "react";

interface TimeFrame {
  name: string;
  startTime: string;
  endTime: string;
  color: string;
}

const PRESET_COLORS = ["#f59e0b", "#3b82f6", "#f97316", "#8b5cf6", "#10b981", "#ef4444", "#ec4899"];

export default function SettingsPage() {
  const [frames, setFrames] = useState<TimeFrame[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings/time-frames")
      .then((r) => r.json())
      .then((d) => setFrames(d.timeFrames ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings/time-frames", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeFrames: frames }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast("Time frames saved");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const addFrame = () => {
    setFrames((f) => [
      ...f,
      { name: "", startTime: "06:00", endTime: "12:00", color: PRESET_COLORS[f.length % PRESET_COLORS.length] },
    ]);
  };

  const updateFrame = (i: number, field: keyof TimeFrame, value: string) => {
    setFrames((f) => f.map((fr, idx) => (idx === i ? { ...fr, [field]: value } : fr)));
  };

  const removeFrame = (i: number) => {
    setFrames((f) => f.filter((_, idx) => idx !== i));
  };

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-lg bg-green-700 text-white">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure tour time frames and other options</p>
        </div>
      </div>

      {/* Time Frames */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Time Frames</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Define time-of-day categories. Customers can filter tours by these on the booking page.
            </p>
          </div>
          <button
            onClick={addFrame}
            className="flex items-center gap-1.5 text-sm px-4 py-2 bg-forest text-white rounded-lg hover:bg-forest/90 transition-colors font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : frames.length === 0 ? (
          <p className="text-sm text-gray-400">No time frames defined. Click &quot;Add&quot; to create one.</p>
        ) : (
          <div className="space-y-3">
            {frames.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50"
              >
                {/* Color picker */}
                <input
                  type="color"
                  value={f.color}
                  onChange={(e) => updateFrame(i, "color", e.target.value)}
                  className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer shrink-0"
                  title="Pick a color"
                />

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                  <input
                    value={f.name}
                    onChange={(e) => updateFrame(i, "name", e.target.value)}
                    placeholder="e.g. Morning, Sunset"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                  />
                </div>

                {/* Start time */}
                <div className="shrink-0">
                  <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
                  <input
                    type="time"
                    value={f.startTime}
                    onChange={(e) => updateFrame(i, "startTime", e.target.value)}
                    className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                  />
                </div>

                {/* End time */}
                <div className="shrink-0">
                  <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
                  <input
                    type="time"
                    value={f.endTime}
                    onChange={(e) => updateFrame(i, "endTime", e.target.value)}
                    className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                  />
                </div>

                {/* Delete */}
                <button
                  onClick={() => removeFrame(i)}
                  className="shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors mt-4"
                  title="Remove"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {frames.length > 0 && (
          <div className="mt-5 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving || frames.some((f) => !f.name.trim())}
              className="px-6 py-2.5 bg-forest text-white text-sm font-semibold rounded-lg hover:bg-forest/90 transition-colors disabled:opacity-40"
            >
              {saving ? "Saving..." : "Save Time Frames"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

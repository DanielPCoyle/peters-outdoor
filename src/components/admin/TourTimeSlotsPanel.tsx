"use client";

import { useState, useEffect, useCallback } from "react";

interface TourTimeSlot {
  id: string;
  tourId: string;
  time: string;
  type: string;
  dates: string[];
  startDate: string | null;
  repeatEvery: string | null;
  repeatCount: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const EMPTY_FORM = {
  time: "",
  type: "specific" as "specific" | "recurring",
  dates: [] as string[],
  startDate: "",
  repeatEvery: "weekly" as "weekly" | "daily" | "monthly",
  repeatCount: 1,
};

function formatTime(time: string): string {
  const [hourStr, minuteStr] = time.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = minuteStr ?? "00";
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minute} ${period}`;
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function TourTimeSlotsPanel({ tourId }: { tourId: string }) {
  const [slots, setSlots] = useState<TourTimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [dateInput, setDateInput] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/tours/${tourId}/timeslots`);
      const data = await res.json();
      setSlots(data.timeSlots ?? []);
    } finally {
      setLoading(false);
    }
  }, [tourId]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const handleAddDate = () => {
    if (!dateInput) return;
    if (form.dates.includes(dateInput)) return;
    const next = [...form.dates, dateInput].sort();
    setForm((f) => ({ ...f, dates: next }));
    setDateInput("");
  };

  const handleRemoveDate = (date: string) => {
    setForm((f) => ({ ...f, dates: f.dates.filter((d) => d !== date) }));
  };

  const handleSave = async () => {
    if (!form.time) return;
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        time: form.time,
        type: form.type,
      };
      if (form.type === "specific") {
        body.dates = form.dates;
      } else {
        body.startDate = form.startDate;
        body.repeatEvery = form.repeatEvery;
        body.repeatCount = form.repeatCount;
      }
      const res = await fetch(`/api/admin/tours/${tourId}/timeslots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      await fetchSlots();
      setForm({ ...EMPTY_FORM });
      setDateInput("");
      setShowForm(false);
      showToast("Time slot added");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this time slot?")) return;
    try {
      const res = await fetch(`/api/admin/timeslots/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      await fetchSlots();
      showToast("Time slot deleted");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to delete.");
    }
  };

  const handleCancel = () => {
    setForm({ ...EMPTY_FORM });
    setDateInput("");
    setShowForm(false);
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-100">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-lg bg-green-700 text-white">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700">Time Slots</h4>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-forest text-white rounded-lg hover:bg-forest/90 transition-colors font-medium"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Time Slot
          </button>
        )}
      </div>

      {/* Existing slots */}
      {loading ? (
        <div className="text-xs text-gray-400 py-2">Loading time slots…</div>
      ) : slots.length === 0 && !showForm ? (
        <p className="text-xs text-gray-400">No time slots yet</p>
      ) : (
        <div className="space-y-2 mb-4">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="flex items-start justify-between gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50"
            >
              <div className="flex items-start gap-3 min-w-0">
                {/* Time */}
                <span className="text-sm font-semibold text-gray-800 shrink-0">
                  {formatTime(slot.time)}
                </span>

                {/* Badge */}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                    slot.type === "recurring"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {slot.type === "recurring" ? "Recurring" : "Specific"}
                </span>

                {/* Details */}
                <div className="min-w-0">
                  {slot.type === "specific" ? (
                    <p className="text-xs text-gray-500 leading-tight">
                      {slot.dates.length === 0
                        ? "No dates set"
                        : slot.dates.length <= 3
                        ? slot.dates.map(formatDate).join(", ")
                        : `${slot.dates.slice(0, 3).map(formatDate).join(", ")} +${slot.dates.length - 3} more`}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 leading-tight">
                      {slot.repeatCount}× {slot.repeatEvery && capitalize(slot.repeatEvery)}
                      {slot.startDate ? ` from ${formatDate(slot.startDate)}` : ""}
                    </p>
                  )}
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={() => handleDelete(slot.id)}
                className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Delete time slot"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          {/* Time */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
              Time
            </label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
            />
          </div>

          {/* Type toggle */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
              Type
            </label>
            <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, type: "specific" }))}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  form.type === "specific"
                    ? "bg-forest text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Specific Dates
              </button>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, type: "recurring" }))}
                className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-200 ${
                  form.type === "recurring"
                    ? "bg-forest text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Recurring
              </button>
            </div>
          </div>

          {/* Specific dates */}
          {form.type === "specific" && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                Dates
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
                <button
                  type="button"
                  onClick={handleAddDate}
                  disabled={!dateInput}
                  className="px-3 py-2 bg-forest text-white text-sm font-medium rounded-lg hover:bg-forest/90 transition-colors disabled:opacity-40"
                >
                  Add
                </button>
              </div>
              {form.dates.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {form.dates.map((date) => (
                    <span
                      key={date}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                    >
                      {formatDate(date)}
                      <button
                        type="button"
                        onClick={() => handleRemoveDate(date)}
                        className="hover:text-blue-900 transition-colors ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recurring */}
          {form.type === "recurring" && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  Repeat Every
                </label>
                <select
                  value={form.repeatEvery}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      repeatEvery: e.target.value as "daily" | "weekly" | "monthly",
                    }))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 bg-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  Number of Occurrences
                </label>
                <input
                  type="number"
                  min="1"
                  max="104"
                  value={form.repeatCount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, repeatCount: parseInt(e.target.value, 10) || 1 }))
                  }
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
              </div>
            </div>
          )}

          {/* Form actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !form.time}
              className="flex-[2] py-2 rounded-lg bg-forest text-white text-sm font-semibold hover:bg-forest/90 transition-colors disabled:opacity-40"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

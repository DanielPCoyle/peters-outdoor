"use client";

import { useState, useEffect } from "react";

interface BookingCalendarProps {
  selected: Date | null;
  onSelect: (date: Date) => void;
  /** YYYY-MM-DD strings that have at least one time slot. When defined, dots are shown and non-slot days are dimmed. */
  availableDates?: Set<string>;
  /** When provided, the calendar will jump to this month (ignores day). */
  initialMonth?: Date | null;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_SHORT = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function BookingCalendar({ selected, onSelect, availableDates, initialMonth }: BookingCalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewDate, setViewDate] = useState(() => {
    const d = initialMonth ? new Date(initialMonth) : new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  useEffect(() => {
    if (!initialMonth) return;
    const d = new Date(initialMonth);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    setViewDate(d);
  }, [initialMonth]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isToday = (day: number) => {
    const d = new Date(year, month, day);
    return d.getTime() === today.getTime();
  };

  const isPast = (day: number) => {
    const d = new Date(year, month, day);
    return d < today;
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    return (
      selected.getFullYear() === year &&
      selected.getMonth() === month &&
      selected.getDate() === day
    );
  };

  const canGoPrev = () => {
    const prevMonthDate = new Date(year, month - 1, 1);
    const todayFirst = new Date(today.getFullYear(), today.getMonth(), 1);
    return prevMonthDate >= todayFirst;
  };

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="bg-white rounded-2xl border border-sage-muted/20 p-3 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev()}
          className="p-1.5 rounded-full hover:bg-sage-muted/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-semibold text-forest text-base">
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-full hover:bg-sage-muted/20 transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d, i) => (
          <div key={d} className="text-center text-xs font-medium text-warm-gray py-1">
            <span className="sm:hidden">{DAYS_SHORT[i]}</span>
            <span className="hidden sm:inline">{d}</span>
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const past = isPast(day);
          const sel = isSelected(day);
          const tod = isToday(day);
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const hasSlots = availableDates ? availableDates.has(dateStr) : undefined;
          // When availableDates is provided, only slot days are selectable
          const noSlotDay = availableDates !== undefined && !hasSlots && !past;
          const disabled = past || noSlotDay;
          return (
            <button
              key={day}
              onClick={() => !disabled && onSelect(new Date(year, month, day))}
              disabled={disabled}
              className={`
                relative flex flex-col items-center justify-center py-1.5 sm:py-1 rounded-xl transition-all font-medium text-sm
                ${past ? "text-warm-gray/40 cursor-not-allowed" : ""}
                ${noSlotDay ? "text-warm-gray/30 cursor-not-allowed" : ""}
                ${sel ? "bg-forest text-white" : ""}
                ${!sel && !disabled ? "hover:bg-forest/10 text-forest cursor-pointer" : ""}
                ${tod && !sel ? "ring-1 ring-forest" : ""}
              `}
            >
              <span>{day}</span>
              {availableDates !== undefined && !past && (
                <span
                  className={`w-1 h-1 rounded-full mt-0.5 ${
                    hasSlots
                      ? sel ? "bg-gold" : "bg-forest"
                      : "bg-transparent"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import BookingSystem from "@/components/BookingSystem";

interface PerkItem {
  label: string;
}

interface BookingFormBlockProps {
  sectionTitle?: string;
  sectionSubtitle?: string;
  // Sidebar toggle
  showGroupSidebar?: boolean;
  // Group sidebar content
  sidebarEyebrow?: string;
  sidebarTitle?: string;
  sidebarDescription?: string;
  sidebarPerks?: (string | PerkItem)[];
  sidebarEmailLabel?: string;
  sidebarEmail?: string;
  sidebarPhoneLabel?: string;
  sidebarPhone?: string;
}

function perkLabel(p: string | PerkItem): string {
  return typeof p === "string" ? p : p.label;
}

const defaultPerks: PerkItem[] = [
  { label: "Private guided tour — just your group" },
  { label: "Flexible route, date, and start time" },
  { label: "Perfect for corporate team building" },
  { label: "Celebrations, reunions, bachelorette parties" },
];

export default function BookingFormBlock({
  sectionTitle = "Reserve Your Spot",
  sectionSubtitle = "Select your tour, pick a date, and secure your booking in minutes.",
  showGroupSidebar = true,
  sidebarEyebrow = "Groups & Corporate",
  sidebarTitle = "Planning a Group Adventure?",
  sidebarDescription = "Corporate outings, family reunions, birthday paddles, or team-building retreats — we'll customize every detail. Private tours and group pricing for parties of 9+.",
  sidebarPerks = defaultPerks,
  sidebarEmailLabel = "Email Us for Group Pricing",
  sidebarEmail = "info@petersoutdoor.com",
  sidebarPhoneLabel = "Call 410-357-1025",
  sidebarPhone = "410-357-1025",
}: BookingFormBlockProps) {
  return (
    <section className="py-16 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        {(sectionTitle || sectionSubtitle) && (
          <div className="mb-10 text-center">
            {sectionTitle && (
              <h2 className="font-serif text-3xl font-bold text-forest mb-2">{sectionTitle}</h2>
            )}
            {sectionSubtitle && (
              <p className="text-warm-gray">{sectionSubtitle}</p>
            )}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Booking form */}
          <div className="flex-1 min-w-0">
            <BookingSystem />
          </div>

          {/* Sidebar */}
          {showGroupSidebar && (
            <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-24">
              <div className="bg-forest text-cream rounded-3xl p-6">
                {sidebarEyebrow && (
                  <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">
                    {sidebarEyebrow}
                  </p>
                )}
                {sidebarTitle && (
                  <h2 className="font-serif text-xl font-bold mb-3">{sidebarTitle}</h2>
                )}
                {sidebarDescription && (
                  <p className="text-sage-light text-sm leading-relaxed mb-5">{sidebarDescription}</p>
                )}

                {sidebarPerks.length > 0 && (
                  <div className="grid grid-cols-1 gap-3 mb-5">
                    {sidebarPerks.map((perk, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 border border-white/10"
                      >
                        <svg className="w-4 h-4 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-cream text-xs font-medium leading-snug">{perkLabel(perk)}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  {sidebarEmail && (
                    <a
                      href={`mailto:${sidebarEmail}?subject=Group%20Booking%20Inquiry`}
                      className="px-5 py-2.5 bg-gold text-forest font-semibold text-sm rounded-full hover:bg-gold-light transition-colors text-center"
                    >
                      {sidebarEmailLabel}
                    </a>
                  )}
                  {sidebarPhone && (
                    <a
                      href={`tel:${sidebarPhone}`}
                      className="px-5 py-2.5 border border-cream/30 text-cream font-semibold text-sm rounded-full hover:bg-cream/10 transition-colors text-center"
                    >
                      {sidebarPhoneLabel}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";

interface TourOption {
  name: string;
  duration?: string;
  groupSize?: string;
  highlights: string;
}

interface BookingOptionsSectionProps {
  title?: string;
  tours?: TourOption[];
  customToursNote?: string;
}

const defaultTours: TourOption[] = [
  {
    name: "Newport Bay Salt Marsh Tour",
    duration: "2-3 hours",
    groupSize: "Up to 8 people",
    highlights: "Salt marsh, tidal creeks, osprey & herons",
  },
  {
    name: "Pocomoke River Cypress Swamp Tour",
    duration: "2-3 hours",
    groupSize: "Up to 8 people",
    highlights: "Bald cypress, blackwater, river otters & owls",
  },
  {
    name: "St. Martin River Tour",
    duration: "2-3 hours",
    groupSize: "Up to 8 people",
    highlights: "Marshes, forests, eagles & dam history",
  },
  {
    name: "Assateague Island Tour",
    duration: "2-3 hours",
    groupSize: "Up to 8 people",
    highlights: "Wild ponies, shipwreck tales, barrier island ecology",
  },
  {
    name: "Sunset Kayak Tour",
    duration: "2-3 hours",
    groupSize: "Up to 8 people",
    highlights: "Golden hour, stunning skies, serene waters",
  },
  {
    name: "Full Moon Kayak Tour",
    duration: "2-3 hours",
    groupSize: "Up to 8 people",
    highlights: "Moonlit paddle, night sounds, magical atmosphere",
  },
];

export default function BookingOptionsSection({
  title = "Choose Your Adventure",
  tours = defaultTours,
  customToursNote = "All tours are customizable. Dates, times, and locations can be adjusted to accommodate your group. Contact us to plan your perfect adventure.",
}: BookingOptionsSectionProps) {
  return (
    <div className="lg:col-span-2">
      <h2 className="font-serif text-3xl font-bold text-forest mb-8">{title}</h2>

      <div className="space-y-4">
        {tours.map((tour, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-sage-muted/10"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-grow">
                <h3 className="font-semibold text-forest text-lg">{tour.name}</h3>
                <p className="text-warm-gray text-sm mt-1">{tour.highlights}</p>
                <div className="flex gap-4 mt-2">
                  {tour.duration && (
                    <span className="text-sage text-xs flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {tour.duration}
                    </span>
                  )}
                  {tour.groupSize && (
                    <span className="text-sage text-xs flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {tour.groupSize}
                    </span>
                  )}
                </div>
              </div>
              <a
                href={`mailto:info@petersoutdoor.com?subject=Booking Inquiry: ${tour.name}`}
                className="px-6 py-2.5 bg-gold text-forest font-semibold text-sm rounded-full hover:bg-gold-light transition-colors whitespace-nowrap"
              >
                Inquire Now
              </a>
            </div>
          </div>
        ))}
      </div>

      {customToursNote && (
        <div className="mt-8 bg-sage-muted/20 rounded-2xl p-6 border border-sage-muted/30">
          <p className="text-sm text-warm-gray">
            <strong className="text-forest">Custom Tours Available:</strong>{" "}
            {customToursNote}
          </p>
        </div>
      )}
    </div>
  );
}

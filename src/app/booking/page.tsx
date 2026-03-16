import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Book a Tour",
  description:
    "Book your guided kayak eco-tour with W.H. Peters Outdoor Adventures. Choose from Pocomoke River, Newport Bay, St. Martin River, Assateague Island, sunset, and full moon tours.",
};

const tourOptions = [
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

export default function BookingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[350px] flex items-center justify-center">
        <Image
          src="https://static.wixstatic.com/media/5768ba_8efacc66b0074908b6c5c8b6a8abd3c7~mv2.jpg/v1/fill/w_1920,h_800,al_c,q_85,enc_avif,quality_auto/PXL_20251106_215242625_edited.jpg"
          alt="Sunset river view"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-forest/60" />
        <div className="relative z-10 text-center text-white px-6">
          <p className="text-sage-light text-sm font-medium tracking-[0.3em] uppercase mb-4">
            Reserve Your Spot
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold">
            Book a Tour
          </h1>
        </div>
      </section>

      {/* Booking Content */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Tour Options */}
            <div className="lg:col-span-2">
              <h2 className="font-serif text-3xl font-bold text-forest mb-8">
                Choose Your Adventure
              </h2>

              <div className="space-y-4">
                {tourOptions.map((tour, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-sage-muted/10"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-grow">
                        <h3 className="font-semibold text-forest text-lg">
                          {tour.name}
                        </h3>
                        <p className="text-warm-gray text-sm mt-1">
                          {tour.highlights}
                        </p>
                        <div className="flex gap-4 mt-2">
                          <span className="text-sage text-xs flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {tour.duration}
                          </span>
                          <span className="text-sage text-xs flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {tour.groupSize}
                          </span>
                        </div>
                      </div>
                      <a
                        href="mailto:info@petersoutdoor.com?subject=Booking Inquiry: ${tour.name}"
                        className="px-6 py-2.5 bg-gold text-forest font-semibold text-sm rounded-full hover:bg-gold-light transition-colors whitespace-nowrap"
                      >
                        Inquire Now
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-sage-muted/20 rounded-2xl p-6 border border-sage-muted/30">
                <p className="text-sm text-warm-gray">
                  <strong className="text-forest">Custom Tours Available:</strong>{" "}
                  All tours are customizable. Dates, times, and locations can be
                  adjusted to accommodate your group. Contact us to plan your
                  perfect adventure.
                </p>
              </div>
            </div>

            {/* Contact Sidebar */}
            <div>
              <div className="bg-forest text-cream rounded-2xl p-8 sticky top-32">
                <h3 className="font-serif text-2xl font-bold mb-6">
                  Ready to Paddle?
                </h3>
                <p className="text-sage-light text-sm mb-8 leading-relaxed">
                  Contact us to check availability, ask questions, or book your
                  guided kayak eco-tour. We&apos;ll help you choose the perfect
                  adventure.
                </p>

                <div className="space-y-4 mb-8">
                  <a
                    href="tel:410-357-1025"
                    className="flex items-center gap-3 text-cream hover:text-gold transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-sage-light">Call us</p>
                      <p className="font-semibold">410-357-1025</p>
                    </div>
                  </a>

                  <a
                    href="mailto:info@petersoutdoor.com"
                    className="flex items-center gap-3 text-cream hover:text-gold transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-sage-light">Email us</p>
                      <p className="font-semibold">info@petersoutdoor.com</p>
                    </div>
                  </a>
                </div>

                <div className="border-t border-sage/20 pt-6">
                  <h4 className="font-semibold text-sm mb-3">What&apos;s Included</h4>
                  <ul className="space-y-2 text-sage-light text-sm">
                    {[
                      "Kayak & paddle equipment",
                      "Safety gear (PFDs)",
                      "Expert naturalist guide",
                      "Wildlife & ecology education",
                      "Small group experience",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-sage/20 pt-6 mt-6">
                  <h4 className="font-semibold text-sm mb-2">Important</h4>
                  <p className="text-sage-light text-xs leading-relaxed">
                    All participants must sign a liability release form.
                    Children under 18 require parent/guardian co-signature.{" "}
                    <Link href="/tours" className="text-gold hover:text-gold-light underline">
                      View tour details
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

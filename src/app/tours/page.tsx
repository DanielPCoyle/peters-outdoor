import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tours",
  description:
    "Explore our guided kayak eco-tours: Pocomoke River, Newport Bay, St. Martin River, Assateague Island, plus sunset and full moon tours.",
};

const tours = [
  {
    id: "newport",
    title: "Newport Bay Salt Marsh",
    tagline:
      "Kayak Maryland's hidden gem: Newport Bay's wild salt marsh.",
    description:
      "Paddle through the largest continuous salt marsh in Worcester County, Maryland on a peaceful 2-3 hour guided tour. You'll glide along tidal creeks and open waters, spotting osprey, herons, and other wildlife while learning the stories of Maryland's \"forgotten bays.\" Small groups, calm waters, and optional sunset departures make this experience perfect for all skill levels — whether you're seeking adventure, relaxation, or stunning photos.",
    image:
      "https://static.wixstatic.com/media/5768ba_a2d76f158bc74f90b6db4b28452ab0e1~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/20221012_121045.jpg",
    wildlife: ["Osprey", "Herons", "Coastal Birds"],
    duration: "2-3 hours",
  },
  {
    id: "pocomoke",
    title: "Pocomoke River Bald Cypress Swamp",
    tagline: "Serenity, Wildlife, and Ancient Trees Await",
    description:
      "Paddle the serene blackwaters of the Pocomoke River, home to the northernmost bald cypress swamp in the U.S. This 2-3 hour guided tour is great for all skill levels and offers close encounters with wildlife like herons, owls, turtles, river otters, and even longnose gar. Small groups, peaceful scenery, and optional sunset tours make this a truly unforgettable experience.",
    image:
      "https://static.wixstatic.com/media/5768ba_3bc8f28567d84fdbba85e29534c0e859~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/5768ba_3bc8f28567d84fdbba85e29534c0e859~mv2.jpg",
    wildlife: ["Herons", "Owls", "Turtles", "River Otters", "Longnose Gar"],
    duration: "2-3 hours",
  },
  {
    id: "stmartin",
    title: "St. Martin River",
    tagline:
      "Follow the quiet bends of the St. Martin River and step into a story of wildlife, water, and renewal.",
    description:
      "Paddle into the hidden beauty of the upper St. Martin River on a guided kayak adventure. Experience a peaceful journey through marshes and forests alive with herons, eagles, and other wildlife. Along the way, discover the rich history of Bishopville Dam and the inspiring restoration efforts bringing new life to the river. Small groups, expert guides, and calm waters make this the perfect escape into nature.",
    image:
      "https://static.wixstatic.com/media/5768ba_8efacc66b0074908b6c5c8b6a8abd3c7~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20251106_215242625_edited.jpg",
    wildlife: ["Herons", "Eagles", "Diverse Wildlife"],
    duration: "2-3 hours",
  },
  {
    id: "assateague",
    title: "Assateague Island National Seashore",
    tagline:
      "Where wild ponies roam, shipwreck tales linger, and the island itself is always on the move.",
    description:
      "Paddle through calm bays, salt marshes, and winding channels on a 2-3 hour guided kayak tour of Assateague Island National Seashore. Along the way, spot wild ponies, ospreys, herons, and other wildlife, while learning about shipwrecks, local watermen, and the island's shifting sands. Perfect for all skill levels, this small-group experience blends ecology, history, and stunning scenery — with magical sunset tours available seasonally.",
    image:
      "https://static.wixstatic.com/media/5768ba_359609431599441684b622533bee766f~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20250509_151508817_MP.jpg",
    wildlife: ["Wild Ponies", "Ospreys", "Herons"],
    duration: "2-3 hours",
  },
];

export default function ToursPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
        <Image
          src="https://static.wixstatic.com/media/5768ba_228ce943b71e4538a11a9ab52ddaf6ad~mv2.jpg/v1/fill/w_1920,h_800,al_c,q_85,enc_avif,quality_auto/5768ba_228ce943b71e4538a11a9ab52ddaf6ad~mv2.jpg"
          alt="Kayaking at sunset"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-forest/60" />
        <div className="relative z-10 text-center text-white px-6">
          <p className="text-sage-light text-sm font-medium tracking-[0.3em] uppercase mb-4">
            Guided Eco-Tours
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold">
            Explore Nature&apos;s Wonders
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 bg-cream">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-lg text-warm-gray leading-relaxed mb-6">
            Join me for exhilarating kayak eco-tours led by an experienced,
            local naturalist and ACA certified coastal kayak instructor.
            Experience diverse ecosystems, learn about local wildlife and rich
            cultural history, all while enjoying the beauty of nature paddling
            through serene waters.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="px-4 py-2 bg-sage-muted/30 text-forest rounded-full">
              All skill levels welcome
            </span>
            <span className="px-4 py-2 bg-sage-muted/30 text-forest rounded-full">
              Max 6 kayaks / 8 people
            </span>
            <span className="px-4 py-2 bg-sage-muted/30 text-forest rounded-full">
              Customizable dates & times
            </span>
            <span className="px-4 py-2 bg-sage-muted/30 text-forest rounded-full">
              Equipment provided
            </span>
          </div>
        </div>
      </section>

      {/* Tours */}
      <section className="py-24 bg-cream-dark">
        <div className="max-w-7xl mx-auto px-6 space-y-24">
          {tours.map((tour, i) => (
            <div
              key={tour.id}
              id={tour.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                i % 2 === 1 ? "lg:direction-rtl" : ""
              }`}
            >
              <div className={`${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    width={900}
                    height={600}
                    className="w-full group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-forest">
                    {tour.duration}
                  </div>
                </div>
              </div>

              <div className={`${i % 2 === 1 ? "lg:order-1" : ""}`}>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-forest mb-3">
                  {tour.title}
                </h2>
                <p className="text-sage font-medium text-lg mb-4 italic">
                  {tour.tagline}
                </p>
                <p className="text-warm-gray leading-relaxed mb-6">
                  {tour.description}
                </p>

                {/* Wildlife tags */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-forest mb-2">
                    Wildlife you may see:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tour.wildlife.map((animal) => (
                      <span
                        key={animal}
                        className="px-3 py-1 bg-sage-muted/30 text-forest text-sm rounded-full"
                      >
                        {animal}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href="/booking"
                  className="inline-block px-8 py-3 bg-gold text-forest font-semibold rounded-full hover:bg-gold-light transition-colors"
                >
                  Book This Tour
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Special Tours */}
      <section className="py-24 bg-forest text-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sage-light text-sm font-medium tracking-[0.3em] uppercase mb-3">
              Special Experiences
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold">
              Sunset & Full Moon Tours
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative rounded-2xl overflow-hidden group h-80">
              <Image
                src="https://static.wixstatic.com/media/5768ba_388163a383e849019d7b74abfa4e0da0~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20250823_233340318_MP.jpg"
                alt="Sunset kayaking"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="inline-block px-3 py-1 bg-gold/90 text-forest text-xs font-semibold rounded-full mb-3">
                  Runs Daily
                </span>
                <h3 className="font-serif text-2xl font-bold mb-2">
                  Sunset Kayak Tour
                </h3>
                <p className="text-white/80 text-sm">
                  Watch the sky transform as you paddle through golden-hour waters.
                </p>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden group h-80">
              <Image
                src="https://static.wixstatic.com/media/5768ba_b2953e61daad4dd08109df65193010b6~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20251007_225010061.jpg"
                alt="Full moon kayaking"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="inline-block px-3 py-1 bg-gold/90 text-forest text-xs font-semibold rounded-full mb-3">
                  Every Full Moon
                </span>
                <h3 className="font-serif text-2xl font-bold mb-2">
                  Full Moon Kayak Tour
                </h3>
                <p className="text-white/80 text-sm">
                  A magical nighttime paddle under the glow of the full moon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Info */}
      <section className="py-16 bg-cream">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-sage-muted/20">
            <h3 className="font-serif text-2xl font-bold text-forest mb-4">
              Important Information
            </h3>
            <ul className="space-y-3 text-warm-gray">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-sage mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                All participants must sign an assumption of risk and release of
                liability form. Children under 18 must have a parent or legal
                guardian co-sign.
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-sage mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tours are easily accessible from Ocean City, Berlin, Snow Hill,
                Ocean Pines, Bishopville, Fenwick DE, and Selbyville DE.
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-sage mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                All tours are customizable. Dates, times, and locations can be
                adjusted to accommodate your group.
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-sage mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Limited to 6 kayaks or 8 people (with tandem kayaks) per tour.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

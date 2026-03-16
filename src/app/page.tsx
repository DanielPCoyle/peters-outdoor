import Link from "next/link";
import Image from "next/image";
import TourCard from "@/components/TourCard";

const tours = [
  {
    title: "Pocomoke River",
    subtitle: "Bald Cypress Swamp",
    description:
      "Paddle the serene blackwaters of the Pocomoke River, home to the northernmost bald cypress swamp in the U.S. Close encounters with herons, owls, turtles, river otters, and longnose gar.",
    image: "https://static.wixstatic.com/media/5768ba_3bc8f28567d84fdbba85e29534c0e859~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/5768ba_3bc8f28567d84fdbba85e29534c0e859~mv2.jpg",
    href: "/tours#pocomoke",
  },
  {
    title: "Assateague Island",
    subtitle: "National Seashore",
    description:
      "Paddle through calm bays, salt marshes, and winding channels. Spot wild ponies, ospreys, and herons while learning about shipwrecks and the island's shifting sands.",
    image: "https://static.wixstatic.com/media/5768ba_359609431599441684b622533bee766f~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20250509_151508817_MP.jpg",
    href: "/tours#assateague",
  },
  {
    title: "Newport Bay",
    subtitle: "Salt Marsh Exploration",
    description:
      "Kayak through the largest continuous salt marsh in Worcester County. Glide along tidal creeks and open waters spotting osprey, herons, and other coastal wildlife.",
    image: "https://static.wixstatic.com/media/5768ba_a2d76f158bc74f90b6db4b28452ab0e1~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/20221012_121045.jpg",
    href: "/tours#newport",
  },
];

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "ACA Certified",
    description: "Level 1 Certified Kayak Instructor ensuring your safety and learning on every tour.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Local Naturalist",
    description: "Deep knowledge of local ecosystems, wildlife, and the cultural history of Maryland's Eastern Shore.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Small Groups",
    description: "Limited to 6 kayaks (8 people max) for a personal, intimate experience on the water.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "Sunset & Full Moon",
    description: "Special sunset tours daily and full moon tours monthly for magical experiences on the water.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-screen min-h-[700px] flex items-center">
        <Image
          src="https://static.wixstatic.com/media/5768ba_228ce943b71e4538a11a9ab52ddaf6ad~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_85,enc_avif,quality_auto/5768ba_228ce943b71e4538a11a9ab52ddaf6ad~mv2.jpg"
          alt="Sunset over the Maryland salt marsh"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-white">
          <p className="text-sage-light text-sm font-medium tracking-[0.3em] uppercase mb-4 animate-fade-up opacity-0">
            Ocean City, Maryland
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6 animate-fade-up opacity-0 animation-delay-200">
            Paddle.<br />
            Explore.<br />
            <span className="text-gold-light">Learn.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-xl mb-10 animate-fade-up opacity-0 animation-delay-400">
            Guided kayak eco-tours through ancient cypress swamps, wild salt
            marshes, and pristine barrier islands.
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-up opacity-0 animation-delay-600">
            <Link
              href="/booking"
              className="px-8 py-4 bg-gold text-forest font-semibold rounded-full text-lg hover:bg-gold-light transition-colors"
            >
              Book a Tour
            </Link>
            <Link
              href="/tours"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full text-lg border border-white/30 hover:bg-white/20 transition-colors"
            >
              Explore Tours
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-forest text-cream py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage/20 text-sage-light mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sage-light text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sage text-sm font-medium tracking-[0.3em] uppercase mb-3">
              Our Tours
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-forest mb-4">
              Discover Maryland&apos;s Hidden Waterways
            </h2>
            <p className="text-warm-gray text-lg max-w-2xl mx-auto">
              Each tour is a unique journey through diverse ecosystems, rich
              history, and stunning natural beauty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <TourCard key={tour.title} {...tour} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 text-forest font-semibold text-lg hover:text-sage transition-colors"
            >
              View All Tours
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-24 bg-cream-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://static.wixstatic.com/media/5768ba_b0bd60522dbe4c95821c13551a01b85b~mv2.jpg/v1/crop/x_145,y_106,w_2291,h_1555/fill/w_824,h_560,al_c,q_85,enc_avif,quality_auto/PXL_20250811_124020150_edited.jpg"
                  alt="Your guide on the water"
                  width={824}
                  height={560}
                  className="w-full"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gold rounded-2xl p-6 shadow-lg hidden md:block">
                <p className="font-serif text-2xl font-bold text-forest">15+</p>
                <p className="text-forest/70 text-sm">Years on the water</p>
              </div>
            </div>

            <div>
              <p className="text-sage text-sm font-medium tracking-[0.3em] uppercase mb-3">
                Our Story
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-forest mb-6">
                A Legacy of Love for Nature
              </h2>
              <p className="text-warm-gray text-lg leading-relaxed mb-6">
                W.H. Peters Outdoor Adventures is named after the man whose love
                of the natural world inspired everything we do. From childhood
                walks through the woods to summers fishing in Ocean City,
                Maryland, that sense of wonder has been passed down through
                generations.
              </p>
              <p className="text-warm-gray leading-relaxed mb-8">
                Today, every tour is an opportunity to spark that same excitement
                and wonder in others &mdash; to help people form a personal
                connection to nature that inspires them to protect it.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-forest text-forest font-semibold rounded-full hover:bg-forest hover:text-cream transition-all"
              >
                Read Our Full Story
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sage text-sm font-medium tracking-[0.3em] uppercase mb-3">
              Testimonials
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-forest">
              What Our Guests Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Emily Johnson",
                quote: "The kayak tour was amazing! I learned so much and felt completely at ease.",
              },
              {
                name: "Michael Chen",
                quote: "A fantastic adventure! The guide was knowledgeable and the scenery was breathtaking.",
              },
              {
                name: "Sophie Martinez",
                quote: "Highly recommend! The kayak instruction was top-notch and very educational.",
              },
            ].map((review, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-1 text-gold mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-warm-gray italic leading-relaxed mb-6">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <p className="font-semibold text-forest">{review.name}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/reviews"
              className="text-water font-semibold hover:text-water-light transition-colors"
            >
              Read All Reviews &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Special Tours */}
      <section className="py-24 bg-forest text-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sunset */}
            <div className="relative rounded-2xl overflow-hidden group h-96">
              <Image
                src="https://static.wixstatic.com/media/5768ba_388163a383e849019d7b74abfa4e0da0~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20250823_233340318_MP.jpg"
                alt="Sunset kayaking"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="inline-block px-3 py-1 bg-gold/90 text-forest text-xs font-semibold rounded-full mb-3">
                  Daily
                </span>
                <h3 className="font-serif text-3xl font-bold mb-2">
                  Sunset Tours
                </h3>
                <p className="text-white/80 mb-4">
                  Watch the sky come alive as you paddle through serene waters at golden hour.
                </p>
                <Link
                  href="/booking"
                  className="inline-block px-6 py-2.5 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/30 transition-colors"
                >
                  Book Sunset Tour
                </Link>
              </div>
            </div>

            {/* Full Moon */}
            <div className="relative rounded-2xl overflow-hidden group h-96">
              <Image
                src="https://static.wixstatic.com/media/5768ba_b2953e61daad4dd08109df65193010b6~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20251007_225010061.jpg"
                alt="Full moon kayaking"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="inline-block px-3 py-1 bg-gold/90 text-forest text-xs font-semibold rounded-full mb-3">
                  Monthly
                </span>
                <h3 className="font-serif text-3xl font-bold mb-2">
                  Full Moon Tours
                </h3>
                <p className="text-white/80 mb-4">
                  A magical nighttime paddle under the glow of the full moon.
                </p>
                <Link
                  href="/booking"
                  className="inline-block px-6 py-2.5 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/30 transition-colors"
                >
                  Book Full Moon Tour
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

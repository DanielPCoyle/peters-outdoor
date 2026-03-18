import Link from "next/link";
import TourCard from "@/components/TourCard";

interface TourItem {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  href: string;
  duration?: string;
  difficulty?: string;
}

interface FeaturedToursSectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  tours?: TourItem[];
  ctaText?: string;
  ctaHref?: string;
}

const defaultTours: TourItem[] = [
  {
    title: "Pocomoke River",
    subtitle: "Bald Cypress Swamp",
    description:
      "Paddle the serene blackwaters of the Pocomoke River, home to the northernmost bald cypress swamp in the U.S. Close encounters with herons, owls, turtles, river otters, and longnose gar.",
    image:
      "https://static.wixstatic.com/media/5768ba_3bc8f28567d84fdbba85e29534c0e859~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/5768ba_3bc8f28567d84fdbba85e29534c0e859~mv2.jpg",
    href: "/tours#pocomoke",
  },
  {
    title: "Assateague Island",
    subtitle: "National Seashore",
    description:
      "Paddle through calm bays, salt marshes, and winding channels. Spot wild ponies, ospreys, and herons while learning about shipwrecks and the island's shifting sands.",
    image:
      "https://static.wixstatic.com/media/5768ba_359609431599441684b622533bee766f~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20250509_151508817_MP.jpg",
    href: "/tours#assateague",
  },
  {
    title: "Newport Bay",
    subtitle: "Salt Marsh Exploration",
    description:
      "Kayak through the largest continuous salt marsh in Worcester County. Glide along tidal creeks and open waters spotting osprey, herons, and other coastal wildlife.",
    image:
      "https://static.wixstatic.com/media/5768ba_a2d76f158bc74f90b6db4b28452ab0e1~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/20221012_121045.jpg",
    href: "/tours#newport",
  },
];

export default function FeaturedToursSection({
  eyebrow = "Our Tours",
  title = "Discover Maryland's Hidden Waterways",
  description = "Each tour is a unique journey through diverse ecosystems, rich history, and stunning natural beauty.",
  tours = defaultTours,
  ctaText = "View All Tours",
  ctaHref = "/tours",
}: FeaturedToursSectionProps) {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sage text-sm font-medium tracking-[0.3em] uppercase mb-3">
            {eyebrow}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-forest mb-4">
            {title}
          </h2>
          <p className="text-warm-gray text-lg max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <TourCard key={tour.title} {...tour} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 text-forest font-semibold text-lg hover:text-sage transition-colors"
          >
            {ctaText}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

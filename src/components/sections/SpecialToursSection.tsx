import Image from "next/image";
import Link from "next/link";

interface SpecialTourCard {
  badge?: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
  imageUrl: string;
  imageAlt?: string;
}

interface SpecialToursSectionProps {
  eyebrow?: string;
  sectionTitle?: string;
  cards?: SpecialTourCard[];
  cardHeight?: "h-96" | "h-80";
  darkBackground?: boolean;
}

const defaultCards: SpecialTourCard[] = [
  {
    badge: "Daily",
    title: "Sunset Tours",
    description: "Watch the sky come alive as you paddle through serene waters at golden hour.",
    ctaText: "Book Sunset Tour",
    ctaHref: "/booking",
    imageUrl:
      "https://static.wixstatic.com/media/5768ba_388163a383e849019d7b74abfa4e0da0~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20250823_233340318_MP.jpg",
    imageAlt: "Sunset kayaking",
  },
  {
    badge: "Monthly",
    title: "Full Moon Tours",
    description: "A magical nighttime paddle under the glow of the full moon.",
    ctaText: "Book Full Moon Tour",
    ctaHref: "/booking",
    imageUrl:
      "https://static.wixstatic.com/media/5768ba_b2953e61daad4dd08109df65193010b6~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20251007_225010061.jpg",
    imageAlt: "Full moon kayaking",
  },
];

const toursPageCards: SpecialTourCard[] = [
  {
    badge: "Runs Daily",
    title: "Sunset Kayak Tour",
    description: "Watch the sky transform as you paddle through golden-hour waters.",
    imageUrl:
      "https://static.wixstatic.com/media/5768ba_388163a383e849019d7b74abfa4e0da0~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20250823_233340318_MP.jpg",
    imageAlt: "Sunset kayaking",
  },
  {
    badge: "Every Full Moon",
    title: "Full Moon Kayak Tour",
    description: "A magical nighttime paddle under the glow of the full moon.",
    imageUrl:
      "https://static.wixstatic.com/media/5768ba_b2953e61daad4dd08109df65193010b6~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20251007_225010061.jpg",
    imageAlt: "Full moon kayaking",
  },
];

export { toursPageCards };

export default function SpecialToursSection({
  eyebrow,
  sectionTitle,
  cards = defaultCards,
  cardHeight = "h-96",
  darkBackground = true,
}: SpecialToursSectionProps) {
  return (
    <section className={`py-24 ${darkBackground ? "bg-forest text-cream" : "bg-cream"}`}>
      <div className="max-w-7xl mx-auto px-6">
        {(eyebrow || sectionTitle) && (
          <div className="text-center mb-16">
            {eyebrow && (
              <p className="text-sage-light text-sm font-medium tracking-[0.3em] uppercase mb-3">
                {eyebrow}
              </p>
            )}
            {sectionTitle && (
              <h2 className="font-serif text-4xl md:text-5xl font-bold">
                {sectionTitle}
              </h2>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`relative rounded-2xl overflow-hidden group ${cardHeight}`}
            >
              <Image
                src={card.imageUrl}
                alt={card.imageAlt ?? card.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                {card.badge && (
                  <span className="inline-block px-3 py-1 bg-gold/90 text-forest text-xs font-semibold rounded-full mb-3">
                    {card.badge}
                  </span>
                )}
                <h3 className="font-serif text-3xl font-bold mb-2">{card.title}</h3>
                <p className="text-white/80 mb-4">{card.description}</p>
                {card.ctaText && card.ctaHref && (
                  <Link
                    href={card.ctaHref}
                    className="inline-block px-6 py-2.5 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/30 transition-colors"
                  >
                    {card.ctaText}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

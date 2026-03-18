import Image from "next/image";
import Link from "next/link";

type WildlifeItem = string | { animal: string };

interface TourDetailSectionProps {
  id?: string;
  title: string;
  tagline?: string;
  description: string;
  wildlife?: WildlifeItem[];
  duration?: string;
  imageUrl: string;
  imageAlt?: string;
  reversed?: boolean;
  ctaText?: string;
  ctaHref?: string;
}

export default function TourDetailSection({
  id,
  title,
  tagline,
  description,
  wildlife = [],
  duration = "2-3 hours",
  imageUrl,
  imageAlt,
  reversed = false,
  ctaText = "Book This Tour",
  ctaHref = "/booking",
}: TourDetailSectionProps) {
  return (
    <div id={id} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className={reversed ? "lg:order-2" : ""}>
        <div className="relative rounded-2xl overflow-hidden shadow-xl group">
          <Image
            src={imageUrl}
            alt={imageAlt ?? title}
            width={900}
            height={600}
            className="w-full group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-forest">
            {duration}
          </div>
        </div>
      </div>

      <div className={reversed ? "lg:order-1" : ""}>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-forest mb-3">
          {title}
        </h2>
        {tagline && (
          <p className="text-sage font-medium text-lg mb-4 italic">{tagline}</p>
        )}
        <p className="text-warm-gray leading-relaxed mb-6">{description}</p>

        {wildlife.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-forest mb-2">
              Wildlife you may see:
            </p>
            <div className="flex flex-wrap gap-2">
              {wildlife.map((item, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-sage-muted/30 text-forest text-sm rounded-full"
                >
                  {typeof item === "string" ? item : item.animal}
                </span>
              ))}
            </div>
          </div>
        )}

        <Link
          href={ctaHref}
          className="inline-block px-8 py-3 bg-gold text-forest font-semibold rounded-full hover:bg-gold-light transition-colors"
        >
          {ctaText}
        </Link>
      </div>
    </div>
  );
}

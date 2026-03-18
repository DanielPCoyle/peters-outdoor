import Image from "next/image";
import Link from "next/link";

type HeadlineLine = string | { line: string };

interface HomeHeroProps {
  eyebrow?: string;
  headlineLines?: HeadlineLine[];
  highlightedLine?: string;
  tagline?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export default function HomeHero({
  eyebrow = "Ocean City, Maryland",
  headlineLines = ["Paddle.", "Explore."],
  highlightedLine = "Learn.",
  tagline = "Guided kayak eco-tours through ancient cypress swamps, wild salt marshes, and pristine barrier islands.",
  primaryCtaText = "Book a Tour",
  primaryCtaHref = "/booking",
  secondaryCtaText = "Explore Tours",
  secondaryCtaHref = "/tours",
  imageUrl = "https://static.wixstatic.com/media/5768ba_228ce943b71e4538a11a9ab52ddaf6ad~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_85,enc_avif,quality_auto/5768ba_228ce943b71e4538a11a9ab52ddaf6ad~mv2.jpg",
  imageAlt = "Sunset over the Maryland salt marsh",
}: HomeHeroProps) {
  return (
    <section className="relative h-full flex items-center">
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-white">
        <p className="text-sage-light text-sm font-medium tracking-[0.3em] uppercase mb-4 animate-fade-up opacity-0">
          {eyebrow}
        </p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6 animate-fade-up opacity-0 animation-delay-200">
          {headlineLines.map((line, i) => (
            <span key={i}>
              {typeof line === "string" ? line : line.line}
              <br />
            </span>
          ))}
          <span className="text-gold-light">{highlightedLine}</span>
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-xl mb-10 animate-fade-up opacity-0 animation-delay-400">
          {tagline}
        </p>
        <div className="flex flex-wrap gap-4 animate-fade-up opacity-0 animation-delay-600">
          <Link
            href={primaryCtaHref}
            className="px-8 py-4 bg-gold text-forest font-semibold rounded-full text-lg hover:bg-gold-light transition-colors"
          >
            {primaryCtaText}
          </Link>
          <Link
            href={secondaryCtaHref}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full text-lg border border-white/30 hover:bg-white/20 transition-colors"
          >
            {secondaryCtaText}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}

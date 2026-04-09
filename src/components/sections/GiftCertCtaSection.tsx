import Link from "next/link";

interface GiftCertCtaSectionProps {
  eyebrow?: string;
  title?: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function GiftCertCtaSection({
  eyebrow = "Ready to Paddle?",
  title = "Want to book a tour for yourself?",
  ctaText = "Book a Tour",
  ctaHref = "/booking",
}: GiftCertCtaSectionProps) {
  return (
    <section className="py-12 bg-forest text-cream">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <p className="text-sage-light mb-2 text-sm uppercase tracking-widest font-medium">
          {eyebrow}
        </p>
        <h2 className="font-serif text-3xl font-bold mb-4">{title}</h2>
        <Link
          href={ctaHref}
          className="inline-block px-8 py-3 bg-gold text-forest font-semibold rounded-full hover:bg-gold-light transition-colors"
        >
          {ctaText}
        </Link>
      </div>
    </section>
  );
}

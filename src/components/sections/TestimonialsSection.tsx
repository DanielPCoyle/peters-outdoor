import Link from "next/link";

interface Review {
  name: string;
  quote: string;
}

interface TestimonialsSectionProps {
  eyebrow?: string;
  title?: string;
  reviews?: Review[];
  ctaText?: string;
  ctaHref?: string;
}

const defaultReviews: Review[] = [
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
];

export default function TestimonialsSection({
  eyebrow = "Testimonials",
  title = "What Our Guests Say",
  reviews = defaultReviews,
  ctaText = "Read All Reviews →",
  ctaHref = "/reviews",
}: TestimonialsSectionProps) {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sage text-sm font-medium tracking-[0.3em] uppercase mb-3">
            {eyebrow}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-forest">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
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
          <Link href={ctaHref} className="text-water font-semibold hover:text-water-light transition-colors">
            {ctaText}
          </Link>
        </div>
      </div>
    </section>
  );
}

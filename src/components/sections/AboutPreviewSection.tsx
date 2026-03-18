import Image from "next/image";
import Link from "next/link";

interface AboutPreviewSectionProps {
  eyebrow?: string;
  title?: string;
  body1?: string;
  body2?: string;
  ctaText?: string;
  ctaHref?: string;
  imageUrl?: string;
  imageAlt?: string;
  statValue?: string;
  statLabel?: string;
}

export default function AboutPreviewSection({
  eyebrow = "Our Story",
  title = "A Legacy of Love for Nature",
  body1 = "W.H. Peters Outdoor Adventures is named after the man whose love of the natural world inspired everything we do. From childhood walks through the woods to summers fishing in Ocean City, Maryland, that sense of wonder has been passed down through generations.",
  body2 = "Today, every tour is an opportunity to spark that same excitement and wonder in others — to help people form a personal connection to nature that inspires them to protect it.",
  ctaText = "Read Our Full Story",
  ctaHref = "/about",
  imageUrl = "https://static.wixstatic.com/media/5768ba_b0bd60522dbe4c95821c13551a01b85b~mv2.jpg/v1/crop/x_145,y_106,w_2291,h_1555/fill/w_824,h_560,al_c,q_85,enc_avif,quality_auto/PXL_20250811_124020150_edited.jpg",
  imageAlt = "Your guide on the water",
  statValue = "15+",
  statLabel = "Years on the water",
}: AboutPreviewSectionProps) {
  return (
    <section className="py-24 bg-cream-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={imageUrl}
                alt={imageAlt}
                width={824}
                height={560}
                className="w-full"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-gold rounded-2xl p-6 shadow-lg hidden md:block">
              <p className="font-serif text-2xl font-bold text-forest">{statValue}</p>
              <p className="text-forest/70 text-sm">{statLabel}</p>
            </div>
          </div>

          <div>
            <p className="text-sage text-sm font-medium tracking-[0.3em] uppercase mb-3">
              {eyebrow}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-forest mb-6">
              {title}
            </h2>
            <p className="text-warm-gray text-lg leading-relaxed mb-6">{body1}</p>
            <p className="text-warm-gray leading-relaxed mb-8">{body2}</p>
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-forest text-forest font-semibold rounded-full hover:bg-forest hover:text-cream transition-all"
            >
              {ctaText}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

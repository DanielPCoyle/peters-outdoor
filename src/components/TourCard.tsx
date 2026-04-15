import Link from "next/link";
import Image from "next/image";
import { richTextToPlain } from "./RichText";

interface TourCardProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  href: string;
  duration?: string;
  difficulty?: string;
}

export default function TourCard({
  title,
  subtitle,
  description,
  image,
  href,
  duration = "2-3 hours",
  difficulty = "All levels",
}: TourCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-4 left-4 flex gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-forest">
            {duration}
          </span>
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-forest">
            {difficulty}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-serif text-xl font-bold text-forest mb-1">
          {title}
        </h3>
        <p className="text-sage text-sm font-medium mb-3">{subtitle}</p>
        <p className="text-warm-gray text-sm leading-relaxed mb-5 line-clamp-3">
          {richTextToPlain(description)}
        </p>
        <div className="flex items-center justify-between">
          <Link
            href={href}
            className="text-water font-semibold text-sm hover:text-water-light transition-colors flex items-center gap-1"
          >
            Learn More
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
          <Link
            href="/booking"
            className="px-5 py-2 bg-gold text-forest font-semibold text-sm rounded-full hover:bg-gold-light transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}

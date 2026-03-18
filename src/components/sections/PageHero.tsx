import Image from "next/image";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  imageUrl: string;
  imageAlt?: string;
}

export default function PageHero({
  eyebrow,
  title,
  imageUrl,
  imageAlt,
}: PageHeroProps) {
  return (
    <section className="relative flex items-center justify-center h-full">
      <Image
        src={imageUrl}
        alt={imageAlt ?? title}
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-forest/60" />
      <div className="relative z-10 text-center text-white px-6">
        {eyebrow && (
          <p className="text-sage-light text-sm font-medium tracking-[0.3em] uppercase mb-4">
            {eyebrow}
          </p>
        )}
        <h1 className="font-serif text-5xl md:text-7xl font-bold">{title}</h1>
      </div>
    </section>
  );
}

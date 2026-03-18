import type { Metadata } from "next";
import { fetchOneEntry, getBuilderSearchParams } from "@builder.io/sdk-react";
import BuilderContentWrapper from "@/components/BuilderContent";
import PageHero from "@/components/sections/PageHero";
import TourDetailSection from "@/components/sections/TourDetailSection";
import SpecialToursSection from "@/components/sections/SpecialToursSection";
import ToursIntroSection from "@/components/sections/ToursIntroSection";
import ToursImportantInfoSection from "@/components/sections/ToursImportantInfoSection";
import { getActiveTours } from "@/lib/tourStore";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tours",
  description:
    "Explore our guided kayak eco-tours: Pocomoke River, Newport Bay, St. Martin River, Assateague Island, plus sunset and full moon tours.",
};

const BUILDER_API_KEY = process.env.BUILDERIO_PUBLIC_API_KEY ?? "";

export default async function ToursPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const content = BUILDER_API_KEY
    ? await fetchOneEntry({
        model: "page",
        apiKey: BUILDER_API_KEY,
        cacheSeconds: 1,
        staleCacheSeconds: 1,
        fetchOptions: { cache: "no-store" },
        options: { noCache: "true", cachebust: "true", ...getBuilderSearchParams(params) },
        query: { "data.url": "/tours" },
        userAttributes: { urlPath: "/tours" },
      })
    : null;

  if (content) {
    return <BuilderContentWrapper content={content} apiKey={BUILDER_API_KEY} />;
  }

  const tours = await getActiveTours();

  // Split into regular tours (first 4 by sortOrder) and special tours (remainder)
  const regularTours = tours.filter((t) => t.sortOrder < 4);
  const specialTours = tours.filter((t) => t.sortOrder >= 4);

  const specialCards = specialTours.map((t) => ({
    title: t.name,
    description: t.tagline,
    imageUrl: t.imageUrl,
    imageAlt: t.name,
    ctaText: `Book ${t.name}`,
    ctaHref: "/booking",
  }));

  return (
    <>
      <div style={{ height: "50vh", minHeight: "400px" }}>
        <PageHero
          eyebrow="Guided Eco-Tours"
          title="Explore Nature's Wonders"
          imageUrl="https://static.wixstatic.com/media/5768ba_228ce943b71e4538a11a9ab52ddaf6ad~mv2.jpg/v1/fill/w_1920,h_800,al_c,q_85,enc_avif,quality_auto/5768ba_228ce943b71e4538a11a9ab52ddaf6ad~mv2.jpg"
          imageAlt="Kayaking at sunset"
        />
      </div>

      <ToursIntroSection />

      {/* Main tour details */}
      {regularTours.length > 0 && (
        <section className="py-24 bg-cream-dark">
          <div className="max-w-7xl mx-auto px-6 space-y-24">
            {regularTours.map((tour, i) => (
              <TourDetailSection
                key={tour.id}
                id={tour.id}
                title={tour.name}
                tagline={tour.tagline}
                description={tour.description}
                wildlife={tour.wildlife}
                duration={tour.duration}
                imageUrl={tour.imageUrl}
                imageAlt={tour.name}
                reversed={i % 2 === 1}
              />
            ))}
          </div>
        </section>
      )}

      {/* Special tours (sunset, full moon, etc.) */}
      {specialCards.length > 0 && (
        <SpecialToursSection
          eyebrow="Special Experiences"
          sectionTitle="Sunset & Full Moon Tours"
          cards={specialCards}
          cardHeight="h-80"
        />
      )}

      <ToursImportantInfoSection />
    </>
  );
}

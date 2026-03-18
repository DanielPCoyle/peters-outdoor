import type { Metadata } from "next";
import { fetchOneEntry, getBuilderSearchParams } from "@builder.io/sdk-react";
import BuilderContentWrapper from "@/components/BuilderContent";
import PageHero from "@/components/sections/PageHero";
import TourDetailSection from "@/components/sections/TourDetailSection";
import SpecialToursSection, { toursPageCards } from "@/components/sections/SpecialToursSection";
import ToursIntroSection from "@/components/sections/ToursIntroSection";
import ToursImportantInfoSection from "@/components/sections/ToursImportantInfoSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tours",
  description:
    "Explore our guided kayak eco-tours: Pocomoke River, Newport Bay, St. Martin River, Assateague Island, plus sunset and full moon tours.",
};

const BUILDER_API_KEY = process.env.BUILDERIO_PUBLIC_API_KEY ?? "";

const tours = [
  {
    id: "newport",
    title: "Newport Bay Salt Marsh",
    tagline: "Kayak Maryland's hidden gem: Newport Bay's wild salt marsh.",
    description:
      "Paddle through the largest continuous salt marsh in Worcester County, Maryland on a peaceful 2-3 hour guided tour. You'll glide along tidal creeks and open waters, spotting osprey, herons, and other wildlife while learning the stories of Maryland's \"forgotten bays.\" Small groups, calm waters, and optional sunset departures make this experience perfect for all skill levels — whether you're seeking adventure, relaxation, or stunning photos.",
    image:
      "https://static.wixstatic.com/media/5768ba_a2d76f158bc74f90b6db4b28452ab0e1~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/20221012_121045.jpg",
    wildlife: ["Osprey", "Herons", "Coastal Birds"],
    duration: "2-3 hours",
  },
  {
    id: "pocomoke",
    title: "Pocomoke River Bald Cypress Swamp",
    tagline: "Serenity, Wildlife, and Ancient Trees Await",
    description:
      "Paddle the serene blackwaters of the Pocomoke River, home to the northernmost bald cypress swamp in the U.S. This 2-3 hour guided tour is great for all skill levels and offers close encounters with wildlife like herons, owls, turtles, river otters, and even longnose gar. Small groups, peaceful scenery, and optional sunset tours make this a truly unforgettable experience.",
    image:
      "https://static.wixstatic.com/media/5768ba_3bc8f28567d84fdbba85e29534c0e859~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/5768ba_3bc8f28567d84fdbba85e29534c0e859~mv2.jpg",
    wildlife: ["Herons", "Owls", "Turtles", "River Otters", "Longnose Gar"],
    duration: "2-3 hours",
  },
  {
    id: "stmartin",
    title: "St. Martin River",
    tagline:
      "Follow the quiet bends of the St. Martin River and step into a story of wildlife, water, and renewal.",
    description:
      "Paddle into the hidden beauty of the upper St. Martin River on a guided kayak adventure. Experience a peaceful journey through marshes and forests alive with herons, eagles, and other wildlife. Along the way, discover the rich history of Bishopville Dam and the inspiring restoration efforts bringing new life to the river. Small groups, expert guides, and calm waters make this the perfect escape into nature.",
    image:
      "https://static.wixstatic.com/media/5768ba_8efacc66b0074908b6c5c8b6a8abd3c7~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20251106_215242625_edited.jpg",
    wildlife: ["Herons", "Eagles", "Diverse Wildlife"],
    duration: "2-3 hours",
  },
  {
    id: "assateague",
    title: "Assateague Island National Seashore",
    tagline:
      "Where wild ponies roam, shipwreck tales linger, and the island itself is always on the move.",
    description:
      "Paddle through calm bays, salt marshes, and winding channels on a 2-3 hour guided kayak tour of Assateague Island National Seashore. Along the way, spot wild ponies, ospreys, herons, and other wildlife, while learning about shipwrecks, local watermen, and the island's shifting sands. Perfect for all skill levels, this small-group experience blends ecology, history, and stunning scenery — with magical sunset tours available seasonally.",
    image:
      "https://static.wixstatic.com/media/5768ba_359609431599441684b622533bee766f~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20250509_151508817_MP.jpg",
    wildlife: ["Wild Ponies", "Ospreys", "Herons"],
    duration: "2-3 hours",
  },
];

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

      {/* Tour Details */}
      <section className="py-24 bg-cream-dark">
        <div className="max-w-7xl mx-auto px-6 space-y-24">
          {tours.map((tour, i) => (
            <TourDetailSection
              key={tour.id}
              id={tour.id}
              title={tour.title}
              tagline={tour.tagline}
              description={tour.description}
              wildlife={tour.wildlife}
              duration={tour.duration}
              imageUrl={tour.image}
              imageAlt={tour.title}
              reversed={i % 2 === 1}
            />
          ))}
        </div>
      </section>

      <SpecialToursSection
        eyebrow="Special Experiences"
        sectionTitle="Sunset & Full Moon Tours"
        cards={toursPageCards}
        cardHeight="h-80"
      />

      <ToursImportantInfoSection />
    </>
  );
}

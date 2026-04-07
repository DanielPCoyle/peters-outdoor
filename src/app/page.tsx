import type { Metadata } from "next";
import { fetchOneEntry, getBuilderSearchParams } from "@builder.io/sdk-react";
import BuilderContentWrapper from "@/components/BuilderContent";
import HomeHero from "@/components/sections/HomeHero";
import FeaturesStrip from "@/components/sections/FeaturesStrip";
import FeaturedToursSection from "@/components/sections/FeaturedToursSection";
import AboutPreviewSection from "@/components/sections/AboutPreviewSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import SpecialToursSection from "@/components/sections/SpecialToursSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "W.H. Peters Outdoor Adventures | Guided Kayak Eco-Tours | Ocean City, MD",
  description:
    "Book guided kayak eco-tours on Maryland's Eastern Shore. Explore bald cypress swamps, salt marshes, and Assateague Island with ACA Certified Instructor Paul Oliver.",
  openGraph: {
    title: "W.H. Peters Outdoor Adventures | Guided Kayak Eco-Tours",
    description: "Book guided kayak eco-tours on Maryland's Eastern Shore — morning, afternoon, and sunset paddling adventures.",
  },
};

const BUILDER_API_KEY = process.env.BUILDERIO_PUBLIC_API_KEY ?? "";

export default async function Home({
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
        query: { "data.url": "/" },
        userAttributes: { urlPath: "/" },
      })
    : null;

  if (content) {
    return <BuilderContentWrapper content={content} apiKey={BUILDER_API_KEY} />;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "W.H. Peters Outdoor Adventures",
    description: "Guided kayak eco-tours on Maryland's Eastern Shore",
    url: "https://petersoutdoor.com",
    telephone: "410-357-1025",
    email: "info@petersoutdoor.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ocean City",
      addressRegion: "MD",
      addressCountry: "US",
    },
    priceRange: "$$",
    sameAs: [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ height: "100svh", minHeight: "700px" }}>
        <HomeHero />
      </div>
      <FeaturesStrip />
      <FeaturedToursSection />
      <AboutPreviewSection />
      <TestimonialsSection />
      <SpecialToursSection />
    </>
  );
}

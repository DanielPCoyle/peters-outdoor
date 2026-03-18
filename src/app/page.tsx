import { fetchOneEntry, getBuilderSearchParams } from "@builder.io/sdk-react";
import BuilderContentWrapper from "@/components/BuilderContent";
import HomeHero from "@/components/sections/HomeHero";
import FeaturesStrip from "@/components/sections/FeaturesStrip";
import FeaturedToursSection from "@/components/sections/FeaturedToursSection";
import AboutPreviewSection from "@/components/sections/AboutPreviewSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import SpecialToursSection from "@/components/sections/SpecialToursSection";

export const dynamic = "force-dynamic";

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

  return (
    <>
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

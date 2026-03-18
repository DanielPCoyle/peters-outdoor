import type { Metadata } from "next";
import { fetchOneEntry, getBuilderSearchParams } from "@builder.io/sdk-react";
import BuilderContentWrapper from "@/components/BuilderContent";
import PageHero from "@/components/sections/PageHero";
import AboutPurposeSection from "@/components/sections/AboutPurposeSection";
import AboutStorySection from "@/components/sections/AboutStorySection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn the story behind W.H. Peters Outdoor Adventures — a legacy of love for nature passed down through generations.",
};

const BUILDER_API_KEY = process.env.BUILDERIO_PUBLIC_API_KEY ?? "";

export default async function AboutPage({
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
        query: { "data.url": "/about" },
        userAttributes: { urlPath: "/about" },
      })
    : null;

  if (content) {
    return <BuilderContentWrapper content={content} apiKey={BUILDER_API_KEY} />;
  }

  return (
    <>
      <div style={{ height: "50vh", minHeight: "400px" }}>
        <PageHero
          eyebrow="Our Story"
          title="Discover Our Journey"
          imageUrl="https://static.wixstatic.com/media/5768ba_3bc8f28567d84fdbba85e29534c0e859~mv2.jpg/v1/fill/w_1920,h_800,al_c,q_85,enc_avif,quality_auto/5768ba_3bc8f28567d84fdbba85e29534c0e859~mv2.jpg"
          imageAlt="Kayaking through the cypress swamp"
        />
      </div>
      <AboutPurposeSection />
      <AboutStorySection />
    </>
  );
}

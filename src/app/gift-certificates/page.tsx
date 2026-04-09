import type { Metadata } from "next";
import { fetchOneEntry, getBuilderSearchParams } from "@builder.io/sdk-react";
import BuilderContentWrapper from "@/components/BuilderContent";
import PageHero from "@/components/sections/PageHero";
import GiftCertIntroSection from "@/components/sections/GiftCertIntroSection";
import GiftCertHowItWorksSection from "@/components/sections/GiftCertHowItWorksSection";
import GiftCertFormSection from "@/components/sections/GiftCertFormSection";
import GiftCertCtaSection from "@/components/sections/GiftCertCtaSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gift Certificates | W.H. Peters Outdoor Adventures",
  description:
    "Give the gift of adventure. Purchase a gift certificate for a guided kayak eco-tour on Maryland's Eastern Shore — perfect for any occasion.",
};

const BUILDER_API_KEY = process.env.BUILDERIO_PUBLIC_API_KEY ?? "";

export default async function GiftCertificatesPage({
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
        query: { "data.url": "/gift-certificates" },
        userAttributes: { urlPath: "/gift-certificates" },
      })
    : null;

  if (content) {
    return <BuilderContentWrapper content={content} apiKey={BUILDER_API_KEY} />;
  }

  return (
    <>
      <div style={{ height: "50vh", minHeight: "400px" }}>
        <PageHero
          eyebrow="Give the Gift of Adventure"
          title="Gift Certificates"
          imageUrl="https://static.wixstatic.com/media/5768ba_359609431599441684b622533bee766f~mv2.jpg/v1/fill/w_1920,h_800,al_c,q_85,enc_avif,quality_auto/PXL_20250509_151508817_MP.jpg"
          imageAlt="Kayaking on the water"
        />
      </div>

      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <GiftCertIntroSection />
          <GiftCertHowItWorksSection />
          <GiftCertFormSection />
        </div>
      </section>
      <GiftCertCtaSection />
    </>
  );
}

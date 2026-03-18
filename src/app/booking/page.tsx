import type { Metadata } from "next";
import { fetchOneEntry, getBuilderSearchParams } from "@builder.io/sdk-react";
import BuilderContentWrapper from "@/components/BuilderContent";
import PageHero from "@/components/sections/PageHero";
import BookingOptionsSection from "@/components/sections/BookingOptionsSection";
import BookingContactSidebar from "@/components/sections/BookingContactSidebar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book a Tour",
  description:
    "Book your guided kayak eco-tour with W.H. Peters Outdoor Adventures. Choose from Pocomoke River, Newport Bay, St. Martin River, Assateague Island, sunset, and full moon tours.",
};

const BUILDER_API_KEY = process.env.BUILDERIO_PUBLIC_API_KEY ?? "";

export default async function BookingPage({
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
        query: { "data.url": "/booking" },
        userAttributes: { urlPath: "/booking" },
      })
    : null;

  if (content) {
    return <BuilderContentWrapper content={content} apiKey={BUILDER_API_KEY} />;
  }

  return (
    <>
      <div style={{ height: "50vh", minHeight: "400px" }}>
        <PageHero
          eyebrow="Reserve Your Spot"
          title="Book a Tour"
          imageUrl="https://static.wixstatic.com/media/5768ba_8efacc66b0074908b6c5c8b6a8abd3c7~mv2.jpg/v1/fill/w_1920,h_800,al_c,q_85,enc_avif,quality_auto/PXL_20251106_215242625_edited.jpg"
          imageAlt="Sunset river view"
        />
      </div>

      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <BookingOptionsSection />
            <div>
              <BookingContactSidebar />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

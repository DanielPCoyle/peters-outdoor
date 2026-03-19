import type { Metadata } from "next";
import { fetchOneEntry, getBuilderSearchParams } from "@builder.io/sdk-react";
import BuilderContentWrapper from "@/components/BuilderContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Terms & Conditions — W.H. Peters Outdoor Adventures",
  description:
    "Read the terms and conditions for booking and participating in guided kayak eco-tours with W.H. Peters Outdoor Adventures.",
};

const BUILDER_API_KEY = process.env.BUILDERIO_PUBLIC_API_KEY ?? "";

export default async function TermsPage({
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
        query: { "data.url": "/terms" },
        userAttributes: { urlPath: "/terms" },
      })
    : null;

  if (content) {
    return <BuilderContentWrapper content={content} apiKey={BUILDER_API_KEY} />;
  }

  return <LegalFallback title="Terms & Conditions" lastUpdated="March 2026" sections={TERMS_SECTIONS} />;
}

const TERMS_SECTIONS = [
  {
    heading: "1. Agreement to Terms",
    body: "By booking a tour or using our services, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not proceed with a booking.",
  },
  {
    heading: "2. Bookings & Payment",
    body: "All bookings are subject to availability. Full payment is required at the time of booking to confirm your reservation. We accept all major credit and debit cards via our secure Stripe payment processor.",
  },
  {
    heading: "3. Cancellations & Refunds",
    body: "Cancellations made 72 hours or more before the scheduled tour date will receive a full refund. Cancellations within 72 hours of the tour are non-refundable but may be rescheduled at our discretion, subject to availability. No-shows forfeit their full payment.",
  },
  {
    heading: "4. Weather & Safety",
    body: "Your safety is our top priority. We reserve the right to cancel or reschedule tours due to unsafe weather conditions, high winds, or other environmental factors. In such cases, you will receive a full refund or the option to reschedule at no additional cost.",
  },
  {
    heading: "5. Liability Release",
    body: "All participants must sign a liability release waiver before participating in any tour. Kayaking involves inherent risks. By joining a tour, you acknowledge and accept these risks. Children under 18 must have a parent or legal guardian co-sign the release form.",
  },
  {
    heading: "6. Participant Responsibilities",
    body: "Participants are responsible for disclosing any medical conditions, physical limitations, or swimming ability prior to the tour. Alcohol consumption before or during tours is strictly prohibited. We reserve the right to remove any participant whose behavior poses a safety risk.",
  },
  {
    heading: "7. Equipment",
    body: "All necessary equipment — including kayaks, paddles, and personal flotation devices — is provided. Participants are responsible for any damage to equipment caused by negligence or misuse.",
  },
  {
    heading: "8. Intellectual Property",
    body: "All content on this website, including photographs, text, and branding, is the property of W.H. Peters Outdoor Adventures and may not be reproduced without written permission.",
  },
  {
    heading: "9. Governing Law",
    body: "These terms are governed by the laws of the State of Maryland. Any disputes arising from these terms or your use of our services shall be resolved in the courts of Worcester County, Maryland.",
  },
  {
    heading: "10. Contact",
    body: "Questions about these terms? Email us at info@petersoutdoor.com or call 410-357-1025.",
  },
];

const PRIVACY_SECTIONS = TERMS_SECTIONS; // exported separately in privacy/page.tsx

function LegalFallback({
  title,
  lastUpdated,
  sections,
}: {
  title: string;
  lastUpdated: string;
  sections: { heading: string; body: string }[];
}) {
  return (
    <div className="bg-[#f5f0e8] min-h-screen">
      {/* Hero */}
      <div className="bg-forest py-16 px-6 text-center">
        <p className="text-gold text-xs font-bold uppercase tracking-widest mb-3">Legal</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">{title}</h1>
        <p className="text-white/60 text-sm mt-3">Last updated: {lastUpdated}</p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-14 space-y-10">
        {sections.map((s) => (
          <div key={s.heading}>
            <h2 className="font-serif text-lg font-bold text-forest mb-2">{s.heading}</h2>
            <p className="text-warm-gray leading-relaxed text-sm">{s.body}</p>
          </div>
        ))}

        <div className="border-t border-sage-muted/30 pt-8 text-center">
          <p className="text-xs text-warm-gray">
            Questions?{" "}
            <a href="mailto:info@petersoutdoor.com" className="text-forest underline">
              info@petersoutdoor.com
            </a>{" "}
            ·{" "}
            <a href="tel:410-357-1025" className="text-forest underline">
              410-357-1025
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

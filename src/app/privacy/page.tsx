import type { Metadata } from "next";
import { fetchOneEntry, getBuilderSearchParams } from "@builder.io/sdk-react";
import BuilderContentWrapper from "@/components/BuilderContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy Policy — W.H. Peters Outdoor Adventures",
  description:
    "Learn how W.H. Peters Outdoor Adventures collects, uses, and protects your personal information.",
};

const BUILDER_API_KEY = process.env.BUILDERIO_PUBLIC_API_KEY ?? "";

export default async function PrivacyPage({
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
        query: { "data.url": "/privacy" },
        userAttributes: { urlPath: "/privacy" },
      })
    : null;

  if (content) {
    return <BuilderContentWrapper content={content} apiKey={BUILDER_API_KEY} />;
  }

  return <LegalFallback title="Privacy Policy" lastUpdated="March 2026" sections={PRIVACY_SECTIONS} />;
}

const PRIVACY_SECTIONS = [
  {
    heading: "1. Information We Collect",
    body: "When you book a tour or contact us, we collect personal information such as your name, email address, phone number, and payment details. We also collect information you provide when signing liability waivers or subscribing to our newsletter.",
  },
  {
    heading: "2. How We Use Your Information",
    body: "We use your information to process bookings, send confirmation emails, communicate about your tour, and improve our services. With your consent, we may send you occasional newsletters about upcoming tours and special events. We do not sell your personal information to third parties.",
  },
  {
    heading: "3. Payment Information",
    body: "All payments are processed securely through Stripe. We do not store your credit card details on our servers. Stripe's privacy policy governs how payment data is handled. You can review it at stripe.com/privacy.",
  },
  {
    heading: "4. Cookies & Analytics",
    body: "Our website may use cookies and analytics tools to understand how visitors interact with our site. This helps us improve the user experience. You can disable cookies in your browser settings at any time.",
  },
  {
    heading: "5. Data Sharing",
    body: "We do not sell or rent your personal data. We may share information with trusted service providers (such as our email delivery and payment processors) solely to operate our business. All service providers are contractually obligated to protect your data.",
  },
  {
    heading: "6. Data Retention",
    body: "We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, and resolve disputes. You may request deletion of your data at any time by contacting us.",
  },
  {
    heading: "7. Your Rights",
    body: "You have the right to access, correct, or delete your personal information. To exercise these rights, email us at info@petersoutdoor.com. We will respond to your request within 30 days.",
  },
  {
    heading: "8. Children's Privacy",
    body: "Our services are not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.",
  },
  {
    heading: "9. Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the updated policy on this page with a revised date. Continued use of our services after changes constitutes acceptance of the updated policy.",
  },
  {
    heading: "10. Contact",
    body: "If you have any questions or concerns about this Privacy Policy, please contact us at info@petersoutdoor.com or call 410-357-1025.",
  },
];

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

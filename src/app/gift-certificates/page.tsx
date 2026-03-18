import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import GiftCertificateForm from "@/components/GiftCertificateForm";
import CheckBalanceModal from "@/components/CheckBalanceModal";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gift Certificates | W.H. Peters Outdoor Adventures",
  description:
    "Give the gift of adventure. Purchase a gift certificate for a guided kayak eco-tour on Maryland's Eastern Shore — perfect for any occasion.",
};

const howItWorks = [
  {
    step: "01",
    title: "Choose Your Amount",
    body: "Pick a denomination or enter a custom amount. Any tour, any date.",
  },
  {
    step: "02",
    title: "We Send the Certificate",
    body: "You'll receive a personalized PDF gift certificate by email within 24 hours.",
  },
  {
    step: "03",
    title: "Recipient Books Their Tour",
    body: "They pick their tour and date, then apply the certificate at checkout.",
  },
];

const occasions = [
  "Birthdays",
  "Anniversaries",
  "Holidays",
  "Graduations",
  "Mother's / Father's Day",
  "Corporate Gifts",
  "Just Because",
];

export default function GiftCertificatesPage() {
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

      {/* Intro */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="font-serif text-3xl font-bold text-forest mb-4">
              The Most Memorable Gift They'll Ever Receive
            </h2>
            <p className="text-warm-gray leading-relaxed">
              Skip the stuff. Give an experience they'll talk about for years. A W.H. Peters
              Outdoor Adventures gift certificate is redeemable for any tour, any date — no
              expiration.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {occasions.map((o) => (
                <span
                  key={o}
                  className="text-xs bg-forest/10 text-forest px-3 py-1.5 rounded-full font-medium"
                >
                  {o}
                </span>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {howItWorks.map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl p-7 border border-sage-muted/20 text-center"
              >
                <p className="text-gold font-bold text-3xl font-serif mb-3">{item.step}</p>
                <h3 className="font-semibold text-forest text-lg mb-2">{item.title}</h3>
                <p className="text-warm-gray text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          {/* Form + sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3">
              <GiftCertificateForm />
            </div>

            <div className="lg:col-span-2 space-y-5">
              {/* What's included */}
              <div className="bg-white rounded-2xl p-6 border border-sage-muted/20">
                <h3 className="font-semibold text-forest mb-4">What&rsquo;s Included</h3>
                <ul className="space-y-3 text-sm text-warm-gray">
                  {[
                    "Valid for any tour (Newport Bay, Pocomoke, Assateague, St. Martin, Sunset, Full Moon)",
                    "Redeemable for any available date",
                    "No expiration date",
                    "Transferable — gift it to anyone",
                    "All equipment provided (kayak, paddle, PFD)",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <svg
                        className="w-4 h-4 text-gold mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Denominations */}
              <div className="bg-forest/5 rounded-2xl p-6 border border-forest/10">
                <h3 className="font-semibold text-forest mb-3">Popular Amounts</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { label: "1 Standard Tour", amount: "$75" },
                    { label: "1 Premium Tour (Sunset or Full Moon)", amount: "$85" },
                    { label: "2 People, Standard Tour", amount: "$150" },
                    { label: "2 People, Premium Tour", amount: "$170" },
                  ].map((d) => (
                    <div
                      key={d.label}
                      className="flex justify-between items-center py-1.5 border-b border-forest/10 last:border-0"
                    >
                      <span className="text-warm-gray">{d.label}</span>
                      <span className="text-forest font-bold">{d.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Questions */}
              <div className="bg-white rounded-2xl p-6 border border-sage-muted/20 text-sm">
                <p className="text-forest font-semibold mb-1">Questions?</p>
                <p className="text-warm-gray mb-3">
                  We&rsquo;re happy to help you choose the right gift.
                </p>
                <a
                  href="mailto:info@petersoutdoor.com"
                  className="text-forest underline hover:text-forest/70 transition-colors"
                >
                  info@petersoutdoor.com
                </a>
                <span className="text-warm-gray mx-2">·</span>
                <a
                  href="tel:410-357-1025"
                  className="text-forest underline hover:text-forest/70 transition-colors"
                >
                  410-357-1025
                </a>
                <CheckBalanceModal />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-forest text-cream">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-sage-light mb-2 text-sm uppercase tracking-widest font-medium">
            Ready to Paddle?
          </p>
          <h2 className="font-serif text-3xl font-bold mb-4">Want to book a tour for yourself?</h2>
          <Link
            href="/booking"
            className="inline-block px-8 py-3 bg-gold text-forest font-semibold rounded-full hover:bg-gold-light transition-colors"
          >
            Book a Tour
          </Link>
        </div>
      </section>
    </>
  );
}

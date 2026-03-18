import Link from "next/link";

interface IncludedItem {
  value: string;
}

interface BookingContactSidebarProps {
  title?: string;
  description?: string;
  phone?: string;
  email?: string;
  whatsIncluded?: (string | IncludedItem)[];
  importantNote?: string;
}

function itemLabel(item: string | IncludedItem): string {
  return typeof item === "string" ? item : item.value;
}

const defaultIncluded = [
  "Kayak & paddle equipment",
  "Safety gear (PFDs)",
  "Expert naturalist guide",
  "Wildlife & ecology education",
  "Small group experience",
];

export default function BookingContactSidebar({
  title = "Ready to Paddle?",
  description = "Contact us to check availability, ask questions, or book your guided kayak eco-tour. We'll help you choose the perfect adventure.",
  phone = "410-357-1025",
  email = "info@petersoutdoor.com",
  whatsIncluded = defaultIncluded,
  importantNote = "All participants must sign a liability release form. Children under 18 require parent/guardian co-signature.",
}: BookingContactSidebarProps) {
  return (
    <div className="bg-forest text-cream rounded-2xl p-8 sticky top-32">
      <h3 className="font-serif text-2xl font-bold mb-6">{title}</h3>
      <p className="text-sage-light text-sm mb-8 leading-relaxed">{description}</p>

      <div className="space-y-4 mb-8">
        <a
          href={`tel:${phone}`}
          className="flex items-center gap-3 text-cream hover:text-gold transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-sage-light">Call us</p>
            <p className="font-semibold">{phone}</p>
          </div>
        </a>

        <a
          href={`mailto:${email}`}
          className="flex items-center gap-3 text-cream hover:text-gold transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-sage-light">Email us</p>
            <p className="font-semibold">{email}</p>
          </div>
        </a>
      </div>

      <div className="border-t border-sage/20 pt-6">
        <h4 className="font-semibold text-sm mb-3">What&apos;s Included</h4>
        <ul className="space-y-2 text-sage-light text-sm">
          {whatsIncluded.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {itemLabel(item)}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-sage/20 pt-6 mt-6">
        <h4 className="font-semibold text-sm mb-2">Important</h4>
        <p className="text-sage-light text-xs leading-relaxed">
          {importantNote}{" "}
          <Link href="/tours" className="text-gold hover:text-gold-light underline">
            View tour details
          </Link>
        </p>
      </div>
    </div>
  );
}

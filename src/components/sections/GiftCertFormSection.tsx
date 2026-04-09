import GiftCertificateForm from "@/components/GiftCertificateForm";
import CheckBalanceModal from "@/components/CheckBalanceModal";

interface IncludedItem {
  value: string;
}

interface Denomination {
  label: string;
  amount: string;
}

interface GiftCertFormSectionProps {
  whatsIncludedTitle?: string;
  whatsIncluded?: IncludedItem[];
  popularAmountsTitle?: string;
  popularAmounts?: Denomination[];
  questionsTitle?: string;
  questionsDescription?: string;
  email?: string;
  phone?: string;
}

const defaultIncluded = [
  "Valid for any tour (Newport Bay, Pocomoke, Assateague, St. Martin, Sunset, Full Moon)",
  "Redeemable for any available date",
  "No expiration date",
  "Transferable — gift it to anyone",
  "All equipment provided (kayak, paddle, PFD)",
];

const defaultPopularAmounts: Denomination[] = [
  { label: "1 Standard Tour", amount: "$75" },
  { label: "1 Premium Tour (Sunset or Full Moon)", amount: "$85" },
  { label: "2 People, Standard Tour", amount: "$150" },
  { label: "2 People, Premium Tour", amount: "$170" },
];

export default function GiftCertFormSection({
  whatsIncludedTitle = "What's Included",
  whatsIncluded,
  popularAmountsTitle = "Popular Amounts",
  popularAmounts,
  questionsTitle = "Questions?",
  questionsDescription = "We're happy to help you choose the right gift.",
  email = "info@petersoutdoor.com",
  phone = "410-357-1025",
}: GiftCertFormSectionProps) {
  const includedItems = whatsIncluded?.length
    ? whatsIncluded.map((i) => i.value)
    : defaultIncluded;
  const amounts = popularAmounts?.length ? popularAmounts : defaultPopularAmounts;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
      <div className="lg:col-span-3">
        <GiftCertificateForm />
      </div>

      <div className="lg:col-span-2 space-y-5">
        {/* What's included */}
        <div className="bg-white rounded-2xl p-6 border border-sage-muted/20">
          <h3 className="font-semibold text-forest mb-4">{whatsIncludedTitle}</h3>
          <ul className="space-y-3 text-sm text-warm-gray">
            {includedItems.map((item) => (
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
          <h3 className="font-semibold text-forest mb-3">{popularAmountsTitle}</h3>
          <div className="space-y-2 text-sm">
            {amounts.map((d) => (
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
          <p className="text-forest font-semibold mb-1">{questionsTitle}</p>
          <p className="text-warm-gray mb-3">{questionsDescription}</p>
          <a
            href={`mailto:${email}`}
            className="text-forest underline hover:text-forest/70 transition-colors"
          >
            {email}
          </a>
          <span className="text-warm-gray mx-2">&middot;</span>
          <a
            href={`tel:${phone}`}
            className="text-forest underline hover:text-forest/70 transition-colors"
          >
            {phone}
          </a>
          <CheckBalanceModal />
        </div>
      </div>
    </div>
  );
}

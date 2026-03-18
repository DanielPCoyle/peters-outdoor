interface InfoItem {
  text: string;
}

interface ToursImportantInfoSectionProps {
  title?: string;
  items?: (string | InfoItem)[];
}

function itemText(item: string | InfoItem): string {
  return typeof item === "string" ? item : item.text;
}

const defaultItems = [
  "All participants must sign an assumption of risk and release of liability form. Children under 18 must have a parent or legal guardian co-sign.",
  "Tours are easily accessible from Ocean City, Berlin, Snow Hill, Ocean Pines, Bishopville, Fenwick DE, and Selbyville DE.",
  "All tours are customizable. Dates, times, and locations can be adjusted to accommodate your group.",
  "Limited to 6 kayaks or 8 people (with tandem kayaks) per tour.",
];

export default function ToursImportantInfoSection({
  title = "Important Information",
  items = defaultItems,
}: ToursImportantInfoSectionProps) {
  return (
    <section className="py-16 bg-cream">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-sage-muted/20">
          <h3 className="font-serif text-2xl font-bold text-forest mb-4">{title}</h3>
          <ul className="space-y-3 text-warm-gray">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-sage mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {itemText(item)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

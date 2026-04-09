interface GiftCertIntroSectionProps {
  title?: string;
  description?: string;
  occasions?: { value: string }[];
}

const defaultOccasions = [
  "Birthdays",
  "Anniversaries",
  "Holidays",
  "Graduations",
  "Mother's / Father's Day",
  "Corporate Gifts",
  "Just Because",
];

export default function GiftCertIntroSection({
  title = "The Most Memorable Gift They'll Ever Receive",
  description = "Skip the stuff. Give an experience they'll talk about for years. A W.H. Peters Outdoor Adventures gift certificate is redeemable for any tour, any date — no expiration.",
  occasions,
}: GiftCertIntroSectionProps) {
  const items = occasions?.length ? occasions.map((o) => o.value) : defaultOccasions;

  return (
    <div className="max-w-2xl mx-auto text-center mb-16">
      <h2 className="font-serif text-3xl font-bold text-forest mb-4">{title}</h2>
      <p className="text-warm-gray leading-relaxed">{description}</p>
      <div className="flex flex-wrap justify-center gap-2 mt-6">
        {items.map((o) => (
          <span
            key={o}
            className="text-xs bg-forest/10 text-forest px-3 py-1.5 rounded-full font-medium"
          >
            {o}
          </span>
        ))}
      </div>
    </div>
  );
}

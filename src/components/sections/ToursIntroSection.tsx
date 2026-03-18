interface BadgeItem {
  value: string;
}

interface ToursIntroSectionProps {
  description?: string;
  badges?: (string | BadgeItem)[];
}

const defaultBadges = [
  "All skill levels welcome",
  "Max 6 kayaks / 8 people",
  "Customizable dates & times",
  "Equipment provided",
];

function badgeLabel(b: string | BadgeItem): string {
  return typeof b === "string" ? b : b.value;
}

export default function ToursIntroSection({
  description = "Join me for exhilarating kayak eco-tours led by an experienced, local naturalist and ACA certified coastal kayak instructor. Experience diverse ecosystems, learn about local wildlife and rich cultural history, all while enjoying the beauty of nature paddling through serene waters.",
  badges = defaultBadges,
}: ToursIntroSectionProps) {
  return (
    <section className="py-16 bg-cream">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-lg text-warm-gray leading-relaxed mb-6">{description}</p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          {badges.map((b, i) => (
            <span key={i} className="px-4 py-2 bg-sage-muted/30 text-forest rounded-full">
              {badgeLabel(b)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

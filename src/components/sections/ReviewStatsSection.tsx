interface StatItem {
  value: string;
  label: string;
}

interface ReviewStatsSectionProps {
  stats?: StatItem[];
}

const defaultStats: StatItem[] = [
  { value: "5.0", label: "Average Rating" },
  { value: "100%", label: "Would Recommend" },
  { value: "500+", label: "Happy Guests" },
];

export default function ReviewStatsSection({ stats = defaultStats }: ReviewStatsSectionProps) {
  return (
    <section className="bg-forest text-cream py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-3 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <p className="font-serif text-3xl md:text-4xl font-bold text-gold">
                {stat.value}
              </p>
              <p className="text-sage-light text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

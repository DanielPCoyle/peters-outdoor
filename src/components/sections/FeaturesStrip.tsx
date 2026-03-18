export type FeatureIconType = "certified" | "naturalist" | "smallGroup" | "sunset";

export interface Feature {
  iconType: FeatureIconType;
  title: string;
  description: string;
}

interface FeaturesStripProps {
  features?: Feature[];
}

const iconMap: Record<FeatureIconType, React.ReactNode> = {
  certified: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  naturalist: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  smallGroup: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  sunset: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
};

const defaultFeatures: Feature[] = [
  {
    iconType: "certified",
    title: "ACA Certified",
    description: "Level 1 Certified Kayak Instructor ensuring your safety and learning on every tour.",
  },
  {
    iconType: "naturalist",
    title: "Local Naturalist",
    description: "Deep knowledge of local ecosystems, wildlife, and the cultural history of Maryland's Eastern Shore.",
  },
  {
    iconType: "smallGroup",
    title: "Small Groups",
    description: "Limited to 6 kayaks (8 people max) for a personal, intimate experience on the water.",
  },
  {
    iconType: "sunset",
    title: "Sunset & Full Moon",
    description: "Special sunset tours daily and full moon tours monthly for magical experiences on the water.",
  },
];

export default function FeaturesStrip({ features = defaultFeatures }: FeaturesStripProps) {
  return (
    <section className="bg-forest text-cream py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage/20 text-sage-light mb-4">
                {iconMap[feature.iconType]}
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sage-light text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

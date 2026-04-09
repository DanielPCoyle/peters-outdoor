interface Step {
  step: string;
  title: string;
  body: string;
}

interface GiftCertHowItWorksSectionProps {
  steps?: Step[];
}

const defaultSteps: Step[] = [
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

export default function GiftCertHowItWorksSection({
  steps,
}: GiftCertHowItWorksSectionProps) {
  const items = steps?.length ? steps : defaultSteps;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
      {items.map((item) => (
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
  );
}

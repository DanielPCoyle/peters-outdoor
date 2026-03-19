interface Section {
  heading: string;
  body: string;
}

interface LegalPageProps {
  title?: string;
  lastUpdated?: string;
  sections?: Section[];
}

export default function LegalPage({
  title = "Legal",
  lastUpdated,
  sections = [],
}: LegalPageProps) {
  return (
    <div className="bg-[#f5f0e8] min-h-screen">
      {/* Hero */}
      <div className="bg-forest py-16 px-6 text-center">
        <p className="text-gold text-xs font-bold uppercase tracking-widest mb-3">Legal</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">{title}</h1>
        {lastUpdated && (
          <p className="text-white/60 text-sm mt-3">Last updated: {lastUpdated}</p>
        )}
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-14 space-y-10">
        {sections.map((s, i) => (
          <div key={i}>
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

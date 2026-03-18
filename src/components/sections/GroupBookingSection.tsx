interface PerkItem {
  label: string;
}

interface GroupBookingSectionProps {
  sidebar?: boolean;
  eyebrow?: string;
  title?: string;
  description?: string;
  perks?: (string | PerkItem)[];
  emailLabel?: string;
  email?: string;
  phone?: string;
}

function perkLabel(p: string | PerkItem): string {
  return typeof p === "string" ? p : p.label;
}

const defaultPerks: PerkItem[] = [
  { label: "Private guided tour — just your group" },
  { label: "Flexible route, date, and start time" },
  { label: "Perfect for corporate team building" },
  { label: "Celebrations, reunions, bachelorette parties" },
];

const PerkIcon = () => (
  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

export default function GroupBookingSection({
  sidebar = false,
  eyebrow = "Groups & Corporate",
  title = "Planning a Group Adventure?",
  description = "Whether it's a corporate outing, family reunion, birthday paddle, or team-building retreat — we'll customize every detail for your group. Private tours, flexible scheduling, and group pricing available for parties of 9 or more.",
  perks = defaultPerks,
  emailLabel = "Email Us for Group Pricing",
  email = "info@petersoutdoor.com",
  phone = "410-357-1025",
}: GroupBookingSectionProps) {
  if (sidebar) {
    return (
      <div className="bg-forest text-cream rounded-3xl p-6">
        <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">
          {eyebrow}
        </p>
        <h2 className="font-serif text-xl font-bold mb-3">{title}</h2>
        <p className="text-sage-light text-sm leading-relaxed mb-5">{description}</p>

        <div className="grid grid-cols-1 gap-3 mb-5">
          {perks.map((p, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 border border-white/10">
              <span className="text-gold shrink-0"><PerkIcon /></span>
              <p className="text-cream text-xs font-medium leading-snug">{perkLabel(p)}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <a
            href={`mailto:${email}?subject=Group%20Booking%20Inquiry`}
            className="px-5 py-2.5 bg-gold text-forest font-semibold text-sm rounded-full hover:bg-gold-light transition-colors text-center"
          >
            {emailLabel}
          </a>
          <a
            href={`tel:${phone}`}
            className="px-5 py-2.5 border border-cream/30 text-cream font-semibold text-sm rounded-full hover:bg-cream/10 transition-colors text-center"
          >
            Call {phone}
          </a>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-forest text-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">
              {eyebrow}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            <p className="text-sage-light leading-relaxed mb-6">{description}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`mailto:${email}?subject=Group%20Booking%20Inquiry`}
                className="px-7 py-3 bg-gold text-forest font-semibold text-sm rounded-full hover:bg-gold-light transition-colors text-center"
              >
                {emailLabel}
              </a>
              <a
                href={`tel:${phone}`}
                className="px-7 py-3 border border-cream/30 text-cream font-semibold text-sm rounded-full hover:bg-cream/10 transition-colors text-center"
              >
                Call {phone}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {perks.map((p, i) => (
              <div key={i} className="bg-white/10 rounded-2xl p-5 border border-white/10">
                <span className="text-gold block mb-2"><PerkIcon /></span>
                <p className="text-cream text-sm font-medium leading-snug">{perkLabel(p)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";

export const metadata: Metadata = {
  title: "Growth Retainer Proposal | W.H. Peters Outdoor Adventures",
  description:
    "A $500/month partnership to grow bookings, tighten operations, and keep the site bulletproof.",
  robots: { index: false, follow: false },
};

interface DeliverableItem {
  title: string;
  body: string;
  icon: string;
}

interface DeliverableGroup {
  eyebrow: string;
  title: string;
  body: string;
  icon: string;
  items: DeliverableItem[];
}

const deliverables: DeliverableGroup[] = [
  {
    eyebrow: "Project Management",
    title: "Always know what I’m working on",
    body: "Every task, every priority, every shipped feature — visible to both of us in one place. No chasing, no guessing, no “did you get my email?”",
    icon: "view_kanban",
    items: [
      {
        icon: "dashboard",
        title: "Shared kanban board on SimplerDevelopment.com",
        body: "A live board with columns for Backlog → Up Next → In Progress → Shipped. You can add requests anytime, see exactly what I’m working on, and watch things move across the board in real time.",
      },
      {
        icon: "assignment_ind",
        title: "Dedicated project management",
        body: "I own the roadmap, prioritization, and sequencing — so you don’t have to manage me. You share ideas; I turn them into scoped, ordered tasks on the board.",
      },
      {
        icon: "event",
        title: "Weekly and monthly check-ins",
        body: "A short weekly pulse on what’s in flight plus a monthly review of what shipped, what it did for the business, and what’s coming next.",
      },
    ],
  },
  {
    eyebrow: "Marketing & Content",
    title: "Turn the site into a booking engine",
    body: "The site already converts — these pieces squeeze more out of every visitor and bring more of them in.",
    icon: "campaign",
    items: [
      {
        icon: "web",
        title: "Tour-specific marketing pages",
        body: "Each tour gets its own dedicated landing page — keyword-targeted copy, tour-specific photo galleries, guide bios, seasonal highlights, and a focused booking CTA. Built for Google to rank individually and for paid ads to point at directly.",
      },
      {
        icon: "article",
        title: "Blog & FAQ in CMS",
        body: "Builder.io-powered blog and FAQ so you can publish seasonal posts (\"best time to see dolphins\", \"what to wear in October\") that earn local search traffic all year.",
      },
      {
        icon: "mail",
        title: "Per-tour email templates",
        body: "Confirmation, pre-tour prep, and post-tour thank-you emails tailored to each tour — not one generic template.",
      },
      {
        icon: "notifications_active",
        title: "Reminder emails",
        body: "Automatic 24-hour and 2-hour reminders with meeting location, parking, and what to bring.",
      },
      {
        icon: "sms",
        title: "SMS text reminders",
        body: "Twilio-powered text reminders. The single highest-impact change for reducing no-shows.",
      },
      {
        icon: "card_giftcard",
        title: "Referral code logic",
        body: "Extend the existing discount code system so each guest gets a personal referral code — guests bring guests.",
      },
      {
        icon: "star",
        title: "Post-tour review requests",
        body: "Automatic email asking happy guests for a Google review, two days after their tour.",
      },
    ],
  },
  {
    eyebrow: "Guest Experience",
    title: "Make the site feel like a concierge",
    body: "Small touches that turn one-time bookers into repeat customers and word-of-mouth referrers.",
    icon: "favorite",
    items: [
      {
        icon: "account_circle",
        title: "Customer accounts",
        body: "Booking history, one-click rebook, downloadable waivers and receipts, and a place to track their referral rewards.",
      },
      {
        icon: "partly_cloudy_day",
        title: "Weather-aware tour-day emails",
        body: "Morning-of email pulls the day's forecast and sends a \"what to bring today\" note — sunscreen, rain shell, extra layer.",
      },
    ],
  },
  {
    eyebrow: "Admin & Operations",
    title: "Run the business in less time",
    body: "Tools that take the busywork off your plate so you can focus on guests and the water.",
    icon: "settings",
    items: [
      {
        icon: "table_view",
        title: "CSV exports",
        body: "Export orders, waivers, subscribers, and gift certificates for accounting, insurance, and marketing.",
      },
      {
        icon: "event_repeat",
        title: "Refund & reschedule workflows",
        body: "Handle changes directly from the admin — no more logging into Stripe and crossing your fingers.",
      },
      {
        icon: "edit_note",
        title: "Internal notes",
        body: "Private notes per customer and per booking — allergies, accessibility needs, repeat-guest flags.",
      },
    ],
  },
  {
    eyebrow: "Ops & Security",
    title: "Keep it bulletproof",
    body: "The stuff you don't notice until it breaks. Set it up once, sleep well forever.",
    icon: "shield",
    items: [
      {
        icon: "science",
        title: "Staging environment",
        body: "A private copy of the site where every change gets tested first — with real data but no real customers. You can preview new features before they ever touch production.",
      },
      {
        icon: "rocket_launch",
        title: "Safe production deployments",
        body: "Nothing goes to the live site until it passes on staging. Every deploy is versioned, reversible, and logged — so a bad change can be rolled back in minutes, not hours.",
      },
      {
        icon: "bug_report",
        title: "Sentry error monitoring",
        body: "The moment something breaks on the site, I know about it — usually before any guest does.",
      },
      {
        icon: "cloud_sync",
        title: "Automated DB backups & recovery",
        body: "Nightly off-site backups and a documented restore procedure. Proven, not promised.",
      },
    ],
  },
];

const includedBullets: { icon: string; label: string }[] = [
  { icon: "code", label: "Active development on the feature roadmap below" },
  { icon: "trending_up", label: "Onsite technical SEO monitoring and improvements" },
  {
    icon: "view_kanban",
    label: "Dedicated project management + SimplerDevelopment.com kanban board",
  },
  {
    icon: "rocket_launch",
    label: "Staging environment with safe, reversible production deploys",
  },
  { icon: "shield", label: "Error monitoring, backups, and security patching" },
  { icon: "bolt", label: "Priority response on anything urgent" },
  { icon: "summarize", label: "Monthly summary of what shipped and what’s next" },
];

const seoItems: { icon: string; label: string }[] = [
  {
    icon: "speed",
    label: "Monthly technical SEO audit (Core Web Vitals, crawl errors, broken links)",
  },
  { icon: "data_object", label: "Per-tour schema.org structured data for rich Google results" },
  { icon: "travel_explore", label: "Sitemap + robots monitoring and automatic regeneration" },
  { icon: "image", label: "Image optimization and alt-text coverage" },
  { icon: "link", label: "Internal linking between blog posts, tours, and landing pages" },
  { icon: "storefront", label: "Google Business Profile monitoring and post updates" },
];

const howItWorks: { step: string; icon: string; title: string; body: string }[] = [
  {
    step: "01",
    icon: "add_task",
    title: "Add it to the board",
    body: "Every idea, request, or bug goes on the shared SimplerDevelopment.com kanban board. Nothing gets lost, and we’re always looking at the same list.",
  },
  {
    step: "02",
    icon: "deployed_code",
    title: "I prioritize and ship",
    body: "I sequence the work, keep the board up to date, and ship in small, safe increments. You can watch cards move across the board in real time.",
  },
  {
    step: "03",
    icon: "insights",
    title: "Weekly + monthly check-ins",
    body: "Short weekly pulse on what’s in flight. End-of-month review of what shipped, what it did for the business, and what’s queued up next.",
  },
];

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

export default function PitchPage() {
  return (
    <>
      {/* Material Symbols font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />

      <div style={{ height: "55vh", minHeight: "420px" }}>
        <PageHero
          eyebrow="Growth Retainer Proposal"
          title="$500/month. Real outcomes."
          imageUrl="https://static.wixstatic.com/media/5768ba_3bc8f28567d84fdbba85e29534c0e859~mv2.jpg/v1/fill/w_1920,h_800,al_c,q_85,enc_avif,quality_auto/5768ba_3bc8f28567d84fdbba85e29534c0e859~mv2.jpg"
          imageAlt="Kayaking through the cypress swamp"
        />
      </div>

      {/* Overview */}
      <section className="bg-cream py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-sage text-sm font-medium tracking-[0.3em] uppercase mb-4">
            The Partnership
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-forest mb-6">
            A single monthly retainer to grow bookings and keep the site sharp.
          </h2>
          <p className="text-warm-gray text-lg leading-relaxed">
            Right now the site works. This proposal is about what comes next — the features that turn visitors into guests, guests into regulars, and regulars into referrers. Plus the quiet infrastructure work that protects everything you&rsquo;ve built.
          </p>
        </div>
      </section>

      {/* Headline price card */}
      <section className="bg-cream pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-forest text-cream rounded-3xl p-10 md:p-14 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
              <div className="md:col-span-1 text-center md:text-left">
                <p className="text-sage-light text-sm font-medium tracking-[0.3em] uppercase mb-3">
                  Monthly Retainer
                </p>
                <p className="font-serif text-6xl md:text-7xl font-bold text-gold-light leading-none">
                  $500
                </p>
                <p className="text-sage-light mt-2">per month</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="font-serif text-2xl md:text-3xl font-bold mb-4">
                  What&rsquo;s included every month
                </h3>
                <ul className="space-y-3 text-sage-light">
                  {includedBullets.map((b) => (
                    <li key={b.label} className="flex gap-3 items-start">
                      <Icon name={b.icon} className="text-gold-light shrink-0" />
                      <span className="leading-snug pt-0.5">{b.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables — grouped */}
      <section className="bg-cream-dark py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sage text-sm font-medium tracking-[0.3em] uppercase mb-4">
              The Roadmap
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-forest">
              What we&rsquo;ll build, in order of impact
            </h2>
          </div>

          <div className="space-y-16">
            {deliverables.map((group) => (
              <div key={group.title}>
                <div className="max-w-2xl mb-8 flex items-start gap-5">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-forest text-gold-light shrink-0">
                    <Icon name={group.icon} className="text-3xl" />
                  </div>
                  <div>
                    <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-2">
                      {group.eyebrow}
                    </p>
                    <h3 className="font-serif text-3xl font-bold text-forest mb-3">
                      {group.title}
                    </h3>
                    <p className="text-warm-gray leading-relaxed">{group.body}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {group.items.map((item) => (
                    <div
                      key={item.title}
                      className="bg-white rounded-2xl p-6 border border-sage-muted/30"
                    >
                      <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-sage-muted/40 text-forest mb-4">
                        <Icon name={item.icon} className="text-2xl" />
                      </div>
                      <h4 className="font-semibold text-forest text-lg mb-2">
                        {item.title}
                      </h4>
                      <p className="text-warm-gray text-sm leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO block */}
      <section className="bg-cream py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-sage text-sm font-medium tracking-[0.3em] uppercase mb-4">
                Always-On SEO
              </p>
              <h2 className="font-serif text-4xl font-bold text-forest mb-5">
                Onsite technical SEO, month after month.
              </h2>
              <p className="text-warm-gray leading-relaxed mb-4">
                Search is the quietest, cheapest way to fill a tour. It doesn&rsquo;t happen from one audit — it happens from steady attention. Every month of the retainer includes:
              </p>
              <ul className="space-y-3">
                {seoItems.map((item) => (
                  <li key={item.label} className="flex gap-3 text-forest items-start">
                    <Icon name={item.icon} className="text-gold shrink-0" />
                    <span className="leading-snug pt-0.5">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-forest text-cream rounded-3xl p-8 md:p-10">
              <p className="text-gold-light text-xs font-semibold tracking-[0.3em] uppercase mb-4">
                Recommended Add-On
              </p>
              <div className="flex items-center gap-3 mb-4">
                <Icon name="query_stats" className="text-gold-light text-4xl" />
                <h3 className="font-serif text-3xl font-bold">
                  Add the SEMrush Pro plan
                </h3>
              </div>
              <p className="text-sage-light leading-relaxed mb-6">
                SEMrush is the industry-standard SEO toolkit. On the Pro plan you get keyword research, competitor tracking, rank monitoring, and site audits — the data I&rsquo;ll use every month to decide what to work on next.
              </p>
              <div className="bg-forest-light rounded-2xl p-5 mb-6">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sage-light text-sm">SEMrush Pro</span>
                  <span className="font-serif text-2xl font-bold text-gold-light">
                    ~$140/mo
                  </span>
                </div>
                <p className="text-sage-light text-xs">
                  Billed directly to you by SEMrush. Cancel anytime.
                </p>
              </div>
              <p className="text-sage-light text-sm leading-relaxed">
                Without it we&rsquo;re guessing at what to rank for. With it, every blog post and tour page targets a keyword we know has real local search demand.
              </p>
            </div>
          </div>

          {/* Total line */}
          <div className="mt-12 bg-cream-dark rounded-2xl p-6 md:p-8 border border-sage-muted/40">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left items-center">
              <div>
                <p className="text-xs text-warm-gray uppercase tracking-widest mb-1">
                  Retainer
                </p>
                <p className="font-serif text-2xl font-bold text-forest">
                  $500<span className="text-base text-warm-gray">/mo</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-warm-gray uppercase tracking-widest mb-1">
                  SEMrush Pro (optional)
                </p>
                <p className="font-serif text-2xl font-bold text-forest">
                  ~$140<span className="text-base text-warm-gray">/mo</span>
                </p>
              </div>
              <div className="md:border-l md:border-sage-muted md:pl-6">
                <p className="text-xs text-gold uppercase tracking-widest mb-1 font-semibold">
                  All-In Monthly
                </p>
                <p className="font-serif text-3xl font-bold text-forest">
                  ~$640<span className="text-base text-warm-gray">/mo</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-cream-dark py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sage text-sm font-medium tracking-[0.3em] uppercase mb-4">
              How It Works
            </p>
            <h2 className="font-serif text-4xl font-bold text-forest">
              Simple, month to month.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorks.map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl p-7 border border-sage-muted/20 text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-forest text-gold-light mb-4">
                  <Icon name={item.icon} className="text-3xl" />
                </div>
                <p className="text-gold font-bold text-xl font-serif mb-2">{item.step}</p>
                <h3 className="font-semibold text-forest text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-warm-gray text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Close */}
      <section className="bg-forest text-cream py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-sage-light text-sm font-medium tracking-[0.3em] uppercase mb-4">
            Let&rsquo;s Go
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Ready when you are.
          </h2>
          <p className="text-sage-light text-lg leading-relaxed mb-10">
            If this lines up with where you want to take the business, we can start the first work cycle as soon as next week. Happy to walk through any of it live.
          </p>
          <a
            href="mailto:info@danielpcoyle.com?subject=Peters%20Outdoor%20Retainer"
            className="inline-flex items-center gap-2 bg-gold text-forest font-semibold px-8 py-4 rounded-full hover:bg-gold-light transition-colors"
          >
            <Icon name="mail" />
            Start the conversation
          </a>
        </div>
      </section>
    </>
  );
}

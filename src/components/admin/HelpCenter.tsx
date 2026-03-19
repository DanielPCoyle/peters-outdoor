"use client";

import { useState, useMemo } from "react";

interface Article {
  id: string;
  category: string;
  title: string;
  content: Section[];
}

interface Section {
  type: "para" | "heading" | "steps" | "tip" | "warning" | "table";
  text?: string;
  items?: string[];
  rows?: { label: string; value: string }[];
}

const ARTICLES: Article[] = [
  // ─── Dashboard ───────────────────────────────────────────────────────────
  {
    id: "dashboard-overview",
    category: "Dashboard",
    title: "Understanding the Dashboard",
    content: [
      { type: "para", text: "The Dashboard is your home base. It shows a snapshot of this month's revenue, a calendar of upcoming booked tours, and gift certificate stats." },
      { type: "heading", text: "Revenue Cards" },
      { type: "para", text: "The five revenue cards at the top break down this month's income by source:" },
      {
        type: "table",
        rows: [
          { label: "Total", value: "Sum of all revenue sources for the current month" },
          { label: "Orders", value: "Revenue from regular tour bookings via the booking page" },
          { label: "Private Tours", value: "Revenue from paid private / corporate tours" },
          { label: "Gift Certificates", value: "Certificate value sold this month" },
          { label: "Add-ons", value: "Extra add-on revenue included within orders" },
        ],
      },
      { type: "heading", text: "Booked Tours Calendar" },
      { type: "para", text: "The calendar shows every tour date that has at least one confirmed booking. Click a date to see which tours are running." },
      { type: "heading", text: "Gift Certificate Stats" },
      { type: "para", text: "Active certificates are ones that have been paid for but not yet redeemed. The outstanding balance shows the total dollar value you owe guests in future tour credit." },
    ],
  },

  // ─── Tours ───────────────────────────────────────────────────────────────
  {
    id: "tours-create",
    category: "Tours",
    title: "Creating & Editing Tours",
    content: [
      { type: "para", text: "Tours are the core products guests book. Each tour has a name, description, pricing, photos, and available time slots." },
      { type: "heading", text: "Creating a Tour" },
      {
        type: "steps",
        items: [
          "Go to Tours in the sidebar.",
          "Click \"New Tour\" in the top-right.",
          "Fill in the Title, Description, Max Guests, Price Per Person, and upload an Image.",
          "Toggle \"Active\" to make the tour visible on the booking page.",
          "Click Save.",
        ],
      },
      { type: "heading", text: "Editing a Tour" },
      { type: "para", text: "Click any tour card to open the full tour editor. From here you can update any field and manage time slots (see the Time Slots article)." },
      { type: "tip", text: "The image you upload here appears on the booking calendar when a guest selects this tour. Use a wide, landscape photo for best results." },
      { type: "heading", text: "Deactivating a Tour" },
      { type: "para", text: "Toggle \"Active\" off to hide a tour from the public booking page without deleting it. All existing bookings are unaffected." },
    ],
  },
  {
    id: "tours-timeslots",
    category: "Tours",
    title: "Managing Time Slots",
    content: [
      { type: "para", text: "Time slots define the specific dates and times guests can book a tour. Each slot has a date, start time, max guests, and a price override (optional)." },
      { type: "heading", text: "Adding a Time Slot" },
      {
        type: "steps",
        items: [
          "Open a tour by clicking it in Tours.",
          "Scroll to the Time Slots panel.",
          "Click \"Add Slot\".",
          "Enter the Date, Start Time, and Max Guests.",
          "Leave Price Override blank to use the tour's default price, or enter a specific amount for this slot.",
          "Click Save.",
        ],
      },
      { type: "heading", text: "Blocking a Date" },
      { type: "para", text: "To block a date (e.g. for a private event), set its Max Guests to 0. The date will still appear on the calendar but won't accept bookings." },
      { type: "tip", text: "If a tour has no time slots at all, the calendar on the booking page will show a blurred overlay with a \"Request a Date\" button, allowing guests to reach out directly." },
      { type: "heading", text: "Calendar Smart Navigation" },
      { type: "para", text: "When a guest selects a tour on the booking page, the calendar automatically jumps to the month of the next available slot so they don't have to scroll." },
    ],
  },
  {
    id: "tours-addons",
    category: "Tours",
    title: "Managing Add-ons",
    content: [
      { type: "para", text: "Add-ons are optional extras guests can purchase during checkout — for example, a photography package or gear rental." },
      { type: "heading", text: "Creating an Add-on" },
      {
        type: "steps",
        items: [
          "Go to Tours → Add-ons in the sidebar.",
          "Click \"New Add-on\".",
          "Enter a Name, Description, and Price.",
          "Select which tours this add-on applies to, or leave unselected to apply to all tours.",
          "Click Save.",
        ],
      },
      { type: "heading", text: "Add-on Revenue" },
      { type: "para", text: "Add-on revenue is tracked separately in the Dashboard revenue cards and in the Orders analytics chart under \"Add-ons\"." },
    ],
  },

  // ─── Orders ──────────────────────────────────────────────────────────────
  {
    id: "orders-overview",
    category: "Orders",
    title: "Viewing & Filtering Orders",
    content: [
      { type: "para", text: "The Orders page shows every completed booking — both regular tour bookings and paid private tours — sorted newest first." },
      { type: "heading", text: "Filters" },
      {
        type: "table",
        rows: [
          { label: "Period", value: "Filter orders by the last 7 days, 30 days, 90 days, 1 year, or all time." },
          { label: "Tour", value: "Narrow results to a specific tour." },
        ],
      },
      { type: "heading", text: "Order Types" },
      { type: "para", text: "Orders show a badge to indicate their type:" },
      {
        type: "table",
        rows: [
          { label: "Private Charter", value: "A full-boat private charter booked through the regular booking flow." },
          { label: "Private Tour", value: "A custom one-off tour created in the Private Tours admin screen." },
        ],
      },
      { type: "heading", text: "Expanding an Order" },
      { type: "para", text: "Click any order row to expand it and view the guest's email, phone, tour date, notes, and a direct link to the Stripe payment." },
      { type: "heading", text: "Analytics Chart" },
      { type: "para", text: "The chart above the list visualises revenue, order count, and guest count over the selected time period. Yearly and all-time views bucket data by week." },
    ],
  },

  // ─── Private Tours ───────────────────────────────────────────────────────
  {
    id: "private-tours-create",
    category: "Private Tours",
    title: "Creating a Private / Corporate Tour",
    content: [
      { type: "para", text: "Private tours are custom one-off bookings for individuals or corporate groups. You create the tour, set the price, and share a branded payment link directly with the client." },
      { type: "heading", text: "Creating a Tour" },
      {
        type: "steps",
        items: [
          "Go to Tours → Private Tours in the sidebar.",
          "Click \"New Private Tour\".",
          "Fill in the client's name and email.",
          "Enter the tour title, date, time, number of guests, and total price.",
          "Optionally add a meeting location, description, and any internal notes (not shown to the client).",
          'Click "Create & Get Link".',
        ],
      },
      { type: "heading", text: "Sharing the Payment Link" },
      { type: "para", text: "After creating the tour, click \"Copy Link\" on the tour row. Send this URL to your client — it opens a branded booking page where they can review the details and pay via Stripe." },
      { type: "tip", text: "You can also click \"Preview\" to see exactly what the client will see before sending the link." },
      { type: "heading", text: "Tracking Payment" },
      { type: "para", text: "Once the client pays, the tour status changes from Pending to Paid. Confirmation emails are sent automatically to both you and the client. Paid private tours also appear in the Orders page and count toward Dashboard revenue." },
    ],
  },

  // ─── Gift Certificates ───────────────────────────────────────────────────
  {
    id: "gift-certs-overview",
    category: "Gift Certificates",
    title: "Managing Gift Certificates",
    content: [
      { type: "para", text: "Guests can purchase gift certificates from the public Gift Certificates page. Once paid, the recipient receives an email with a unique code they can use when booking." },
      { type: "heading", text: "Certificate Statuses" },
      {
        type: "table",
        rows: [
          { label: "Pending Payment", value: "The guest started checkout but hasn't completed payment yet." },
          { label: "Active", value: "Payment confirmed. The certificate has been emailed to the recipient and is ready to use." },
          { label: "Redeemed", value: "The certificate has been used toward a tour booking." },
        ],
      },
      { type: "heading", text: "Marking a Certificate as Redeemed" },
      {
        type: "steps",
        items: [
          "Find the certificate in the Active tab.",
          'Expand the row and click "Mark Redeemed".',
          "The status updates immediately and the redemption date is recorded.",
        ],
      },
      { type: "heading", text: "Resending a Certificate Email" },
      { type: "para", text: "If a recipient didn't receive their certificate, click the email icon on any Active certificate row to resend it." },
      { type: "heading", text: "Outstanding Balance" },
      { type: "para", text: "The outstanding balance bar shows the total dollar value of all Active (unredeemed) certificates — this is money owed to guests in future tour credit." },
    ],
  },

  // ─── Check-In ────────────────────────────────────────────────────────────
  {
    id: "checkin-overview",
    category: "Guest Check-In",
    title: "Using Guest Check-In",
    content: [
      { type: "para", text: "The Check-In screen is designed for use at the dock. It lets you look up a guest's booking and mark them as checked in using their confirmation code." },
      { type: "heading", text: "Checking In a Guest" },
      {
        type: "steps",
        items: [
          "Open /admin/checkin on your phone or tablet.",
          "Ask the guest for their confirmation code (included in their booking email).",
          "Enter the code into the search box.",
          "Their booking details will appear — verify their name and tour date.",
          "Click \"Check In\" to mark them as arrived.",
        ],
      },
      { type: "tip", text: "The check-in page works great as a home screen shortcut on your phone. In Safari, tap Share → Add to Home Screen." },
      { type: "heading", text: "Confirmation Codes" },
      { type: "para", text: "Each booking has a unique confirmation code that is emailed to the guest automatically after payment. Codes are alphanumeric and case-insensitive." },
    ],
  },

  // ─── Waivers ─────────────────────────────────────────────────────────────
  {
    id: "waivers-overview",
    category: "Waivers",
    title: "Managing Guest Waivers",
    content: [
      { type: "para", text: "All guests must sign a liability waiver before their tour. The Waivers page gives you a QR code to display at the dock and a full log of everyone who has signed." },
      { type: "heading", text: "Collecting Waivers" },
      {
        type: "steps",
        items: [
          "Print or display the QR code from the Waivers page at your launch site.",
          "Guests scan it with their phone camera.",
          "They fill in their name, email, and tour date, then sign digitally.",
          "Their signature appears instantly in the Waivers log.",
        ],
      },
      { type: "heading", text: "Searching Waivers" },
      { type: "para", text: "Use the search box to find a waiver by guest name, email, or tour date. Useful for quickly confirming a signature at the dock." },
      { type: "heading", text: "Editing the Waiver Content" },
      {
        type: "steps",
        items: [
          "Click \"Edit Waiver\" on the Waivers page.",
          "A full-screen rich text editor opens.",
          "Use the toolbar to format headings, bold text, bullet lists, etc.",
          "Click \"Save Changes\" when done.",
          "The updated text goes live on the public waiver page immediately.",
        ],
      },
      { type: "warning", text: "Have any changes to the waiver text reviewed by a legal professional before publishing, especially changes to the liability release clauses." },
    ],
  },

  // ─── Newsletter ──────────────────────────────────────────────────────────
  {
    id: "newsletter-overview",
    category: "Newsletter",
    title: "Managing Newsletter Subscribers",
    content: [
      { type: "para", text: "Anyone who fills in the newsletter sign-up in the website footer is added to your subscriber list automatically." },
      { type: "heading", text: "Viewing Subscribers" },
      { type: "para", text: "Go to Newsletter in the sidebar. The list shows every subscriber's email and sign-up date. Use the search box to find a specific address." },
      { type: "heading", text: "Exporting to CSV" },
      {
        type: "steps",
        items: [
          "Click \"Export CSV\" in the top-right of the subscriber list.",
          "A CSV file downloads immediately with two columns: Email and Signed Up date.",
          "Import this file into Mailchimp, Klaviyo, or any email marketing platform.",
        ],
      },
      { type: "heading", text: "Removing a Subscriber" },
      { type: "para", text: "Click the trash icon on any subscriber row to remove them. This cannot be undone." },
      { type: "tip", text: "The stats at the top show total subscribers and how many signed up this month — a useful growth indicator." },
    ],
  },

  // ─── Website Content ─────────────────────────────────────────────────────
  {
    id: "content-builderio",
    category: "Website Content",
    title: "Editing Page Content with Builder.io",
    content: [
      { type: "para", text: "The public website pages (Home, Tours, About, Booking, Gallery, Reviews, Terms, Privacy) are managed through Builder.io — a visual CMS that lets you edit content without touching code." },
      { type: "heading", text: "Accessing Builder.io" },
      {
        type: "steps",
        items: [
          'Click "Builder.io CMS" in the sidebar under External.',
          "Log in at builder.io if prompted.",
          'Click "Content" in the top nav, then select "Page" as the model.',
          "You'll see a list of all editable pages.",
        ],
      },
      { type: "heading", text: "Editing a Page" },
      {
        type: "steps",
        items: [
          'Click a page name (e.g. "Home") to open the visual editor.',
          "Click any section on the canvas to select it.",
          "Edit text, images, and settings in the right-hand panel.",
          "Click \"Publish\" in the top-right when you're happy with the changes.",
          "Your changes go live on the website within seconds.",
        ],
      },
      { type: "heading", text: "Editable Sections" },
      {
        type: "table",
        rows: [
          { label: "HomeHero", value: "The full-screen hero on the home page — headline, tagline, CTA buttons, and background image." },
          { label: "PageHero", value: "The hero banner at the top of interior pages." },
          { label: "FeaturedToursSection", value: "The tour cards grid on the home page." },
          { label: "TestimonialsSection", value: "Customer quotes and the Reviews CTA." },
          { label: "AboutPurposeSection / AboutStorySection", value: "Text blocks on the About page." },
          { label: "GalleryGridSection", value: "The photo grid on the Gallery page." },
          { label: "ReviewsGridSection", value: "The full review cards on the Reviews page." },
          { label: "LegalPage", value: "Terms & Conditions and Privacy Policy text, organised by section." },
        ],
      },
      { type: "tip", text: "Never delete a page in Builder.io — if a page has no content it falls back to the built-in default layout. Use the visual editor to update content rather than recreating pages from scratch." },
    ],
  },
  {
    id: "content-terms-privacy",
    category: "Website Content",
    title: "Updating Terms & Conditions / Privacy Policy",
    content: [
      { type: "para", text: "The Terms & Conditions (/terms) and Privacy Policy (/privacy) pages are managed through Builder.io like any other page." },
      {
        type: "steps",
        items: [
          "Open Builder.io CMS from the sidebar.",
          "Go to Content → Page.",
          'Click "Terms & Conditions" or "Privacy Policy".',
          "Select the LegalPage block on the canvas.",
          "In the right panel, edit the Title, Last Updated date, and each Section (heading + body text).",
          "Click \"Publish\" to push changes live.",
        ],
      },
      { type: "warning", text: "Always have legal document changes reviewed by an attorney before publishing. Keep the Last Updated date current whenever you make changes." },
    ],
  },

  // ─── Account & Settings ──────────────────────────────────────────────────
  {
    id: "settings-login",
    category: "Account",
    title: "Logging In & Out",
    content: [
      { type: "para", text: "The admin portal is protected by a password set in your environment configuration. Only share the login URL and password with trusted team members." },
      { type: "heading", text: "Logging In" },
      {
        type: "steps",
        items: [
          "Go to /admin/login.",
          "Enter the admin password.",
          "You'll be redirected to the Dashboard.",
        ],
      },
      { type: "heading", text: "Logging Out" },
      { type: "para", text: "Click \"Sign Out\" at the bottom of the sidebar. Your session is cleared and you'll be redirected to the login page." },
      { type: "tip", text: "Sessions are stored in a secure HTTP-only cookie and expire automatically. If you're ever logged out unexpectedly, simply log in again." },
    ],
  },
  {
    id: "settings-stripe",
    category: "Account",
    title: "Stripe Payments",
    content: [
      { type: "para", text: "All payments on the site are processed by Stripe. You don't need to do anything in the admin to accept payments — they're handled automatically." },
      { type: "heading", text: "Viewing Transactions" },
      { type: "para", text: "Click \"Stripe Payments\" in the sidebar to open your Stripe dashboard. Here you can view payouts, issue refunds, download reports, and manage disputes." },
      { type: "heading", text: "Issuing a Refund" },
      {
        type: "steps",
        items: [
          "Find the order in the Orders page and click the Stripe payment link in the expanded row.",
          'In Stripe, click "Refund payment".',
          "Choose full or partial refund and confirm.",
          "Stripe sends the refund to the guest's card automatically.",
        ],
      },
      { type: "heading", text: "Payouts" },
      { type: "para", text: "Stripe pays out your balance on a rolling schedule (typically 2 business days after a charge). You can see upcoming payouts in the Stripe dashboard under Balances → Payouts." },
      { type: "warning", text: "Never share your Stripe secret key or any API keys. These are stored securely in the server environment and should never appear in emails, chat messages, or documents." },
    ],
  },
];

const CATEGORIES = Array.from(new Set(ARTICLES.map((a) => a.category)));

function renderSection(s: Section, i: number) {
  switch (s.type) {
    case "heading":
      return <h3 key={i} className="font-bold text-forest text-base mt-6 mb-2">{s.text}</h3>;
    case "para":
      return <p key={i} className="text-warm-gray text-sm leading-relaxed">{s.text}</p>;
    case "steps":
      return (
        <ol key={i} className="space-y-2 mt-2">
          {s.items!.map((item, j) => (
            <li key={j} className="flex gap-3 text-sm text-warm-gray">
              <span className="shrink-0 w-6 h-6 rounded-full bg-forest text-white text-xs font-bold flex items-center justify-center mt-0.5">
                {j + 1}
              </span>
              <span className="leading-relaxed pt-0.5">{item}</span>
            </li>
          ))}
        </ol>
      );
    case "tip":
      return (
        <div key={i} className="flex gap-3 bg-forest/5 border border-forest/15 rounded-xl px-4 py-3 mt-2">
          <svg className="w-4 h-4 text-forest shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="text-sm text-forest leading-relaxed">{s.text}</p>
        </div>
      );
    case "warning":
      return (
        <div key={i} className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mt-2">
          <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm text-amber-800 leading-relaxed">{s.text}</p>
        </div>
      );
    case "table":
      return (
        <div key={i} className="mt-2 rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              {s.rows!.map((row, j) => (
                <tr key={j} className={j % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-2.5 font-semibold text-forest whitespace-nowrap w-40">{row.label}</td>
                  <td className="px-4 py-2.5 text-warm-gray">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

export default function HelpCenter() {
  const [activeId, setActiveId] = useState(ARTICLES[0].id);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return ARTICLES;
    return ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.content.some(
          (s) =>
            s.text?.toLowerCase().includes(q) ||
            s.items?.some((i) => i.toLowerCase().includes(q)) ||
            s.rows?.some((r) => r.label.toLowerCase().includes(q) || r.value.toLowerCase().includes(q))
        )
    );
  }, [search]);

  const article = ARTICLES.find((a) => a.id === activeId) ?? ARTICLES[0];

  const groupedFiltered = useMemo(() => {
    const map = new Map<string, Article[]>();
    for (const cat of CATEGORIES) {
      const articles = filtered.filter((a) => a.category === cat);
      if (articles.length) map.set(cat, articles);
    }
    return map;
  }, [filtered]);

  return (
    <div className="flex gap-6 items-start">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 sticky top-6 space-y-4">
        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles…"
            className="flex-1 text-sm text-forest placeholder-gray-400 focus:outline-none bg-transparent"
          />
        </div>

        {/* Nav */}
        <nav className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {groupedFiltered.size === 0 ? (
            <p className="px-4 py-6 text-xs text-warm-gray text-center">No articles match.</p>
          ) : (
            Array.from(groupedFiltered.entries()).map(([cat, articles]) => (
              <div key={cat}>
                <p className="px-4 pt-4 pb-1 text-xs font-bold text-warm-gray uppercase tracking-widest">{cat}</p>
                {articles.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => { setActiveId(a.id); setSearch(""); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      activeId === a.id
                        ? "bg-forest/10 text-forest font-semibold"
                        : "text-warm-gray hover:bg-gray-50 hover:text-forest"
                    }`}
                  >
                    {a.title}
                  </button>
                ))}
              </div>
            ))
          )}
        </nav>
      </aside>

      {/* Article */}
      <div className="flex-1 min-w-0 bg-white border border-gray-200 rounded-2xl p-8">
        <p className="text-xs font-bold text-warm-gray uppercase tracking-widest mb-1">{article.category}</p>
        <h2 className="font-serif text-2xl font-bold text-forest mb-6">{article.title}</h2>
        <div className="space-y-3">
          {article.content.map((s, i) => renderSection(s, i))}
        </div>

        {/* Article footer nav */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between text-sm">
          {(() => {
            const allIds = ARTICLES.map((a) => a.id);
            const idx = allIds.indexOf(article.id);
            const prev = idx > 0 ? ARTICLES[idx - 1] : null;
            const next = idx < ARTICLES.length - 1 ? ARTICLES[idx + 1] : null;
            return (
              <>
                {prev ? (
                  <button onClick={() => setActiveId(prev.id)} className="flex items-center gap-2 text-warm-gray hover:text-forest transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {prev.title}
                  </button>
                ) : <span />}
                {next ? (
                  <button onClick={() => setActiveId(next.id)} className="flex items-center gap-2 text-warm-gray hover:text-forest transition-colors ml-auto">
                    {next.title}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : <span />}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

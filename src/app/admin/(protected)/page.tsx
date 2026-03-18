import { getAllRequests } from "@/lib/giftCertStore";
import Link from "next/link";
import BookingCalendarWidget from "@/components/admin/BookingCalendarWidget";

export const dynamic = "force-dynamic";

const STRIPE_DASHBOARD = "https://dashboard.stripe.com";
const BUILDERIO_DASHBOARD = "https://builder.io/content";

export default async function AdminDashboard() {
  const requests = await getAllRequests();
  const active          = requests.filter((r) => r.status === "active");
  const pendingPayment  = requests.filter((r) => r.status === "pending_payment");
  const redeemed        = requests.filter((r) => r.status === "redeemed");
  const recent = requests.slice(0, 5);

  const activeRevenue = active.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="p-6 lg:p-10 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-warm-gray uppercase tracking-widest mb-1">Overview</p>
        <h1 className="font-serif text-3xl font-bold text-forest">Dashboard</h1>
      </div>

      {/* Booking calendar */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-forest text-lg">Booked Tours</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-forest underline hover:text-forest/70 transition-colors"
          >
            View all orders →
          </Link>
        </div>
        <BookingCalendarWidget />
      </div>

      {/* Gift Certificates header */}
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-forest">Gift Certificates</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Active Certs"
          value={active.length}
          sub={active.length > 0 ? `$${activeRevenue} outstanding` : "All redeemed"}
          accent="forest"
        />
        <StatCard label="Redeemed" value={redeemed.length} sub="Tours completed" accent="sage" />
        <StatCard
          label="Pending Payment"
          value={pendingPayment.length}
          sub="In checkout"
          accent="gold"
        />
        <StatCard label="Total Sold" value={requests.length} sub="All time" accent="gray" />
      </div>

      {/* Recent gift cert requests */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-forest text-lg">Recent Requests</h3>
          <Link
            href="/admin/gift-certificates"
            className="text-sm text-forest underline hover:text-forest/70 transition-colors"
          >
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-warm-gray text-sm">
            No gift certificate requests yet.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {recent.map((req, i) => (
              <div
                key={req.id}
                className={`flex items-center justify-between p-4 gap-4 ${
                  i < recent.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-forest text-sm truncate">{req.yourName}</p>
                  <p className="text-warm-gray text-xs">{req.yourEmail}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-forest">${req.amount}</p>
                  <p className="text-xs text-warm-gray">
                    {new Date(req.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
                <StatusBadge status={req.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* External links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ExternalCard
          href={STRIPE_DASHBOARD}
          title="Stripe Payments"
          description="View transactions, payouts, refunds, and payment history."
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          }
          badge="stripe.com"
        />
        <ExternalCard
          href={BUILDERIO_DASHBOARD}
          title="Builder.io CMS"
          description="Edit page content, hero text, tour descriptions, and more."
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          }
          badge="builder.io"
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: number;
  sub: string;
  accent: "gold" | "forest" | "sage" | "gray";
}) {
  const colors = {
    gold: "bg-gold/10 text-gold-dark",
    forest: "bg-forest/10 text-forest",
    sage: "bg-sage-muted/30 text-sage",
    gray: "bg-gray-100 text-gray-500",
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold mb-3 ${colors[accent]}`}>
        {label}
      </div>
      <p className="text-3xl font-bold text-forest mb-1">{value}</p>
      <p className="text-xs text-warm-gray">{sub}</p>
    </div>
  );
}

function ExternalCard({
  href,
  title,
  description,
  icon,
  badge,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-forest/30 hover:shadow-sm transition-all flex gap-4 items-start"
    >
      <div className="w-11 h-11 bg-forest/10 rounded-xl flex items-center justify-center text-forest shrink-0 group-hover:bg-forest group-hover:text-white transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-semibold text-forest">{title}</p>
          <span className="text-xs text-warm-gray bg-gray-100 px-2 py-0.5 rounded-full">{badge}</span>
        </div>
        <p className="text-sm text-warm-gray leading-snug">{description}</p>
      </div>
      <svg className="w-4 h-4 text-gray-300 group-hover:text-forest transition-colors shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending_payment: "bg-amber-50 text-amber-700 border-amber-200",
    active:          "bg-green-50 text-green-700 border-green-200",
    redeemed:        "bg-blue-50 text-blue-700 border-blue-200",
  };
  const labels: Record<string, string> = {
    pending_payment: "Pending",
    active:          "Active",
    redeemed:        "Redeemed",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${styles[status] ?? "bg-gray-50 text-gray-500 border-gray-200"}`}>
      {labels[status] ?? status}
    </span>
  );
}

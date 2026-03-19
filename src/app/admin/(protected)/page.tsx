import { getAllRequests } from "@/lib/giftCertStore";
import Link from "next/link";
import BookingCalendarWidget from "@/components/admin/BookingCalendarWidget";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const STRIPE_DASHBOARD = "https://dashboard.stripe.com";
const BUILDERIO_DASHBOARD = "https://builder.io/content";

async function getMonthlyRevenue() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startTs = Math.floor(startOfMonth.getTime() / 1000);

  let ordersRevenue = 0;
  let addOnsRevenue = 0;
  let orderCount = 0;

  if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes("your_secret_key")) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const intents = await stripe.paymentIntents.list({
        limit: 100,
        created: { gte: startTs },
      });
      const tourOrders = intents.data.filter(
        (pi) => pi.metadata?.tourId && pi.status === "succeeded"
      );
      orderCount = tourOrders.length;
      ordersRevenue = tourOrders.reduce((s, pi) => s + pi.amount / 100, 0);
      addOnsRevenue = tourOrders.reduce(
        (s, pi) => s + parseFloat(pi.metadata?.addOnsTotal ?? "0"),
        0
      );
    } catch {
      // Stripe unavailable — show zeros
    }
  }

  return { ordersRevenue, addOnsRevenue, orderCount };
}

async function getPrivateTourRevenue(startOfMonth: Date) {
  const paid = await prisma.privateTour.findMany({
    where: { status: "paid", updatedAt: { gte: startOfMonth } },
    select: { price: true },
  });
  return {
    privateTourRevenue: paid.reduce((s, t) => s + Number(t.price), 0),
    privateTourCount: paid.length,
  };
}

export default async function AdminDashboard() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [requests, monthlyRevenue, privateTours] = await Promise.all([
    getAllRequests(),
    getMonthlyRevenue(),
    getPrivateTourRevenue(startOfMonth),
  ]);
  const active          = requests.filter((r) => r.status === "active");
  const pendingPayment  = requests.filter((r) => r.status === "pending_payment");
  const redeemed        = requests.filter((r) => r.status === "redeemed");
  const activeRevenue = active.reduce((s, r) => s + r.amount, 0);

  const monthlyGiftCertRevenue = requests
    .filter((r) => r.status !== "pending_payment" && new Date(r.createdAt) >= startOfMonth)
    .reduce((s, r) => s + r.amount, 0);
  const { ordersRevenue, addOnsRevenue, orderCount } = monthlyRevenue;
  const { privateTourRevenue, privateTourCount } = privateTours;
  const monthlyTotal = ordersRevenue + monthlyGiftCertRevenue + privateTourRevenue;

  return (
    <div className="p-6 lg:p-10 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-warm-gray uppercase tracking-widest mb-1">Overview</p>
        <h1 className="font-serif text-3xl font-bold text-forest">Dashboard</h1>
      </div>

      {/* Monthly Revenue */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-semibold text-warm-gray uppercase tracking-widest mb-0.5">
              {now.toLocaleString("en-US", { month: "long", year: "numeric" })}
            </p>
            <h2 className="font-serif text-2xl font-bold text-forest">Revenue</h2>
          </div>
          <Link
            href="/admin/orders"
            className="text-sm text-forest underline hover:text-forest/70 transition-colors"
          >
            View orders →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <RevenueCard
            label="Total"
            amount={monthlyTotal}
            sub="All sources"
            accent="forest"
            primary
          />
          <RevenueCard
            label="Orders"
            amount={ordersRevenue}
            sub={`${orderCount} booking${orderCount !== 1 ? "s" : ""}`}
            accent="sage"
          />
          <RevenueCard
            label="Private Tours"
            amount={privateTourRevenue}
            sub={`${privateTourCount} paid`}
            accent="gold"
          />
          <RevenueCard
            label="Gift Certificates"
            amount={monthlyGiftCertRevenue}
            sub="Sold this month"
            accent="gold"
          />
          <RevenueCard
            label="Add-ons"
            amount={addOnsRevenue}
            sub="Included in orders"
            accent="gray"
          />
        </div>
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-bold text-forest">Gift Certificates</h2>
        <Link
          href="/admin/gift-certificates"
          className="text-sm text-forest underline hover:text-forest/70 transition-colors"
        >
          View all →
        </Link>
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

function RevenueCard({
  label,
  amount,
  sub,
  accent,
  primary = false,
}: {
  label: string;
  amount: number;
  sub: string;
  accent: "gold" | "forest" | "sage" | "gray";
  primary?: boolean;
}) {
  const colors = {
    gold: "bg-gold/10 text-gold-dark",
    forest: "bg-forest/10 text-forest",
    sage: "bg-sage-muted/30 text-sage",
    gray: "bg-gray-100 text-gray-500",
  };
  return (
    <div className={`rounded-2xl border p-5 ${primary ? "bg-forest text-white border-forest" : "bg-white border-gray-200"}`}>
      <div className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold mb-3 ${primary ? "bg-white/20 text-white" : colors[accent]}`}>
        {label}
      </div>
      <p className={`text-3xl font-bold mb-1 ${primary ? "text-white" : "text-forest"}`}>
        ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
      <p className={`text-xs ${primary ? "text-white/70" : "text-warm-gray"}`}>{sub}</p>
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


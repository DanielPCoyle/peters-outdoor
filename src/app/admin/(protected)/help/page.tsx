import HelpCenter from "@/components/admin/HelpCenter";

export const metadata = { title: "Help — Admin" };

export default function HelpPage() {
  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <p className="text-xs font-semibold text-warm-gray uppercase tracking-widest mb-1">Documentation</p>
        <h1 className="font-serif text-3xl font-bold text-forest">Help Center</h1>
        <p className="text-warm-gray text-sm mt-1">Step-by-step guides for managing your site and bookings.</p>
      </div>
      <HelpCenter />
    </div>
  );
}

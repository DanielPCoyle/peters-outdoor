import GiftCertificatesManager from "@/components/admin/GiftCertificatesManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Gift Certificates — Admin" };

export default function GiftCertificatesPage() {
  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <div className="mb-8">
        <p className="text-xs font-semibold text-warm-gray uppercase tracking-widest mb-1">Admin</p>
        <h1 className="font-serif text-3xl font-bold text-forest">Gift Certificates</h1>
        <p className="text-warm-gray text-sm mt-1">
          Review requests, send certificates, and track redemptions.
        </p>
      </div>
      <GiftCertificatesManager />
    </div>
  );
}

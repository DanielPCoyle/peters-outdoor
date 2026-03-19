import PrivateToursManager from "@/components/admin/PrivateToursManager";

export const metadata = { title: "Private Tours — Admin" };

export default function PrivateToursPage() {
  return (
    <div className="p-6 lg:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-forest">Private & Corporate Tours</h1>
        <p className="text-warm-gray text-sm mt-1">Create custom one-off tours and share a branded payment link with your client.</p>
      </div>
      <PrivateToursManager />
    </div>
  );
}

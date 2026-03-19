import NewsletterManager from "@/components/admin/NewsletterManager";

export const metadata = { title: "Newsletter — Admin" };

export default function NewsletterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-forest">Newsletter</h1>
        <p className="text-warm-gray text-sm mt-1">Manage email subscribers from the sign-up form.</p>
      </div>
      <NewsletterManager />
    </div>
  );
}

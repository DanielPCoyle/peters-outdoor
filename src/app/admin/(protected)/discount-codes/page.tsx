import type { Metadata } from "next";
import DiscountCodesManager from "@/components/admin/DiscountCodesManager";

export const metadata: Metadata = { title: "Discount Codes" };

export default function DiscountCodesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-forest mb-6">Discount Codes</h1>
      <DiscountCodesManager />
    </div>
  );
}

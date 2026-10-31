import { Suspense } from "react";
import { VendorDashboardClient } from "@/app/vendor/VendorDashboardClient";

export const metadata = {
  title: "Vendor Hub & QR Storefront",
};

export default function VendorPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-ink-muted">Loading Vendor Hub...</div>}>
      <VendorDashboardClient />
    </Suspense>
  );
}

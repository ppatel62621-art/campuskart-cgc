import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { AuthForm } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/Button";
import { vendors, products } from "@/data/catalog";

export const metadata = {
  title: "Admin Desk & Campus Ops",
};

export default function AdminPage() {
  return (
    <Container className="space-y-8 py-8 sm:py-10">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-campus-700">
              Campus Operations Console
            </p>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl text-ink">
              CGC Mohali Admin Desk
            </h1>
            <p className="mt-3 text-sm leading-6 text-ink-muted">
              Oversee hyperlocal commerce around CGC Landran &amp; Jhanjeri campuses, monitor active vendor listings, and track campus delivery runner dispatch.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-3xl bg-white p-4 shadow-sm border border-stone-200">
              <span className="text-xs text-ink-muted">Active Vendors</span>
              <p className="mt-1 font-display text-2xl font-bold text-ink">{vendors.length}</p>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-sm border border-stone-200">
              <span className="text-xs text-ink-muted">Catalog Items</span>
              <p className="mt-1 font-display text-2xl font-bold text-ink">{products.length}</p>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-sm border border-stone-200">
              <span className="text-xs text-ink-muted">Campus Hubs</span>
              <p className="mt-1 font-display text-2xl font-bold text-ink">1 (Mohali)</p>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-sm border border-stone-200">
              <span className="text-xs text-ink-muted">Drop Zones</span>
              <p className="mt-1 font-display text-2xl font-bold text-campus-800">8 Hostels</p>
            </div>
          </div>

          {/* Verified Campus Vendors Overview */}
          <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-sm border border-stone-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-ink">Registered Campus Shops</h2>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                All Verified ✓
              </span>
            </div>

            <ul className="divide-y divide-stone-100">
              {vendors.map((vendor) => (
                <li
                  key={vendor.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3"
                >
                  <div>
                    <p className="font-semibold text-sm text-ink">{vendor.name}</p>
                    <p className="text-xs text-ink-muted">
                      {vendor.address} &middot; {vendor.phone}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      ★ {vendor.rating.toFixed(1)}
                    </span>
                    <Link
                      href={`/vendor?store=${vendor.slug}`}
                      className="text-xs font-semibold text-campus-700 hover:text-campus-900 underline"
                    >
                      Open Console &rarr;
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <AuthForm
            role="admin"
            heading="Admin Auth Login"
            description="Production login for authenticated Supabase admins with RBAC role = admin."
          />
        </div>
      </div>
    </Container>
  );
}

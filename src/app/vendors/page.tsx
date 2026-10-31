import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VendorCard } from "@/components/vendors/VendorCard";
import { VENDOR_CATEGORIES } from "@/lib/constants";
import { getVendors } from "@/lib/catalog-service";
import Link from "next/link";

type VendorsPageProps = {
  searchParams: {
    category?: string;
  };
};

export const metadata = {
  title: "Vendors",
};

export default async function VendorsPage({ searchParams }: VendorsPageProps) {
  const vendors = await getVendors();
  const category = searchParams.category;
  const filtered = category
    ? vendors.filter((vendor) => vendor.category === category)
    : vendors;

  return (
    <Container className="space-y-8 py-10">
      <SectionHeading
        eyebrow="CGC Mohali"
        title="Vendors around campus"
        description="Kirana stores, printers, thrift shops, mithai houses, gift studios, and services within reach of CGC University."
      />

      <div className="flex flex-wrap gap-2">
        <Link
          href="/vendors"
          className={`rounded-full px-3 py-1.5 text-sm font-medium ${
            !category ? "bg-campus-800 text-white" : "bg-white text-ink"
          }`}
        >
          All
        </Link>
        {VENDOR_CATEGORIES.map((item) => (
          <Link
            key={item.slug}
            href={`/vendors?category=${item.slug}`}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              category === item.slug ? "bg-campus-800 text-white" : "bg-white text-ink"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-3xl bg-white p-8 text-sm text-ink-muted">
          No vendors in this category yet. Check back after onboarding.
        </p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      )}
    </Container>
  );
}

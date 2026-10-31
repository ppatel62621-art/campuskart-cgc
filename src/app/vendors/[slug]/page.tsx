import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { getProductsByVendor, getVendorBySlug } from "@/data/catalog";
import { AddToCartButton } from "@/components/vendors/AddToCartButton";
import { formatInr } from "@/lib/utils";

type VendorDetailProps = {
  params: { slug: string };
};

export function generateMetadata({ params }: VendorDetailProps) {
  const vendor = getVendorBySlug(params.slug);
  return {
    title: vendor?.name ?? "Vendor",
  };
}

export default function VendorDetailPage({ params }: VendorDetailProps) {
  const vendor = getVendorBySlug(params.slug);

  if (!vendor) {
    notFound();
  }

  const catalog = getProductsByVendor(vendor.id);

  return (
    <Container className="space-y-8 py-6 sm:py-10">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-ink-muted">
        <Link href="/vendors" className="hover:text-ink">
          &larr; All CGC Vendors
        </Link>
        <span>/</span>
        <span className="capitalize">{vendor.category}</span>
        <span>/</span>
        <span className="font-semibold text-ink truncate">{vendor.name}</span>
      </nav>

      <div className="overflow-hidden rounded-[2rem] bg-white shadow-card">
        <div className="relative h-48 sm:h-72 w-full">
          <Image
            src={vendor.imageUrl}
            alt={vendor.name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
            <div>
              <span className="inline-block rounded-md bg-black/40 px-2.5 py-1 text-xs backdrop-blur font-medium">
                ★ {vendor.rating.toFixed(1)} &middot; {vendor.etaMinutes} min campus drop
              </span>
            </div>
            <Link
              href={`/vendor?store=${vendor.slug}&tab=qr`}
              className="rounded-xl bg-white/95 px-3 py-1.5 text-xs font-semibold text-campus-900 shadow hover:bg-white transition flex items-center gap-1.5 backdrop-blur"
            >
              <span>📱</span>
              <span>Shop QR Standee</span>
            </Link>
          </div>
        </div>

        <div className="space-y-4 p-5 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-campus-700">
                {vendor.category} &middot; CGC Landran
              </p>
              <h1 className="mt-1 font-display text-3xl sm:text-4xl text-ink">{vendor.name}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
                {vendor.description}
              </p>
            </div>
            <Badge tone={vendor.isOpen ? "success" : "danger"}>
              {vendor.isOpen ? "Open Now" : "Closed"}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 border-t border-stone-100 pt-4 text-xs sm:text-sm text-ink-muted">
            <span className="flex items-center gap-1">
              📍 <strong>Location:</strong> {vendor.address}
            </span>
            <span className="flex items-center gap-1">
              📞 <strong>Vendor Helpline:</strong> {vendor.phone}
            </span>
            <span className="flex items-center gap-1">
              ⚡ <strong>Avg Delivery:</strong> {vendor.etaMinutes} mins to hostel
            </span>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl text-ink">Catalog &amp; Menu</h2>
            <p className="text-xs sm:text-sm text-ink-muted">
              {catalog.length} student essentials available for direct hostel delivery
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {catalog.map((product) => (
            <article
              key={product.id}
              className="flex gap-4 rounded-3xl border border-stone-200/80 bg-white p-4 transition hover:border-campus-200 hover:shadow-sm"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-stone-100">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
                {product.badge ? (
                  <span className="absolute top-1 left-1 rounded bg-saffron px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">
                    {product.badge}
                  </span>
                ) : null}
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <h3 className="font-semibold text-sm sm:text-base text-ink line-clamp-1">
                  {product.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-ink-muted">
                  {product.description}
                </p>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-ink-muted">Price</span>
                    <span className="text-sm sm:text-base font-bold text-ink">
                      {formatInr(product.price)}
                    </span>
                  </div>
                  <AddToCartButton product={product} vendorName={vendor.name} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Container>
  );
}

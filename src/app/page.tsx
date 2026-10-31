import Image from "next/image";
import Link from "next/link";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VendorCard } from "@/components/vendors/VendorCard";
import { campusCopy } from "@/data/catalog";
import { APP_NAME } from "@/lib/constants";
import { getVendors } from "@/lib/catalog-service";

export default async function HomePage() {
  const allVendors = await getVendors();
  const featured = allVendors.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <Container className="grid items-center gap-10 py-10 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <div className="flex items-center gap-2">
              <p className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-campus-700 shadow-sm border border-stone-200">
                Live at {campusCopy.shortName}
              </p>
              <span className="rounded-full bg-saffron/20 px-2.5 py-1 text-xs font-bold text-saffron-dark">
                ⚡ 20-min Hostel Drop
              </span>
            </div>

            <h1 className="mt-5 max-w-xl font-display text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl">
              {campusCopy.headline}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-ink-muted sm:text-lg">
              {campusCopy.subhead}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/vendors" size="lg" className="shadow-md">
                Browse Campus Vendors &rarr;
              </Button>
              <Button href="/vendor" variant="outline" size="lg" className="border-campus-700 text-campus-900 font-bold">
                🏪 Open Vendor Desk (QR)
              </Button>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="rounded-2xl bg-white/70 p-3.5 border border-stone-200/60 shadow-sm">
                <dt className="text-ink-muted font-medium">Campus</dt>
                <dd className="mt-1 font-bold text-ink">{campusCopy.name}</dd>
              </div>
              <div className="rounded-2xl bg-white/70 p-3.5 border border-stone-200/60 shadow-sm">
                <dt className="text-ink-muted font-medium">Hostel Drop</dt>
                <dd className="mt-1 font-bold text-campus-800">BH-1, BH-2, GH-1</dd>
              </div>
              <div className="rounded-2xl bg-white/70 p-3.5 border border-stone-200/60 shadow-sm">
                <dt className="text-ink-muted font-medium">Checkout</dt>
                <dd className="mt-1 font-bold text-ink">COD &bull; UPI</dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -left-6 -top-6 h-28 w-28 rounded-full bg-campus-200/80 blur-xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 shadow-card">
              <Image
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=80"
                alt="Students on a campus walkway"
                width={900}
                height={720}
                className="h-[380px] sm:h-[430px] w-full object-cover"
                priority
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur">
                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm font-bold text-ink">
                    Kirana, Xerox, Mithai &amp; Laundry at Gate 2
                  </p>
                  <span className="rounded bg-campus-100 px-2 py-0.5 text-[10px] font-bold text-campus-800">
                    Active Demo
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink-muted">
                  {APP_NAME} connects local shop counters directly to CGC student rooms with runner tracking.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3 Step Workflow for CGC Demo */}
      <section className="py-6 sm:py-10 bg-white/50 border-y border-stone-200/60">
        <Container>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="flex items-start gap-4 p-4 rounded-3xl bg-white shadow-sm border border-stone-200/60">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-campus-100 text-lg font-bold text-campus-800">
                1
              </span>
              <div>
                <h2 className="font-display text-base font-bold text-ink">
                  Scan QR or Browse
                </h2>
                <p className="mt-1 text-xs text-ink-muted leading-relaxed">
                  Scan the acrylic standee at the shop counter or open the digital catalog from your room.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-3xl bg-white shadow-sm border border-stone-200/60">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-saffron/20 text-lg font-bold text-saffron-dark">
                2
              </span>
              <div>
                <h2 className="font-display text-base font-bold text-ink">
                  Pick Hostel Drop Point
                </h2>
                <p className="mt-1 text-xs text-ink-muted leading-relaxed">
                  Choose BH-1, BH-2, GH-1, or Block lawns. Get an instant 4-digit runner verification PIN.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-3xl bg-white shadow-sm border border-stone-200/60">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-bold text-emerald-800">
                3
              </span>
              <div>
                <h2 className="font-display text-base font-bold text-ink">
                  Pay at Gate &amp; Enjoy
                </h2>
                <p className="mt-1 text-xs text-ink-muted leading-relaxed">
                  Pay with Cash on Delivery or UPI scan when the runner arrives in 15-20 minutes.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Categories */}
      <section className="py-8 sm:py-12">
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="Shop by need"
            title="What CGC students actually send someone out for"
            description="Start with the shop type, then pick a vendor close to campus."
          />
          <CategoryGrid />
        </Container>
      </section>

      {/* Featured Vendors */}
      <section className="py-8 sm:py-12">
        <Container className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Near campus"
              title="Featured shops around CGC University"
              description="Direct Gate 2, Landran chowk, and Kharar partners ready to dispatch to campus."
            />
            <Button href="/vendors" variant="outline" size="sm">
              View All {allVendors.length} Vendors &rarr;
            </Button>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

import Link from "next/link";
import { VENDOR_CATEGORIES } from "@/lib/constants";
import { Card } from "@/components/ui/Card";

export function CategoryGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {VENDOR_CATEGORIES.map((category) => (
        <Link key={category.slug} href={`/vendors?category=${category.slug}`}>
          <Card className="h-full p-5 transition hover:-translate-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-campus-700">
              {category.label}
            </p>
            <p className="mt-2 font-display text-2xl text-ink">{category.label} nearby</p>
            <p className="mt-2 text-sm leading-6 text-ink-muted">{category.description}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}

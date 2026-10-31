import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { Vendor } from "@/types";

export function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Link href={`/vendors/${vendor.slug}`} className="block h-full group">
      <Card className="h-full transition duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col overflow-hidden">
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-stone-100">
          <Image
            src={vendor.imageUrl}
            alt={vendor.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute top-3 right-3">
            <Badge tone={vendor.isOpen ? "success" : "danger"}>
              {vendor.isOpen ? "Open Now" : "Closed"}
            </Badge>
          </div>
          <div className="absolute bottom-2.5 left-3 rounded-lg bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
            ★ {vendor.rating.toFixed(1)} &middot; {vendor.etaMinutes}m drop
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between p-5 space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-campus-700">
                {vendor.category}
              </span>
              <span className="text-xs text-ink-muted">Gate 2 &middot; Landran</span>
            </div>
            <h3 className="mt-1 font-display text-xl font-bold text-ink group-hover:text-campus-800 transition">
              {vendor.name}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-ink-muted">
              {vendor.description}
            </p>
          </div>

          <div className="border-t border-stone-100 pt-3 flex items-center justify-between text-xs font-semibold text-campus-800">
            <span>Browse Products</span>
            <span className="group-hover:translate-x-1 transition">&rarr;</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

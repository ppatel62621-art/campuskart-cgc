"use client";

import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";
import { formatInr } from "@/lib/utils";

export function FloatingCartBar() {
  const { itemCount, subtotal } = useCart();

  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 sm:hidden">
      <Link
        href="/cart"
        className="flex items-center justify-between rounded-2xl bg-campus-800 px-5 py-3.5 text-white shadow-xl shadow-campus-900/30 ring-1 ring-white/20 active:scale-98 transition"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-saffron text-xs font-bold">
            {itemCount}
          </div>
          <div className="text-left">
            <p className="text-xs font-medium text-campus-100">Your Campus Bag</p>
            <p className="text-sm font-bold">{formatInr(subtotal)}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-saffron">
          <span>Checkout</span>
          <span className="text-sm">&rarr;</span>
        </div>
      </Link>
    </div>
  );
}

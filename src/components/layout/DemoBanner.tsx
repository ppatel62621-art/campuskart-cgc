"use client";

import Link from "next/link";
import { useState } from "react";
import { resetDemoOrders } from "@/lib/local-orders";
import { useCart } from "@/components/providers/CartProvider";

export function DemoBanner() {
  const [minimized, setMinimized] = useState(false);
  const [resetStatus, setResetStatus] = useState<string | null>(null);
  const { clearCart } = useCart();

  function handleReset() {
    resetDemoOrders();
    clearCart();
    setResetStatus("Reset complete!");
    setTimeout(() => setResetStatus(null), 2500);
  }

  if (minimized) {
    return (
      <aside aria-label="Demo mode control" className="bg-campus-900 text-white text-xs py-1.5 px-4 flex items-center justify-between border-b border-campus-700/60 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold tracking-wide">Demo Mode (CGC Mohali)</span>
        </div>
        <button
          onClick={() => setMinimized(false)}
          className="text-[11px] underline text-campus-200 hover:text-white"
        >
          Expand Bar ▾
        </button>
      </aside>
    );
  }

  return (
    <aside aria-label="Demo mode details and shortcuts" className="bg-gradient-to-r from-campus-900 via-campus-800 to-campus-900 text-white text-xs py-2.5 px-3 sm:px-6 border-b border-campus-700/80 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-saffron px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
            Hackathon Demo
          </span>
          <p className="text-white/90 text-xs font-normal">
            <strong className="text-white font-semibold">CGC Mohali Edition</strong> &middot; Offline-first state with local cart &amp; instant live orders.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2 text-xs">
          <Link
            href="/vendors"
            className="rounded-lg bg-white/10 hover:bg-white/20 px-2.5 py-1 text-campus-100 hover:text-white transition font-medium"
          >
            🛒 Student Store
          </Link>
          <Link
            href="/vendor"
            className="rounded-lg bg-saffron hover:bg-saffron-dark text-white px-2.5 py-1 transition font-medium shadow-sm"
          >
            🏪 Vendor Desk &amp; QR
          </Link>
          <Link
            href="/orders"
            className="rounded-lg bg-white/10 hover:bg-white/20 px-2.5 py-1 text-campus-100 hover:text-white transition font-medium"
          >
            📦 Track Orders
          </Link>
          <button
            onClick={handleReset}
            className="rounded-lg border border-white/20 hover:border-white/40 px-2 py-1 text-white/80 hover:text-white transition text-[11px]"
            title="Reset to fresh demo orders and clear cart"
          >
            {resetStatus || "↺ Reset Demo"}
          </button>
          <button
            onClick={() => setMinimized(true)}
            className="text-white/60 hover:text-white ml-1 px-1.5 py-0.5 rounded text-xs"
            title="Minimize banner"
            aria-label="Minimize demo banner"
          >
            ✕
          </button>
        </div>
      </div>
    </aside>
  );
}

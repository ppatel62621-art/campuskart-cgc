"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { APP_NAME, DEFAULT_CAMPUS, NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/providers/CartProvider";
import { Container } from "@/components/layout/Container";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-cream/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-campus-800 font-display text-lg text-white shadow-sm">
            CK
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg text-ink font-bold">{APP_NAME}</span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-campus-700">
              {DEFAULT_CAMPUS.shortName}
            </span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-semibold transition",
                  active
                    ? "bg-campus-800 text-white shadow-sm"
                    : "text-ink-muted hover:bg-white hover:text-ink",
                )}
              >
                {link.label}
                {link.href === "/cart" && itemCount > 0 ? (
                  <span className="ml-2 rounded-full bg-saffron px-1.5 py-0.5 text-[10px] text-white font-bold">
                    {itemCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Right Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-ink text-base shadow-sm"
            aria-label="Cart"
          >
            🛒
            {itemCount > 0 ? (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-saffron text-[10px] font-bold text-white shadow">
                {itemCount}
              </span>
            ) : null}
          </Link>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-stone-300 bg-white shadow-sm"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">Menu</span>
            <span className="flex flex-col gap-1.5">
              <span className={cn("h-0.5 w-5 bg-ink transition-all", open && "translate-y-2 rotate-45")} />
              <span className={cn("h-0.5 w-5 bg-ink transition-all", open && "opacity-0")} />
              <span className={cn("h-0.5 w-5 bg-ink transition-all", open && "-translate-y-2 -rotate-45")} />
            </span>
          </button>
        </div>
      </Container>

      {/* Mobile Drawer Menu */}
      {open ? (
        <div className="border-t border-stone-200 bg-cream/98 shadow-xl lg:hidden animate-fade-in">
          <Container className="flex flex-col py-3 gap-1">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    active
                      ? "bg-campus-800 text-white"
                      : "text-ink hover:bg-white"
                  )}
                >
                  <span>{link.label}</span>
                  {link.href === "/cart" && itemCount > 0 ? (
                    <span className="rounded-full bg-saffron px-2 py-0.5 text-xs text-white">
                      {itemCount} items
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </Container>
        </div>
      ) : null}
    </header>
  );
}

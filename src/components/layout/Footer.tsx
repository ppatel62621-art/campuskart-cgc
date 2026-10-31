import Link from "next/link";
import { APP_NAME, DEFAULT_CAMPUS, VENDOR_CATEGORIES } from "@/lib/constants";
import { Container } from "@/components/layout/Container";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-white">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl text-ink font-bold">{APP_NAME}</p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-ink-muted">
            Hyperlocal campus commerce for {DEFAULT_CAMPUS.name}, {DEFAULT_CAMPUS.city}.
            Built for students, local vendors, and the shops between class and hostel.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            <li>
              <Link href="/vendors" className="hover:text-ink">
                Nearby CGC vendors
              </Link>
            </li>
            <li>
              <Link href="/orders" className="hover:text-ink">
                Track campus orders
              </Link>
            </li>
            <li>
              <Link href="/vendor" className="hover:text-ink font-medium text-campus-700">
                Vendor Hub &amp; QR Standee
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-ink">
                Campus Admin desk
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Shop types</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            {VENDOR_CATEGORIES.map((category) => (
              <li key={category.slug}>
                <Link href={`/vendors?category=${category.slug}`} className="hover:text-ink">
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Campus desk</p>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            First campus: {DEFAULT_CAMPUS.name}, {DEFAULT_CAMPUS.city}.
            Operating in offline-first Demo Mode for hackathon evaluation. Instant student ordering with COD &amp; UPI.
          </p>
        </div>
      </Container>
      <div className="border-t border-stone-200 py-4 text-center text-xs text-ink-muted">
        &copy; {new Date().getFullYear()} {APP_NAME}. Hyperlocal commerce tailored for CGC University students.
      </div>
    </footer>
  );
}

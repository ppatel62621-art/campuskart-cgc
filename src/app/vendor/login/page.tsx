import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { AuthForm } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Vendor Login & Hub",
};

export default function VendorLoginPage() {
  return (
    <Container className="grid gap-8 py-10 lg:grid-cols-2 items-start">
      <div className="space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-campus-700">
            For CGC Local Shops &amp; Services
          </p>
          <h1 className="mt-2 font-display text-4xl text-ink">
            Sell to CGC University without a physical campus stall.
          </h1>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            Kirana stores, midnight printers, thrift studios, mithai houses, and campus laundry services can manage incoming student hostel orders and display counter QR standees.
          </p>
        </div>

        {/* Demo Fast-Track Card */}
        <div className="rounded-3xl bg-gradient-to-br from-campus-900 to-campus-800 p-6 text-white shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-saffron px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
              Hackathon Quick Access
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold">
            Instant Vendor Console
          </h2>
          <p className="text-xs text-campus-100 leading-5">
            Evaluate the live vendor order queue, order status toggles, stock controls, and QR standee generator without creating a Supabase Auth account.
          </p>
          <Button
            href="/vendor"
            size="lg"
            className="w-full bg-saffron hover:bg-saffron-dark text-white font-bold"
          >
            Launch Vendor Console &amp; QR Standee &rarr;
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <AuthForm
          role="vendor"
          heading="Supabase Vendor Sign-in"
          description="For production setups connected to Supabase Auth. For hackathon judging, use the Instant Vendor Console on the left."
        />
      </div>
    </Container>
  );
}

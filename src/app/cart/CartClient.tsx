"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { useCart } from "@/components/providers/CartProvider";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { writeLocalOrder } from "@/lib/local-orders";
import { formatInr } from "@/lib/utils";
import type { Order } from "@/types";

const CGC_DROP_LOCATIONS = [
  "Boys Hostel 1 (BH-1) - Ground Floor / Gate",
  "Boys Hostel 2 (BH-2) - Security Desk",
  "Girls Hostel 1 (GH-1) - Visitor Desk",
  "Girls Hostel 2 (GH-2) - Main Entry Point",
  "Block 3 (Mechanical Lawn)",
  "Block 7 (CSE Courtyard)",
  "Gate 2 (CGC Landran Pickup Stand)",
  "Central Library - Front Steps",
];

export function CartClient() {
  const router = useRouter();
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const [placing, setPlacing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Student details state
  const [dropLocation, setDropLocation] = useState(CGC_DROP_LOCATIONS[0]);
  const [roomNumber, setRoomNumber] = useState("Room 312");
  const [studentName, setStudentName] = useState("Rohan Verma");
  const [studentPhone, setStudentPhone] = useState("+91 98765 43210");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi_delivery">("cod");
  const [notes, setNotes] = useState("Call upon reaching gate");

  function placeOrder() {
    setPlacing(true);

    const fullLocation = `${dropLocation} (${roomNumber})`;

    const order = writeLocalOrder({
      items,
      total: subtotal,
      studentName,
      studentPhone,
      dropLocation: fullLocation,
      notes,
      paymentMethod,
      vendorId: items[0]?.product.vendorId,
    });

    clearCart();
    setPlacing(false);
    setConfirmedOrder(order);
  }

  return (
    <Container className="space-y-8 py-6 sm:py-10">
      <SectionHeading
        eyebrow="Smooth Student Checkout"
        title="Your Campus Bag"
        description="Instant hyper-local checkout for CGC Landran / Jhanjeri. Free campus runner delivery during hackathon demo."
      />

      {confirmedOrder ? (
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-card border border-emerald-100 text-center animate-fade-in">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
            ✓
          </div>
          <span className="mt-4 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
            Order Placed Successfully
          </span>
          <h2 className="mt-3 font-display text-3xl text-ink">
            Order #{confirmedOrder.id}
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            Assigned to campus runner &middot; Delivering to <strong>{confirmedOrder.dropLocation}</strong>
          </p>

          <div className="my-6 rounded-2xl bg-cream p-4 text-left space-y-2 border border-stone-200">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-ink-muted">Vendor:</span>
              <span className="font-semibold">{confirmedOrder.vendorName}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-ink-muted">Amount Due:</span>
              <span className="font-bold text-campus-800">{formatInr(confirmedOrder.total)}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-ink-muted">Payment:</span>
              <span className="font-semibold uppercase text-xs">{confirmedOrder.paymentMethod === "cod" ? "Cash on Delivery" : "UPI at Gate"}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm border-t border-stone-300 pt-2">
              <span className="text-ink-muted font-medium">Delivery Runner PIN:</span>
              <span className="rounded bg-campus-800 px-2 py-0.5 font-mono text-sm font-bold text-white tracking-widest">
                {confirmedOrder.deliveryPin || "4821"}
              </span>
            </div>
            <p className="text-[11px] text-ink-muted italic pt-1">
              * Show this 4-digit PIN to the campus delivery runner when taking your package.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button href="/orders" size="lg" className="w-full sm:w-auto">
              Track Order Live &rarr;
            </Button>
            <Button
              href="/vendor"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-campus-800"
            >
              Open Vendor Desk (Demo)
            </Button>
          </div>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="Your bag is currently empty"
          description="Browse your favorite campus shops around CGC Landran for instant delivery."
          actionLabel="Explore CGC Vendors"
          actionHref="/vendors"
        />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-sm border border-stone-200/80">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <h3 className="font-display text-xl text-ink">Selected Items ({items.length})</h3>
                <span className="text-xs text-ink-muted">Vendor: {items[0]?.vendorName}</span>
              </div>

              <ul className="divide-y divide-stone-100">
                {items.map((item) => (
                  <li
                    key={item.product.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-ink text-sm sm:text-base">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-ink-muted">{item.vendorName}</p>
                      <p className="mt-1 text-sm font-bold text-campus-800">
                        {formatInr(item.product.price)} each
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center rounded-full border border-stone-300 bg-stone-50 p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-ink shadow-sm hover:bg-stone-100"
                          aria-label="Decrease quantity"
                        >
                          &minus;
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-ink">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-campus-700 text-xs font-bold text-white shadow-sm hover:bg-campus-800"
                          aria-label="Increase quantity"
                        >
                          &#43;
                        </button>
                      </div>

                      <span className="min-w-16 text-right text-sm font-semibold text-ink">
                        {formatInr(item.product.price * item.quantity)}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="text-xs text-stone-400 hover:text-rose-600 transition p-1"
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* CGC Campus Drop Location Details */}
            <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-sm border border-stone-200/80 space-y-4">
              <h3 className="font-display text-xl text-ink">CGC Hostel Drop Location</h3>
              <p className="text-xs text-ink-muted">
                Our student delivery runners deliver directly to hostel desks and campus gates.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="campus-drop-location" className="block text-xs font-semibold text-ink-muted mb-1">
                    Select Hostel / Block Point
                  </label>
                  <select
                    id="campus-drop-location"
                    value={dropLocation}
                    onChange={(e) => setDropLocation(e.target.value)}
                    className="w-full rounded-2xl border border-stone-300 bg-cream/40 px-3.5 py-2.5 text-xs sm:text-sm text-ink focus:border-campus-600 focus:outline-none"
                  >
                    {CGC_DROP_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="room-number" className="block text-xs font-semibold text-ink-muted mb-1">
                    Room / Floor / Wing
                  </label>
                  <input
                    id="room-number"
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="e.g. Room 314, 3rd Floor"
                    className="w-full rounded-2xl border border-stone-300 bg-cream/40 px-3.5 py-2.5 text-xs sm:text-sm text-ink focus:border-campus-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 pt-2">
                <div>
                  <label htmlFor="student-name" className="block text-xs font-semibold text-ink-muted mb-1">
                    Student Name
                  </label>
                  <input
                    id="student-name"
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full rounded-2xl border border-stone-300 bg-cream/40 px-3.5 py-2 text-xs sm:text-sm text-ink focus:border-campus-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="student-phone" className="block text-xs font-semibold text-ink-muted mb-1">
                    Phone (Runner calls here)
                  </label>
                  <input
                    id="student-phone"
                    type="tel"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    className="w-full rounded-2xl border border-stone-300 bg-cream/40 px-3.5 py-2 text-xs sm:text-sm text-ink focus:border-campus-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="order-notes" className="block text-xs font-semibold text-ink-muted mb-1">
                  Delivery Runner Instructions (Optional)
                </label>
                <input
                  id="order-notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please bring changes for 500, ring bell"
                  className="w-full rounded-2xl border border-stone-300 bg-cream/40 px-3.5 py-2 text-xs sm:text-sm text-ink focus:border-campus-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right Summary Column */}
          <aside className="h-fit space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-stone-200/80 space-y-5">
              <h3 className="font-display text-xl text-ink">Bill Summary</h3>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between text-ink-muted">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-ink">{formatInr(subtotal)}</span>
                </div>
                <div className="flex justify-between text-ink-muted">
                  <span className="flex items-center gap-1">
                    <span>Campus Runner Delivery</span>
                    <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
                      FREE
                    </span>
                  </span>
                  <span className="line-through text-stone-400">₹25</span>
                </div>
                <div className="flex justify-between text-ink-muted">
                  <span>Hostel Platform Fee</span>
                  <span className="font-semibold text-emerald-700">₹0</span>
                </div>
                <div className="border-t border-stone-200 pt-3 flex justify-between items-baseline">
                  <span className="font-display text-base text-ink">Total to Pay</span>
                  <span className="font-display text-3xl text-campus-800">{formatInr(subtotal)}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-2">
                <p className="text-xs font-bold text-ink mb-2">Select Payment Method</p>
                <div className="space-y-2">
                  <label className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition ${paymentMethod === "cod" ? "border-campus-600 bg-campus-50/60" : "border-stone-200 bg-white"}`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-campus-700"
                    />
                    <div>
                      <p className="text-xs font-semibold text-ink">Cash on Delivery (COD)</p>
                      <p className="text-[11px] text-ink-muted">Hand cash to student runner at hostel</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition ${paymentMethod === "upi_delivery" ? "border-campus-600 bg-campus-50/60" : "border-stone-200 bg-white"}`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "upi_delivery"}
                      onChange={() => setPaymentMethod("upi_delivery")}
                      className="accent-campus-700"
                    />
                    <div>
                      <p className="text-xs font-semibold text-ink">UPI on Delivery</p>
                      <p className="text-[11px] text-ink-muted">Scan GPay / PhonePe / Paytm runner QR</p>
                    </div>
                  </label>
                </div>
              </div>

              <Button
                className="w-full text-base py-3"
                size="lg"
                onClick={placeOrder}
                disabled={placing}
              >
                {placing ? "Confirming Order..." : "Place Instant Campus Order"}
              </Button>

              <p className="text-center text-[11px] text-ink-muted">
                ⚡ Estimated arrival: <strong>15-20 minutes</strong> at your hostel gate.
              </p>
            </div>
          </aside>
        </div>
      )}
    </Container>
  );
}

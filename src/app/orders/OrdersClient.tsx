"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { readLocalOrders, updateLocalOrderStatus } from "@/lib/local-orders";
import { formatInr } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

const ORDER_STEPS: OrderStatus[] = ["placed", "accepted", "preparing", "ready", "delivered"];

function statusTone(status: OrderStatus) {
  if (status === "delivered") return "success" as const;
  if (status === "cancelled") return "danger" as const;
  if (status === "placed") return "warning" as const;
  if (status === "preparing") return "warning" as const;
  if (status === "ready") return "success" as const;
  return "neutral" as const;
}

function statusLabel(status: OrderStatus) {
  switch (status) {
    case "placed":
      return "Order Received";
    case "accepted":
      return "Vendor Confirmed";
    case "preparing":
      return "Packing Order";
    case "ready":
      return "Out with Runner";
    case "delivered":
      return "Delivered to Hostel";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

export function OrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);

  function load() {
    setOrders(readLocalOrders());
  }

  useEffect(() => {
    load();

    function onUpdated() {
      load();
    }

    window.addEventListener("campuskart:orderUpdated", onUpdated);
    return () => window.removeEventListener("campuskart:orderUpdated", onUpdated);
  }, []);

  function handleAdvance(order: Order) {
    const currentIndex = ORDER_STEPS.indexOf(order.status);
    if (currentIndex >= 0 && currentIndex < ORDER_STEPS.length - 1) {
      const nextStatus = ORDER_STEPS[currentIndex + 1];
      const updated = updateLocalOrderStatus(order.id, nextStatus);
      setOrders(updated);
    }
  }

  return (
    <Container className="space-y-8 py-6 sm:py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeading
          eyebrow="Live Student Desk"
          title="Campus Orders Tracker"
          description="Track incoming food, supplies, and prints to your CGC hostel in real time."
        />
        <div className="flex items-center gap-2">
          <Button href="/vendors" variant="outline" size="sm">
            + New Order
          </Button>
          <Button href="/vendor" size="sm" className="bg-saffron hover:bg-saffron-dark text-white">
            Switch to Vendor Desk
          </Button>
        </div>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          title="No campus orders found"
          description="Place an order from any campus shop to see instant live delivery tracking."
          actionLabel="Browse CGC Vendors"
          actionHref="/vendors"
        />
      ) : (
        <div className="space-y-5">
          {orders.map((order) => {
            const stepIndex = ORDER_STEPS.indexOf(order.status);

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-3xl bg-white p-5 sm:p-6 shadow-sm border border-stone-200/80 space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-xl text-ink font-bold">
                        #{order.id}
                      </span>
                      <Badge tone={statusTone(order.status)}>
                        {statusLabel(order.status)}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-ink-muted">
                      From <strong>{order.vendorName}</strong> &middot; {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-display text-2xl font-bold text-campus-800">
                      {formatInr(order.total)}
                    </p>
                    <p className="text-xs text-ink-muted">
                      {order.itemCount} items &middot; {order.paymentMethod === "upi_delivery" ? "UPI at Gate" : "COD"}
                    </p>
                  </div>
                </div>

                {/* Progress Stepper for hackathon demo */}
                <div className="py-2">
                  <div className="grid grid-cols-5 gap-1 sm:gap-2 text-center text-[10px] sm:text-xs">
                    {ORDER_STEPS.map((step, idx) => {
                      const isComplete = stepIndex >= idx;
                      const isCurrent = stepIndex === idx;

                      return (
                        <div key={step} className="flex flex-col items-center gap-1.5">
                          <div
                            className={`h-2 sm:h-2.5 w-full rounded-full transition-all ${
                              isComplete
                                ? "bg-campus-600"
                                : "bg-stone-200"
                            } ${isCurrent ? "ring-2 ring-campus-400 ring-offset-1" : ""}`}
                          />
                          <span
                            className={`hidden sm:inline font-medium capitalize truncate w-full ${
                              isCurrent
                                ? "text-campus-800 font-bold"
                                : isComplete
                                ? "text-ink"
                                : "text-stone-400"
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Drop Info & PIN */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-cream/70 p-3.5 text-xs">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-ink">
                      📍 Drop Point: {order.dropLocation || "Hostel Gate 2 (BH-1)"}
                    </p>
                    {order.studentName ? (
                      <p className="text-ink-muted">
                        Recipient: {order.studentName} ({order.studentPhone || "+91 98765 00000"})
                      </p>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-white px-3 py-1.5 border border-stone-200 shadow-sm text-center">
                      <span className="block text-[10px] uppercase font-bold text-ink-muted tracking-wider">
                        Runner PIN
                      </span>
                      <span className="font-mono text-sm font-bold text-campus-900 tracking-wider">
                        {order.deliveryPin || "4821"}
                      </span>
                    </div>

                    {order.status !== "delivered" && order.status !== "cancelled" ? (
                      <button
                        onClick={() => handleAdvance(order)}
                        className="rounded-xl bg-campus-800 hover:bg-campus-900 text-white px-3 py-2 text-xs font-semibold shadow-sm transition active:scale-95"
                        title="Simulate vendor / runner updating status"
                      >
                        ⚡ Advance Status
                      </button>
                    ) : (
                      <span className="rounded-xl bg-emerald-100 text-emerald-800 px-3 py-2 text-xs font-bold">
                        Completed ✓
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Container>
  );
}

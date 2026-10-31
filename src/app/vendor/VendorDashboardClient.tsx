"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { QrCodeSvg } from "@/components/ui/QrCodeSvg";
import { products as catalogProducts, vendors } from "@/data/catalog";
import { readLocalOrders, updateLocalOrderStatus } from "@/lib/local-orders";
import { formatInr } from "@/lib/utils";
import type { Order, OrderStatus, Product, Vendor } from "@/types";

export function VendorDashboardClient() {
  const searchParams = useSearchParams();
  const storeParam = searchParams.get("store");
  const tabParam = searchParams.get("tab");

  const [selectedVendor, setSelectedVendor] = useState<Vendor>(
    () => vendors.find((v) => v.slug === storeParam) || vendors[0]
  );
  const [activeTab, setActiveTab] = useState<"orders" | "qr" | "inventory">(
    tabParam === "qr" ? "qr" : "orders"
  );
  const [isOpen, setIsOpen] = useState(selectedVendor.isOpen);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync products when selected vendor changes
  useEffect(() => {
    setProducts(catalogProducts.filter((p) => p.vendorId === selectedVendor.id));
    setIsOpen(selectedVendor.isOpen);
  }, [selectedVendor]);

  // Load and subscribe to orders
  useEffect(() => {
    function loadOrders() {
      setOrders(readLocalOrders());
    }

    loadOrders();
    window.addEventListener("campuskart:orderUpdated", loadOrders);
    return () => window.removeEventListener("campuskart:orderUpdated", loadOrders);
  }, []);

  // Filter orders for selected vendor or campus
  const vendorOrders = orders.filter(
    (o) =>
      o.vendorName.toLowerCase().includes(selectedVendor.name.toLowerCase()) ||
      o.vendorId === selectedVendor.id
  );

  const displayOrders = vendorOrders.length > 0 ? vendorOrders : orders;

  const todayRevenue = displayOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = displayOrders.filter(
    (o) => o.status !== "delivered" && o.status !== "cancelled"
  ).length;

  function handleStatusChange(orderId: string, nextStatus: OrderStatus) {
    const updated = updateLocalOrderStatus(orderId, nextStatus);
    setOrders(updated);
  }

  function toggleStock(productId: string) {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: !p.inStock } : p))
    );
  }

  const storefrontUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/vendors/${selectedVendor.slug}`
      : `http://localhost:3000/vendors/${selectedVendor.slug}`;

  function copyStoreLink() {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(storefrontUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  }

  return (
    <Container className="space-y-6 py-6 sm:py-10">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-saffron px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
              Vendor Console
            </span>
            <span className="text-xs text-ink-muted">CGC Mohali Campus Network</span>
          </div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl text-ink">
            {selectedVendor.name}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-ink-muted">
            📍 {selectedVendor.address} &middot; Phone: {selectedVendor.phone}
          </p>
        </div>

        {/* Store selector dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="vendor-switcher" className="text-xs font-semibold text-ink-muted">
            Switch Store:
          </label>
          <select
            id="vendor-switcher"
            value={selectedVendor.slug}
            onChange={(e) => {
              const found = vendors.find((v) => v.slug === e.target.value);
              if (found) setSelectedVendor(found);
            }}
            className="rounded-2xl border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-ink shadow-sm focus:border-campus-600 focus:outline-none"
          >
            {vendors.map((v) => (
              <option key={v.slug} value={v.slug}>
                {v.name} ({v.category})
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`rounded-2xl px-4 py-2 text-xs font-bold transition shadow-sm ${
              isOpen
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-rose-600 text-white hover:bg-rose-700"
            }`}
          >
            {isOpen ? "🟢 Store is Open" : "🔴 Store is Paused"}
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-sm border border-stone-200/80">
          <p className="text-xs font-medium text-ink-muted">Today&apos;s Orders</p>
          <p className="mt-2 font-display text-2xl sm:text-3xl font-bold text-ink">
            {displayOrders.length}
          </p>
          <span className="mt-1 inline-block text-[11px] text-emerald-600 font-semibold">
            +4 in last hour
          </span>
        </div>

        <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-sm border border-stone-200/80">
          <p className="text-xs font-medium text-ink-muted">Today&apos;s Revenue</p>
          <p className="mt-2 font-display text-2xl sm:text-3xl font-bold text-campus-800">
            {formatInr(todayRevenue)}
          </p>
          <span className="mt-1 inline-block text-[11px] text-ink-muted">
            COD &amp; UPI combined
          </span>
        </div>

        <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-sm border border-stone-200/80">
          <p className="text-xs font-medium text-ink-muted">Pending Orders</p>
          <p className="mt-2 font-display text-2xl sm:text-3xl font-bold text-saffron">
            {pendingCount}
          </p>
          <span className="mt-1 inline-block text-[11px] text-saffron-dark font-semibold">
            Needs action
          </span>
        </div>

        <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-sm border border-stone-200/80">
          <p className="text-xs font-medium text-ink-muted">Hostel Dispatch ETA</p>
          <p className="mt-2 font-display text-2xl sm:text-3xl font-bold text-ink">
            {selectedVendor.etaMinutes} min
          </p>
          <span className="mt-1 inline-block text-[11px] text-emerald-600 font-semibold">
            Runner assigned
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-4 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 transition border-b-2 flex items-center gap-1.5 ${
            activeTab === "orders"
              ? "border-campus-800 text-campus-900"
              : "border-transparent text-ink-muted hover:text-ink"
          }`}
        >
          <span>📋 Live Incoming Orders</span>
          {pendingCount > 0 ? (
            <span className="rounded-full bg-saffron px-1.5 py-0.2 text-[10px] text-white">
              {pendingCount}
            </span>
          ) : null}
        </button>

        <button
          onClick={() => setActiveTab("qr")}
          className={`pb-3 transition border-b-2 flex items-center gap-1.5 ${
            activeTab === "qr"
              ? "border-campus-800 text-campus-900"
              : "border-transparent text-ink-muted hover:text-ink"
          }`}
        >
          <span>📱 Counter QR Standee</span>
          <span className="rounded bg-emerald-100 text-emerald-800 px-1.5 py-0.2 text-[10px] font-bold">
            Scan &amp; Order
          </span>
        </button>

        <button
          onClick={() => setActiveTab("inventory")}
          className={`pb-3 transition border-b-2 flex items-center gap-1.5 ${
            activeTab === "inventory"
              ? "border-campus-800 text-campus-900"
              : "border-transparent text-ink-muted hover:text-ink"
          }`}
        >
          <span>🏷️ Menu &amp; Stock ({products.length})</span>
        </button>
      </div>

      {/* TAB 1: LIVE ORDERS */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-ink">Incoming Student Orders</h2>
            <p className="text-xs text-ink-muted">
              Real-time feed &middot; Click status buttons to update campus runner
            </p>
          </div>

          {displayOrders.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center border border-stone-200">
              <p className="text-sm text-ink-muted">No orders yet for this vendor.</p>
              <Button href={`/vendors/${selectedVendor.slug}`} className="mt-4" size="sm">
                Place Test Order as Student
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {displayOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-3xl bg-white p-5 sm:p-6 shadow-sm border border-stone-200/80 space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-lg font-bold text-ink">
                          Order #{order.id}
                        </span>
                        <Badge
                          tone={
                            order.status === "delivered"
                              ? "success"
                              : order.status === "placed"
                              ? "warning"
                              : "neutral"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-ink-muted">
                        Placed by <strong>{order.studentName || "Student"}</strong> ({order.studentPhone || "+91 98765 00000"})
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-display text-xl font-bold text-campus-800">
                        {formatInr(order.total)}
                      </p>
                      <p className="text-xs text-ink-muted capitalize">
                        Mode: {order.paymentMethod === "upi_delivery" ? "UPI at Gate" : "Cash on Delivery"}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 text-xs">
                    <div>
                      <p className="font-semibold text-ink">📍 Destination Hostel:</p>
                      <p className="text-ink-muted">{order.dropLocation || "CGC Campus Gate 2"}</p>
                      {order.notes ? (
                        <p className="mt-1 text-[11px] italic text-stone-500">
                          Note: &ldquo;{order.notes}&rdquo;
                        </p>
                      ) : null}
                    </div>

                    <div className="flex items-center justify-start sm:justify-end gap-3">
                      <div className="rounded-xl bg-cream p-2.5 text-center border border-stone-200">
                        <span className="block text-[10px] uppercase font-bold text-ink-muted">
                          Runner PIN
                        </span>
                        <span className="font-mono text-sm font-bold text-campus-900 tracking-wider">
                          {order.deliveryPin || "4821"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vendor Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
                    <span className="text-xs text-ink-muted">
                      Quick Status Update:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {order.status === "placed" && (
                        <button
                          onClick={() => handleStatusChange(order.id, "accepted")}
                          className="rounded-xl bg-campus-700 hover:bg-campus-800 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition"
                        >
                          ✓ Accept Order
                        </button>
                      )}
                      {order.status === "accepted" && (
                        <button
                          onClick={() => handleStatusChange(order.id, "preparing")}
                          className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition"
                        >
                          🥣 Start Packing
                        </button>
                      )}
                      {order.status === "preparing" && (
                        <button
                          onClick={() => handleStatusChange(order.id, "ready")}
                          className="rounded-xl bg-saffron hover:bg-saffron-dark text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition"
                        >
                          🏃 Hand to Runner (Out for Drop)
                        </button>
                      )}
                      {order.status === "ready" && (
                        <button
                          onClick={() => handleStatusChange(order.id, "delivered")}
                          className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition"
                        >
                          🎉 Mark Delivered &amp; Paid
                        </button>
                      )}
                      {order.status === "delivered" && (
                        <span className="text-xs font-bold text-emerald-700">
                          ✓ Delivery Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: QR COUNTER STANDEE */}
      {activeTab === "qr" && (
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] items-start">
          {/* Standee Preview Card */}
          <div className="mx-auto w-full max-w-sm rounded-[2.5rem] bg-gradient-to-b from-stone-900 via-campus-900 to-campus-950 p-6 text-white shadow-2xl border-4 border-stone-800">
            {/* Acrylic Standee Header */}
            <div className="text-center pb-4 border-b border-white/10">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-saffron px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow">
                <span>⚡</span>
                <span>CampusKart Instant Order</span>
              </div>
              <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.2em] text-white/70">
                Chandigarh Group of Colleges
              </p>
              <h3 className="mt-1 font-display text-2xl font-bold text-white">
                {selectedVendor.name}
              </h3>
              <p className="text-xs text-campus-200">
                {selectedVendor.address}
              </p>
            </div>

            {/* QR Code Container */}
            <div className="my-6 flex flex-col items-center justify-center rounded-3xl bg-white p-6 shadow-inner text-center">
              <QrCodeSvg value={storefrontUrl} size={180} />
              <p className="mt-3 font-display text-sm font-bold text-ink">
                Scan with Phone Camera
              </p>
              <p className="text-[11px] text-ink-muted">
                Browse catalog &middot; Order directly to your hostel room
              </p>
            </div>

            {/* Standee Perks */}
            <div className="space-y-1.5 text-center text-xs text-white/90 pb-2">
              <p className="font-semibold text-campus-200">
                🚀 Free Campus Runner Delivery
              </p>
              <p className="text-[11px] text-white/70">
                Avg 15-20 mins drop to BH-1, BH-2, GH-1 &amp; Academic Blocks
              </p>
              <p className="text-[10px] font-mono text-saffron uppercase tracking-widest pt-1">
                COD &bull; UPI ACCEPTED
              </p>
            </div>
          </div>

          {/* Standee Actions & Instructions */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-5">
            <h2 className="font-display text-2xl text-ink">
              Storefront Standee &amp; QR Management
            </h2>
            <p className="text-sm text-ink-muted leading-6">
              Place this official CampusKart QR standee on your physical shop counter or assignment desk. When students scan the QR code with their phone, it opens your menu and allows direct room ordering.
            </p>

            <div className="rounded-2xl bg-cream p-4 text-xs space-y-2 border border-stone-200">
              <p className="font-semibold text-ink">Storefront Direct Link:</p>
              <p className="font-mono text-campus-800 break-all">{storefrontUrl}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                href={`/vendors/${selectedVendor.slug}`}
                size="md"
                className="flex-1"
              >
                Open Student Storefront &rarr;
              </Button>
              <button
                onClick={copyStoreLink}
                className="rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:border-campus-600 transition shadow-sm"
              >
                {copiedLink ? "Copied to Clipboard! ✓" : "Copy Store Link"}
              </button>
            </div>

            <div className="border-t border-stone-100 pt-4 text-xs text-ink-muted space-y-2">
              <p className="font-semibold text-ink">💡 Hackathon Demo Tip:</p>
              <p>
                Open this QR link on a secondary mobile device or in an incognito window to simulate a student walking up to the shop counter, scanning the standee, and receiving their delivery at the hostel!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MENU & INVENTORY */}
      {activeTab === "inventory" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl text-ink">
                Catalog &amp; Item Availability
              </h2>
              <p className="text-xs text-ink-muted">
                Toggle stock availability in real time during rush hours
              </p>
            </div>
            <span className="text-xs font-semibold text-campus-800">
              {products.filter((p) => p.inStock).length} of {products.length} In Stock
            </span>
          </div>

          <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-stone-200/80">
            <ul className="divide-y divide-stone-100">
              {products.map((product) => (
                <li
                  key={product.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-stone-100 text-lg">
                      📦
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-ink text-sm sm:text-base">
                          {product.name}
                        </p>
                        {product.badge ? (
                          <span className="rounded bg-saffron px-1.5 py-0.2 text-[10px] font-bold text-white">
                            {product.badge}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-xs text-ink-muted line-clamp-1">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <span className="font-display text-base font-bold text-ink">
                      {formatInr(product.price)}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleStock(product.id)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition shadow-sm ${
                        product.inStock
                          ? "bg-campus-100 text-campus-800 hover:bg-campus-200"
                          : "bg-stone-200 text-stone-600 hover:bg-stone-300"
                      }`}
                    >
                      {product.inStock ? "✓ In Stock" : "✕ Out of Stock"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Container>
  );
}

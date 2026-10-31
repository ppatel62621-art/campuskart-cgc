import { sampleOrders } from "@/data/catalog";
import type { CartItem, Order, OrderStatus } from "@/types";

const STORAGE_KEY = "campuskart.orders";

export function readLocalOrders(): Order[] {
  if (typeof window === "undefined") return sampleOrders;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleOrders));
      return sampleOrders;
    }
    return JSON.parse(raw) as Order[];
  } catch {
    return sampleOrders;
  }
}

export type PlaceOrderPayload = {
  items: CartItem[];
  total: number;
  studentName?: string;
  studentPhone?: string;
  dropLocation?: string;
  notes?: string;
  paymentMethod?: "cod" | "upi_delivery";
  vendorId?: string;
};

export function writeLocalOrder(payloadOrItems: CartItem[] | PlaceOrderPayload, subtotalFallback?: number): Order {
  const isPayload = !Array.isArray(payloadOrItems);
  const items = isPayload ? payloadOrItems.items : payloadOrItems;
  const total = isPayload ? payloadOrItems.total : (subtotalFallback ?? 0);

  const order: Order = {
    id: `CK-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    vendorName: items[0]?.vendorName ?? "CGC Campus Vendor",
    vendorId: isPayload ? payloadOrItems.vendorId : undefined,
    status: "placed",
    total,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    items: [...items],
    dropLocation: isPayload ? (payloadOrItems.dropLocation || "Boys Hostel 1 (BH-1)") : "Hostel Gate 2",
    studentName: isPayload ? (payloadOrItems.studentName || "CGC Student") : "Student",
    studentPhone: isPayload ? (payloadOrItems.studentPhone || "+91 98765 00000") : "+91 98765 00000",
    paymentMethod: isPayload ? (payloadOrItems.paymentMethod || "cod") : "cod",
    deliveryPin: `${Math.floor(1000 + Math.random() * 9000)}`,
    notes: isPayload ? payloadOrItems.notes : "",
  };

  const current = readLocalOrders();
  const next = [order, ...current];
  
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent("campuskart:orderUpdated", { detail: { order, all: next } }));
    } catch (e) {
      console.error("Failed to save local order:", e);
    }
  }

  return order;
}

export function updateLocalOrderStatus(orderId: string, status: OrderStatus): Order[] {
  const current = readLocalOrders();
  const updated = current.map((ord) => (ord.id === orderId ? { ...ord, status } : ord));
  
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("campuskart:orderUpdated", { detail: { orderId, status, all: updated } }));
    } catch (e) {
      console.error("Failed to update local order:", e);
    }
  }

  return updated;
}

export function resetDemoOrders(): Order[] {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleOrders));
      window.dispatchEvent(new CustomEvent("campuskart:orderUpdated", { detail: { all: sampleOrders } }));
    } catch (e) {
      console.error("Failed to reset orders:", e);
    }
  }
  return sampleOrders;
}

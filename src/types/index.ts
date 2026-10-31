import type { VendorCategorySlug } from "@/lib/constants";

export type UserRole = "student" | "vendor" | "admin";

export type Vendor = {
  id: string;
  slug: string;
  name: string;
  category: VendorCategorySlug | string;
  description: string;
  address: string;
  phone: string;
  isOpen: boolean;
  rating: number;
  etaMinutes: number;
  imageUrl: string;
};

export type Product = {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
  badge?: string;
};

export type CartItem = {
  product: Product;
  vendorName: string;
  quantity: number;
};

export type OrderStatus = "placed" | "accepted" | "preparing" | "ready" | "delivered" | "cancelled";

export type Order = {
  id: string;
  createdAt: string;
  vendorName: string;
  vendorId?: string;
  status: OrderStatus;
  total: number;
  itemCount: number;
  items?: CartItem[];
  dropLocation?: string;
  studentName?: string;
  studentPhone?: string;
  paymentMethod?: "cod" | "upi_delivery";
  deliveryPin?: string;
  notes?: string;
};

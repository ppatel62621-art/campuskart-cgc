export type UserRole = "student" | "vendor" | "admin";

export type VendorCategory =
  | "kirana"
  | "printing"
  | "thrift"
  | "mithai"
  | "gifts"
  | "services";

export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export interface Campus {
  id: string;
  name: string;
  city: string;
  slug: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  campus_id: string | null;
  phone: string | null;
  created_at: string;
}

export interface Vendor {
  id: string;
  campus_id: string;
  owner_id: string | null;
  name: string;
  slug: string;
  category: VendorCategory;
  description: string | null;
  address: string | null;
  phone: string | null;
  is_open: boolean;
  image_url: string | null;
  rating: number;
  eta_minutes: number;
  created_at: string;
}

export interface Product {
  id: string;
  vendor_id: string;
  name: string;
  description: string | null;
  price_inr: number;
  image_url: string | null;
  is_available: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  student_id: string;
  vendor_id: string;
  campus_id: string;
  status: OrderStatus;
  payment_status: "unpaid" | "cod";
  total_inr: number;
  notes: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price_inr: number;
}

export interface Database {
  public: {
    Tables: {
      campuses: {
        Row: Campus;
        Insert: Omit<Campus, "id"> & { id?: string };
        Update: Partial<Campus>;
        Relationships: [];
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at"> & { created_at?: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      vendors: {
        Row: Vendor;
        Insert: Omit<Vendor, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Vendor>;
        Relationships: [];
      };
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Product>;
        Relationships: [];
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Order>;
        Relationships: [];
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, "id"> & { id?: string };
        Update: Partial<OrderItem>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      vendor_category: VendorCategory;
      order_status: OrderStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}

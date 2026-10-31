export const APP_NAME = "CampusKart";
export const APP_TAGLINE = "Campus essentials, from shops next door.";
export const DEFAULT_CAMPUS = {
  name: "CGC University",
  city: "Mohali",
  slug: "cgc-university-mohali",
  shortName: "CGC Mohali",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/vendors", label: "Vendors" },
  { href: "/cart", label: "Cart" },
  { href: "/orders", label: "Orders" },
  { href: "/vendor", label: "Vendor Hub" },
  { href: "/admin", label: "Admin" },
] as const;

export const VENDOR_CATEGORIES = [
  {
    slug: "kirana",
    label: "Kirana",
    description: "Snacks, Maggi, tea, and daily hostel supplies.",
  },
  {
    slug: "printing",
    label: "Printing",
    description: "Assignments, spiral binding, and last-minute prints.",
  },
  {
    slug: "thrift",
    label: "Thrift",
    description: "Pre-loved clothes, books, and campus finds.",
  },
  {
    slug: "mithai",
    label: "Mithai",
    description: "Festival boxes, late-night sweets, and gifting.",
  },
  {
    slug: "gifts",
    label: "Gifts",
    description: "Birthday hampers, custom mugs, and surprise drops.",
  },
  {
    slug: "services",
    label: "Services",
    description: "Tailors, cobblers, laundry, and repair help nearby.",
  },
] as const;

export type VendorCategorySlug = (typeof VENDOR_CATEGORIES)[number]["slug"];

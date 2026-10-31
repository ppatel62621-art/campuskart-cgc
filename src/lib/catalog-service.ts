import { products, vendors } from "@/data/catalog";
import { isSupabaseConfigured } from "@/lib/utils";
import type { Product, Vendor } from "@/types";

export async function getVendors(): Promise<Vendor[]> {
  if (!isSupabaseConfigured()) {
    return vendors;
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = createClient();
    const { data, error } = await supabase
      .from("vendors")
      .select(
        "id, slug, name, category, description, address, phone, is_open, rating, eta_minutes, image_url",
      )
      .order("name");

    if (error || !data?.length) {
      return vendors;
    }

    return data.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      category: row.category,
      description: row.description ?? "",
      address: row.address ?? "",
      phone: row.phone ?? "",
      isOpen: Boolean(row.is_open),
      rating: Number(row.rating ?? 0),
      etaMinutes: Number(row.eta_minutes ?? 0),
      imageUrl: row.image_url ?? vendors[0].imageUrl,
    }));
  } catch {
    return vendors;
  }
}

export function getLocalProducts(vendorId: string): Product[] {
  return products.filter((product) => product.vendorId === vendorId);
}

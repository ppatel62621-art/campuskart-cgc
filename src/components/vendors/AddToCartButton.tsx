"use client";

import { useCart } from "@/components/providers/CartProvider";
import type { Product } from "@/types";

export function AddToCartButton({
  product,
  vendorName,
}: {
  product: Product;
  vendorName: string;
}) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.product.id === product.id);

  if (!product.inStock) {
    return (
      <span className="inline-flex items-center rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-400">
        Sold Out
      </span>
    );
  }

  if (cartItem && cartItem.quantity > 0) {
    return (
      <div className="inline-flex items-center rounded-full border border-campus-700 bg-campus-50 p-0.5 shadow-sm">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            updateQuantity(product.id, cartItem.quantity - 1);
          }}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-campus-800 shadow-sm transition hover:bg-campus-700 hover:text-white"
          aria-label="Decrease quantity"
        >
          &minus;
        </button>
        <span className="min-w-6 px-2 text-center text-xs font-bold text-campus-900">
          {cartItem.quantity}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addItem(product, vendorName);
          }}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-campus-700 text-sm font-bold text-white shadow-sm transition hover:bg-campus-800"
          aria-label="Increase quantity"
        >
          &#43;
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product, vendorName);
      }}
      className="inline-flex items-center gap-1.5 rounded-full bg-campus-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-campus-800 active:scale-95"
    >
      <span>&#43;</span>
      <span>Add</span>
    </button>
  );
}

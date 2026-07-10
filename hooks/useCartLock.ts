"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { lockCartItem, unlockCartItem } from "@/lib/api";
import { parseCartItemFromLock } from "@/lib/cart";
import { useCart } from "@/context/CartContext";

interface SeatLike {
  item_id?: number;
  cabin_type?: string;
  status?: number;
  fare?: number;
  cabin_no?: string;
  [key: string]: unknown;
}

export function useCartLock(
  tripId: string | undefined,
  itemType: "seat" | "cabin" | "sofa",
  tripMeta?: Record<string, unknown>
) {
  const { items, addItem, removeItem, isInCart } = useCart();
  const [locking, setLocking] = useState<number | null>(null);

  const toggleItem = useCallback(
    async (item: SeatLike) => {
      if (!item.item_id || item.cabin_type === "empty" || item.status !== 1) {
        return;
      }

      const itemId = item.item_id;
      const numericTripId = Number(tripId);

      if (!numericTripId) {
        toast.error("Trip not selected");
        return;
      }

      const existing = items.find((i) => i.itemId === itemId);
      if (existing) {
        setLocking(itemId);
        try {
          await unlockCartItem(existing.lockId, itemId);
          removeItem(existing.lockId);
        } catch {
          toast.error("Could not release seat. Please try again.");
        } finally {
          setLocking(null);
        }
        return;
      }

      setLocking(itemId);
      try {
        const payload = await lockCartItem(numericTripId, itemType, itemId);
        if (payload.success === false) {
          toast.error(String(payload.message || "Item is not available."));
          return;
        }

        const cartItem = parseCartItemFromLock(
          payload as Record<string, unknown>,
          item as Record<string, unknown>,
          itemType,
          tripMeta
        );

        if (!cartItem) {
          toast.error("Item is unavailable right now. Please try another.");
          return;
        }

        addItem(cartItem);
        toast.success(`Added ${cartItem.meta.cabin_no || "item"} to cart`);
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to lock item";
        toast.error(message);
      } finally {
        setLocking(null);
      }
    },
    [tripId, itemType, tripMeta, items, addItem, removeItem]
  );

  return { toggleItem, isInCart, locking };
}
